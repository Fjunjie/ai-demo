package com.cmwsp.zentransfer.dto.uorder;

public class Agent {

    private String id;
    private String agentId;
    private String cCode; // 客户编码
    private String cOutSysKey; // ERP编码
    private String cName; // 名称
    private String cTaxNo; // 税号
    private Long iAgentCategoryId; // 客户分类ID
    private Long iAgentLevelId; // 客户级别ID
    private Long iAgentIndustryId; // 客户行业ID
    private Long iAgentAreaId; // 客户区域ID
    private Address oAddress; // 地址信息对象
    private Long iAddressId; // 地址ID
    private String iCorporationContactsId; // 主联系人ID
    private User oCorporationContact; // 联系人信息
    private User oUser; // 登录用户

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

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

    public Long getiAgentCategoryId() {
        return iAgentCategoryId;
    }

    public void setiAgentCategoryId(Long iAgentCategoryId) {
        this.iAgentCategoryId = iAgentCategoryId;
    }

    public Long getiAgentLevelId() {
        return iAgentLevelId;
    }

    public void setiAgentLevelId(Long iAgentLevelId) {
        this.iAgentLevelId = iAgentLevelId;
    }

    public Long getiAgentIndustryId() {
        return iAgentIndustryId;
    }

    public void setiAgentIndustryId(Long iAgentIndustryId) {
        this.iAgentIndustryId = iAgentIndustryId;
    }

    public Long getiAgentAreaId() {
        return iAgentAreaId;
    }

    public void setiAgentAreaId(Long iAgentAreaId) {
        this.iAgentAreaId = iAgentAreaId;
    }

    public Address getoAddress() {
        return oAddress;
    }

    public void setoAddress(Address oAddress) {
        this.oAddress = oAddress;
    }

    public Long getiAddressId() {
        return iAddressId;
    }

    public void setiAddressId(Long iAddressId) {
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

