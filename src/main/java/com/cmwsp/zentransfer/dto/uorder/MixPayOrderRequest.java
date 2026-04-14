package com.cmwsp.zentransfer.dto.uorder;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MixPayOrderRequest {

    // 支付单号
    String payNo;

    // 订单单号
    String orderNo;

    // 实际支付金额
    BigDecimal realAmount;

    // 返利抵扣金额
    BigDecimal rebateAmount;

    // 扣除余额金额
    BigDecimal balanceAmount;

    // 支付总金额
    BigDecimal totalAmount;

    String agentId;
}
