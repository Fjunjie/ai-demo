package com.cmwsp.zentransfer.model.alipay;

import com.cmwsp.zentransfer.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Table(name = "alipay_user_infos")
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo extends BaseEntity {

  private static final long serialVersionUID = 7374239498469409378L;

  // 用户 id 2088 开头的 16 位数字
  @Column(updatable = false, nullable = false, unique = true)
  private String userId;

  // 昵称
  @Column(updatable = true, nullable = true, unique = false)
  private String nickName;

  // 头像
  @Column(updatable = true, nullable = true, unique = false)
  private String avatar;

}
