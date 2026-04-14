package com.cmwsp.zentransfer.dto.uorder;

import java.math.BigDecimal;

public class OrderDetail {

    // 订单号
    private String cOrderNo;

    // 订单表体自定义项明细
    private OrderDetailDefine oOrderDetailDefine;

    // 行唯一标记
    private String idKey;

    // 明细行SKU对象
    private ProductSKU oSKU;

    // 主计量数量
    private BigDecimal iQuantity;

    // 主计量单位名称
    private String cProductUnitName;

    // 辅计量数量
    private BigDecimal iAuxUnitQuantity;

    // 辅计量单位名称
    private String cProductAuxUnitName;

    // 主辅计量转换率
    private int iConversionRate;

    // U订货商品编码
    private String cProductCode;

    // 规格属性
    private String cSpecDescription;

    // 商品明细小计
    private BigDecimal fSaleCost;

    // 实付金额
    private BigDecimal fSalePayMoney;

    // 商品名称
    private String cProductName;

    // 已发货数量
    private BigDecimal iSendQuantity;

    // 商品实际销售单价
    private BigDecimal fSalePrice;

    // 商品SKUID
    private long iSKUId;

    // 商品erp编码
    private String cProductOutSysKey;

    // 商品类型
    private String cOrderProductType;

    // 商品所属仓库ID
    private long iStockId;

    // 商品ID
    private long iProductId;

    // 商品分组ID
    private long iGroupId;

    // 成交价
    private BigDecimal fTransactionPrice;

    // 订单交易类型
    private Long iTransactionTypeId;

    // 交易类型
    private TransactionType oTransactionType;

    // 商品库存组织外部编码
    private String cStockOrgOutSysKey;

    public String getcOrderNo() {
        return cOrderNo;
    }

    public void setcOrderNo(String cOrderNo) {
        this.cOrderNo = cOrderNo;
    }

    public OrderDetailDefine getoOrderDetailDefine() {
        return oOrderDetailDefine;
    }

    public void setoOrderDetailDefine(OrderDetailDefine oOrderDetailDefine) {
        this.oOrderDetailDefine = oOrderDetailDefine;
    }

    public String getIdKey() {
        return idKey;
    }

    public void setIdKey(String idKey) {
        this.idKey = idKey;
    }

    public ProductSKU getoSKU() {
        return oSKU;
    }

    public void setoSKU(ProductSKU oSKU) {
        this.oSKU = oSKU;
    }

    public BigDecimal getiQuantity() {
        return iQuantity;
    }

    public void setiQuantity(BigDecimal iQuantity) {
        this.iQuantity = iQuantity;
    }

    public String getcProductUnitName() {
        return cProductUnitName;
    }

    public void setcProductUnitName(String cProductUnitName) {
        this.cProductUnitName = cProductUnitName;
    }

    public BigDecimal getiAuxUnitQuantity() {
        return iAuxUnitQuantity;
    }

    public void setiAuxUnitQuantity(BigDecimal iAuxUnitQuantity) {
        this.iAuxUnitQuantity = iAuxUnitQuantity;
    }

    public String getcProductAuxUnitName() {
        return cProductAuxUnitName;
    }

    public void setcProductAuxUnitName(String cProductAuxUnitName) {
        this.cProductAuxUnitName = cProductAuxUnitName;
    }

    public int getiConversionRate() {
        return iConversionRate;
    }

    public void setiConversionRate(int iConversionRate) {
        this.iConversionRate = iConversionRate;
    }

    public String getcProductCode() {
        return cProductCode;
    }

    public void setcProductCode(String cProductCode) {
        this.cProductCode = cProductCode;
    }

    public String getcSpecDescription() {
        return cSpecDescription;
    }

    public void setcSpecDescription(String cSpecDescription) {
        this.cSpecDescription = cSpecDescription;
    }

    public BigDecimal getfSaleCost() {
        return fSaleCost;
    }

    public void setfSaleCost(BigDecimal fSaleCost) {
        this.fSaleCost = fSaleCost;
    }

    public BigDecimal getfSalePayMoney() {
        return fSalePayMoney;
    }

    public void setfSalePayMoney(BigDecimal fSalePayMoney) {
        this.fSalePayMoney = fSalePayMoney;
    }

    public String getcProductName() {
        return cProductName;
    }

    public void setcProductName(String cProductName) {
        this.cProductName = cProductName;
    }

    public BigDecimal getiSendQuantity() {
        return iSendQuantity;
    }

    public void setiSendQuantity(BigDecimal iSendQuantity) {
        this.iSendQuantity = iSendQuantity;
    }

    public BigDecimal getfSalePrice() {
        return fSalePrice;
    }

    public void setfSalePrice(BigDecimal fSalePrice) {
        this.fSalePrice = fSalePrice;
    }

    public long getiSKUId() {
        return iSKUId;
    }

    public void setiSKUId(long iSKUId) {
        this.iSKUId = iSKUId;
    }

    public String getcProductOutSysKey() {
        return cProductOutSysKey;
    }

    public void setcProductOutSysKey(String cProductOutSysKey) {
        this.cProductOutSysKey = cProductOutSysKey;
    }

    public String getcOrderProductType() {
        return cOrderProductType;
    }

    public void setcOrderProductType(String cOrderProductType) {
        this.cOrderProductType = cOrderProductType;
    }

    public long getiStockId() {
        return iStockId;
    }

    public void setiStockId(long iStockId) {
        this.iStockId = iStockId;
    }

    public long getiProductId() {
        return iProductId;
    }

    public void setiProductId(long iProductId) {
        this.iProductId = iProductId;
    }

    public long getiGroupId() {
        return iGroupId;
    }

    public void setiGroupId(long iGroupId) {
        this.iGroupId = iGroupId;
    }

    public BigDecimal getfTransactionPrice() {
        return fTransactionPrice;
    }

    public void setfTransactionPrice(BigDecimal fTransactionPrice) {
        this.fTransactionPrice = fTransactionPrice;
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

    public String getcStockOrgOutSysKey() {
        return cStockOrgOutSysKey;
    }

    public void setcStockOrgOutSysKey(String cStockOrgOutSysKey) {
        this.cStockOrgOutSysKey = cStockOrgOutSysKey;
    }
}
