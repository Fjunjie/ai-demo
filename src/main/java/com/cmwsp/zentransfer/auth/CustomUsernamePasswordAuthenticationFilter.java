//package com.cmwsp.zentransfer.auth;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.lang.Nullable;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationServiceException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//
//public class CustomUsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
//
//    public static final String SPRING_SECURITY_FORM_USERNAME_KEY = "username";
//
//    public static final String SPRING_SECURITY_FORM_PASSWORD_KEY = "password";
//
//    private String usernameParameter = SPRING_SECURITY_FORM_USERNAME_KEY;
//
//    private String passwordParameter = SPRING_SECURITY_FORM_PASSWORD_KEY;
//
//    private static final AntPathRequestMatcher DEFAULT_ANT_PATH_REQUEST_MATCHER = new AntPathRequestMatcher("/auto-login");
//
//    public CustomUsernamePasswordAuthenticationFilter() {
//        super(DEFAULT_ANT_PATH_REQUEST_MATCHER);
//    }
//
//    public CustomUsernamePasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
//        super(DEFAULT_ANT_PATH_REQUEST_MATCHER, authenticationManager);
//    }
//
//    @Override
//    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
//        // 允许 GET 请求
//        if (!"POST".equalsIgnoreCase(request.getMethod()) && !"GET".equalsIgnoreCase(request.getMethod())) {
//            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
//        }
//        // 获取用户名和密码
//        String username = obtainUsername(request);
//        String password = obtainPassword(request);
//        if (username == null) {
//            username = "";
//        }
//        if (password == null) {
//            password = "";
//        }
//        username = username.trim();
//
//        // 创建认证令牌
//        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
//                username, password);
//        // 设置详情
//        setDetails(request, authRequest);
//        // 进行认证
//        return this.getAuthenticationManager().authenticate(authRequest);
//    }
//
//    @Nullable
//    protected String obtainPassword(HttpServletRequest request) {
//        return request.getParameter(this.passwordParameter);
//    }
//
//    @Nullable
//    protected String obtainUsername(HttpServletRequest request) {
//        return request.getParameter(this.usernameParameter);
//    }
//
//    protected void setDetails(HttpServletRequest request, UsernamePasswordAuthenticationToken authRequest) {
//        authRequest.setDetails(this.authenticationDetailsSource.buildDetails(request));
//    }
//
//}
