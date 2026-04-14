package com.cmwsp.zentransfer.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthLoginFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 静态资源全放开
        if (request.getRequestURI().indexOf("/js") != -1
                || request.getRequestURI().indexOf("/css") != -1
                || request.getRequestURI().indexOf("/alipay") != -1
                || request.getRequestURI().indexOf("/uorder") != -1
                || request.getRequestURI().indexOf("/login") != -1
                || request.getRequestURI().indexOf("/auto-login") != -1) {
            filterChain.doFilter(request, response);
            return;
        }
        // 获取 Session 中的用户信息
        Object user = request.getSession().getAttribute("user");
        // 如果用户未登录，则重定向到登录页面
        if (user == null) {
            response.sendRedirect("/login");
            return;
        }
        // 如果用户已登录，则继续处理请求
        filterChain.doFilter(request, response);
    }
}

