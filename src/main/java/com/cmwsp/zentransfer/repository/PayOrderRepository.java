package com.cmwsp.zentransfer.repository;

import com.cmwsp.zentransfer.model.pay.PayOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PayOrderRepository extends JpaRepository<PayOrder, String>, JpaSpecificationExecutor<PayOrder> {

    Optional<PayOrder> findByPayNo(String payNo);
}
