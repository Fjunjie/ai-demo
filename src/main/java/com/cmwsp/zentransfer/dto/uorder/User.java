package com.cmwsp.zentransfer.dto.uorder;

public class User {

    // 登陆名
    private String cUserName;

    // 姓名
    private String cFullName;

    // 手机号
    private String cMobile;

    // 邮箱
    private String cEmail;

    // 部门
    private String cDepartment;

    // QQ
    private String cQQ;

    // 手机是否验证通过
    private boolean bMobileValid;

    // 邮箱是否验证通过
    private boolean bEmailValid;

    // 是否开通
    private boolean bActivate;

    // 账号类型
    private String cType;

    // 外部唯一标识
    private String cOutSysKey;

    // 编码
    private String cCode;


    public String getcUserName() {
        return cUserName;
    }

    public void setcUserName(String cUserName) {
        this.cUserName = cUserName;
    }

    public String getcFullName() {
        return cFullName;
    }

    public void setcFullName(String cFullName) {
        this.cFullName = cFullName;
    }

    public String getcMobile() {
        return cMobile;
    }

    public void setcMobile(String cMobile) {
        this.cMobile = cMobile;
    }

    public String getcEmail() {
        return cEmail;
    }

    public void setcEmail(String cEmail) {
        this.cEmail = cEmail;
    }

    public String getcDepartment() {
        return cDepartment;
    }

    public void setcDepartment(String cDepartment) {
        this.cDepartment = cDepartment;
    }

    public String getcQQ() {
        return cQQ;
    }

    public void setcQQ(String cQQ) {
        this.cQQ = cQQ;
    }

    public boolean isbMobileValid() {
        return bMobileValid;
    }

    public void setbMobileValid(boolean bMobileValid) {
        this.bMobileValid = bMobileValid;
    }

    public boolean isbEmailValid() {
        return bEmailValid;
    }

    public void setbEmailValid(boolean bEmailValid) {
        this.bEmailValid = bEmailValid;
    }

    public boolean isbActivate() {
        return bActivate;
    }

    public void setbActivate(boolean bActivate) {
        this.bActivate = bActivate;
    }

    public String getcType() {
        return cType;
    }

    public void setcType(String cType) {
        this.cType = cType;
    }

    public String getcOutSysKey() {
        return cOutSysKey;
    }

    public void setcOutSysKey(String cOutSysKey) {
        this.cOutSysKey = cOutSysKey;
    }

    public String getcCode() {
        return cCode;
    }

    public void setcCode(String cCode) {
        this.cCode = cCode;
    }
}
