package com.cmwsp.zentransfer.service;

import com.alipay.api.domain.AuthParticipantInfo;
import com.alipay.api.response.AlipayFundBatchCreateResponse;
import com.cmwsp.zentransfer.dto.alipay.BatchCreateDTO;
import com.cmwsp.zentransfer.dto.alipay.TransRenderPayDTO;
import com.cmwsp.zentransfer.dto.alipay.UniApplyDTO;
import com.cmwsp.zentransfer.model.alipay.AlipayBatchPayRecord;
import com.cmwsp.zentransfer.model.alipay.AlipayFundAuthRecord;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.repository.alipay.AlipayBatchPayRecordRepository;
import com.cmwsp.zentransfer.repository.alipay.AlipayFundAuthRecordRepository;
import org.apache.catalina.util.StringUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import org.thymeleaf.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

@Service
public class PayService {

    private final AlipayFundAuthRecordRepository alipayFundAuthRecordRepository;
    private final AlipayBatchPayRecordRepository alipayBatchPayRecordRepository;
    private final AlipayService alipayService;

    public PayService(AlipayFundAuthRecordRepository alipayFundAuthRecordRepository,
                      AlipayBatchPayRecordRepository alipayBatchPayRecordRepository,
                      AlipayService alipayService) {
        this.alipayFundAuthRecordRepository = alipayFundAuthRecordRepository;
        this.alipayBatchPayRecordRepository = alipayBatchPayRecordRepository;
        this.alipayService = alipayService;
    }

    public void saveAuthRecord(AlipayFundAuthRecord record) {
        alipayFundAuthRecordRepository.save(record);
    }

    public void saveBatchPayRecord(AlipayBatchPayRecord record) {
        alipayBatchPayRecordRepository.save(record);
    }

    /**
     * 根据用户id查询制单授权记录
     *
     * @param userId
     * @return
     */
    public AlipayFundAuthRecord checkUserFundAuth(String userId) {
        // 用户可能存在多条授权记录，这里只取有效的授权记录
        // TODO 因为目前只需要授权一次即可，每次申请的业务单号不能重复，因此查询无用
//        var uniQuery = new UniQueryDTO();
//        uniQuery.setProductCode("BATCH_API_TO_ACC");
//        uniQuery.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
//        uniQuery.setOutBizNo(oauthInfo.getUserId());
//        var authorizeUniQueryRes = alipayService.authorizeUniQuery(uniQuery);
//        if (authorizeUniQueryRes.getCode().equals("40004") &&
//                authorizeUniQueryRes.getSubCode().equals("AUTHORIZATION_NOT_EXIST")) {
//
//        }
        return alipayFundAuthRecordRepository.findFirstByUserIdAndStatus(userId, "NORMAL").orElse(null);
    }

    /**
     * 申请制单授权的申请请求
     */
    public ModelAndView applyAlipayFundAuth(String userId,String outBizNo) {
        // TODO 先确认没有申请过授权，申请过的话，则查询授权结果是否通过
        // 1 调用支付宝授权接口
        var uniApply = UniApplyDTO.builder()
                .build();
        uniApply.setProductCode("BATCH_API_TO_ACC");
        uniApply.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
        uniApply.setOutBizNo(outBizNo);
        uniApply.setAuthorizeLinkType("SHORT_URL");

        var principalInfo = new AuthParticipantInfo();
        principalInfo.setParticipantId(userId);
        principalInfo.setParticipantIdType("ALIPAY_USER_ID");
        var response = alipayService.authorizeUniApply(uniApply);

        if (response.isSuccess()) {
            var alipayFundAuthRecord = AlipayFundAuthRecord.builder()
                    .outBizNo(outBizNo)
                    .userId(userId)
                    .build();
            saveAuthRecord(alipayFundAuthRecord);
            return new ModelAndView(new RedirectView(response.getAuthorizeLink()));
        } else {
            var modelView = new ModelAndView("error");
            modelView.addObject("errorMessage", response.getMsg());
            return modelView;
        }
    }

    /**
     * 发起批量支付请求
     */
    public ModelAndView applyBatchPay(String userId, Order order) {
        // 3.渲染+转账
        var batchCreateDTO = new BatchCreateDTO();
        batchCreateDTO.setOutBatchNo(order.getPayNo());// TODO 考虑放订单号还是支付号
        batchCreateDTO.setTotalCount(1); // 目前是采购商转账给蔡明伟，所以都是1对1转账
        batchCreateDTO.setTotalTransAmount(order.getAmount().getAmount().doubleValue()); // TODO 带有综合支付的时候 此处需要调整，此处最好使用Bigdecimal
        batchCreateDTO.setProductCode("BATCH_API_TO_ACC");
        batchCreateDTO.setOrderTitle(order.getProduceDesc());
        batchCreateDTO.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
//        batchCreateDTO.setTimeExpire("");// TODO 超时时间
        batchCreateDTO.setRemark("转账:" + order.getProduceDesc());
        // 填充付款方信息
        var payerInfo = new BatchCreateDTO.Participant();
        payerInfo.setIdentity(userId);
        payerInfo.setIdentityType("ALIPAY_USER_ID");

        // 填充收款方信息 目前基本都是1对1转账
        var transOrderDetail = new BatchCreateDTO.TransOrderDetail();
        var payeeInfo = new BatchCreateDTO.Participant();
        // TODO 收款方账户信息需要确认
        payeeInfo.setIdentity("2088641086367762");
        payeeInfo.setIdentityType("ALIPAY_USER_ID");
        transOrderDetail.setPayeeInfo(payeeInfo);
        transOrderDetail.setTransAmount(order.getAmount().getAmount().doubleValue());
        transOrderDetail.setOutBizNo(order.getPayNo());// 此处考虑使用支付号，这样完成后便于更新所有订单的支付状态

        batchCreateDTO.setPayerInfo(payerInfo);
        batchCreateDTO.setTransOrderList(Collections.singletonList(transOrderDetail));

        AlipayFundBatchCreateResponse alipayFundBatchCreateResponse = alipayService.createBatchFund(batchCreateDTO);

        if (!alipayFundBatchCreateResponse.isSuccess()) {
            throw new RuntimeException("支付宝批量转账失败");
        }

        // 持久化支付订单信息
        var alipayBatchPayRecord = AlipayBatchPayRecord.builder()
                .batchTransId(alipayFundBatchCreateResponse.getBatchTransId())
                .outBatchNo(order.getPayNo())
                .status(alipayFundBatchCreateResponse.getStatus())
                .notifySuccess(false)
                .build();

        saveBatchPayRecord(alipayBatchPayRecord);

        // 2.2 调用支付宝支付渲染接口
        var transRender = new TransRenderPayDTO();
        transRender.setOrderId(alipayFundBatchCreateResponse.getBatchTransId());
        transRender.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
        transRender.setProductCode("BATCH_API_TO_ACC");
        transRender.setTargetTerminalType("tinyapp");
        transRender.setInitializeCodeType("SHORT_URL");
        transRender.setExpireTime(LocalDateTime.now().plusMinutes(30)
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));// 暂定义30分钟后失效
        var response = alipayService.transRenderPay(transRender);

        if (!response.isSuccess()) {
            throw new RuntimeException("支付宝支付渲染失败");
        }
        return new ModelAndView(new RedirectView(response.getInitializeCode()));
    }

    /**
     * 处理制单授权的回调请求
     */
    public void callbackAlipayFundAuth() {

    }


    public AlipayBatchPayRecord getBatchPayRecordById(String id) {
        return alipayBatchPayRecordRepository.findById(id).orElse(null);
    }

}
