package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

/**
 * 数据传输对象，用于关闭批次操作
 */
@Data
public class BatchCloseDTO implements Stringify {
  /**
   * 支付宝批次ID
   * 字段类型: String
   * 最大长度: 32
   * 是否必填: 必选
   * 示例: 201801310127742502
   */
  private String batchTransId;

  /**
   * 销售产品码，BATCH_API_TO_ACC（固定值）
   * 字段类型: String
   * 最大长度: 64
   * 是否必填: 必选
   * 示例: BATCH_API_TO_ACC
   */
  private String productCode;

  /**
   * 业务场景 STANDARD_MESSAGE_BATCH_PAY
   * 字段类型: String
   * 最大长度: 64
   * 是否必填: 必选
   * 示例: STANDARD_MESSAGE_BATCH_PAY
   */
  private String bizScene;

  // getters and setters...
}