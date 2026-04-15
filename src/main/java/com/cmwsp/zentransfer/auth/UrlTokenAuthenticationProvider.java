//package com.cmwsp.zentransfer.auth;
//
//import lombok.Getter;
//import lombok.Setter;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.InternalAuthenticationServiceException;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.userdetails.UserCache;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.core.userdetails.cache.NullUserCache;
//import org.springframework.util.Assert;
//import org.springframework.util.StringUtils;
//
//@Slf4j
//@Getter
//@Setter
//public class UrlTokenAuthenticationProvider implements AuthenticationProvider {
//
//    private UserDetailsService userDetailsService;
//    private String key;
//    private String username;
//    private UserCache userCache = new NullUserCache();
//
//    @Override
//    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
//        UrlTokenAuthenticationToken urlTokenAuthenticationToken = (UrlTokenAuthenticationToken) authentication;
//        String token = (String) urlTokenAuthenticationToken.getPrincipal();
//        if (StringUtils.hasLength(token) && token.equals(key)) {
//            boolean cacheWasUsed = true;
//            UserDetails user = this.userCache.getUserFromCache(username);
//            if (user == null) {
//                cacheWasUsed = false;
//                try {
//                    user = this.retrieveUser(username, urlTokenAuthenticationToken);
//                } catch (UsernameNotFoundException var6) {
//                    log.debug("Failed to find user '" + username + "'", var6);
//                    throw new BadCredentialsException("无有效用户信息");
//                }
//                Assert.notNull(user, "retrieveUser returned null - a violation of the interface contract");
//            }
//            if (!cacheWasUsed) {
//                this.userCache.putUserInCache(user);
//            }
//            UrlTokenAuthenticationToken result = new UrlTokenAuthenticationToken(user,null, user.getAuthorities());
//            result.setDetails(authentication.getDetails());
//            return result;
//        } else {
//            throw new BadCredentialsException("无效token信息");
//        }
//    }
//
//    @Override
//    public boolean supports(Class<?> authentication) {
//        return UrlTokenAuthenticationToken.class.isAssignableFrom(authentication);
//    }
//
//    protected final UserDetails retrieveUser(String username, UrlTokenAuthenticationToken authentication) throws AuthenticationException {
//        try {
//            UserDetails loadedUser = this.getUserDetailsService().loadUserByUsername(username);
//            if (loadedUser == null) {
//                throw new InternalAuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
//            } else {
//                return loadedUser;
//            }
//        } catch (UsernameNotFoundException var4) {
//            UsernameNotFoundException ex = var4;
//            throw ex;
//        } catch (InternalAuthenticationServiceException var5) {
//            InternalAuthenticationServiceException ex = var5;
//            throw ex;
//        } catch (Exception var6) {
//            Exception ex = var6;
//            throw new InternalAuthenticationServiceException(ex.getMessage(), ex);
//        }
//    }
//
//}
