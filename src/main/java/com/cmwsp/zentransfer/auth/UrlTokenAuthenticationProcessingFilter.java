//package com.cmwsp.zentransfer.auth;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
//import org.springframework.util.StringUtils;
//
//import java.io.IOException;
//
//public class UrlTokenAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {
//
//    private static final String DEFAULT_ANT_PATH_REQUEST_MATCHER = "/auto-login";
//
//    public UrlTokenAuthenticationProcessingFilter() {
//        super(DEFAULT_ANT_PATH_REQUEST_MATCHER);
//    }
//
//    @Override
//    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
//        String token = obtainToken(request);
//        token = token == null ? "" : token;
//        if(!StringUtils.hasLength(token)){
//            throw new BadCredentialsException("无效token");
//        }
//        UrlTokenAuthenticationToken urlTokenAuthenticationToken = new UrlTokenAuthenticationToken(token,null);
//        urlTokenAuthenticationToken.setDetails(this.authenticationDetailsSource.buildDetails(request));
//        return this.getAuthenticationManager().authenticate(urlTokenAuthenticationToken);
//    }
//
//    protected String obtainToken(HttpServletRequest request) {
//        // 从URL参数中获取用户名
//        return request.getParameter("token");
//    }
//}
