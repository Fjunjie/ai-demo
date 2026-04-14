package com.cmwsp.zentransfer.dto.uorder;

import java.io.Serializable;

// U订货支付通知参数对象
public record OrderNotify(
    // 支付单号
    String payNo,

    // 支付状态 ”0” 成功
    String status,

    // 保留字段， 默认：CustomChannel
    String srcReserve,

    // 商家签名
    String sign,

    // 外部单号
    String outTradeNo) implements Serializable {
}