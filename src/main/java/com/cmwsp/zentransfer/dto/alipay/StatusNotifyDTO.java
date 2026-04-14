package com.cmwsp.zentransfer.dto.alipay;

public class StatusNotifyDTO {

  // 授权传入的外部单号。
  private String outBizNo;

  // 销售产品码，BATCH_API_TO_ACC（固定值）。
  private String productCode;

  // 业务场景 STANDARD_MESSAGE_BATCH_PAY（标准制单）
  private String bizScene;

  // 协议号
  private String agreementNo;

  // 签约（sign）/解约（un_sign）
  private String operationType;

  // 批次状态，当订单状态变化到如下状态时会触发异步通知：
  // TEMP：签约未完成
  // NORMAL：签约完成
  // STOP： 解约
  private String status;

  // getters and setters...
}