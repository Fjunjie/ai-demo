package com.cmwsp.zentransfer.service;

import com.alibaba.fastjson.JSONObject;
import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.alipay.BatchDetailQueryDTO;
import com.cmwsp.zentransfer.dto.alipay.UniQueryDTO;
import com.cmwsp.zentransfer.dto.uorder.*;
import com.cmwsp.zentransfer.repository.OrderRepository;
import com.cmwsp.zentransfer.repository.alipay.AlipayBatchPayRecordRepository;
import com.cmwsp.zentransfer.utils.Rsa2Utils;
import com.cmwsp.zentransfer.utils.UOrderUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.util.AssertionErrors.assertEquals;
import static org.springframework.test.util.AssertionErrors.assertNotNull;


@SpringBootTest
@ActiveProfiles("local")
public class UOrderApiTest {

    @Autowired
    private UOrderApi uOrderApi;
    @Autowired
    private UOrderConfiguration configuration;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private AlipayBatchPayRecordRepository alipayBatchPayRecordRepository;
    @Autowired
    private AlipayService alipayService;

    private String formData = "json";


    @Test
    public void testGetOrder() {
        String sign = "";
        String orderNo = "UO-c08b487172092502170001";

        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("orderno", orderNo);

        sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getOrder(configuration.getAppKey(), formData, configuration.getToken(), orderNo, sign);

        assertNotNull("Response should not be null", response.getBody());
        assertEquals("Expected status code 200", 200, response.getStatusCodeValue());

        System.out.println(JSONObject.toJSONString(response.getBody()));
        // Assert other values as per your requirement
    }

    @Test
    public void testGetAgentFund() throws Exception {
        String agentOutSysKey = "0001F810000";


        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("agentOutSysKey", agentOutSysKey);

        String sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getAgentFundForTest(configuration.getAppKey(), formData, configuration.getToken(), agentOutSysKey, sign);

        System.out.println(JSONObject.toJSONString(response));
    }

    @Test
    public void savePaymentVerificationTest() {
        var payment = new Payment();
        var paymentVerification = new PaymentVerification();
        payment.setcPayNo("UP-c07e6d41c00d2407130001");
        paymentVerification.setcVoucherNo("2024070811077201408");
        paymentVerification.setiAmount(new BigDecimal(0.5));

        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("payment", JSONObject.toJSONString(payment));

        String sign = UOrderUtils.sign(params, configuration);
        var response = uOrderApi.savePaymentVerification(configuration.getAppKey(), formData, configuration.getToken(), JSONObject.toJSONString(payment), sign);

        System.out.println(JSONObject.toJSONString(response.getBody()));

    }

    @Test
    public void getPayTest() {
        String payno = "UP-c07e6d41c00d2407130001";
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("payno", payno);

        String sign = UOrderUtils.sign(params, configuration);
        var response = uOrderApi.getPay(configuration.getAppKey(), formData, configuration.getToken(), payno, sign);

        System.out.println(JSONObject.toJSONString(response.getBody()));
    }

    @Test
    public void getPayVerifcationTest() {
        String paynos = "UP-c07e6d41c00d2407130001";
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("paynos", paynos);

        String sign = UOrderUtils.sign(params, configuration);
        var response = uOrderApi.getPayVerifcation(configuration.getAppKey(), formData, configuration.getToken(), paynos, sign);

        System.out.println(JSONObject.toJSONString(response.getBody()));
    }


