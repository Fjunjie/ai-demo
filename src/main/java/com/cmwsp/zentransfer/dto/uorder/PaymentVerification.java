package com.cmwsp.zentransfer.dto.uorder;

public class PaymentVerification {
    private double iAmount;
    private String cVoucherNo;

    public double getiAmount() {
        return iAmount;
    }

    public void setiAmount(double iAmount) {
        this.iAmount = iAmount;
    }

    public String getcVoucherNo() {
        return cVoucherNo;
    }

    public void setcVoucherNo(String cVoucherNo) {
        this.cVoucherNo = cVoucherNo;
    }
}
