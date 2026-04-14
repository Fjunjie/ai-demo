package com.cmwsp.zentransfer.dto.uorder;

import lombok.Data;

// U订货支付请求参数对象
@Data
public class OrderDTO {
        // 编码规则，固定值：UTF-8
        String inputCharset;

        // 支付单号
        String payNo;

        // 订单单号
        String orderNo;

        // 金额 单位“元”
        String amount;

        // 商品描述
        String produceDesc;

        // 异步通知url （该地址由用友提供）
        String notifyUrl;

        // 保留字段， 固定CustomChannel
        String srcReserve;

        // 商家Id
        String bizId;

        // 客户Id
        String agentId;

        // 平台签名
        String sign;
        String returnUrl;
        String size;

}