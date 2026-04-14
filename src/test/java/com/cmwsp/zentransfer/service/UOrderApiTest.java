package com.cmwsp.zentransfer.service;

import com.alibaba.fastjson.JSONObject;
import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.uorder.Payment;
import com.cmwsp.zentransfer.dto.uorder.PaymentVerification;
import com.cmwsp.zentransfer.utils.UOrderUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.util.AssertionErrors.assertEquals;
import static org.springframework.test.util.AssertionErrors.assertNotNull;


@SpringBootTest
@ActiveProfiles("local")
public class UOrderApiTest {

    @Autowired
    private UOrderApi uOrderApi;
    @Autowired
    private UOrderConfiguration configuration;

    private String formData = "json";


    @Test
    public void testGetOrder() {
        String sign = "";
        String orderNo = "UO-c07e6d41c00d2407120002";

        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppkey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("orderno", orderNo);

        sign = UOrderUtils.sign(params,configuration);

        var response = uOrderApi.getOrder(configuration.getAppkey(), formData,configuration.getToken(),orderNo,sign);

        assertNotNull("Response should not be null", response.getBody());
        assertEquals("Expected status code 200", 200, response.getStatusCodeValue());

        System.out.println(response.getBody().getData().getClass().getName());
        System.out.println(JSONObject.toJSONString(response.getBody()));
        // Assert other values as per your requirement
    }

    @Test
    public void testGetAgentFund() throws Exception {
        String agentOutSysKey = "0001F81000000002WTHI";


        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppkey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("agentOutSysKey", agentOutSysKey);

        String sign = UOrderUtils.sign(params,configuration);

        var response = uOrderApi.getAgentFund(configuration.getAppkey(), formData,configuration.getToken(),agentOutSysKey,sign);

        System.out.println(JSONObject.toJSONString(response));
    }
    @Test
    public void savePaymentVerificationTest(){
        var payment = new Payment();
        var paymentVerification = new PaymentVerification();
        payment.setcPayNo("UP-c07e6d41c00d2407080027");
        paymentVerification.setcVoucherNo("2024070811077201408");
        paymentVerification.setiAmount(1.0);

        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppkey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("payment", JSONObject.toJSONString(payment));

        String sign = UOrderUtils.sign(params,configuration);
        var response = uOrderApi.savePaymentVerification(configuration.getAppkey(), formData,configuration.getToken(),JSONObject.toJSONString(payment),sign);

        System.out.println(JSONObject.toJSONString(response.getBody()));

    }

    @Test
    public void getPayTest(){
        String payno = "UP-c07e6d41c00d2407080027";
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppkey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("payno", payno);

        String sign = UOrderUtils.sign(params,configuration);
        var response = uOrderApi.getPay(configuration.getAppkey(), formData,configuration.getToken(),payno,sign);

        System.out.println(JSONObject.toJSONString(response.getBody()));
    }

}
