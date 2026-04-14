package com.cmwsp.zentransfer.dto.uorder;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Payment {
    private String cPayNo;

    @JsonProperty("iAmount")
    @JSONField(name = "iAmount")
    private BigDecimal amount;

    @JsonProperty("cOutSysKey")
    @JSONField(name = "cOutSysKey")
    private String cOutSysKey;

    @JsonProperty("cSalesOrgOutSysKey")
    @JSONField(name = "cSalesOrgOutSysKey")
    private String cSalesOrgOutSysKey;

    @JsonProperty("cSettlementOrgOutSysKey")
    @JSONField(name = "cSettlementOrgOutSysKey")
    private String cSettlementOrgOutSysKey;

    @JsonProperty("oAgent")
    @JSONField(name = "oAgent")
    private Agent agent;

    @JsonProperty("iPayType")
    @JSONField(name = "iPayType")
    private int iPayType;

    @JsonProperty("cyberbankCode")
    @JSONField(name = "cyberbankCode")
    private String cyberbankCode;

    @JsonProperty("oSettlementWay")
    @JSONField(name = "oSettlementWay")
    private SettlementWay oSettlementWay;

    @JsonProperty("cVoucherType")
    @JSONField(name = "cVoucherType")
    private String voucherType;

    @JsonProperty("iPayMentStatusCode")
    @JSONField(name = "iPayMentStatusCode")
    private int paymentStatusCode;

    @JsonProperty("dPayFinishDate")
    @JSONField(name = "dPayFinishDate", format = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss ")
    private LocalDateTime paymentFinishDate;

    @JsonProperty("dReceiptDate")
    @JSONField(name = "dReceiptDate", format = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime receiptDate;

    @JsonProperty("remark")
    @JSONField(name = "remark")
    private String remark;

    @JsonProperty("lsPaymentVerifications")
    @JSONField(name = "lsPaymentVerifications")
    private List<PaymentVerification> paymentVerifications;

    @JsonProperty("cSource")
    @JSONField(name = "cSource")
    private String cSource;

    public String getcSource() {
        return cSource;
    }

    public void setcSource(String cSource) {
        this.cSource = cSource;
    }

    public String getcPayNo() {
        return cPayNo;
    }

    public void setcPayNo(String cPayNo) {
        this.cPayNo = cPayNo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getcSalesOrgOutSysKey() {
        return cSalesOrgOutSysKey;
    }

    public void setcSalesOrgOutSysKey(String cSalesOrgOutSysKey) {
        this.cSalesOrgOutSysKey = cSalesOrgOutSysKey;
    }

    public String getcSettlementOrgOutSysKey() {
        return cSettlementOrgOutSysKey;
    }

    public void setcSettlementOrgOutSysKey(String cSettlementOrgOutSysKey) {
        this.cSettlementOrgOutSysKey = cSettlementOrgOutSysKey;
    }

    public Agent getAgent() {
        return agent;
    }

    public void setAgent(Agent agent) {
        this.agent = agent;
    }

    public int getiPayType() {
        return iPayType;
    }

    public void setiPayType(int iPayType) {
        this.iPayType = iPayType;
    }

    public String getCyberbankCode() {
        return cyberbankCode;
    }

    public void setCyberbankCode(String cyberbankCode) {
        this.cyberbankCode = cyberbankCode;
    }

    public String getVoucherType() {
        return voucherType;
    }

    public void setVoucherType(String voucherType) {
        this.voucherType = voucherType;
    }

    public int getPaymentStatusCode() {
        return paymentStatusCode;
    }

    public void setPaymentStatusCode(int paymentStatusCode) {
        this.paymentStatusCode = paymentStatusCode;
    }

    public LocalDateTime getPaymentFinishDate() {
        return paymentFinishDate;
    }

    public void setPaymentFinishDate(LocalDateTime paymentFinishDate) {
        this.paymentFinishDate = paymentFinishDate;
    }

    public LocalDateTime getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(LocalDateTime receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<PaymentVerification> getPaymentVerifications() {
        return paymentVerifications;
    }

    public void setPaymentVerifications(List<PaymentVerification> paymentVerifications) {
        this.paymentVerifications = paymentVerifications;
    }

    public String getcOutSysKey() {
        return cOutSysKey;
    }

    public void setcOutSysKey(String cOutSysKey) {
        this.cOutSysKey = cOutSysKey;
    }

    public SettlementWay getoSettlementWay() {
        return oSettlementWay;
    }

    public void setoSettlementWay(SettlementWay oSettlementWay) {
        this.oSettlementWay = oSettlementWay;
    }
}

