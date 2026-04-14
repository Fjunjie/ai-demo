package com.cmwsp.zentransfer.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.alipay.api.domain.AccDetailModel;
import com.cmwsp.zentransfer.repository.PayOrderDetailRepository;
import com.cmwsp.zentransfer.repository.PayOrderRepository;
import com.cmwsp.zentransfer.repository.alipay.AlipayBatchPayRecordRepository;
import com.cmwsp.zentransfer.service.AlipayNotifyMessageHandler;
import com.cmwsp.zentransfer.service.PayService;
import com.cmwsp.zentransfer.utils.PayDetailType;
import com.cmwsp.zentransfer.utils.PayOrderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Map;

import static com.cmwsp.zentransfer.utils.PayOrderType.*;

@Component
@Slf4j
public class AlipayBatchPayChangedNotify implements AlipayNotifyMessageHandler<Map<String, String>> {

    public final static String BATCH_PAY_CHANGED = "alipay.fund.batch.order.changed";

    private final AlipayBatchPayRecordRepository alipayBatchPayRecordRepository;
    private final PayOrderRepository payOrderRepository;
    private final PayService payService;
    private final PayOrderDetailRepository payOrderDetailRepository;

    public AlipayBatchPayChangedNotify(AlipayBatchPayRecordRepository alipayBatchPayRecordRepository,
                                       PayOrderRepository payOrderRepository,
                                       PayService payService,
                                       PayOrderDetailRepository payOrderDetailRepository) {
        this.alipayBatchPayRecordRepository = alipayBatchPayRecordRepository;
        this.payOrderRepository = payOrderRepository;
        this.payService = payService;
        this.payOrderDetailRepository = payOrderDetailRepository;
    }

    @Override
    public String supportMsgMethod() {
        return BATCH_PAY_CHANGED;
    }

    @Override
    public void handleMessage(Map<String, String> formData) {
        if (log.isDebugEnabled()) {
            log.debug("支付宝返回数据:{}", formData);
        }
        // 查询记录
        alipayBatchPayRecordRepository.findByOutBatchNo(formData.get("out_batch_no"))
                .ifPresent(record -> {
                    if (log.isDebugEnabled()) {
                        log.debug("更新前数据:{}", JSONObject.toJSONString(record));
                    }
                    // 更新状态
                    record.setStatus(formData.get("batch_status"));
                    if ("SUCCESS".equals(record.getStatus())) {
                        payOrderRepository.findByPayNo(record.getOutBatchNo())
                                .ifPresent(payOrder ->
                                        {
                                            // 处理支付详情单信息
                                            payOrderDetailRepository.findAllByPayOrderId(payOrder.getId())
                                                    .forEach(x -> {
                                                        if (x.getDetailType().equals(PayDetailType.ALIPAY)) {
                                                            x.setStatus(1);
                                                            payOrderDetailRepository.save(x);
                                                        }
                                                    });
                                            if (!payOrder.getType().equals(PayOrderType.ALIPAY)) {
                                                // 核销余额，余额核销完成就可以通知U订单了
                                                payService.applyBalancePayOrder(payOrder);
                                            }
                                            // 如果是混合支付的，此处需要新增支付单
                                            if (MIX_PAY_ALIPAY_BALANCE.equals(payOrder.getType())
                                                    || MIX_PAY_ALIPAY_REBATE.equals(payOrder.getType())
                                                    || MIX_PAY_ALIPAY_BALANCE_REBATE.equals(payOrder.getType())) {
                                                // 放入更新后的支付单号
                                                String newPayNo = payService.applyNewPayments(payOrder);
                                                payOrder.setPayNo(newPayNo);
                                                // 同步更新支付宝批量支付记录的外部单号，保持关联关系
                                                record.setOutBatchNo(newPayNo);
                                            } else {
                                                payService.notifyUOrder(payOrder.getPayNo(), record.getBatchTransId());
                                            }
                                            if(StringUtils.hasLength(formData.get("acc_detail_list"))){
                                                var accDetailList = JSONObject.parseArray(formData.get("acc_detail_list"), AccDetailModel.class);
                                                // 目前理论上只有一个
                                                accDetailList.stream().findFirst()
                                                        .ifPresent(accDetailModel -> payOrder.setAlipayOrderNo(accDetailModel.getAlipayOrderNo()));
                                            }
                                            payService.confirmPayOrder(payOrder);
                                            record.setNotifySuccess(true);
                                            if (log.isDebugEnabled()) {
                                                log.debug("更新后数据:{}", JSONObject.toJSONString(record));
                                            }
                                            alipayBatchPayRecordRepository.save(record);
                                        }
                                );
                    } else {
                        if (log.isDebugEnabled()) {
                            log.debug("更新后数据:{}", JSONObject.toJSONString(record));
                        }
                        alipayBatchPayRecordRepository.save(record);
                    }
                });
    }

}
