package com.cmwsp.zentransfer.controller;

import com.alibaba.fastjson.JSONObject;
import com.alipay.api.AlipayApiException;
import com.alipay.api.internal.util.AlipaySignature;
import com.cmwsp.zentransfer.configuration.AlipayClientConfiguration;
import com.cmwsp.zentransfer.dto.alipay.AuthCallbackDTO;
import com.cmwsp.zentransfer.service.AlipayService;
import com.cmwsp.zentransfer.service.PayService;
import com.cmwsp.zentransfer.service.UOrderService;
import com.cmwsp.zentransfer.service.impl.AlipayNotificationEvent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController()
@RequestMapping("/alipay")
@Slf4j
public class AlipayController {

    private final AlipayService alipayService;
    private final UOrderService uOrderService;
    private final PayService payService;
    private final AlipayClientConfiguration alipayClientConfiguration;
    private final ApplicationEventPublisher publisher;

    public AlipayController(AlipayService alipayService,
                            UOrderService uOrderService,
                            PayService payService,
                            AlipayClientConfiguration alipayClientConfiguration,
                            ApplicationEventPublisher publisher) {
        this.uOrderService = uOrderService;
        this.alipayService = alipayService;
        this.payService = payService;
        this.alipayClientConfiguration = alipayClientConfiguration;
        this.publisher = publisher;
    }

    // 用于接收支付宝异步通知消息（例如From平台消息等），需要传入http(s)公网可访问的网页地址。选填，若不设置，则无法接收相应的异步通知消息
    @PostMapping("/gateway")
    public ResponseEntity<String> gateway(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            params.put(paramName, request.getParameter(paramName));
        }
        if (log.isDebugEnabled()) {
            log.debug("支付宝通知数据:{}", params);
        }
        // 验签逻辑，确保通知来自支付宝
        boolean verifyResult = false;
        try {
            verifyResult = AlipaySignature.rsaCertCheckV1(params, alipayClientConfiguration.getAppPubCret(), "utf-8", "RSA2");
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
        if (verifyResult) {
             publisher.publishEvent(new AlipayNotificationEvent<>(params.get("msg_method"), JSONObject.parseObject(params.get("biz_content"),Map.class)));
            // 注意：此处的处理逻辑需要根据实际业务需求编写
            return new ResponseEntity<>("success", HttpStatus.OK);
        } else {
            // 签名校验失败
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
        }
    }

    // 授权回调地址
    @GetMapping("/callback")
    public ResponseEntity<String> callback(HttpServletRequest request) {
        // 从请求中获取支付宝的通知内容
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            params.put(paramName, request.getParameter(paramName));
        }

        // 验签逻辑，确保通知来自支付宝
        boolean verifyResult = false;
        try {
            verifyResult = AlipaySignature.rsaCheckV1(params, "", "utf-8", "RSA2");
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
        if (verifyResult) {
            // TODO 签名校验通过，处理业务逻辑，如更新数据库状态等
            // 注意：此处的处理逻辑需要根据实际业务需求编写
            return new ResponseEntity<>("success", HttpStatus.OK);
        } else {
            // 签名校验失败
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/pay")
    @Deprecated
    public ModelAndView pay(@RequestParam("auth_code") String authCode,
                            @RequestParam("app_id") String appId,
                            @RequestParam("source") String source,
                            @RequestParam("scope") String scope,
                            @RequestParam("state") String state,
                            HttpServletRequest request) {
        var authCallbackDTO = AuthCallbackDTO.builder()
                .authCode(authCode)
                .appId(appId)
                .source(source)
                .scope(scope).build();
        var order = uOrderService.getOrderByPayNo(state);

        if(order == null){
            throw new RuntimeException("获取订单信息失败:"+state);
        }

        // 1.获取用户信息
        var oauthInfo = alipayService.getAlipayAccessToken(authCallbackDTO, request.getCookies());

        // 2.确认是否授权
        var fundAuthRecord = payService.checkUserFundAuth(oauthInfo.getUserId());
        if (fundAuthRecord == null) {
            return payService.applyAlipayFundAuth(oauthInfo.getUserId(), order.getPayNo());
        }
        // 3.支付渲染
        return payService.applyBatchPay(oauthInfo.getUserId(), order);
    }

    @GetMapping("/mixPay")
    public ModelAndView mixPay(@RequestParam("auth_code") String authCode,
                            @RequestParam("app_id") String appId,
                            @RequestParam("source") String source,
                            @RequestParam("scope") String scope,
                            @RequestParam("state") String state,
                            HttpServletRequest request) {
        var authCallbackDTO = AuthCallbackDTO.builder()
                .authCode(authCode)
                .appId(appId)
                .source(source)
                .scope(scope).build();
        var payOrder = payService.getPayOrderById(state);

        if(payOrder == null){
            throw new RuntimeException("获取混合支付订单信息失败:"+state);
        }

        // 1.获取用户信息
        var oauthInfo = alipayService.getAlipayAccessToken(authCallbackDTO, request.getCookies());

        // 2.确认是否授权
        var fundAuthRecord = payService.checkUserFundAuth(oauthInfo.getUserId());
        if (fundAuthRecord == null) {
            return payService.applyAlipayFundAuth(oauthInfo.getUserId(), payOrder.getPayNo());
        }
        // 3.支付渲染
        return payService.applyBatchPay(oauthInfo.getUserId(), payOrder);
    }

}