    @Test
    public void notifyUOrderPayResultTest() {

        Map<String, String> model = new HashMap<>();
        model.put("status", "0");
        model.put("payNo", "UP-c07e6d41c00d2407120055");
        model.put("outTradeNo", "2024071211108259332");
        model.put("srcReserve", "CustomChannel");
        String linkString = Rsa2Utils.createLinkString(model, true);
        System.out.println(linkString);
        String sign = null;
        try {
            sign = Rsa2Utils.sign(linkString, configuration.getPrivateKey(), "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("回调通知签名异常");
        }
        try {
            var verify = Rsa2Utils.verify(linkString, sign, configuration.getPublicKey(), "UTF-8");
            if (verify) {
                System.out.println("验签成功");
            } else {
                System.out.println("验签失败");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        model.put("sign", sign);
        RestClient restClient = RestClient.builder().baseUrl("https://api.udinghuo.cn/api/basic/PaySrv/newPaymentNotify")
                .requestInitializer(request -> {
                    System.out.println("请求链接：" + request.getURI());
                })
                .build();

        var response = restClient.post()
                .uri("?payNo={payNo}&outTradeNo={outTradeNo}&status={status}&srcReserve={srcReserve}&sign={sign}",
                        model)
                .retrieve()
                .toEntity(String.class);
        System.out.println("通知结果:" + JSONObject.toJSONString(response));
    }


    @Test
    void savePaymentTest() {
        var payment = new Payment();
        var agent = new Agent();
//        var settlementWay = new SettlementWay();
//        settlementWay.setcOutSysKey("1680627162734919735");
//        settlementWay.setcCode("1680627162734919735");
        agent.setcCode("16099");
        agent.setcName("收款测试客户（测试系统使用）");
        agent.setcOutSysKey("0001F810000");
        payment.setAmount(BigDecimal.ONE);
        payment.setiPayType(1);
        payment.setAgent(agent);
        payment.setVoucherType("NORMAL");
        payment.setCyberbankCode("CustomChannelMobile");
//        payment.setoSettlementWay(settlementWay);
        payment.setPaymentStatusCode(1);// 付款中
        payment.setcOutSysKey(UUID.randomUUID().toString());
        payment.setPaymentFinishDate(LocalDateTime.now());
        payment.setReceiptDate(LocalDateTime.now());
        payment.setcSource("0");
        // 设置核销信息
        var paymentVerification = new PaymentVerification();
        paymentVerification.setiAmount(BigDecimal.ONE);
        paymentVerification.setcVoucherNo("UO-c07e6d41c00d2408270002");
        payment.setPaymentVerifications(List.of(paymentVerification));

        Map<String, String> params = new HashMap<>();
//        params.put("appkey", configuration.getAppKey());
        params.put("appkey", configuration.getAppKey2());
//        params.put("token", configuration.getToken());
        params.put("token", configuration.getToken2());
        params.put("format", formData);
        params.put("payment", JSONObject.toJSONString(payment));

        String sign = UOrderUtils.sign(params, configuration.getSecret2());

        var response = uOrderApi.savePayment(configuration.getAppKey2(),
                formData,
                configuration.getToken2(),
                sign,
                JSONObject.toJSONString(payment));


        System.out.println(JSONObject.toJSONString(response.getBody()));
    }

    @Test
    void getPaymentsTest() {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
//        params.put("appkey", "ENPsBNpH");
        params.put("token", configuration.getToken());
//        params.put("token", "!*XrzIrRcrhg6lBOgBlrtw4Uvt0DHk9c1bY0n@aDj1YQizw6~VX@SXqbxp~K0h2qiOBp215MRBxy1n4UD@cm8YgA**-");
        params.put("format", formData);
        params.put("startdate", LocalDate.now().minusYears(5).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        params.put("enddate", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        params.put("pagesize", "100");
        params.put("pageindex", "1");
        params.put("agentid","211704448381446");

//        String sign = UOrderUtils.sign(params, "5c6ea96cb6394790c5861aefd933c80ca8c5fec1");
        String sign = UOrderUtils.sign(params, configuration.getSecret());
//        var response = uOrderApi.getPaymentsByDateForTest(configuration.getAppKey(),
//                formData,
//                configuration.getToken(),
//                sign,
//                "2024-07-13",
//                "2024-07-13",
//                "2",
//                "1");
//        var response = uOrderApi.getPaymentsByDateForTest(params.get("appkey"),
        var response = uOrderApi.getPaymentsByDate(params.get("appkey"),
                formData,
                params.get("token"),
                sign,
                params.get("startdate"),
                params.get("enddate"),
                "100",
                "1",
                params.get("agentid"));

        System.out.println(JSONObject.toJSONString(response.getBody()));

        System.out.println(response.getBody().getData().getData().stream().map(PaymentInfo::getNotUsedMoney).reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue());
    }

    @Test
    void getSummaryPayVouchersForTest() {
        String bizOutSysKey = "33015";

        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("bizOutSysKey", bizOutSysKey);

        String sign = UOrderUtils.sign(params, configuration);

        var response = uOrderApi.getSummaryPayVouchersForTest(configuration.getAppKey(),
                formData,
                configuration.getToken(),
                sign,
                bizOutSysKey);

        System.out.println(JSONObject.toJSONString(response.getBody()));
    }

    @Test
    void getSettlementWay() {
        Map<String, String> params = new HashMap<>();
        params.put("appkey", configuration.getAppKey());
        params.put("token", configuration.getToken());
        params.put("format", formData);
        params.put("pagesize", "100");
        params.put("pageindex", "1");

        String sign = UOrderUtils.sign(params, configuration);
        var response = uOrderApi.getSettlementWay(configuration.getAppKey(),
                formData,
                configuration.getToken(),
                sign,
                "100",
                "1");

        System.out.println(JSONObject.toJSONString(response.getBody()));
    }

    @Test
    public void batchDetailQueryTest(){
        var batchDetailQueryDTO = new BatchDetailQueryDTO();
        batchDetailQueryDTO.setOutBatchNo("87ab14f1406347148fe97f407b671291");
        batchDetailQueryDTO.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
        batchDetailQueryDTO.setProductCode("BATCH_API_TO_ACC");
        var response = alipayService.batchDetailQuery(batchDetailQueryDTO);
        System.out.println(JSONObject.toJSONString(response));
    }


    @Test
    public void QueryTest(){
        var uniQuery = new UniQueryDTO();
        uniQuery.setProductCode("BATCH_API_TO_ACC");
        uniQuery.setBizScene("STANDARD_MESSAGE_BATCH_PAY");
        uniQuery.setOutBizNo("87ab14f1406347148fe97f407b671291");
        var authorizeUniQueryRes = alipayService.authorizeUniQuery(uniQuery);
        System.out.println(JSONObject.toJSONString(authorizeUniQueryRes));
    }
}
