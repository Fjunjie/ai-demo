package com.cmwsp.zentransfer.dto.reconciliation;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class QueryListParamsRequest {

    private String agentName;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDateTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDateTime;

    private String orderNo;

    private String payNo;

    private String batchTransId;

    private Integer status;

}
