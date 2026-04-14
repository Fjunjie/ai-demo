package com.cmwsp.zentransfer.service;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.PropertyNamingStrategy;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alipay.api.domain.AuthParticipantInfo;
import com.alipay.api.response.AlipayFundBatchCreateResponse;
import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.alipay.*;
import com.cmwsp.zentransfer.dto.reconciliation.QueryListParamsRequest;
import com.cmwsp.zentransfer.dto.uorder.Agent;
import com.cmwsp.zentransfer.dto.uorder.MixPayOrderRequest;
import com.cmwsp.zentransfer.dto.uorder.Payment;
import com.cmwsp.zentransfer.dto.uorder.PaymentVerification;
import com.cmwsp.zentransfer.model.alipay.AlipayBatchPayRecord;
import com.cmwsp.zentransfer.model.alipay.AlipayFundAuthRecord;
import com.cmwsp.zentransfer.model.pay.PayOrder;
import com.cmwsp.zentransfer.model.pay.PayOrderDetail;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.repository.OrderRepository;
import com.cmwsp.zentransfer.repository.PayOrderDetailRepository;
import com.cmwsp.zentransfer.repository.PayOrderRepository;
import com.cmwsp.zentransfer.repository.alipay.AlipayBatchPayRecordRepository;
import com.cmwsp.zentransfer.repository.alipay.AlipayFundAuthRecordRepository;
import com.cmwsp.zentransfer.service.impl.AlipayNotificationEvent;
import com.cmwsp.zentransfer.service.impl.BalancePayProcessor;
import com.cmwsp.zentransfer.utils.PayDetailType;
import com.cmwsp.zentransfer.utils.Rsa2Utils;
import com.cmwsp.zentransfer.utils.UOrderUtils;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static com.cmwsp.zentransfer.service.impl.AlipayBatchPayChangedNotify.BATCH_PAY_CHANGED;
import static com.cmwsp.zentransfer.utils.PayOrderType.*;

@Service
@Slf4j
public class PayService {

    private final AlipayFundAuthRecordRepository alipayFundAuthRecordRepository;
    private final AlipayBatchPayRecordRepository alipayBatchPayRecordRepository;
    private final AlipayService alipayService;
    private final UOrderConfiguration configuration;
    private final UOrderApi uOrderApi;
    private final PayOrderDetailRepository payOrderDetailRepository;
    private final OrderRepository orderRepository;
    private final PayOrderRepository payOrderRepository;
    private final ApplicationEventPublisher publisher;

