package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

@Data
public class TransRenderPayDTO implements Stringify {

  // 订单 id
  private String orderId;

  // 阿里云支付服务产品编码
  private String productCode;

  // 业务场景
  private String bizScene;

  // 目标终端类型：PC 或 小程序
  private String targetTerminalType;

  // 初始编码类型 SHORT_URL
  private String initializeCodeType;

  // 短链的有效期 格式：2024-05-06 19:20 (可选)
  private String expireTime;
}
