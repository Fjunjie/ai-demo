package com.cmwsp.zentransfer.configuration;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig{
    @Bean
    public ModelMapper modelMapper() {
        var modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        //忽略这些静态资源（不拦截）  新版本 Spring Security 6.0 已经弃用 antMatchers()
//        return (web) -> web.ignoring().requestMatchers("/js/**", "/css/**", "/images/**","/*.html");
//    }
//
//    @Bean
//    SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity.authorizeRequests() //开启登录配置
//                .requestMatchers("/alipay/*", "/uorder/*").permitAll() //允许直接访问的路径,包括验证码
//                .anyRequest().authenticated();//其他任何请求都必须经过身份验证
//
//        httpSecurity.formLogin(loginCustomizer ->
//                loginCustomizer.loginPage("/login")//跳转到自定义的登录页面
//                        .usernameParameter("username")//自定义表单的用户名的name,默认为username
//                        .passwordParameter("password")
//                        .defaultSuccessUrl("/reconciliation/list")
//                        .permitAll());//允许访问登录有关的路径
//        //开启注销
//        httpSecurity.logout(logoutCustomizer -> logoutCustomizer.logoutSuccessUrl("/login"));//注销后跳转到index页面
//        httpSecurity.csrf(csrfCustomizer -> csrfCustomizer.disable());
//        httpSecurity.headers(headersCustomizer -> headersCustomizer
//                .frameOptions(frameOptionsCustomizer -> frameOptionsCustomizer.disable())
//                .disable());
//        httpSecurity.addFilterAt(customUsernamePasswordAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//        return httpSecurity.build();
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("*"));
//        configuration.setAllowedMethods(Arrays.asList("*"));
//        configuration.setAllowedHeaders(Arrays.asList("*"));
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//    private CustomUsernamePasswordAuthenticationFilter customUsernamePasswordAuthenticationFilter(){
//        CustomUsernamePasswordAuthenticationFilter filter = new CustomUsernamePasswordAuthenticationFilter();
////        filter.setAuthenticationManager();
//        filter.setSessionAuthenticationStrategy(sessionAuthenticationStrategy());
//        return filter;
//    }
//
//    public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
//        List<SessionAuthenticationStrategy> delegateStrategies = new ArrayList<>();
//        delegateStrategies.add(new ChangeSessionIdAuthenticationStrategy());
//        ConcurrentSessionControlAuthenticationStrategy strategy =
//                new ConcurrentSessionControlAuthenticationStrategy(sessionRegistry());
//        //设置并发会话最大数
//        strategy.setMaximumSessions(1);
//        //设置当超过并发会话最大数时，禁止后来者登录
//        strategy.setExceptionIfMaximumExceeded(true);
//        delegateStrategies.add(strategy);
//        delegateStrategies.add(new RegisterSessionAuthenticationStrategy(sessionRegistry()));
//        return new CompositeSessionAuthenticationStrategy(delegateStrategies);
//    }
//
//    @Bean
//    public SessionRegistry sessionRegistry() {
//        return new SessionRegistryImpl();
//    }

}
