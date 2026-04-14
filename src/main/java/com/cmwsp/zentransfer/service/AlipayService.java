package com.cmwsp.zentransfer.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayFundAuthorizeUniApplyRequest;
import com.alipay.api.request.AlipayFundAuthorizeUniQueryRequest;
import com.alipay.api.request.AlipayFundBatchAppPayRequest;
import com.alipay.api.request.AlipayFundBatchCloseRequest;
import com.alipay.api.request.AlipayFundBatchCreateRequest;
import com.alipay.api.request.AlipayFundBatchDetailQueryRequest;
import com.alipay.api.request.AlipayFundTransRenderPayRequest;
import com.alipay.api.request.AlipaySystemOauthTokenRequest;
import com.alipay.api.request.AlipayUserInfoAuthRequest;
import com.alipay.api.request.AlipayUserInfoShareRequest;
import com.alipay.api.response.AlipayFundAuthorizeUniApplyResponse;
import com.alipay.api.response.AlipayFundAuthorizeUniQueryResponse;
import com.alipay.api.response.AlipayFundBatchAppPayResponse;
import com.alipay.api.response.AlipayFundBatchCloseResponse;
import com.alipay.api.response.AlipayFundBatchCreateResponse;
import com.alipay.api.response.AlipayFundBatchDetailQueryResponse;
import com.alipay.api.response.AlipayFundTransRenderPayResponse;
import com.alipay.api.response.AlipaySystemOauthTokenResponse;
import com.alipay.api.response.AlipayUserInfoShareResponse;
import com.cmwsp.zentransfer.configuration.AlipayClientConfiguration;
import com.cmwsp.zentransfer.configuration.AppConfig;
import com.cmwsp.zentransfer.dto.alipay.AuthCallbackDTO;
import com.cmwsp.zentransfer.dto.alipay.BatchCloseDTO;
import com.cmwsp.zentransfer.dto.alipay.BatchCreateDTO;
import com.cmwsp.zentransfer.dto.alipay.BatchDetailQueryDTO;
import com.cmwsp.zentransfer.dto.alipay.OauthTokenDTO;
import com.cmwsp.zentransfer.dto.alipay.TransRenderPayDTO;
import com.cmwsp.zentransfer.dto.alipay.UniApplyDTO;
import com.cmwsp.zentransfer.dto.alipay.UniQueryDTO;
import com.cmwsp.zentransfer.model.alipay.OauthToken;
import com.cmwsp.zentransfer.model.alipay.UserInfo;
import com.cmwsp.zentransfer.repository.alipay.OauthTokenRepository;
import com.cmwsp.zentransfer.repository.alipay.UserInfoRepository;
import com.cmwsp.zentransfer.utils.JsonUtil;
import com.cmwsp.zentransfer.utils.converter.DateConverter;
import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.servlet.http.Cookie;

import java.util.UUID;

@Service
public class AlipayService {

    private AlipayClient alipayClient;
    private final AlipayClientConfiguration alipayClientConfiguration;
    private OauthTokenRepository oauthTokenRepository;
    private UserInfoRepository userInfoRepository;

    public AlipayService(AlipayClient client,
                         AlipayClientConfiguration alipayClientConfiguration,
                         OauthTokenRepository oauthTokenRepository,
                         UserInfoRepository userInfoRepository) {
        this.alipayClient = client;
        this.alipayClientConfiguration = alipayClientConfiguration;
        this.oauthTokenRepository = oauthTokenRepository;
        this.userInfoRepository = userInfoRepository;
    }

