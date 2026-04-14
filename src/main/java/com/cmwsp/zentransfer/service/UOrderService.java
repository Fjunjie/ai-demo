package com.cmwsp.zentransfer.service;

import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.uorder.AgentFundInfo;
import com.cmwsp.zentransfer.dto.uorder.OrderResponseDTO;
import com.cmwsp.zentransfer.utils.UOrderUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cmwsp.zentransfer.dto.uorder.OrderDTO;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.repository.OrderRepository;
import com.cmwsp.zentransfer.utils.converter.uorder.OrderMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class UOrderService {
  
  private OrderRepository repository;
  private OrderMapper mapper;
  private UOrderApi uOrderApi;
  private UOrderConfiguration configuration;
  
  public UOrderService(OrderRepository repository,
                       OrderMapper mapper,
                       UOrderApi uOrderApi,
                       UOrderConfiguration configuration) {
    this.repository = repository;
    this.mapper = mapper;
    this.uOrderApi = uOrderApi;
    this.configuration = configuration;
  }

  public Order saveOrder(OrderDTO orderDTO) {
    var order = mapper.toEntity(orderDTO, Order.class);
    return repository.save(order);
  }

  public Order getOrderById(String id) {
    return repository.findById(id).orElse(null);
  }

  public OrderResponseDTO getUOrderByUOrderId(String orderNo){
    Map<String, String> params = new HashMap<>();
    params.put("appkey", configuration.getAppkey());
    params.put("token", configuration.getToken());
    params.put("format", UOrderUtils.FORMDATA);
    params.put("orderno", orderNo);

    String sign = UOrderUtils.sign(params,configuration);

    var response = uOrderApi.getOrder(configuration.getAppkey(), UOrderUtils.FORMDATA,configuration.getToken(),orderNo,sign);

    if(!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")){
      throw new RuntimeException("获取订单信息失败，请重新提交订单信息");
    }
    return response.getBody().getData();
  }

  /**
   * 获取商户账户信息
   */
  public AgentFundInfo getAgentFundInfo(String agentOutSysKey){
    Map<String, String> params = new HashMap<>();
    params.put("appkey", configuration.getAppkey());
    params.put("token", configuration.getToken());
    params.put("format", UOrderUtils.FORMDATA);
    params.put("agentOutSysKey", agentOutSysKey);

    String sign = UOrderUtils.sign(params,configuration);

    var response = uOrderApi.getAgentFund(configuration.getAppkey(), UOrderUtils.FORMDATA,configuration.getToken(),agentOutSysKey,sign);

    if(!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")){
      throw new RuntimeException("获取商户账户信息失败，请重新提交订单信息");
    }
    return response.getBody().getData();
  }

}
