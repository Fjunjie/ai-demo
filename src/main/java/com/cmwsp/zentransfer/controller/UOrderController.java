package com.cmwsp.zentransfer.controller;

import com.alipay.api.response.AlipayFundBatchCreateResponse;
import com.cmwsp.zentransfer.dto.alipay.BatchCreateDTO;
import com.cmwsp.zentransfer.dto.alipay.TransRenderPayDTO;
import com.cmwsp.zentransfer.model.uorder.Order;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alipay.api.domain.AuthParticipantInfo;
import com.cmwsp.zentransfer.configuration.AlipayClientConfiguration;
import com.cmwsp.zentransfer.dto.alipay.UniApplyDTO;
import com.cmwsp.zentransfer.dto.alipay.UniQueryDTO;
import com.cmwsp.zentransfer.dto.uorder.OrderDTO;
import com.cmwsp.zentransfer.service.AlipayService;
import com.cmwsp.zentransfer.service.UOrderService;

@RestController
@RequestMapping("/uorder")
public class UOrderController {

    private UOrderService uOrderService;
    private AlipayService alipayService;
    private AlipayClientConfiguration alipayClientConfiguration;

    public UOrderController(UOrderService uOrderService, AlipayService alipayService,
                            AlipayClientConfiguration alipayClientConfiguration) {
        this.uOrderService = uOrderService;
        this.alipayService = alipayService;
        this.alipayClientConfiguration = alipayClientConfiguration;
    }

    //
    @GetMapping("/placeOrder")
    public ModelAndView placeOrder(@RequestParam(name = "_input_charset") String inputCharset,
                                   @ModelAttribute OrderDTO order) {
        // spring框架问题，针对"_"开头的参数无法绑定，需要手动绑定
        order.setInputCharset(inputCharset);
        // 存储订单信息，用于后续操作
        // 首先通过跳转到支付宝完整登录授权，拿到 uid
        Order localOrder = uOrderService.saveOrder(order);

        // TODO 查询组合支付的情况
        // 1.查询订单信息
        var uOrder = uOrderService.getUOrderByUOrderId(localOrder.getOrderNo());
        // 2.查询余额信息
        var agentFundInfo = uOrderService.getAgentFundInfo(uOrder.getoAgent().getcOutSysKey());
        // 跳转到支付宝授权获取用户信息
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("uorder_new");
        modelAndView.addObject("order", localOrder);
        modelAndView.addObject("agentFundInfo",agentFundInfo);
        modelAndView.addObject("uOrder", uOrder);
        modelAndView.addObject("redirectUrl",alipayClientConfiguration.getAppUrl() + "alipay/pay" );
        return modelAndView;
    }

}
