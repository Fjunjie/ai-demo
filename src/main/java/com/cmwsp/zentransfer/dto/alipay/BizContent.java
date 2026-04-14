package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

@Data
public class BizContent implements Stringify {
  // isv代操作的商户账号，可以是支付宝账号，也可以是pid（2088开头）
  private String account;

  // 商户联系人信息，包含联系人名称、手机、邮箱信息。联系人信息将用于接受签约后的重要通知，如确认协议、到期提醒等。
  private ContactInfo contactInfo;

  // 订单授权凭证。若传入本参数，则对应事务提交后进入预授权模式。
  private String orderTicket;

  @Data
  public static class ContactInfo {
    // 联系人名称
    private String contactName;

    // 联系人手机号码
    private String contactMobile;

    // 联系人邮箱
    private String contactEmail;
  }
}
