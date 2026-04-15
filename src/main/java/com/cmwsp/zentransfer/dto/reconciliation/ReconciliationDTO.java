package com.cmwsp.zentransfer.dto.reconciliation;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
public class ReconciliationDTO {

    // 商品描述
    @ExcelIgnore
    private String produceDesc;

    // 外部订单号
    @ExcelIgnore
    private String outTradeNo;

    // 支付状态如果为0表示成功
    @ExcelIgnore
    private short status;

    @ExcelIgnore
    private String returnUrl;

    // 通知地址
    @ExcelIgnore
    private String notifyUrl;

    @ExcelIgnore
    private String id;

    @ExcelIgnore
    private LocalDateTime updatedAt;

    /**
     * 批次状态
     */
    @ExcelIgnore
    private String payStatus;

    /**
     * 是否通知成功
     */
    @ExcelIgnore
    private Boolean notifySuccess;

    /**
     * 付款用户id
     */
    @ExcelIgnore
    private String payerId;

    // 客商编码
//    @ColumnWidth(20)
//    @ExcelProperty(value = "客商编码",order = 1)
    @ExcelIgnore
    private String agentERPCode;

    // 客商编码
    @ColumnWidth(20)
    @ExcelProperty(value = "客商编码",order = 1)
    private String uAgentId;

    // 客商名称
    @ColumnWidth(40)
    @ExcelProperty(value = "客商名称",order = 2)
    private String agentName;

    // 订单单号
    @ColumnWidth(40)
    @ExcelProperty(value = "订单号(U订货)",order = 3)
    private String orderNo;

    // 支付单号
    @ColumnWidth(40)
    @ExcelProperty(value = "支付单号",order = 4)
    private String payNo;

    @ColumnWidth(10)
    @ExcelProperty(value = "订单金额",order = 5)
    private BigDecimal totalAmount;


    // 实际支付金额
    @ColumnWidth(10)
    @ExcelProperty(value = "转账金额",order = 6)
    private BigDecimal realAmount;

    // 返利抵扣金额
    @ColumnWidth(10)
    @ExcelProperty(value = "返利抵扣",order = 7)
    private BigDecimal rebateAmount;

    // 扣除余额金额
    @ColumnWidth(10)
    @ExcelProperty(value = "余额支付",order = 8)
    private BigDecimal balanceAmount;

    @ColumnWidth(40)
    @ExcelProperty(value = "核销单号(U订货)",order = 9)
    private String voucherNo;

    @ColumnWidth(40)
    @ExcelProperty(value = "收款单号(U订货)",order = 10)
    private String payeeNo;


    @ColumnWidth(24)
    @ExcelProperty(value = "支付时间",order = 11)
    private LocalDateTime createdAt;

    /**
     * 批次支付订单号
     */
//    @ColumnWidth(40)
//    @ExcelProperty(value = "支付宝唯一标识",order = 12)
    @ExcelIgnore
    private String batchTransId;

    /**
     * 支付宝唯一单号
     */
    @ColumnWidth(80)
    @ExcelProperty(value = "支付宝唯一标识",order = 12)
    private String alipayOrderNo;

    // 扣除余额金额
    @ColumnWidth(10)
    @ExcelProperty(value = "支付状态",order = 13)
    private String payStatusName;

}
