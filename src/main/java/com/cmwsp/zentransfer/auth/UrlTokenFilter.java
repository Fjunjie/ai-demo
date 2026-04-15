package com.cmwsp.zentransfer.auth;

//
//public class UrlTokenFilter extends OncePerRequestFilter {
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        if(request.getRequestURI().contains("/login") && StringUtils.hasLength(request.getParameter("token"))){
//            request.setAttribute("username","admin");
//            request.setAttribute("password","admin123456");
//        }
//        filterChain.doFilter(request,response);
//    }
//}
