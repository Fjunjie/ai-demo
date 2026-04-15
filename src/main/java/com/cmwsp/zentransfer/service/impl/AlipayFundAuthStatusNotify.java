package com.cmwsp.zentransfer.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.cmwsp.zentransfer.repository.alipay.AlipayFundAuthRecordRepository;
import com.cmwsp.zentransfer.service.AlipayNotifyMessageHandler;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AlipayFundAuthStatusNotify implements AlipayNotifyMessageHandler<Map<String, String>> {

    private final AlipayFundAuthRecordRepository alipayFundAuthRecordRepository;

    public final static String FUND_AUTH_NOTIFY = "alipay.fund.authorize.status.notify";

    public AlipayFundAuthStatusNotify(AlipayFundAuthRecordRepository alipayFundAuthRecordRepository) {
        this.alipayFundAuthRecordRepository = alipayFundAuthRecordRepository;
    }

    @Override
    public String supportMsgMethod() {
        return FUND_AUTH_NOTIFY;
    }

    @Override
    public void handleMessage(Map<String, String> formData) {
        //1.获取交易号
        var result = alipayFundAuthRecordRepository.findByOutBizNo(formData.get("out_biz_no"));
        if(result.isPresent()){
            var record = result.get();
            //2.更新交易状态
            record.setStatus(formData.get("status"));
            record.setAgreementNo(formData.get("agreement_no"));
            alipayFundAuthRecordRepository.save(record);
        } else {
            System.out.println("未找到对应的交易记录:" + JSONObject.toJSONString(formData));
        }
        // 不存在则丢弃消息
    }
}
