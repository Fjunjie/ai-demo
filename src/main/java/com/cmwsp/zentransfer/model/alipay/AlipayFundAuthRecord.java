package com.cmwsp.zentransfer.model.alipay;

import com.cmwsp.zentransfer.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Table(name = "alipay_fund_auth_record")
@AllArgsConstructor
@NoArgsConstructor
public class AlipayFundAuthRecord extends BaseEntity {

    // 外部请求号
    private String outBizNo;

    // 用户编码
    private String userId;

    // 签约协议号
    private String agreementNo;

    // 签约状态
    private String status;
}
