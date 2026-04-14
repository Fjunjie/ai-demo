package com.cmwsp.zentransfer.dto.alipay;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthCallbackDTO {
  // 授权码
  private String authCode;

  // 应用Id
  private String appId;

  // 来源 alipay_wallet
  private String source;

  // scope 授权范围 auth_user
  private String scope;
}
