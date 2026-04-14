package com.cmwsp.zentransfer.dto.uorder;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SavePaymentsReturnDTO {

    @JsonProperty(value = "agent")
    @JSONField(name = "agent")
    private String agent;

    @JsonProperty(value = "oAgent")
    @JSONField(name = "oAgent")
    private Agent oAgent;

    @JsonProperty(value = "oUser")
    @JSONField(name = "oUser")
    private User oUser;

    @JsonProperty(value = "cOutSysKey")
    @JSONField(name = "cOutSysKey")
    private String cOutSysKey;

    @JsonProperty(value = "cPayNo")
    @JSONField(name = "cPayNo")
    private String cPayNo;


}
