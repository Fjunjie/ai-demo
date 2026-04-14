package com.cmwsp.zentransfer.dto.uorder;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;
import java.util.List;

public class OrderResponseDTO {

    // 客户信息
    private Agent oAgent;

    // 订单编号
    private String cOrderNo;

    // 发票金额
    private String iInvoiceMoney;

    // 发票开户行
    private String cBankName;

    // 发票开户支行
    private String cSubBankName;

    // 发票开户行编码
    private String cBankCode;

    // 发票开户名
    private String cUserBankName;

    // 发票抬头
    private String cInvoiceTitle;

    // 发票类型
    private String cInvoiceType;

    // 发票开户账号
    private String cBankAccount;

    // 发票内容
    private String cInvoiceContent;

    // 税号
    private String cTaxNum;

    // 发票注册地址
    private String cAddress;

    // 发票注册电话
    private String cTelephone;

    // 收货人
    private String cReceiver;

    // 收货人手机号
    private String cReceiveMobile;

    // 收货人电话
    private String cReceiveTelePhone;

    // 收货地址
    private String cReceiveAddress;

    // 收货人邮编
    private String cReceiveZipCode;

    // 收货联系人
    private String cReceiveContacter;

    // 收货联系人电话
    private String cReceiveContacterPhone;

    // 业务员用户ID
    private String iCorpContactId;

    // 业务员名称
    private String cCorpContactUserName;

    // 业务员Erp编码
    private String cCorpContactUserErpCode;

    // 订单日期
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dOrderDate;

    // 预交货日期
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dSendDate;

    // 实际发货日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date dDeliveryDate;

    // 订单支付时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date dPayDate;

    // 订单当前状态码
    private String cStatusCode;

    // 订单下个状态名称
    private String cNextStatusName;

    // 订单下个状态码
    private String cNextStatus;

    // 订单支付状态码
    private String cPayStatusCode;

    // 订单总金额
    private Double fTotalMoney;

    // 订单实付金额含运费(订货金额)
    private Double fPayMoney;

    // 订单应付金额含运费（发货金额）
    private Double fRealMoney;

    // 订单实付金额 (订货金额)
    private Double fOrderPayMoney;

    // 订单应付金额含（发货金额）
    private Double fOrderRealMoney;

    // 抵扣金额
    private Double fRebateMoney;

    // 运费金额
    private Double fReight;

    // 创建人
    private User oSubmiter;

    // 订单明细
    private List<OrderDetail> oOrderDetails;

    // 订单表头自定义项明细
    private OrderDefine oOrderDefine;

    // 订单收货地址ERP编码
    private String cShipToAddressErpCode;

    // 订单交易类型
    private Long iTransactionTypeId;

    // 交易类型
    private TransactionType oTransactionType;

    // 订单销售组织编码
    private String cSalesOrgOutSysKey;

    // 订单财务组织编码
    private String cSettlementOrgOutSysKey;

    // 订单提交拆单后子订单号集合
    private List<String> childOrderNos;

    // 商家编码，外部唯一标识
    private String bizOutSysKey;

    // 商家类型（1：租户；2：供应商；3：经销商）
    private Integer bizType;

    // 订单确认时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date dConfirmDate;


    public Agent getoAgent() {
        return oAgent;
    }

    public void setoAgent(Agent oAgent) {
        this.oAgent = oAgent;
    }

    public String getcOrderNo() {
        return cOrderNo;
    }

    public void setcOrderNo(String cOrderNo) {
        this.cOrderNo = cOrderNo;
    }

    public String getiInvoiceMoney() {
        return iInvoiceMoney;
    }

    public void setiInvoiceMoney(String iInvoiceMoney) {
        this.iInvoiceMoney = iInvoiceMoney;
    }

    public String getcBankName() {
        return cBankName;
    }

    public void setcBankName(String cBankName) {
        this.cBankName = cBankName;
    }

    public String getcSubBankName() {
        return cSubBankName;
    }

    public void setcSubBankName(String cSubBankName) {
        this.cSubBankName = cSubBankName;
    }

    public String getcBankCode() {
        return cBankCode;
    }

    public void setcBankCode(String cBankCode) {
        this.cBankCode = cBankCode;
    }

