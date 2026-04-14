package com.cmwsp.zentransfer.service.impl;

import org.springframework.context.ApplicationEvent;

public class AlipayNotificationEvent<T>  extends ApplicationEvent {

    private T payload;

    public AlipayNotificationEvent(Object source, T payload) {
        super(source);
        this.payload = payload;
    }

    public T getPayload() {
        return payload;
    }
}

