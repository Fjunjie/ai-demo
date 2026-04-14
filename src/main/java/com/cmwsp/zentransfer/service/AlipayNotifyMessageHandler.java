package com.cmwsp.zentransfer.service;

public interface AlipayNotifyMessageHandler<T> {

    String supportMsgMethod();

    void handleMessage(T formData);
}
