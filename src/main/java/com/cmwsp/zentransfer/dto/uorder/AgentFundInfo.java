package com.cmwsp.zentransfer.dto.uorder;

public class AgentFundInfo {
    private String iAgentId;
    private String iAgentRelationId;
    private double fFinance;
    private double iPayNotUsedAmount;//预付款账户余额
    private double iRebateNotUsedAmount;//返利账户余额
    private double iCreditValue;//信用余额
    private double iCusCreLine;
    private long iCorpId;
    private int iDeleted;

    public String getiAgentId() {
        return iAgentId;
    }

    public void setiAgentId(String iAgentId) {
        this.iAgentId = iAgentId;
    }

    public String getiAgentRelationId() {
        return iAgentRelationId;
    }

    public void setiAgentRelationId(String iAgentRelationId) {
        this.iAgentRelationId = iAgentRelationId;
    }

    public double getfFinance() {
        return fFinance;
    }

    public void setfFinance(double fFinance) {
        this.fFinance = fFinance;
    }

    public double getiPayNotUsedAmount() {
        return iPayNotUsedAmount;
    }

    public void setiPayNotUsedAmount(double iPayNotUsedAmount) {
        this.iPayNotUsedAmount = iPayNotUsedAmount;
    }

    public double getiRebateNotUsedAmount() {
        return iRebateNotUsedAmount;
    }

    public void setiRebateNotUsedAmount(double iRebateNotUsedAmount) {
        this.iRebateNotUsedAmount = iRebateNotUsedAmount;
    }

    public double getiCreditValue() {
        return iCreditValue;
    }

    public void setiCreditValue(double iCreditValue) {
        this.iCreditValue = iCreditValue;
    }

    public double getiCusCreLine() {
        return iCusCreLine;
    }

    public void setiCusCreLine(double iCusCreLine) {
        this.iCusCreLine = iCusCreLine;
    }

    public long getiCorpId() {
        return iCorpId;
    }

    public void setiCorpId(long iCorpId) {
        this.iCorpId = iCorpId;
    }

    public int getiDeleted() {
        return iDeleted;
    }

    public void setiDeleted(int iDeleted) {
        this.iDeleted = iDeleted;
    }
}
