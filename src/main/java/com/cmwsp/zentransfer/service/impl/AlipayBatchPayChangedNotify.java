package com.cmwsp.zentransfer.service.impl;

import com.cmwsp.zentransfer.model.alipay.AlipayBatchPayRecord;
import com.cmwsp.zentransfer.repository.alipay.AlipayBatchPayRecordRepository;
import com.cmwsp.zentransfer.service.AlipayNotifyMessageHandler;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AlipayBatchPayChangedNotify implements AlipayNotifyMessageHandler<Map<String,String>> {

    private final static String BATCH_PAY_CHANGED = "alipay.fund.batch.order.changed";

    private final AlipayBatchPayRecordRepository alipayBatchPayRecordRepository;

    public AlipayBatchPayChangedNotify(AlipayBatchPayRecordRepository alipayBatchPayRecordRepository) {
        this.alipayBatchPayRecordRepository = alipayBatchPayRecordRepository;
    }

    @Override
    public String supportMsgMethod() {
        return BATCH_PAY_CHANGED;
    }

    @Override
    public void handleMessage(Map<String, String> formData) {
        // 查询记录
        alipayBatchPayRecordRepository.findByOutBatchNo(formData.get("out_batch_no"))
                .ifPresent(record -> {
                    // 更新状态
                    record.setStatus(formData.get("batch_status"));
                    alipayBatchPayRecordRepository.save(record);
                    if("SUCCESS".equals(record.getStatus())){
                        // TOOD 通知U订单平台付款成功
                    }
                });
    }

}
