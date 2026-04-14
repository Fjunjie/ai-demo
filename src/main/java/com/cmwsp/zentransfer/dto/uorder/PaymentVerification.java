package com.cmwsp.zentransfer.dto.uorder;

import java.math.BigDecimal;

public class PaymentVerification {
    private BigDecimal iAmount;
    private String cVoucherNo;

    public BigDecimal getiAmount() {
        return iAmount;
    }

    public void setiAmount(BigDecimal iAmount) {
        this.iAmount = iAmount;
    }

    public String getcVoucherNo() {
        return cVoucherNo;
    }

    public void setcVoucherNo(String cVoucherNo) {
        this.cVoucherNo = cVoucherNo;
    }
}
