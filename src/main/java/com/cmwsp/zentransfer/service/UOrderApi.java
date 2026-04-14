package com.cmwsp.zentransfer.service;

import com.cmwsp.zentransfer.dto.uorder.*;
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

    /**
     * 用于单元测试接口
     *
     * @param appKey
     * @param formData
     * @param token
     * @param orderNo
     * @param sign
     * @return
     */
    @Deprecated
    @GetExchange("/rs/Orders/getOrder")
    ResponseEntity<?> getOrderForTest(@RequestParam("appkey") String appKey,
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
     * 用于单元测试接口
     *
     * @param appKey
     * @param formData
     * @param token
     * @param agentOutSysKey
     * @param sign
     * @return
     */
    @Deprecated
    @GetExchange("/rs/Pays/getAgentFund")
    ResponseEntity<?> getAgentFundForTest(@RequestParam("appkey") String appKey,
                                          @RequestParam("format") String formData,
                                          @RequestParam("token") String token,
                                          @RequestParam("agentOutSysKey") String agentOutSysKey,
                                          @RequestParam("sign") String sign);

    @PostExchange("/ws/Payments/savePayment")
    ResponseEntity<UOrderResponse<DataResultResponse<SavePaymentsReturnDTO>>> savePayment(@RequestParam("appkey") String appKey,
                                  @RequestParam("format") String formData,
                                  @RequestParam("token") String token,
                                  @RequestParam("sign") String sign,
                                  @RequestParam("payment") String payment);

    @GetExchange("/rs/Archives/getSettlementWays")
    ResponseEntity<?>  getSettlementWay(@RequestParam("appkey") String appKey,
                                        @RequestParam("format") String formData,
                                        @RequestParam("token") String token,
                                        @RequestParam("sign") String sign,
                                        @RequestParam("pagesize") String pagesize,
                                        @RequestParam("pageindex") String pageindex);


    @GetExchange("/rs/Pays/getSummaryPayVouchers")
    ResponseEntity<?> getSummaryPayVouchersForTest(@RequestParam("appkey") String appKey,
                                                   @RequestParam("format") String formData,
                                                   @RequestParam("token") String token,
                                                   @RequestParam("sign") String sign,
                                                   @RequestParam("bizOutSysKey") String bizOutSysKey);

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

    @Deprecated
    @GetExchange("/rs/Pays/getPaymentsByDate")
    ResponseEntity<?> getPaymentsByDateForTest(@RequestParam("appkey") String appKey,
                                               @RequestParam("format") String formData,
                                               @RequestParam("token") String token,
                                               @RequestParam("sign") String sign,
                                               @RequestParam("startdate") String startdate,
                                               @RequestParam("enddate") String enddate,
                                               @RequestParam("pagesize") String pagesize,
                                               @RequestParam("pageindex") String pageindex,
                                               @RequestParam("agentid") String agentid);

    @GetExchange("/rs/Pays/getPaymentsByDate")
    ResponseEntity<UOrderResponse<PageInfo<PaymentInfo>>> getPaymentsByDate(@RequestParam("appkey") String appKey,
                                                                        @RequestParam("format") String formData,
                                                                        @RequestParam("token") String token,
                                                                        @RequestParam("sign") String sign,
                                                                        @RequestParam("startdate") String startdate,
                                                                        @RequestParam("enddate") String enddate,
                                                                        @RequestParam("pagesize") String pagesize,
                                                                        @RequestParam("pageindex") String pageindex,
                                                                        @RequestParam("agentid") String agentid);
    /**
     * 下载核销记录
     */
    @GetExchange("/rs/Pays/getVerifcation")
    ResponseEntity<?> getPayVerifcation(@RequestParam("appkey") String appKey,
                                        @RequestParam("format") String formData,
                                        @RequestParam("token") String token,
                                        @RequestParam("paynos") String paynos,
                                        @RequestParam("sign") String sign);

}
