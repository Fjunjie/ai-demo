package com.cmwsp.zentransfer.model.alipay;

import com.cmwsp.zentransfer.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Table(name = "alipay_batch_pay_record")
@AllArgsConstructor
@NoArgsConstructor
public class AlipayBatchPayRecord extends BaseEntity {

    /**
     * 外部单号
     */
    private String outBatchNo;

    /**
     * 批次支付订单号
     */
    private String batchTransId;

    /**
     * 批次状态
     */
    private String status;

    /**
     * 是否通知成功
     */
    private Boolean notifySuccess;

    /**
     * 付款用户id
     */
    private String payerId;

    /**
     * 收款账户信息
     */
    private String payeeId;

    /**
     * 实际转账金额
     */
    private BigDecimal transAmount;
}
