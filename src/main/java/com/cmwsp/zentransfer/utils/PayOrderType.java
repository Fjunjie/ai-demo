package com.cmwsp.zentransfer.utils;

public enum PayOrderType {
    // 支付宝支付
    ALIPAY,
    // 余额支付
    BALANCE,
    // 混合支付-支付宝+抵扣
    MIX_PAY_ALIPAY_REBATE,
    // 混合支付-支付宝+余额
    MIX_PAY_ALIPAY_BALANCE,
    // 混合支付-支付宝+余额+抵扣
    MIX_PAY_ALIPAY_BALANCE_REBATE
}
