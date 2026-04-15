package com.cmwsp.zentransfer.controller;

import com.cmwsp.zentransfer.configuration.AlipayClientConfiguration;
import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import com.cmwsp.zentransfer.dto.uorder.MixPayOrderRequest;
import com.cmwsp.zentransfer.dto.uorder.OrderDTO;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.service.PayService;
import com.cmwsp.zentransfer.service.UOrderService;
import com.cmwsp.zentransfer.utils.Rsa2Utils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UriUtils;

import java.util.HashMap;

@RestController
@RequestMapping("/uorder")
@Slf4j
public class UOrderController {

    private final PayService payService;
    private final UOrderService uOrderService;
    private final AlipayClientConfiguration alipayClientConfiguration;
    private final UOrderConfiguration uOrderConfiguration;

    public UOrderController(UOrderService uOrderService,
                            AlipayClientConfiguration alipayClientConfiguration,
                            PayService payService,
                            UOrderConfiguration uOrderConfiguration) {
        this.uOrderService = uOrderService;
        this.alipayClientConfiguration = alipayClientConfiguration;
        this.payService = payService;
        this.uOrderConfiguration = uOrderConfiguration;
    }

    //
    @GetMapping("/placeOrder")
    public ModelAndView placeOrder(@RequestParam(name = "_input_charset") String inputCharset,
                                   @ModelAttribute OrderDTO order,
                                   HttpServletRequest request) {
        // TODO 验签无法通过
//        checkRequestVerify(request);
        // spring框架问题，针对"_"开头的参数无法绑定，需要手动绑定
        order.setInputCharset(inputCharset);
        // 存储订单信息，用于后续操作
        // 首先通过跳转到支付宝完整登录授权，拿到 uid
        Order localOrder = uOrderService.saveOrder(order);

        // 1.查询订单信息
        var uOrder = uOrderService.getUOrderByUOrderId(localOrder.getOrderNo());
        if("FINISHPAYMENT".equals(uOrder.getcPayStatusCode())){
            throw new RuntimeException("付款已完成，请勿重复付款");
        }
        localOrder.setAgentERPCode(uOrder.getoAgent().getcOutSysKey());
        localOrder.setAgentName(uOrder.getoAgent().getcName());
        localOrder.setRealAmount(uOrder.getfTotalMoney());
        localOrder.setRebateAmount(uOrder.getfRebateMoney());
        localOrder.setOAgentId(uOrder.getoAgent().getId());
        uOrderService.save(localOrder);

        // 2.查询余额信息
        var agentFundInfo = uOrderService.getAgentFundInfo(uOrder.getoAgent().getcOutSysKey());

        // 跳转到支付宝授权获取用户信息
        ModelAndView modelAndView = new ModelAndView();
//        modelAndView.setViewName("uorder");
        modelAndView.setViewName("uorder_new");
        modelAndView.addObject("order", localOrder);
        modelAndView.addObject("agentFundInfo", agentFundInfo);
        modelAndView.addObject("uOrder", uOrder);
//        modelAndView.addObject("redirectUrl", alipayClientConfiguration.getAppUrl() + "alipay/pay");
        return modelAndView;
    }

    private void checkRequestVerify(HttpServletRequest request) {
        var map = new HashMap<String,String>();
        request.getParameterNames().asIterator()
                .forEachRemaining(x -> {
                    if (!"sign".equals(x)) {
                        map.put(x, request.getParameter(x));
                    }
                });
        boolean verify = false;
        try {
            verify = Rsa2Utils.verify(Rsa2Utils.createLinkString(map,true),
                    request.getParameter("sign").replaceAll(" ","+"),
                    uOrderConfiguration.getPublicKey(),
                    "UTF-8");
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.debug("验签失败：{}", e);
            }
            throw new RuntimeException("验签异常");
        }
        if (!verify) {
            System.out.println("验签失败");
            throw new UnsupportedOperationException("非法请求");
        }
    }

    @PostMapping("/toMixPay")
    public String toMixPay(@RequestBody MixPayOrderRequest mixPayOrderRequest) {
        // 混合支付需要创建带有余额支付的支付单，剩余金额走支付宝支付，如果剩余金额为0 则省略支付宝流程
        var payOrder = payService.initPayOrder(mixPayOrderRequest);
        // 校验订单状态
        var uOrder = uOrderService.getUOrderByUOrderId(payOrder.getUOrderNo());
        if("OPPOSE".equals(uOrder.getcStatusCode())){
            throw new RuntimeException("订单已取消，不能进行付款操作");
        }

        switch (payOrder.getType()) {
            case ALIPAY -> {
                payService.createAlipayOrder(payOrder);

                var alipayUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021004137638718&scope=auth_user&"
                        + "&state=" + UriUtils.encode(payOrder.getId(), "UTF-8")
                        + "&redirect_uri=" + alipayClientConfiguration.getAppUrl() + "alipay/mixPay";
                var alipayAuthCodeUrl = "alipays://platformapi/startapp?appId=20000067&url=" +
                        UriUtils.encode(alipayUrl, "UTF-8");
                return alipayAuthCodeUrl;
            }
            case BALANCE -> {
                // 直接走余额支付
                payService.createBalancePayOrder(payOrder);
                // 直接核销余额支付
                payService.applyBalancePayOrder(payOrder);
                // 通知付款成功 余额支付的不通知U订货
                payService.confirmPayOrder(payOrder);
                return "success";
            }
            case MIX_PAY_ALIPAY_BALANCE, MIX_PAY_ALIPAY_BALANCE_REBATE, MIX_PAY_ALIPAY_REBATE -> {
                // 支付宝、余额混合支付，是否有返利抵扣不影响，返利抵扣目前不在此系统处理
                // 需要将支付宝支付的部分生成新的支付单信息，用于混合支付
                payOrder = payService.createNewPayOrder(payOrder);
                // 上传支付单
                payService.createBalancePayOrder(payOrder);

                payService.createAlipayOrder(payOrder);

                // 剩余部分走支付宝
                // 直接走支付宝支付 "toAliPay"
                var alipayUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021004137638718&scope=auth_user&"
                        + "&state=" + UriUtils.encode(payOrder.getId(), "UTF-8")
                        + "&redirect_uri=" + alipayClientConfiguration.getAppUrl() + "alipay/mixPay";
                var alipayAuthCodeUrl = "alipays://platformapi/startapp?appId=20000067&url=" +
                        UriUtils.encode(alipayUrl, "UTF-8");
                return alipayAuthCodeUrl;

            }
            default -> throw new RuntimeException("目前不支持的支付方式，请联系管理员");
        }
    }

    /**
     * 查询支付结果刷新支付的
     */
    @GetMapping("/pay/result")
    public String payResult(@RequestParam("payNo") String payNo) {
        var payOrder = payService.refreshPayOrder(payNo);
        return payOrder.getPayStatus().toString();
    }

}
