package com.cmwsp.zentransfer.configuration;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.CertAlipayRequest;
import com.alipay.api.DefaultAlipayClient;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlipayClientConfiguration {

    // 支付宝网关（固定）。
    @Value("${alipay.gatewayUrl}")
    private String URL;

    // APPID 即创建小程序后生成。
    @Value("${alipay.appId}")
    private String APPID;

    // 应用私钥路径
    @Value("${alipay.appPrivateKeyPath}")
    private String appPrivateKeyPath;

    // 应用公钥证书路径
    @Value("${alipay.appPubCertPath}")
    private String appPubCertPath;

    // 应用私钥内容
    private String APP_PRIVATE_KEY;

    // 支付宝公钥证书路径
    @Value("${alipay.appPubKeyPath}")
    private String APP_PUB_KEY_PATH;

    // 应用公钥内容
    private String APP_PUB_KEY;

    // 应用公钥证书内容
    @Value("${alipay.appPubCertPath}")
    private String APP_PUB_CERT_PATH;

    // 应用的根地址
    @Value("${app.url}")
    private String appUrl;

    @PostConstruct
    public void init() {
        try {
            APP_PRIVATE_KEY = new String(Files.readAllBytes(Paths.get(appPrivateKeyPath)));
            APP_PUB_KEY = new String(Files.readAllBytes(Paths.get(APP_PUB_KEY_PATH)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // 参数返回格式，只支持 JSON（固定）。
    @Value("${alipay.format}")
    private String FORMAT;

    // 编码集，支持 GBK/UTF-8。
    @Value("${alipay.charset}")
    private String CHARSET;

    // 商户生成签名字符串所使用的签名算法类型，目前支持 RSA2 和 RSA，推荐使用 RSA2。
    @Value("${alipay.signType}")
    private String SIGN_TYPE;

    // 支付宝公钥证书路径
    @Value("${alipay.certPath}")
    private String ALIPAY_CERT_PATH;

    // 支付宝根证书路径
    @Value("${alipay.rootCertPath}")
    private String ALIPAY_ROOT_CERT_PATH;

    public String getAppUrl() {
        return appUrl;
    }

    public String getAppId() {
        return APPID;
    }

    public String getAppPubCret() {
        return ALIPAY_CERT_PATH;
    }

    @Bean
    public CertAlipayRequest createCertAlipayRequest() {
        CertAlipayRequest certAlipayRequest = new CertAlipayRequest();
        certAlipayRequest.setServerUrl(URL);
        certAlipayRequest.setAppId(APPID);
        certAlipayRequest.setPrivateKey(APP_PRIVATE_KEY);
        certAlipayRequest.setFormat(FORMAT);
        certAlipayRequest.setCharset(CHARSET);
        certAlipayRequest.setSignType(SIGN_TYPE);
        certAlipayRequest.setCertPath(APP_PUB_CERT_PATH);
        certAlipayRequest.setAlipayPublicCertPath(ALIPAY_CERT_PATH);
        certAlipayRequest.setRootCertPath(ALIPAY_ROOT_CERT_PATH);

        return certAlipayRequest;
    }

    @Bean
    public AlipayClient createAlipayClient(CertAlipayRequest certAlipayRequest) throws AlipayApiException {
        return new DefaultAlipayClient(certAlipayRequest);
    }
}
