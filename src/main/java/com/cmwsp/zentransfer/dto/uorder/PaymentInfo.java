package com.cmwsp.zentransfer.dto.uorder;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PaymentInfo {

    @JsonProperty("cPayType")
    @JSONField(name = "cPayType")
    private String cPayType;

    @JsonProperty("iNotUsedMoney")
    @JSONField(name = "iNotUsedMoney")
    private BigDecimal notUsedMoney;

    @JsonProperty("cPayNo")
    @JSONField(name = "cPayNo")
    private String payNo;

    @JsonProperty("cCJTNo")
    @JSONField(name = "cCJTNo")
    private String cjtNo;

    @JsonProperty("iAmount")
    @JSONField(name = "iAmount")
    private BigDecimal amount;

    @JsonProperty("iPayType")
    @JSONField(name = "iPayType")
    private int iPayType;

    @JsonProperty("dPayCompleteDate")
    @JSONField(name = "dPayCompleteDate")
    private String payCompleteDate;

}
