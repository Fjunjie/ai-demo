package com.cmwsp.zentransfer.model.pay;

import com.cmwsp.zentransfer.model.BaseEntity;
import com.cmwsp.zentransfer.utils.PayOrderType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.List;

import static jakarta.persistence.EnumType.STRING;

@Entity
@Table(name = "pay_order")
@Data
@EqualsAndHashCode(callSuper = true)
public class PayOrder  extends BaseEntity {

    /**
     * uOrder订单号
     */
    @Column
    private String uOrderNo;

    /**
     * 支付单号
     */
    @Column(unique = true)
    private String payNo;

    /**
     * 支付宝业务号
     */
    @Column
    private String batchTransId;

    /**
     * 总金额
     */
    @Column
    private BigDecimal totalAmount;

    /**
     * 返利抵扣金额
     */
    @Column
    private BigDecimal rebateAmount;

    /**
     * 余额支付
     */
    @Column
    private BigDecimal balanceAmount;

    /**
     * 实际支付金额
     */
    @Column
    private BigDecimal realAmount;

    /**
     * 支付类型
     */
    @Column
    @Enumerated(STRING)
    private PayOrderType type;

    /**
     * 客户id
     */
    @Column
    private String agentId;

    /**
     * 支付状态
     */
    @Column
    private Integer payStatus;

    // 客商ERP
    @Column
    private String agentERPCode;

    // 客商名称
    @Column
    private String agentName;

    // 客商编码
    @Column
    private String uAgentId;

    /**
     * 来源支付单号
     */
    @Column
    private String sourcePayNo;

    /**
     * 支付宝唯一交易号，目前使用都是1对1
     */
    @Column
    private String alipayOrderNo;

    @OneToMany
    @JoinColumn(name = "payOrderId",
            updatable = false,
            insertable = false,
            foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private List<PayOrderDetail> payOrderDetails;

}
