package com.cmwsp.zentransfer.model.pay;

import com.cmwsp.zentransfer.model.BaseEntity;
import com.cmwsp.zentransfer.utils.PayDetailType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

import static jakarta.persistence.EnumType.STRING;

@Data
@Entity
@Table(name = "pay_order_detail")
@EqualsAndHashCode(callSuper = true)
public class PayOrderDetail extends BaseEntity {

    // 支付单号
    @Column
    private String payOrderId;

    // 支付类型
    @Enumerated(STRING)
    @Column
    private PayDetailType detailType;

    // 支付金额
    @Column
    private BigDecimal amount;

    // 支付状态 0 未支付(锁定状态) 1 已支付 2 支付失败
    @Column
    private Integer status;

    // 抵扣支付单号
    @Column
    private String deductionPayNo;

    @ManyToOne
    @JoinColumn(
            name = "payOrderId",
            updatable = false,
            insertable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private PayOrder payOrder;

}
