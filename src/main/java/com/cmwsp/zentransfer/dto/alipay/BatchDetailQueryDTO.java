package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

@Data
public class BatchDetailQueryDTO implements Stringify {
  /**
   * 商户的批次号。
   * 字段类型: String
   * 最大长度: 32
   * 是否必填: 必选
   * 示例: 201903213213213123
   */
  private String outBatchNo;

  /**
   * 销售产品码，BATCH_API_TO_ACC（固定值）。
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

  /**
   * 明细状态。
   * 字段类型: String
   * 最大长度: 16
   * 是否必填: 可选
   * 示例: INIT
   * 可选值: INIT(明细下单完成), WAIT_PAY(明细下单完成，未支付), SUCCESS(明细支付成功), FAIL(明细支付处理失败),
   * DEALING(处理中)
   */
  private String detailStatus;

  /**
   * 采用分页查询，本参数为空或0默认显示第一页。如果输入的值大于总页数，则支付宝返回最后一页数据。
   * 字段类型: String
   * 最大长度: 3
   * 是否必填: 可选
   * 示例: 1
   */
  private String pageNum;

  /**
   * 每页大小，不传的情况下默认500条，超过500条默认按500条查询；不足500条则按实际记录数返回。
   * 字段类型: String
   * 最大长度: 4
   * 是否必填: 可选
   * 示例: 1
   */
  private String pageSize;

  // getters and setters...
}