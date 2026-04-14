package com.cmwsp.zentransfer.dto.uorder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UOrderResponse<T> {

    // 状态吗
    private String code;

    // 提示信息
    private String message;

    // 数据
    private T data;
}
