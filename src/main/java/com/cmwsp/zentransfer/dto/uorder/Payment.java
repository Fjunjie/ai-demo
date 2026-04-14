package com.cmwsp.zentransfer.dto.uorder;

import java.util.List;
import java.util.ArrayList;

public class Payment {
    private String cPayNo;
    private List<PaymentVerification> lsPaymentVerifications = new ArrayList<>();

    public String getcPayNo() {
        return cPayNo;
    }

    public void setcPayNo(String cPayNo) {
        this.cPayNo = cPayNo;
    }

    public List<PaymentVerification> getLsPaymentVerifications() {
        return lsPaymentVerifications;
    }

    public void setLsPaymentVerifications(List<PaymentVerification> lsPaymentVerifications) {
        this.lsPaymentVerifications = lsPaymentVerifications;
    }
}

