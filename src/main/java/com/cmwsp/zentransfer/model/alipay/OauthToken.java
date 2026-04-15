package com.cmwsp.zentransfer.model.alipay;

import com.cmwsp.zentransfer.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Table(name = "alipay_oauth_tokens")
public class OauthToken extends BaseEntity {

  private static final long serialVersionUID = -3701786718509200631L;

  // Session ID
  @Column(updatable = false, nullable = false, unique = true)
  private String sessionId;

  // 访问令牌
  @Column(nullable = false)
  private String accessToken;

  // 支付宝用户的唯一userId （按官方说法，未来会废弃）
  @Column(updatable = false)
  private String alipayUserId;

  // 授权开始的时间
  @Column(nullable = false)
  private LocalDateTime authStart;

  // 授权令牌多长时间后过期（从授权开始的时间算起，单位是“秒”）
  @Column(nullable = false)
  private int expiresIn;

  // 刷新令牌多长时间后过期（从当前这个刷新令牌生成的时间算起，单位是“秒”）
  @Column(nullable = false)
  private int reExpiresIn;

  // 刷新令牌
  @Column(nullable = false)
  private String refreshToken;

  // 用户id user_id
  @Column(updatable = false, nullable = false)
  private String userId;

  // 授权一次性code
  @Column(updatable = false, nullable = false, unique = true)
  private String authCode;

  public OauthToken(String sessionId, String accessToken, String alipayUserId, LocalDateTime authStart, int expiresIn, int reExpiresIn, String refreshToken, String userId, String authCode) {
    this.sessionId = sessionId;
    this.accessToken = accessToken;
    this.alipayUserId = alipayUserId;
    this.authStart = authStart;
    this.expiresIn = expiresIn;
    this.reExpiresIn = reExpiresIn;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.authCode = authCode;
  }

  public OauthToken() {
  }
}
