package com.cmwsp.zentransfer.repository.alipay;

import com.cmwsp.zentransfer.model.alipay.AlipayBatchPayRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlipayBatchPayRecordRepository extends JpaRepository<AlipayBatchPayRecord, String>{


    Optional<AlipayBatchPayRecord> findByBatchTransId(String batchTransId);

    Optional<AlipayBatchPayRecord> findByOutBatchNo(String outBatchNo);


}
