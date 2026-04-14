package com.cmwsp.zentransfer.dto.uorder;

import lombok.Data;

@Data
public class DataResultResponse<T> {

    private Boolean result;

    private T obj;
}
