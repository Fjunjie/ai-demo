package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * DTO for batch creation.
 */
@Data
public class BatchCreateDTO implements Stringify {

  /**
   * 商户端批次的唯一订单号，如果批次已创建时，再传相同外部订单号会报单据已创建。
   */
  private String outBatchNo;

  /**
   * 批次总金额，单位为元，精确到小数点后两位，取值范围[1,9999999999999.99]。
   */
  private Double totalTransAmount;

  /**
   * 批次总笔数。
   */
  private Integer totalCount;

  /**
   * 销售产品码，BATCH_API_TO_ACC（固定值）。
   */
  private String productCode;

  /**
   * 业务场景 STANDARD_MESSAGE_BATCH_PAY
   */
  private String bizScene;

  /**
   * 批量付款的标题，用于在支付宝用户的账单里显示。
   */
  private String orderTitle;

  /**
   * 绝对超时时间，格式为yyyy-MM-dd HH:mm。
   */
  private String timeExpire;

  /**
   * 业务备注
   */
  private String remark;

  /**
   * 通用回传参数，如果请求时传递了该参数，则异步通知商户时会回传该参数。
   */
  private String passbackParams;

  /**
   * 付款方信息
   */
  private Participant payerInfo;

  /**
   * 收款信息列表
   */
  private List<TransOrderDetail> transOrderList;

  // ... Participant and TransOrderDetail classes ...

  // getters and setters...

  public static class Participant {
    /**
     * 付款方账号，传入支付宝 uid。
     */
    private String identity;

    /**
     * 参与方的标识类型，目前支持类型： ALIPAY_USER_ID 支付宝的会员ID
     */
    private String identityType;

    /**
     * 扩展字段：agreement_no（标准制单授权协议号）
     * 如果传入agreement_no，则校验付款方和平台商之间是否存在agreement_no对应的协议；
     * 如果不传，则检验付款方和平台商之间是否存在任意制单授权协议
     */
    private Map<String, String> extInfo;

    public String getIdentity() {
      return identity;
    }

    public void setIdentity(String identity) {
      this.identity = identity;
    }

    public String getIdentityType() {
      return identityType;
    }

    public void setIdentityType(String identityType) {
      this.identityType = identityType;
    }

    public Map<String, String> getExtInfo() {
      return extInfo;
    }

    public void setExtInfo(Map<String, String> extInfo) {
      this.extInfo = extInfo;
    }
  }

  public static class TransOrderDetail {
    /**
     * 商户端明细外部订单号，同一批次下，明细单号需要唯一
     */
    private String outBizNo;

    /**
     * 明细金额，单位为元（最小1元），精确到小数点后两位，取值范围[1,9999999999999.99]
     */
    private Double transAmount;

    /**
     * 转账备注，收款方如果是支付宝账号，会展示在收款方账单里。
     */
    private String remark;

    /**
     * 收款方信息
     */
    private Participant payeeInfo;

    public String getOutBizNo() {
      return outBizNo;
    }

    public void setOutBizNo(String outBizNo) {
      this.outBizNo = outBizNo;
    }

    public Double getTransAmount() {
      return transAmount;
    }

    public void setTransAmount(Double transAmount) {
      this.transAmount = transAmount;
    }

    public String getRemark() {
      return remark;
    }

    public void setRemark(String remark) {
      this.remark = remark;
    }

    public Participant getPayeeInfo() {
      return payeeInfo;
    }

    public void setPayeeInfo(Participant payeeInfo) {
      this.payeeInfo = payeeInfo;
    }
  }
}