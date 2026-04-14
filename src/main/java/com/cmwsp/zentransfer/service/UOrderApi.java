package com.cmwsp.zentransfer.service;

import com.cmwsp.zentransfer.dto.uorder.AgentFundInfo;
import com.cmwsp.zentransfer.dto.uorder.OrderResponseDTO;
import com.cmwsp.zentransfer.dto.uorder.UOrderResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

public interface UOrderApi {

    @GetExchange("/rs/Orders/getOrder")
    ResponseEntity<UOrderResponse<OrderResponseDTO>> getOrder(@RequestParam("appkey") String appKey,
                                                              @RequestParam("format") String formData,
                                                              @RequestParam("token") String token,
                                                              @RequestParam("orderno") String orderNo,
                                                              @RequestParam("sign") String sign);

    @GetExchange("/rs/Pays/getAgentFund")
    ResponseEntity<UOrderResponse<AgentFundInfo>> getAgentFund(@RequestParam("appkey") String appKey,
                                               @RequestParam("format") String formData,
                                               @RequestParam("token") String token,
                                               @RequestParam("agentOutSysKey") String agentOutSysKey,
                                               @RequestParam("sign") String sign);

    /**
     * 支付单核销
     */
    @PostExchange("/ws/Payments/savePaymentVerification")
    ResponseEntity<UOrderResponse> savePaymentVerification(@RequestParam("appkey") String appKey,
                                                           @RequestParam("format") String formData,
                                                           @RequestParam("token") String token,
                                                           @RequestParam("payment") String payment,
                                                           @RequestParam("sign") String sign);

    /**
     * 获取单个支付单信息
     */
    @GetExchange("/rs/Pays/getPayVoucher")
    ResponseEntity<?> getPay(@RequestParam("appkey") String appKey,
                             @RequestParam("format") String formData,
                             @RequestParam("token") String token,
                             @RequestParam("payno") String payno,
                             @RequestParam("sign") String sign);
}
