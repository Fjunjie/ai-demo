package com.cmwsp.zentransfer.utils;

public enum PayDetailType {

    // 余额支付
    BALANCE_PAY,

    // 支付宝支付
    ALIPAY;

    public static PayDetailType getPayDetailType(String type) {
        for (PayDetailType payDetailType : PayDetailType.values()) {
            if (payDetailType.name().equals(type)) {
                return payDetailType;
            }
        }
        return null;
    }
}