    public String getcUserBankName() {
        return cUserBankName;
    }

    public void setcUserBankName(String cUserBankName) {
        this.cUserBankName = cUserBankName;
    }

    public String getcInvoiceTitle() {
        return cInvoiceTitle;
    }

    public void setcInvoiceTitle(String cInvoiceTitle) {
        this.cInvoiceTitle = cInvoiceTitle;
    }

    public String getcInvoiceType() {
        return cInvoiceType;
    }

    public void setcInvoiceType(String cInvoiceType) {
        this.cInvoiceType = cInvoiceType;
    }

    public String getcBankAccount() {
        return cBankAccount;
    }

    public void setcBankAccount(String cBankAccount) {
        this.cBankAccount = cBankAccount;
    }

    public String getcInvoiceContent() {
        return cInvoiceContent;
    }

    public void setcInvoiceContent(String cInvoiceContent) {
        this.cInvoiceContent = cInvoiceContent;
    }

    public String getcTaxNum() {
        return cTaxNum;
    }

    public void setcTaxNum(String cTaxNum) {
        this.cTaxNum = cTaxNum;
    }

    public String getcAddress() {
        return cAddress;
    }

    public void setcAddress(String cAddress) {
        this.cAddress = cAddress;
    }

    public String getcTelephone() {
        return cTelephone;
    }

    public void setcTelephone(String cTelephone) {
        this.cTelephone = cTelephone;
    }

    public String getcReceiver() {
        return cReceiver;
    }

    public void setcReceiver(String cReceiver) {
        this.cReceiver = cReceiver;
    }

    public String getcReceiveMobile() {
        return cReceiveMobile;
    }

    public void setcReceiveMobile(String cReceiveMobile) {
        this.cReceiveMobile = cReceiveMobile;
    }

    public String getcReceiveTelePhone() {
        return cReceiveTelePhone;
    }

    public void setcReceiveTelePhone(String cReceiveTelePhone) {
        this.cReceiveTelePhone = cReceiveTelePhone;
    }

    public String getcReceiveAddress() {
        return cReceiveAddress;
    }

    public void setcReceiveAddress(String cReceiveAddress) {
        this.cReceiveAddress = cReceiveAddress;
    }

    public String getcReceiveZipCode() {
        return cReceiveZipCode;
    }

    public void setcReceiveZipCode(String cReceiveZipCode) {
        this.cReceiveZipCode = cReceiveZipCode;
    }

    public String getcReceiveContacter() {
        return cReceiveContacter;
    }

    public void setcReceiveContacter(String cReceiveContacter) {
        this.cReceiveContacter = cReceiveContacter;
    }

    public String getcReceiveContacterPhone() {
        return cReceiveContacterPhone;
    }

    public void setcReceiveContacterPhone(String cReceiveContacterPhone) {
        this.cReceiveContacterPhone = cReceiveContacterPhone;
    }

    public String getiCorpContactId() {
        return iCorpContactId;
    }

    public void setiCorpContactId(String iCorpContactId) {
        this.iCorpContactId = iCorpContactId;
    }

    public String getcCorpContactUserName() {
        return cCorpContactUserName;
    }

    public void setcCorpContactUserName(String cCorpContactUserName) {
        this.cCorpContactUserName = cCorpContactUserName;
    }

    public String getcCorpContactUserErpCode() {
        return cCorpContactUserErpCode;
    }

    public void setcCorpContactUserErpCode(String cCorpContactUserErpCode) {
        this.cCorpContactUserErpCode = cCorpContactUserErpCode;
    }

    public Date getdOrderDate() {
        return dOrderDate;
    }

    public void setdOrderDate(Date dOrderDate) {
        this.dOrderDate = dOrderDate;
    }

    public Date getdSendDate() {
        return dSendDate;
    }

    public void setdSendDate(Date dSendDate) {
        this.dSendDate = dSendDate;
    }

    public Date getdDeliveryDate() {
        return dDeliveryDate;
    }

    public void setdDeliveryDate(Date dDeliveryDate) {
        this.dDeliveryDate = dDeliveryDate;
    }

    public Date getdPayDate() {
        return dPayDate;
    }

