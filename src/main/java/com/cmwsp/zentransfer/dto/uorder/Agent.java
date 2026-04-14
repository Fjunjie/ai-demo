package com.cmwsp.zentransfer.dto.uorder;

public class Agent {

    private String cCode; // 客户编码
    private String cOutSysKey; // ERP编码
    private String cName; // 名称
    private String cTaxNo; // 税号
    private long iAgentCategoryId; // 客户分类ID
    private long iAgentLevelId; // 客户级别ID
    private long iAgentIndustryId; // 客户行业ID
    private long iAgentAreaId; // 客户区域ID
    private Address oAddress; // 地址信息对象
    private long iAddressId; // 地址ID
    private String iCorporationContactsId; // 主联系人ID
    private User oCorporationContact; // 联系人信息
    private User oUser; // 登录用户

    public String getcCode() {
        return cCode;
    }

    public void setcCode(String cCode) {
        this.cCode = cCode;
    }

    public String getcOutSysKey() {
        return cOutSysKey;
    }

    public void setcOutSysKey(String cOutSysKey) {
        this.cOutSysKey = cOutSysKey;
    }

    public String getcName() {
        return cName;
    }

    public void setcName(String cName) {
        this.cName = cName;
    }

    public String getcTaxNo() {
        return cTaxNo;
    }

    public void setcTaxNo(String cTaxNo) {
        this.cTaxNo = cTaxNo;
    }

    public long getiAgentCategoryId() {
        return iAgentCategoryId;
    }

    public void setiAgentCategoryId(long iAgentCategoryId) {
        this.iAgentCategoryId = iAgentCategoryId;
    }

    public long getiAgentLevelId() {
        return iAgentLevelId;
    }

    public void setiAgentLevelId(long iAgentLevelId) {
        this.iAgentLevelId = iAgentLevelId;
    }

    public long getiAgentIndustryId() {
        return iAgentIndustryId;
    }

    public void setiAgentIndustryId(long iAgentIndustryId) {
        this.iAgentIndustryId = iAgentIndustryId;
    }

    public long getiAgentAreaId() {
        return iAgentAreaId;
    }

    public void setiAgentAreaId(long iAgentAreaId) {
        this.iAgentAreaId = iAgentAreaId;
    }

    public Address getoAddress() {
        return oAddress;
    }

    public void setoAddress(Address oAddress) {
        this.oAddress = oAddress;
    }

    public long getiAddressId() {
        return iAddressId;
    }

    public void setiAddressId(long iAddressId) {
        this.iAddressId = iAddressId;
    }

    public String getiCorporationContactsId() {
        return iCorporationContactsId;
    }

    public void setiCorporationContactsId(String iCorporationContactsId) {
        this.iCorporationContactsId = iCorporationContactsId;
    }

    public User getoCorporationContact() {
        return oCorporationContact;
    }

    public void setoCorporationContact(User oCorporationContact) {
        this.oCorporationContact = oCorporationContact;
    }

    public User getoUser() {
        return oUser;
    }

    public void setoUser(User oUser) {
        this.oUser = oUser;
    }
}