    public PayService(AlipayFundAuthRecordRepository alipayFundAuthRecordRepository,
                      AlipayBatchPayRecordRepository alipayBatchPayRecordRepository,
                      AlipayService alipayService,
                      UOrderConfiguration configuration,
                      UOrderApi uOrderApi,
                      PayOrderDetailRepository payOrderDetailRepository,
                      OrderRepository orderRepository,
                      PayOrderRepository payOrderRepository,
                      ApplicationEventPublisher publisher) {
        this.alipayFundAuthRecordRepository = alipayFundAuthRecordRepository;
        this.alipayBatchPayRecordRepository = alipayBatchPayRecordRepository;
        this.alipayService = alipayService;
        this.configuration = configuration;
        this.uOrderApi = uOrderApi;
        this.payOrderDetailRepository = payOrderDetailRepository;
        this.orderRepository = orderRepository;
        this.payOrderRepository = payOrderRepository;
        this.publisher = publisher;
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
     * @param userId 用户id
     * @return 查验用户余额信息
     */
    public AlipayFundAuthRecord checkUserFundAuth(String userId) {
        var record = alipayFundAuthRecordRepository.findFirstByUserIdAndStatus(userId, "NORMAL").orElse(null);
        // 确认没有申请过授权，申请过的话，则查询授权结果是否通过
        if (null == record) {
            var optionalAlipayFundAuthRecord = alipayFundAuthRecordRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
            if (optionalAlipayFundAuthRecord.isPresent()) {
                record = optionalAlipayFundAuthRecord.get();
                var uniQuery = new UniQueryDTO();
                uniQuery.setProductCode("BATCH_API_TO_ACC");
                uniQuery.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
                uniQuery.setOutBizNo(record.getOutBizNo());
                var authorizeUniQueryRes = alipayService.authorizeUniQuery(uniQuery);
                if (authorizeUniQueryRes.getCode().equals("40004") &&
                        authorizeUniQueryRes.getSubCode().equals("AUTHORIZATION_NOT_EXIST")) {
                    // 继续授权，返回空记录
                    return null;
                } else {
                    record.setStatus(authorizeUniQueryRes.getStatus());
                    alipayFundAuthRecordRepository.save(record);
                }
            }
        }
        return record;
    }

    /**
     * 申请制单授权的申请请求
     */
    public ModelAndView applyAlipayFundAuth(String userId, String outBizNo) {
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
     * <p>
     * 都走混合支付逻辑
     */
    @Deprecated
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
        payeeInfo.setIdentity(configuration.getPayeeId());
        payeeInfo.setIdentityType("ALIPAY_USER_ID");
        transOrderDetail.setPayeeInfo(payeeInfo);
        transOrderDetail.setTransAmount(order.getAmount().getAmount().doubleValue());
        transOrderDetail.setOutBizNo(order.getPayNo());// 此处考虑使用支付号，这样完成后便于更新所有订单的支付状态

        batchCreateDTO.setPayerInfo(payerInfo);
        batchCreateDTO.setTransOrderList(Collections.singletonList(transOrderDetail));

        AlipayFundBatchCreateResponse alipayFundBatchCreateResponse = alipayService.createBatchFund(batchCreateDTO);

        if (!alipayFundBatchCreateResponse.isSuccess()) {
            throw new RuntimeException("支付宝批量转账失败,原因：【" + alipayFundBatchCreateResponse.getSubMsg() + "】");
        }

        // 持久化支付订单信息
        var alipayBatchPayRecord = AlipayBatchPayRecord.builder()
                .batchTransId(alipayFundBatchCreateResponse.getBatchTransId())
                .outBatchNo(order.getPayNo())
                .status(alipayFundBatchCreateResponse.getStatus())
                .payerId(userId)
                .payeeId(configuration.getPayeeId())
                .transAmount(order.getAmount().getAmount())
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
     * 上传余额支付单信息
     */
    public void createBalancePayOrder(PayOrder payOrder) {
        // TODO 生成余额支付单
        // 1.查询可用的支付单用于余额支付
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", UOrderUtils.FORMDATA);
        // 默认提取12个月内的数据
        params.put("startdate", LocalDate.now().minusYears(5).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        params.put("enddate", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        params.put("pagesize", "100");// TODO 默认先取100条
        params.put("pageindex", "1");
        params.put("agentid", payOrder.getAgentId());// 客户id
        String sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getPaymentsByDate(params.get("appkey"),
                params.get("format"),
                params.get("token"),
                sign,
                params.get("startdate"),
                params.get("enddate"),
                params.get("pagesize"),
                params.get("pageindex"),
                params.get("agentid"));
        if (!response.getStatusCode().is2xxSuccessful() || !Objects.requireNonNull(response.getBody()).getCode().equals("200")) {
            throw new RuntimeException("获取余额信息失败，请联系管理员处理或使用其他支付方式");
        }
        if (!response.getBody().getData().getData().isEmpty()) {
            // 2.1 获取可用余额支付单
            var payments = response.getBody().getData().getData();
            var payOrderDetails = BalancePayProcessor.processPayments(payments, payOrder);
            payOrderDetailRepository.saveAll(payOrderDetails);
        }
//        throw new RuntimeException("未支持余额支付");
    }

    public void applyBalancePayOrder(PayOrder payOrder) {
        // 扣除余额
        payOrderDetailRepository.saveAll(payOrderDetailRepository.findAllByPayOrderId(payOrder.getId()).stream()
                .filter(x -> x.getDetailType().equals(PayDetailType.BALANCE_PAY) && x.getStatus().equals(0))
                .peek(x -> {
                    var payment = new Payment();
                    var paymentVerification = new PaymentVerification();
                    paymentVerification.setcVoucherNo(payOrder.getUOrderNo());
                    paymentVerification.setiAmount(x.getAmount());
                    payment.setcPayNo(x.getDeductionPayNo());
                    payment.setPaymentVerifications(Collections.singletonList(paymentVerification));

                    Map<String, String> params = new HashMap<>();
                    params.put("appkey", configuration.getAppKey());
                    params.put("token", configuration.getToken());
                    params.put("format", UOrderUtils.FORMDATA);
                    params.put("payment", JSONObject.toJSONString(payment));

                    String sign = UOrderUtils.sign(params, configuration);
                    var response = uOrderApi.savePaymentVerification(configuration.getAppKey(),
                            UOrderUtils.FORMDATA,
                            configuration.getToken(),
                            JSONObject.toJSONString(payment),
                            sign);
                    if (log.isDebugEnabled()) {
                        log.debug("返回请求:{}", JSONObject.toJSONString(response));
                    }
                    if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
                        log.error("余额扣除异常，请稍后再试或选择其他方式付款");
                        x.setStatus(2);
                    } else {
                        x.setStatus(1);
                    }
                })
                .toList());
    }

    /**
     * 混合支付支付宝支付部分
     *
     * @param userId
     * @param payOrder
     * @return
     */
    public ModelAndView applyBatchPay(String userId, PayOrder payOrder) {
        // 3.渲染+转账
        var batchCreateDTO = new BatchCreateDTO();
        batchCreateDTO.setOutBatchNo(payOrder.getPayNo());// 全部使用混合支付的订单信息
        batchCreateDTO.setTotalCount(1); // 目前是采购商转账给蔡明伟，所以都是1对1转账
        batchCreateDTO.setTotalTransAmount(payOrder.getRealAmount().doubleValue());
        batchCreateDTO.setProductCode("BATCH_API_TO_ACC");
        batchCreateDTO.setOrderTitle("订单：" + payOrder.getUOrderNo() + "支付宝转账部分");
        batchCreateDTO.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
//        batchCreateDTO.setTimeExpire("");// TODO 超时时间
        if(!ALIPAY.equals(payOrder.getType())){
            batchCreateDTO.setRemark("混合支付转账支付部分：" + payOrder.getUOrderNo());
        } else {
            batchCreateDTO.setRemark("混合支付转账支付部分：" + payOrder.getPayNo());
        }
        // 填充付款方信息
        var payerInfo = new BatchCreateDTO.Participant();
        payerInfo.setIdentity(userId);
        payerInfo.setIdentityType("ALIPAY_USER_ID");

        // 填充收款方信息 目前基本都是1对1转账
        var transOrderDetail = new BatchCreateDTO.TransOrderDetail();
        var payeeInfo = new BatchCreateDTO.Participant();
        payeeInfo.setIdentity(configuration.getPayeeId());
        payeeInfo.setIdentityType("ALIPAY_USER_ID");
        transOrderDetail.setPayeeInfo(payeeInfo);
        transOrderDetail.setTransAmount(payOrder.getRealAmount().doubleValue());
        transOrderDetail.setOutBizNo(payOrder.getPayNo());// 此处考虑使用支付号，这样完成后便于更新所有订单的支付状态

        batchCreateDTO.setPayerInfo(payerInfo);
        batchCreateDTO.setTransOrderList(Collections.singletonList(transOrderDetail));

        AlipayFundBatchCreateResponse alipayFundBatchCreateResponse = alipayService.createBatchFund(batchCreateDTO);

        if (!alipayFundBatchCreateResponse.isSuccess()) {
            throw new RuntimeException("支付宝批量转账失败,原因：【" + alipayFundBatchCreateResponse.getSubMsg() + "】");
        }

        // 持久化支付订单信息
        var alipayBatchPayRecord = AlipayBatchPayRecord.builder()
                .batchTransId(alipayFundBatchCreateResponse.getBatchTransId())
                .outBatchNo(payOrder.getPayNo())
                .status(alipayFundBatchCreateResponse.getStatus())
                .payerId(userId)
                .payeeId(configuration.getPayeeId())
                .transAmount(payOrder.getRealAmount())
                .notifySuccess(false)
                .build();
        saveBatchPayRecord(alipayBatchPayRecord);

        payOrder.setBatchTransId(alipayFundBatchCreateResponse.getBatchTransId());
        payOrderRepository.save(payOrder);


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


    public void notifyUOrder(String payNo, String outTradeNo) {
        orderRepository.findFirstByPayNo(payNo)
                .ifPresent(order ->
                {
                    Map<String, String> model = new HashMap<>();
                    model.put("status", "0");
                    model.put("payNo", order.getPayNo());
                    model.put("outTradeNo", outTradeNo);
                    model.put("srcReserve", "CustomChannel");
                    String linkString = Rsa2Utils.createLinkString(model, true);
                    String sign = null;
                    try {
                        sign = Rsa2Utils.sign(linkString, configuration.getPrivateKey(), "UTF-8");
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("回调通知签名异常");
                    }
                    model.put("sign", sign);
                    RestClient restClient = RestClient.builder().baseUrl(order.getNotifyUrl())
                            .requestInitializer(request -> {
                                System.out.println("请求链接：" + request.getURI());
                            })
                            .build();
                    var response = restClient.post()
                            .uri("?payNo={payNo}&outTradeNo={outTradeNo}&status={status}&srcReserve={srcReserve}&sign={sign}",
                                    model)
                            .retrieve()
                            .toEntity(String.class);

                    // TODO 需要删除
                    if (log.isDebugEnabled()) {
                        log.debug("通知结果:{}", JSONObject.toJSONString(response));
                    }
                    if ("SUCCESS".equals(response.getBody())) {
                        order.setStatus((short) 1);
                        orderRepository.save(order);
                    }
                });
    }

    public Page<PayOrderDetail> queryPayOrderDetailPage(Pageable pageable, QueryListParamsRequest paramsRequest) {
        return payOrderDetailRepository.findAll(
                (root, criteriaQuery, criteriaBuilder) -> {
                    List<Predicate> list = new ArrayList<>();
                    if (null != paramsRequest.getStartDateTime() && null != paramsRequest.getEndDateTime()) {
                        list.add(criteriaBuilder.between(root.get("createdAt"), paramsRequest.getStartDateTime(), paramsRequest.getEndDateTime()));
                    }
                    Join<PayOrder, PayOrderDetail> joinPayOrder = root.join("payOrder", JoinType.LEFT);
                    if (StringUtils.hasLength(paramsRequest.getOrderNo())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("uOrderNo"), paramsRequest.getOrderNo()));
                    }
                    if (StringUtils.hasLength(paramsRequest.getPayNo())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("payNo"), paramsRequest.getPayNo()));
                    }
                    if (StringUtils.hasLength(paramsRequest.getAgentName())) {
                        list.add(criteriaBuilder.like(joinPayOrder.get("agentName"), "%" + paramsRequest.getAgentName() + "%"));
                    }
                    if (StringUtils.hasLength(paramsRequest.getBatchTransId())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("alipayOrderNo"), paramsRequest.getBatchTransId()));
                    }
                    if (null != paramsRequest.getStatus()) {
                        list.add(criteriaBuilder.equal(root.get("status"), paramsRequest.getStatus()));
                    }

                    return criteriaQuery.where(list.toArray(new Predicate[list.size()])).getRestriction();
                }, pageable);
    }

    /**
     * 全部查询数据
     *
     * @param paramsRequest
     * @return
     */
    public List<PayOrderDetail>  queryPayOrderDetialList(QueryListParamsRequest paramsRequest) {
        return payOrderDetailRepository.findAll(
                (root, criteriaQuery, criteriaBuilder) -> {
                    List<Predicate> list = new ArrayList<>();
                    if (null != paramsRequest.getStartDateTime() && null != paramsRequest.getEndDateTime()) {
                        list.add(criteriaBuilder.between(root.get("createdAt"), paramsRequest.getStartDateTime(), paramsRequest.getEndDateTime()));
                    }
                    Join<PayOrder, PayOrderDetail> joinPayOrder = root.join("payOrder", JoinType.LEFT);
                    if (StringUtils.hasLength(paramsRequest.getOrderNo())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("uOrderNo"), paramsRequest.getOrderNo()));
                    }
                    if (StringUtils.hasLength(paramsRequest.getPayNo())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("payNo"), paramsRequest.getPayNo()));
                    }
                    if (StringUtils.hasLength(paramsRequest.getAgentName())) {
                        list.add(criteriaBuilder.like(joinPayOrder.get("agentName"), "%" + paramsRequest.getAgentName() + "%"));
                    }
                    if (StringUtils.hasLength(paramsRequest.getBatchTransId())) {
                        list.add(criteriaBuilder.equal(joinPayOrder.get("alipayOrderNo"), paramsRequest.getBatchTransId()));
                    }
                    if (null != paramsRequest.getStatus()) {
                        list.add(criteriaBuilder.equal(root.get("status"), paramsRequest.getStatus()));
                    }
                    return criteriaQuery.where(list.toArray(new Predicate[list.size()])).getRestriction();
                });
    }

    public PayOrder getPayOrderById(String id) {
        return payOrderRepository.findById(id).orElse(null);
    }

    public PayOrder getPayOrderByPayNo(String payNo) {
        return payOrderRepository.findByPayNo(payNo).orElse(null);
    }

    /**
     * 生成混合支付数据
     */
    public PayOrder initPayOrder(MixPayOrderRequest request) {
        // 1.判断余额是否充足
        var optionalOrder = orderRepository.findFirstByPayNo(request.getPayNo());
        // 2.判断是否已有支付单
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("获取订单信息失败，请重试");
        }
        var order = optionalOrder.get();
        payOrderRepository.findByPayNo(request.getPayNo())
                .ifPresent(payOrder -> {
                    throw new RuntimeException("支付单号重复，请重新发起支付");
                });
        var payOrder = new PayOrder();
        payOrder.setUOrderNo(request.getOrderNo());
        payOrder.setPayNo(request.getPayNo());
        payOrder.setTotalAmount(request.getTotalAmount());
        payOrder.setRebateAmount(request.getRebateAmount());
        payOrder.setRealAmount(request.getRealAmount());
        payOrder.setBalanceAmount(request.getBalanceAmount());
        payOrder.setAgentId(request.getAgentId());
        payOrder.setPayStatus(0);// 未支付
        payOrder.setAgentERPCode(order.getAgentERPCode());
        payOrder.setAgentName(order.getAgentName());
        payOrder.setUAgentId(order.getAgentId());
        // 3.判断支付类型是那种
        if (request.getRealAmount().compareTo(BigDecimal.ZERO) < 1
                && request.getBalanceAmount().compareTo(BigDecimal.ZERO) > 0) {
            // 纯余额支付
            payOrder.setType(BALANCE);
        } else if (request.getRealAmount().compareTo(BigDecimal.ZERO) > 0
                && request.getBalanceAmount().compareTo(BigDecimal.ZERO) < 1) {
            // 纯支付宝支付
            payOrder.setType(ALIPAY);
        } else if (request.getRealAmount().compareTo(BigDecimal.ZERO) > 0
                && request.getBalanceAmount().compareTo(BigDecimal.ZERO) > 0
                && request.getRebateAmount().compareTo(BigDecimal.ZERO) > 0) {
            // 混合支付
            payOrder.setType(MIX_PAY_ALIPAY_BALANCE_REBATE);
        } else if (request.getRebateAmount().compareTo(BigDecimal.ZERO) < 1) {
            payOrder.setType(MIX_PAY_ALIPAY_BALANCE);
        } else {
            throw new RuntimeException("不支持的支付类型，请核实余额抵扣金额、订单总额信息");
        }
        return payOrderRepository.save(payOrder);
    }

    public void createAlipayOrder(PayOrder payOrder) {
        PayOrderDetail orderDetail = new PayOrderDetail();
        orderDetail.setPayOrderId(payOrder.getId());
        orderDetail.setAmount(payOrder.getRealAmount());
        orderDetail.setDetailType(PayDetailType.ALIPAY);
        orderDetail.setStatus(0);
        payOrderDetailRepository.save(orderDetail);
    }

    /**
     * 刷新订单状态
     *
     * @param payNo
     * @return
     */
    public PayOrder refreshPayOrder(String payNo) {
        // 1.判断是否有支付宝支付，如果有，则更新支付宝中的信息
        // 2.判断是否已经支付
        alipayBatchPayRecordRepository.findByOutBatchNo(payNo)
                .ifPresent(alipayFundAuthRecord -> {
                    if (!"SUCCESS".equals(alipayFundAuthRecord.getStatus())) {
                        // 3.主动查询支付状态
                        var batchDetailQueryDTO = new BatchDetailQueryDTO();
                        batchDetailQueryDTO.setOutBatchNo(alipayFundAuthRecord.getOutBatchNo());
                        batchDetailQueryDTO.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
                        batchDetailQueryDTO.setProductCode("BATCH_API_TO_ACC");
                        var response = alipayService.batchDetailQuery(batchDetailQueryDTO);
                        SerializeConfig config = new SerializeConfig();
                        config.propertyNamingStrategy = PropertyNamingStrategy.SnakeCase;
                        // 依据查询结果更新支付宝状态
                        publisher.publishEvent(new AlipayNotificationEvent(BATCH_PAY_CHANGED, JSONObject.parseObject(JSONObject.toJSONString(response, config), Map.class)));
                    }
                });
        var payOrder = payOrderRepository.findByPayNo(payNo).orElse(null);
        if (null == payOrder) {
            throw new RuntimeException("不存在的支付单，请核实信息");
        }
        return payOrder;
    }

    /**
     * 创建新的支付单信息
     *
     * @param payOrder
     * @return
     */
    public PayOrder createNewPayOrder(PayOrder payOrder) {
        var newPayOrder = new PayOrder();
        BeanUtils.copyProperties(payOrder, newPayOrder);
        newPayOrder.setId(null);
        newPayOrder.setPayNo(UUID.randomUUID().toString().replaceAll("-",""));// 生成临时支付号
        newPayOrder.setSourcePayNo(payOrder.getPayNo());
        payOrderRepository.save(newPayOrder);
        return newPayOrder;
    }

    /**
     * 请求u订货生成支付单信息
     *
     * @param payOrder
     */
    public String applyNewPayments(PayOrder payOrder) {
        if (log.isDebugEnabled()) {
            log.debug("混合支付支付宝支付部分生成新订单:{},金额:{}", payOrder.getSourcePayNo(), payOrder.getRealAmount());
        }
        var payment = new Payment();
        payment.setAmount(payOrder.getRealAmount());
        payment.setiPayType(1);
        payment.setVoucherType("NORMAL");
        payment.setCyberbankCode("CustomChannelMobile");
        payment.setPaymentStatusCode(2);// 在线支付的逻辑没有其他状态 默认变成支付完成
        payment.setcOutSysKey(payOrder.getId());// 接口唯一标识
        payment.setPaymentFinishDate(payOrder.getCreatedAt());
        payment.setReceiptDate(LocalDateTime.now());
        payment.setcSource("0");
        // 设置代理商信息
        var agent = new Agent();
        agent.setcOutSysKey(payOrder.getAgentERPCode());
        payment.setAgent(agent);
        // 设置核销信息
        var paymentVerification = new PaymentVerification();
        paymentVerification.setiAmount(payOrder.getRealAmount());
        paymentVerification.setcVoucherNo(payOrder.getUOrderNo());
        payment.setPaymentVerifications(List.of(paymentVerification));

        // 用友集团反馈需要使用新的appkey和token进行新的支付单生成
        Map<String, String> params = new HashMap<>();
//        params.put("appkey", configuration.getAppKey());
        params.put("appkey", configuration.getAppKey2());
//        params.put("token", configuration.getToken());
        params.put("token", configuration.getToken2());
        params.put("format", UOrderUtils.FORMDATA);
        params.put("payment", JSONObject.toJSONString(payment));

//        String sign = UOrderUtils.sign(params, configuration);
        String sign = UOrderUtils.sign(params, configuration.getSecret2());

        var response = uOrderApi.savePayment(configuration.getAppKey2(),
                UOrderUtils.FORMDATA,
                configuration.getToken2(),
                sign,
                JSONObject.toJSONString(payment));
        if (log.isDebugEnabled()) {
            log.debug("创建的新的支付单信息:{}", response);
        }
        if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
            throw new RuntimeException("创建混合支付单异常，请核实：" + response.getBody().getMessage());
        }
        // 修改为正在的支付单号
        return response.getBody().getData().getObj().getCPayNo();
    }

    public void confirmPayOrder(PayOrder payOrder) {
        // 处理支付单数据
        long count2 = payOrderDetailRepository.countAllByPayOrderIdAndStatus(payOrder.getId(), 2);
        long count0 = payOrderDetailRepository.countAllByPayOrderIdAndStatus(payOrder.getId(), 0);
        if (count0 == 0) {
            payOrder.setPayStatus(count2 > 0 ? 2 : 1);
        }
        payOrderRepository.save(payOrder);
    }

    public void updateAlipayOrderNo(PayOrder payOrder) {
        alipayBatchPayRecordRepository.findByBatchTransId(payOrder.getBatchTransId())
                .ifPresent(record -> {
                    var batchDetailQueryDTO = new BatchDetailQueryDTO();
                    batchDetailQueryDTO.setOutBatchNo(record.getOutBatchNo());
                    batchDetailQueryDTO.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
                    batchDetailQueryDTO.setProductCode("BATCH_API_TO_ACC");
                    var response = alipayService.batchDetailQuery(batchDetailQueryDTO);
                    if ("SUCCESS".equals(response.getBatchStatus())
                            && !CollectionUtils.isEmpty(response.getAccDetailList())) {
                        // 目前都是1对1转账，只有一个
                        payOrder.setAlipayOrderNo(response.getAccDetailList().get(0).getAlipayOrderNo());
                        payOrderRepository.save(payOrder);
                    }
                });

    }
}
