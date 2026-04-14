package com.cmwsp.zentransfer.repository.alipay;

import com.cmwsp.zentransfer.model.alipay.AlipayFundAuthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlipayFundAuthRecordRepository  extends JpaRepository<AlipayFundAuthRecord, String> {

    Optional<AlipayFundAuthRecord> findByUserId(String userId);

    Optional<AlipayFundAuthRecord> findByOutBizNo(String outBizNo);

    Optional<AlipayFundAuthRecord> findFirstByUserIdAndStatus(String userId,String status);
}
