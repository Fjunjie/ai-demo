package com.cmwsp.zentransfer.service.impl;

import com.cmwsp.zentransfer.service.AlipayNotifyMessageHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AlipayNotificationListener<T> {

    @Autowired
    private List<AlipayNotifyMessageHandler> handlers;

    @EventListener
    public void handleNotificationEvent(AlipayNotificationEvent<T> event) {
        handlers.stream()
                .filter(handler -> handler.supportMsgMethod().equals(event.getSource()))
                .findFirst()
                .ifPresent(handler -> handler.handleMessage(event.getPayload()));
    }

}
