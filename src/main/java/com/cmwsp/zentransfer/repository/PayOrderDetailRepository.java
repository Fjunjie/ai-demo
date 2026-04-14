package com.cmwsp.zentransfer.repository;

import com.cmwsp.zentransfer.model.pay.PayOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayOrderDetailRepository extends JpaRepository<PayOrderDetail,String> , JpaSpecificationExecutor<PayOrderDetail> {

    List<PayOrderDetail> findAllByPayOrderId(String payOrderId);

    long countAllByPayOrderIdAndStatus(String payOrderId,Integer status);

}
