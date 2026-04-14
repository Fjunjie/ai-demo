package com.cmwsp.zentransfer.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.cmwsp.zentransfer.dto.uorder.PaymentInfo;
import com.cmwsp.zentransfer.model.pay.PayOrder;
import com.cmwsp.zentransfer.model.pay.PayOrderDetail;
import com.cmwsp.zentransfer.utils.PayDetailType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BalancePayProcessor {

    public static List<PayOrderDetail> processPayments(List<PaymentInfo> payments, PayOrder payOrder) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PayOrderDetail> payOrderDetails = new ArrayList<>();
        BigDecimal deductionAmount = payOrder.getBalanceAmount(); // 从 PayOrder 获取余额扣除金额

        // 遍历支付信息列表
        for (PaymentInfo payment : payments) {
            if(payment.getNotUsedMoney().compareTo(BigDecimal.ZERO) <= 0){
                continue;
            }
            totalAmount = totalAmount.add(payment.getNotUsedMoney());
            PayOrderDetail orderDetail = new PayOrderDetail();

            if (totalAmount.compareTo(deductionAmount) >= 0) {
                orderDetail.setPayOrderId(payOrder.getId());
                orderDetail.setAmount(deductionAmount);
                orderDetail.setDetailType(PayDetailType.BALANCE_PAY);
                orderDetail.setDeductionPayNo(payment.getPayNo());
                orderDetail.setStatus(0);
            } else if(totalAmount.compareTo(deductionAmount) < 0){
                orderDetail.setPayOrderId(payOrder.getId());
                orderDetail.setAmount(totalAmount);
                orderDetail.setDetailType(PayDetailType.BALANCE_PAY);
                orderDetail.setDeductionPayNo(payment.getPayNo());
                orderDetail.setStatus(0);
            }
            payOrderDetails.add(orderDetail);
            // 重置 totalAmount 和 deductionAmount 以便处理下一个扣除
            totalAmount = BigDecimal.ZERO;
            deductionAmount = deductionAmount.subtract(orderDetail.getAmount()); //减去金额
            if(deductionAmount.compareTo(BigDecimal.ZERO) <= 0){
                break;
            }
        }
        if(deductionAmount.compareTo(BigDecimal.ZERO) > 0){
            throw new RuntimeException("余额不足，请核实后，重新发起支付请求");
        }

        return payOrderDetails;
    }

    public static void main(String[] args) {
//        List<PaymentInfo> payments = Arrays.asList(
//                new PaymentInfo("PAYMENT", new BigDecimal("1.0"), "UP-c07e6d41c00d2407130001", "2024071311114746697", new BigDecimal("1.0"), 1, "2024-07-13 00:50:17"),
//                new PaymentInfo("PAYMENT", new BigDecimal("2.0"), "UP-c07e6d41c00d2407130002", "2024071311114746698", new BigDecimal("2.0"), 1, "2024-07-13 00:50:18"),
//                new PaymentInfo("PAYMENT", new BigDecimal("1.0"), "UP-c07e6d41c00d2407130003", "2024071311114746699", new BigDecimal("3.0"), 1, "2024-07-13 00:50:19"),
//                new PaymentInfo("PAYMENT", new BigDecimal("1.0"), "UP-c07e6d41c00d2407130004", "2024071311114746700", new BigDecimal("4.0"), 1, "2024-07-13 00:50:20"),
//                new PaymentInfo("PAYMENT", new BigDecimal("0.5"), "UP-c07e6d41c00d2407130005", "2024071311114746701", new BigDecimal("5.0"), 1, "2024-07-13 00:50:21"),
//                new PaymentInfo("PAYMENT", new BigDecimal("3.0"), "UP-c07e6d41c00d2407130006", "2024071311114746702", new BigDecimal("6.0"), 1, "2024-07-13 00:50:22"),
//                new PaymentInfo("PAYMENT", new BigDecimal("1.0"), "UP-c07e6d41c00d2407130007", "2024071311114746703", new BigDecimal("7.0"), 1, "2024-07-13 00:50:23")
//        );
//        List<PaymentInfo> payments = JSONObject.parseArray("[{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":0E-8,\"cPayNo\":\"UP-c07e6d41c00d2407130001\",\"cOrderNo\":\"UO-c07e6d41c00d2408230003,UO-c07e6d41c00d2408230004\",\"cCJTNo\":\"2024071311114746697\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-07-13 00:50:17\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":0E-8,\"cPayNo\":\"UP-c07e6d41c00d2408120002\",\"cOrderNo\":\"UO-c07e6d41c00d2408230004\",\"cCJTNo\":\"40288a85914276c80191427734fc0001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-12 01:23:16\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":0E-8,\"cPayNo\":\"UP-c07e6d41c00d2408120003\",\"cOrderNo\":\"UO-c07e6d41c00d2408230004\",\"cCJTNo\":\"ff80808191427be30191427e45060001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-12 01:30:59\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":0.60000000,\"cPayNo\":\"UP-c07e6d41c00d2408140006\",\"cOrderNo\":\"UO-c07e6d41c00d2408230007,UO-c07e6d41c00d2408230008\",\"cCJTNo\":\"2024081411276871082\",\"iAmount\":4.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-14 21:02:18\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408140009\",\"cCJTNo\":\"2024081411277021059\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-14 21:21:05\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408140022\",\"cOrderNo\":\"\",\"cCJTNo\":\"40288a8a91514ae80191514ba45c0001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-14 22:30:00\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408190004\",\"cOrderNo\":\"\",\"cCJTNo\":\"ffde80819169f6a401916a1300600001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-19 17:58:38\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408200006\",\"cCJTNo\":\"ff808081916e642f01916e6e77ff0001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-20 14:17:01\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408200024\",\"cOrderNo\":\"\",\"cCJTNo\":\"ff808081916edd0a01916ee9ae200001\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-20 16:31:36\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408200025\",\"cOrderNo\":\"\",\"cCJTNo\":\"ff808081916edd0a01916efabd900005\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-20 16:50:14\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":1.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408200026\",\"cOrderNo\":\"\",\"cCJTNo\":\"ff808081916edd0a01916efbcf350009\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-20 16:51:24\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":2.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408210003\",\"cOrderNo\":\"\",\"cCJTNo\":\"ff8080819172e90e019172f7c9420001\",\"iAmount\":2.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-21 11:25:31\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":2.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408210004\",\"cOrderNo\":\"\",\"cCJTNo\":\"4028e4019172fac5019172fb58110001\",\"iAmount\":2.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-21 11:29:24\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":2.00000000,\"cPayNo\":\"UP-c07e6d41c00d2408210005\",\"cCJTNo\":\"ff8080819172fc2a019172fce39c0001\",\"iAmount\":2.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-21 11:31:05\"},{\"cPayType\":\"PAYMENT\",\"iNotUsedMoney\":0E-8,\"cPayNo\":\"UP-c07e6d41c00d2408220016\",\"cOrderNo\":\"UO-c07e6d41c00d2408210008\",\"cCJTNo\":\"2024082211319919292\",\"iAmount\":1.00000000,\"iPayType\":1,\"dPayCompleteDate\":\"2024-08-22 15:06:59\"}]", PaymentInfo.class);
        List<PaymentInfo> payments = JSONObject.parseArray("[{\"cCJTNo\":\"2024071311114746697\",\"cPayNo\":\"UP-c07e6d41c00d2407130001\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-07-13 00:50:17\",\"iAmount\":1.00000000,\"iNotUsedMoney\":0E-8,\"iPayType\":1},{\"cCJTNo\":\"40288a85914276c80191427734fc0001\",\"cPayNo\":\"UP-c07e6d41c00d2408120002\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-12 01:23:16\",\"iAmount\":1.00000000,\"iNotUsedMoney\":0E-8,\"iPayType\":1},{\"cCJTNo\":\"ff80808191427be30191427e45060001\",\"cPayNo\":\"UP-c07e6d41c00d2408120003\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-12 01:30:59\",\"iAmount\":1.00000000,\"iNotUsedMoney\":0E-8,\"iPayType\":1},{\"cCJTNo\":\"2024081411276871082\",\"cPayNo\":\"UP-c07e6d41c00d2408140006\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-14 21:02:18\",\"iAmount\":4.00000000,\"iNotUsedMoney\":0.60000000,\"iPayType\":1},{\"cCJTNo\":\"2024081411277021059\",\"cPayNo\":\"UP-c07e6d41c00d2408140009\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-14 21:21:05\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"40288a8a91514ae80191514ba45c0001\",\"cPayNo\":\"UP-c07e6d41c00d2408140022\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-14 22:30:00\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ffde80819169f6a401916a1300600001\",\"cPayNo\":\"UP-c07e6d41c00d2408190004\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-19 17:58:38\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff808081916e642f01916e6e77ff0001\",\"cPayNo\":\"UP-c07e6d41c00d2408200006\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-20 14:17:01\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff808081916edd0a01916ee9ae200001\",\"cPayNo\":\"UP-c07e6d41c00d2408200024\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-20 16:31:36\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff808081916edd0a01916efabd900005\",\"cPayNo\":\"UP-c07e6d41c00d2408200025\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-20 16:50:14\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff808081916edd0a01916efbcf350009\",\"cPayNo\":\"UP-c07e6d41c00d2408200026\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-20 16:51:24\",\"iAmount\":1.00000000,\"iNotUsedMoney\":1.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff8080819172e90e019172f7c9420001\",\"cPayNo\":\"UP-c07e6d41c00d2408210003\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-21 11:25:31\",\"iAmount\":2.00000000,\"iNotUsedMoney\":2.00000000,\"iPayType\":1},{\"cCJTNo\":\"4028e4019172fac5019172fb58110001\",\"cPayNo\":\"UP-c07e6d41c00d2408210004\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-21 11:29:24\",\"iAmount\":2.00000000,\"iNotUsedMoney\":2.00000000,\"iPayType\":1},{\"cCJTNo\":\"ff8080819172fc2a019172fce39c0001\",\"cPayNo\":\"UP-c07e6d41c00d2408210005\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-21 11:31:05\",\"iAmount\":2.00000000,\"iNotUsedMoney\":2.00000000,\"iPayType\":1},{\"cCJTNo\":\"2024082211319919292\",\"cPayNo\":\"UP-c07e6d41c00d2408220016\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-22 15:06:59\",\"iAmount\":1.00000000,\"iNotUsedMoney\":0E-8,\"iPayType\":1},{\"cCJTNo\":\"2024082311324572221\",\"cPayNo\":\"UP-c07e6d41c00d2408230011\",\"cPayType\":\"PAYMENT\",\"dPayCompleteDate\":\"2024-08-23 12:52:03\",\"iAmount\":1.00000000,\"iNotUsedMoney\":0E-8,\"iPayType\":1}]", PaymentInfo.class);

        PayOrder payOrder = new PayOrder();// 创建 PayOrder 对象并设置扣除金额
        payOrder.setPayNo("PAY-c07e6d41c00d2407130001");
        payOrder.setBalanceAmount(new BigDecimal("13.7"));
        long startTime = System.currentTimeMillis();
        System.out.println(startTime);
        List<PayOrderDetail> orderDetails = processPayments(payments, payOrder);
        System.out.println(System.currentTimeMillis()-startTime + "ms");

        for (PayOrderDetail detail : orderDetails) {
            System.out.println("Order Number: " + detail.getDeductionPayNo());
            System.out.println("Total Amount: " + detail.getAmount());
        }
    }

}
