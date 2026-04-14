package com.cmwsp.zentransfer.repository.alipay;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmwsp.zentransfer.model.alipay.OauthToken;
import java.util.Optional;


@Repository
public interface OauthTokenRepository extends JpaRepository<OauthToken, String> {
  Optional<OauthToken> findBySessionId(String sessionId);

  Optional<OauthToken> findFirstByAuthCode(String authCode);




}
