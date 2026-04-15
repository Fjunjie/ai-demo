//package com.cmwsp.zentransfer.auth;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.DefaultSecurityFilterChain;
//
//@Configuration
//public class UrlTokenAuthenticationSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Override
//    public void configure(HttpSecurity http) {
//        UrlTokenAuthenticationProvider provider = new UrlTokenAuthenticationProvider();
//        //设置到provider中
//        provider.setUserDetailsService(userDetailsService);
////        provider.setPasswordEncoder(passwordEncoder);
//        //注册配置
//        http.authenticationProvider(provider);
//    }
//}
