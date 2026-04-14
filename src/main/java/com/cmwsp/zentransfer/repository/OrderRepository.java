package com.cmwsp.zentransfer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmwsp.zentransfer.model.uorder.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
  
}