    public void setdPayDate(Date dPayDate) {
        this.dPayDate = dPayDate;
    }

    public String getcStatusCode() {
        return cStatusCode;
    }

    public void setcStatusCode(String cStatusCode) {
        this.cStatusCode = cStatusCode;
    }

    public String getcNextStatusName() {
        return cNextStatusName;
    }

    public void setcNextStatusName(String cNextStatusName) {
        this.cNextStatusName = cNextStatusName;
    }

    public String getcNextStatus() {
        return cNextStatus;
    }

    public void setcNextStatus(String cNextStatus) {
        this.cNextStatus = cNextStatus;
    }

    public String getcPayStatusCode() {
        return cPayStatusCode;
    }

    public void setcPayStatusCode(String cPayStatusCode) {
        this.cPayStatusCode = cPayStatusCode;
    }

    public Double getfTotalMoney() {
        return fTotalMoney;
    }

    public void setfTotalMoney(Double fTotalMoney) {
        this.fTotalMoney = fTotalMoney;
    }

    public Double getfPayMoney() {
        return fPayMoney;
    }

    public void setfPayMoney(Double fPayMoney) {
        this.fPayMoney = fPayMoney;
    }

    public Double getfRealMoney() {
        return fRealMoney;
    }

    public void setfRealMoney(Double fRealMoney) {
        this.fRealMoney = fRealMoney;
    }

    public Double getfOrderPayMoney() {
        return fOrderPayMoney;
    }

    public void setfOrderPayMoney(Double fOrderPayMoney) {
        this.fOrderPayMoney = fOrderPayMoney;
    }

    public Double getfOrderRealMoney() {
        return fOrderRealMoney;
    }

    public void setfOrderRealMoney(Double fOrderRealMoney) {
        this.fOrderRealMoney = fOrderRealMoney;
    }

    public Double getfReight() {
        return fReight;
    }

    public void setfReight(Double fReight) {
        this.fReight = fReight;
    }

    public User getoSubmiter() {
        return oSubmiter;
    }

    public void setoSubmiter(User oSubmiter) {
        this.oSubmiter = oSubmiter;
    }

    public List<OrderDetail> getoOrderDetails() {
        return oOrderDetails;
    }

    public void setoOrderDetails(List<OrderDetail> oOrderDetails) {
        this.oOrderDetails = oOrderDetails;
    }

    public OrderDefine getoOrderDefine() {
        return oOrderDefine;
    }

    public void setoOrderDefine(OrderDefine oOrderDefine) {
        this.oOrderDefine = oOrderDefine;
    }

    public String getcShipToAddressErpCode() {
        return cShipToAddressErpCode;
    }

    public void setcShipToAddressErpCode(String cShipToAddressErpCode) {
        this.cShipToAddressErpCode = cShipToAddressErpCode;
    }

    public Long getiTransactionTypeId() {
        return iTransactionTypeId;
    }

    public void setiTransactionTypeId(Long iTransactionTypeId) {
        this.iTransactionTypeId = iTransactionTypeId;
    }

    public TransactionType getoTransactionType() {
        return oTransactionType;
    }

    public void setoTransactionType(TransactionType oTransactionType) {
        this.oTransactionType = oTransactionType;
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

    public List<String> getChildOrderNos() {
        return childOrderNos;
    }

    public void setChildOrderNos(List<String> childOrderNos) {
        this.childOrderNos = childOrderNos;
    }

    public String getBizOutSysKey() {
        return bizOutSysKey;
    }

    public void setBizOutSysKey(String bizOutSysKey) {
        this.bizOutSysKey = bizOutSysKey;
    }

    public Integer getBizType() {
        return bizType;
    }

    public void setBizType(Integer bizType) {
        this.bizType = bizType;
    }

    public Date getdConfirmDate() {
        return dConfirmDate;
    }

    public void setdConfirmDate(Date dConfirmDate) {
        this.dConfirmDate = dConfirmDate;
    }

    public Double getfRebateMoney() {
        return fRebateMoney;
    }

    public void setfRebateMoney(Double fRebateMoney) {
        this.fRebateMoney = fRebateMoney;
    }
}
