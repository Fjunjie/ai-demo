package com.cmwsp.zentransfer.configuration;

import com.cmwsp.zentransfer.service.UOrderApi;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
@ConfigurationProperties(prefix = "uorder")
public class UOrderConfiguration {

    private String appKey;

    private String secret;

    private String token;

    private String url;

    private String privateKey;

    private String publicKey;

    private String payeeId;

    private String key;

    private String username;

    private String password;

    private String appKey2;

    private String secret2;

    private String token2;

    public String getToken2() {
        return token2;
    }

    public void setToken2(String token2) {
        this.token2 = token2;
    }

    public String getAppKey2() {
        return appKey2;
    }

    public void setAppKey2(String appKey2) {
        this.appKey2 = appKey2;
    }

    public String getSecret2() {
        return secret2;
    }

    public void setSecret2(String secret2) {
        this.secret2 = secret2;
    }

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

    public String getAppKey() {
        return appKey;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
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

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(String payeeId) {
        this.payeeId = payeeId;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
