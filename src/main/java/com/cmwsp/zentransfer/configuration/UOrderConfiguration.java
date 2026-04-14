package com.cmwsp.zentransfer.configuration;

import com.alibaba.fastjson.support.spring.messaging.MappingFastJsonMessageConverter;
import com.cmwsp.zentransfer.service.UOrderApi;
import com.cmwsp.zentransfer.service.UOrderService;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
@ConfigurationProperties(prefix = "uorder")
public class UOrderConfiguration {

    private String appkey;

    private String secret;

    private String token;

    private String url;


    @Bean
    public UOrderApi initApi(){
        RestClient restClient = RestClient.builder().baseUrl(url)
                .requestInitializer(request -> {
                    System.out.println("请求链接：" + request.getURI());
                })
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(UOrderApi.class);
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAppkey() {
        return appkey;
    }

    public void setAppkey(String appkey) {
        this.appkey = appkey;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
