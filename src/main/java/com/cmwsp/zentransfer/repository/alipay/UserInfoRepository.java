package com.cmwsp.zentransfer.repository.alipay;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmwsp.zentransfer.model.alipay.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
  Optional<UserInfo> findByUserId(String userId);
}