    // 1 制单授权
    public AlipayFundAuthorizeUniApplyResponse authorizeUniApply(UniApplyDTO uniApplyDTO) {
        try {
            var request = new AlipayFundAuthorizeUniApplyRequest();
            request.setBizContent(JsonUtil.convertToJsonString(uniApplyDTO));
            return alipayClient.certificateExecute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundAuthorizeUniApplyResponse();
            response.setCode("40004");
            response.setMsg("UniApplyDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundAuthorizeUniApplyResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }

    }

    // 2 授权查询
    public AlipayFundAuthorizeUniQueryResponse authorizeUniQuery(UniQueryDTO uniQueryDTO) {
        try {
            var request = new AlipayFundAuthorizeUniQueryRequest();
            request.setBizContent(JsonUtil.convertToJsonString(uniQueryDTO));
            return alipayClient.certificateExecute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundAuthorizeUniQueryResponse();
            response.setCode("40004");
            response.setMsg("UniQueryDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundAuthorizeUniQueryResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // 3 签约/解约 通知服务
    public void statusNotify() throws AlipayApiException {
        // 回调的待验签字符串
        String resultInfo = "buyer_id=208****42&total_amount=0.01&body=***试&trade_no=20190329**941025940236&notify_time=2019-03-29 19:42:04&subject=**电脑网站支付&sign_type=RSA2&charset=UTF-8&auth_app_id=201****222&notify_type=trade_status_sync&invoice_amount=0.01&out_trade_no=20190329ygyg45484544100003&trade_status=TRADE_SUCCESS&gmt_payment=2019-03-29 19:42:03&version=1.0&point_amount=0.00&sign=your_sign&gmt_create=2019-03-29 19:42:00&buyer_pay_amount=0.01&receipt_amount=0.01&fund_bill_list=[{\"amount\":\"0.01\",\"fundChannel\":\"PCREDIT\"}]&seller_id=208****5&app_id=2014100***22&notify_id=20190329002221942040**8";
        // 验签支付宝公钥证书路径
        String alipayPublicCertPath = "your_alipayPublicCertPath";
        // 验签字符集
        String charset = "utf-8";
        // 对待签名字符串数据通过&进行拆分
        String[] temp = resultInfo.split("&");
        LinkedHashMap<String, String> params = new LinkedHashMap<String, String>();
        // 把拆分数据放在 Map 集合内
        for (int i = 0; i < temp.length; i++) {
            String[] arr = temp[i].split("=", 2); // 通过"="号分割成2个数据
            String[] tempAagin = new String[arr.length]; // 再开辟一个数组用来接收分割后的数据
            for (int j = 0; j < arr.length; j++) {
                tempAagin[j] = arr[j];
            }
            params.put(tempAagin[0], tempAagin[1]);
        }
        System.out.println(params);
        // 验签方法
        /**
         * @param params               参数列表(包括待验签参数和签名值sign) key-参数名称 value-参数值
         * @param alipayPublicCertPath 验签支付宝公钥证书路径
         * @param charset              验签字符集
         **/
        boolean signVerified = AlipaySignature.rsaCertCheckV1(params, alipayPublicCertPath, charset);
        if (signVerified) {
            // TODO 验签成功后
            System.out.println("success");
        } else {
            System.out.println("fail");
        }
    }

    // 4 批次下单
    public AlipayFundBatchCreateResponse createBatchFund(BatchCreateDTO batchCreateDTO) {
        try {
            var request = new AlipayFundBatchCreateRequest();
            request.setBizContent(JsonUtil.convertToJsonString(batchCreateDTO));
            return alipayClient.certificateExecute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundBatchCreateResponse();
            response.setCode("40004");
            response.setMsg("BatchCreateDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundBatchCreateResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // 5 资金转账渲染支付
    public AlipayFundTransRenderPayResponse transRenderPay(TransRenderPayDTO transRenderPayDTO) {
        try {
            var request = new AlipayFundTransRenderPayRequest();
            request.setBizContent(JsonUtil.convertToJsonString(transRenderPayDTO));
            return alipayClient.certificateExecute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundTransRenderPayResponse();
            response.setCode("40004");
            response.setMsg("TransRenderPayDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundTransRenderPayResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // 6 批次异步通知接口
    public void batchOrderChanged() throws AlipayApiException {
        // 回调的待验签字符串
        String resultInfo = "buyer_id=208****42&total_amount=0.01&body=***试&trade_no=20190329**941025940236&notify_time=2019-03-29 19:42:04&subject=**电脑网站支付&sign_type=RSA2&charset=UTF-8&auth_app_id=201****222&notify_type=trade_status_sync&invoice_amount=0.01&out_trade_no=20190329ygyg45484544100003&trade_status=TRADE_SUCCESS&gmt_payment=2019-03-29 19:42:03&version=1.0&point_amount=0.00&sign=your_sign&gmt_create=2019-03-29 19:42:00&buyer_pay_amount=0.01&receipt_amount=0.01&fund_bill_list=[{\"amount\":\"0.01\",\"fundChannel\":\"PCREDIT\"}]&seller_id=208****5&app_id=2014100***22&notify_id=20190329002221942040**8";
        // 验签支付宝公钥证书路径
        String alipayPublicCertPath = "your_alipayPublicCertPath";
        // 验签字符集
        String charset = "utf-8";
        // 对待签名字符串数据通过&进行拆分
        String[] temp = resultInfo.split("&");
        LinkedHashMap<String, String> params = new LinkedHashMap<String, String>();
        // 把拆分数据放在 Map 集合内
        for (int i = 0; i < temp.length; i++) {
            String[] arr = temp[i].split("=", 2); // 通过"="号分割成2个数据
            String[] tempAagin = new String[arr.length]; // 再开辟一个数组用来接收分割后的数据
            for (int j = 0; j < arr.length; j++) {
                tempAagin[j] = arr[j];
            }
            params.put(tempAagin[0], tempAagin[1]);
        }
        System.out.println(params);
        // 验签方法
        /**
         * @param params               参数列表(包括待验签参数和签名值sign) key-参数名称 value-参数值
         * @param alipayPublicCertPath 验签支付宝公钥证书路径
         * @param charset              验签字符集
         **/
        boolean signVerified = AlipaySignature.rsaCertCheckV1(params, alipayPublicCertPath, charset);
        if (signVerified) {
            // TODO 验签成功后
            System.out.println("success");
        } else {
            System.out.println("fail");
        }
    }

    // 7 批次查询服务
    public AlipayFundBatchDetailQueryResponse batchDetailQuery(BatchDetailQueryDTO batchDetailQueryDTO) {
        try {
            var request = new AlipayFundBatchDetailQueryRequest();
            request.setBizContent(JsonUtil.convertToJsonString(batchDetailQueryDTO));
            return alipayClient.execute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundBatchDetailQueryResponse();
            response.setCode("40004");
            response.setMsg("BatchDetailQueryDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundBatchDetailQueryResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // 8 主动关闭不支付批次
    public AlipayFundBatchCloseResponse batchClose(BatchCloseDTO batchCloseDTO) {
        try {
            var request = new AlipayFundBatchCloseRequest();
            request.setBizContent(JsonUtil.convertToJsonString(batchCloseDTO));
            return alipayClient.execute(request);
        } catch (JsonProcessingException e) {
            var response = new AlipayFundBatchCloseResponse();
            response.setCode("40004");
            response.setMsg("BatchCloseDTO JSON字符串解析失败");
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayFundBatchCloseResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }
    // 获取用户支付宝账户的访问令牌

    public AlipaySystemOauthTokenResponse getAlipayAccessToken(AuthCallbackDTO authCallbackDTO, Cookie[] cookies) {
        try {

            var request = new AlipaySystemOauthTokenRequest();

            // 从 Cookie 中读取 Session ID 如果有则到数据库中查找有没有对应的OAuthToken记录
            String sessionId = null;
            // TODO 这个地方是回调，cookies是支付宝回调的信息，支付宝回调好像没有提供cookies
            if(null != cookies){
                for (Cookie cookie : cookies) {
                    if ("session_id".equals(cookie.getName())) {
                        sessionId = cookie.getValue();
                        break;
                    }
                }
            }

            Optional<OauthToken> oauthToken = null;

            // 先查看是否有授权信息


            // 如果 Cookie 中有 Session ID 则到数据库中查找对应的 OAuthToken 记录
            if (sessionId != null) {
                oauthToken = Optional.ofNullable(oauthTokenRepository.findBySessionId(sessionId).orElse(null));

                // 获取当前时间
                var currentDateTime = LocalDateTime.now();

                // 首先根据 oauthToken 中保存的 authStart 和 expiresIn 计算出访问令牌的过期时间
                var accessTokenExpiresAt = oauthToken.get().getAuthStart().plusSeconds(oauthToken.get().getExpiresIn());

                // 如果访问令牌的过期时间在当前时间之前，说明访问令牌已经过期，需要使用刷新令牌刷新访问令牌
                if (accessTokenExpiresAt.isBefore(currentDateTime)) {
                    // 首先根据 oauthToken 中保存的 authStart 和 reExpiresIn 计算出刷新令牌的过期时间
                    var refreshTokenExpiresAt = oauthToken.get().getAuthStart().plusSeconds(oauthToken.get().getReExpiresIn());

                    // 如果刷新令牌的过期时间在当前时间之前，说明刷新令牌已经过期，需要重新授权
                    if (refreshTokenExpiresAt.isBefore(currentDateTime)) {
                        // 删除数据库中的 OAuthToken 记录
                        oauthTokenRepository.delete(oauthToken.get());
                    } else {
                        // 使用刷新令牌刷新访问令牌
                        request.setRefreshToken(oauthToken.get().getRefreshToken());
                        request.setGrantType("refresh_token");
                    }
                } else {
                    // 如果访问令牌没有过期，直接返回访问令牌
                    var response = new AlipaySystemOauthTokenResponse();
                    response.setAccessToken(oauthToken.get().getAccessToken());
                    response.setExpiresIn(String.valueOf(oauthToken.get().getExpiresIn()));
                    response.setReExpiresIn(String.valueOf(oauthToken.get().getReExpiresIn()));
                    response.setAlipayUserId(oauthToken.get().getAlipayUserId());
                    response.setUserId(oauthToken.get().getUserId());
                    return response;
                }
            }

            if (sessionId == null) {
                sessionId = UUID.randomUUID().toString();

                Cookie newSessionCookie = new Cookie("session_id", sessionId);
                newSessionCookie.setPath("/");
                newSessionCookie.setHttpOnly(true);
            }

            // TODO: 从数据库中获取刷新令牌，如果有就设置，没有就不设置，对应的 grant_type 也需要修改
            // request.setRefreshToken("");
            request.setGrantType("authorization_code");
            request.setCode(authCallbackDTO.getAuthCode());
            var response = alipayClient.certificateExecute(request);

            // 将获取到的访问令牌、刷新令牌和用户 id 存入数据库
            oauthTokenRepository.save(OauthToken.builder()
                    .sessionId(sessionId)
                    .accessToken(response.getAccessToken())
                    .refreshToken(response.getRefreshToken())
                    .expiresIn(Integer.parseInt(response.getExpiresIn()))
                    .reExpiresIn(Integer.parseInt(response.getReExpiresIn()))
                    .alipayUserId(response.getAlipayUserId())
                    .userId(response.getUserId())
                    .authStart(DateConverter.convertDateToLocalDateTime(response.getAuthStart()))
                    .build());

            return response;
        } catch (AlipayApiException e) {
            var response = new AlipaySystemOauthTokenResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // 根据 Access Token 获取用户信息
    public AlipayUserInfoShareResponse getUserInfoByAccessToken(String accessToken) {
        try {
            var request = new AlipayUserInfoShareRequest();
            var response = alipayClient.certificateExecute(request, accessToken);

            var userInfo = userInfoRepository.findByUserId(response.getUserId());

            if (!userInfo.isPresent()) {
                // 将获取到的用户信息保存到数据库
                userInfoRepository.save(UserInfo.builder().userId(response.getUserId()).nickName(response.getNickName())
                        .avatar(response.getAvatar()).build());
            }
            return response;
        } catch (AlipayApiException e) {
            var response = new AlipayUserInfoShareResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    // TODO: 账单展示 && 回单下载

    /******************************************
     * 特定于移动端的实现
     ******************************************/

    public AlipayFundBatchAppPayResponse batchAppPay(String batchTransId) {
        var request = new AlipayFundBatchAppPayRequest();
        request.setBizContent(
                """
                        {
                          "batch_trans_id": "%s"
                        }
                        """.formatted(batchTransId));
        request.setReturnUrl(alipayClientConfiguration.getAppUrl() + "alipay/callback");

        try {
            return alipayClient.pageExecute(request);
        } catch (AlipayApiException e) {
            var response = new AlipayFundBatchAppPayResponse();
            response.setCode(e.getErrCode());
            response.setMsg(e.getErrMsg());
            return response;
        }
    }

    private String combineMobilePayLink(String params) throws UnsupportedEncodingException {
        // 初始支付参数
        String parm = params; // "charset=UTF-8&biz_content=%7B%22batch_trans_id%22%3A%22202104130015426093%22%7D&method=alipay.fund.batch.app.pay&sign_type=RSA2&timestamp=2021-04-06+15%3A05%3A26&sign=BF94qwJHdYOQRbJWqklhsiUztI%2B2bA0QtPHwE0tXnIamxzbsSB4yDd1wiegvWRzlLhY2ohIeTwLPvdQVdBKmVmicfgcKE29ceWAJ9YqPYYyCpH1JKBJEwdnntrLL8i%2FvUyCcxKHvpk4K0x7D2H5PmkzMWeG5stAHEY4kpVG1%2F2WKs%2BPQOp3R6%2B4hrrZh8lHKrlmlsOxas3TOwgh525%2Fm%2FA0cRcg1SvNxQRHS7gru6vTW69SLU3hx2VvTo9CftuGdpO8NdmnrMUPu6BsKzhaGfjUpsybINFh6iZd%2Fwr%2FDJF1U9k345TAJeXOTjV4fXfc%2BMkAiUtjHXhtSB93LIh2awg%3D%3D&app_id=2021000146612269";

        // 将支付参数整体 encode 一次
        String encodeParm = URLEncoder.encode(parm, "utf-8");
        // 拼接带参页面路径并再次整体encode
        String pageEncode = URLEncoder.encode("pages/confirm/index/index?signParams=" + encodeParm, "utf-8");

        // 拼接跳转支付宝内支付地址如果商户需要回跳，参考这个
        String payUrl = "alipays://platformapi/startapp?appId=2021002133661287&appClearTop=false&startMultApp=YES" +
                "&thirdPartSchema=" + URLEncoder.encode("这里填写商户自己的app schema", "utf-8") // 如需支持商户支付后通过schema回跳商家/ISV应用，需在此拼接回跳地址。
                + "&page=" + pageEncode;
        // 拼接跳转支付宝内支付地址，如果商户无需回跳，参考这个
        // String payUrl =
        // "alipays://platformapi/startapp?appId=2021002133661287&appClearTop=false&startMultApp=YES"
        // + "&page=" + pageEncode;

        // 拼接完整跳转链接
        String fullUrl = "https://render.alipay.com/p/s/ulink/?scheme=" + URLEncoder.encode(payUrl, "utf-8");

        return fullUrl;
    }
}
