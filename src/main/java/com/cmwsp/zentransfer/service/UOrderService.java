package com.cmwsp.zentransfer.service;

import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.uorder.AgentFundInfo;
import com.cmwsp.zentransfer.dto.uorder.OrderDTO;
import com.cmwsp.zentransfer.dto.uorder.OrderResponseDTO;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.repository.OrderRepository;
import com.cmwsp.zentransfer.utils.UOrderUtils;
import com.cmwsp.zentransfer.utils.converter.uorder.OrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class UOrderService {

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final UOrderApi uOrderApi;
    private final UOrderConfiguration configuration;

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

    public Order save(Order order) {
        return repository.save(order);
    }

    public Order getOrderByPayNo(String payNo) {
        return repository.findFirstByPayNo(payNo).orElse(null);
    }

    public OrderResponseDTO getUOrderByUOrderId(String orderNo) {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", UOrderUtils.FORMDATA);
        params.put("orderno", orderNo);

        String sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getOrder(configuration.getAppKey(), UOrderUtils.FORMDATA, configuration.getToken(), orderNo, sign);

        if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
            throw new RuntimeException("获取订单信息失败，请重新提交订单信息");
        }
        return response.getBody().getData();
    }

    public CompletableFuture<OrderResponseDTO> getUOrderByUOrderIdAsync(String orderNo) {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", UOrderUtils.FORMDATA);
        params.put("orderno", orderNo);

        String sign = UOrderUtils.sign(params, configuration);

        return CompletableFuture.supplyAsync(() -> {
            try {
                var response = uOrderApi.getOrder(configuration.getAppKey(), UOrderUtils.FORMDATA, configuration.getToken(), orderNo, sign);

                if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
                    throw new RuntimeException("获取订单信息失败，请重新提交订单信息");
                }
                return response.getBody().getData();
            } catch (RestClientException e) {
                throw new RuntimeException("获取订单信息失败，请重新提交订单信息", e);
            }
        });
    }

    /**
     * 获取商户账户信息
     */
    public AgentFundInfo getAgentFundInfo(String agentOutSysKey) {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", UOrderUtils.FORMDATA);
        params.put("agentOutSysKey", agentOutSysKey);

        String sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getAgentFund(configuration.getAppKey(), UOrderUtils.FORMDATA, configuration.getToken(), agentOutSysKey, sign);

        if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
            throw new RuntimeException("获取商户账户信息失败，请重新提交订单信息");
        }
        return response.getBody().getData();
    }

    public CompletableFuture<AgentFundInfo> getAgentFundInfoAsync(String agentOutSysKey) {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", UOrderUtils.FORMDATA);
        params.put("agentOutSysKey", agentOutSysKey);

        String sign = UOrderUtils.sign(params, configuration);

        return CompletableFuture.supplyAsync(() -> {
            try {
                var response = uOrderApi.getAgentFund(configuration.getAppKey(), UOrderUtils.FORMDATA, configuration.getToken(), agentOutSysKey, sign);

                if (!response.getStatusCode().is2xxSuccessful() || !response.getBody().getCode().equals("200")) {
                    throw new RuntimeException("获取商户账户信息失败，请重新提交订单信息");
                }
                return response.getBody().getData();
            } catch (RestClientException e) {
                throw new RuntimeException("获取商户账户信息失败，请重新提交订单信息", e);
            }
        });
    }


}
