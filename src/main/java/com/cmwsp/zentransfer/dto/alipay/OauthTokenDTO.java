package com.cmwsp.zentransfer.dto.alipay;

import lombok.Data;

@Data
public class OauthTokenDTO {
  // 授权方式 可取值：authorization_code 或 refresh_token
  private String grantType;

  // 授权码
  private String code;

  // 刷新令牌
  private String refreshToken;
}
