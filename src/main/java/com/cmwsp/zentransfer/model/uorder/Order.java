package com.cmwsp.zentransfer.model.uorder;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.cmwsp.zentransfer.model.BaseEntity;
import com.cmwsp.zentransfer.utils.converter.MoneyConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.money.Money;

import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "uorder_orders")
public class Order extends BaseEntity {

    private static final long serialVersionUID = 269037004773028995L;

    // 支付单号
    // TODO: 这里需要把 unique = true 在发布到生产环境前改回为 true
    @Column(updatable = false, nullable = false, unique = true)
    @ExcelProperty("支付单号")
    private String payNo;

    // 订单单号
    // TODO: 这里需要把 unique = true 在发布到生产环境前改回为 true
    @Column(updatable = false, nullable = false)
    @ExcelProperty("订单号")
    private String orderNo;

    // 金额 单位“元”\
    @Column(updatable = false, nullable = false)
    @Convert(converter = MoneyConverter.class)
    @ExcelIgnore
    private Money amount;

    // 商品描述
    @Column(updatable = false, nullable = false)
    private String produceDesc;

    // 保留字段， 固定CustomChannel
    @Column(updatable = false, nullable = false)
    private String srcReserve;

    // 商家Id
    @Column(updatable = false, nullable = false)
    private String bizId;

    // 客户Id
    @Column(updatable = false, nullable = false)
    private String agentId;

    // 外部订单号
    @Column(updatable = false, nullable = true)
    private String outTradeNo;

    // 支付状态如果为0表示成功
    @Column(updatable = true, nullable = false)
    private short status;

    @Column(updatable = false, nullable = false)
    private String inputCharset;

    @Column(updatable = false, nullable = false)
    private String returnUrl;

    @Column(updatable = false, nullable = false)
    private String size;

    // 通知地址
    @Column
    private String notifyUrl;

    // 客商编码
    @Column
    private String agentERPCode;

    // 客商名称
    @Column
    private String agentName;

    // 实际支付金额
    @Column
    private BigDecimal realAmount;

    // 返利抵扣金额
    @Column
    private BigDecimal rebateAmount;

    // 扣除余额金额
    @Column
    private BigDecimal balanceAmount;

    private String oAgentId;
    
}


