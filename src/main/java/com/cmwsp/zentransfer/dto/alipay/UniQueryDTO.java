package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

// 授权查询 DTO 对象
@Data
public class UniQueryDTO implements Stringify {

  // 产品码，BATCH_API_TO_ACC（固定值）。
  private String productCode;

  // 业务场景 STANDARD_MESSAGE_BATCH_PAY
  private String bizScene;

  // 外部单号，agreement_no不传时必选
  private String outBizNo;

  // 协议号，out_biz_no不传时必选
  private String agreementNo;
}
