//package com.cmwsp.zentransfer.auth;
//
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//
//import java.util.Collection;
//
//public class UrlTokenAuthenticationToken extends AbstractAuthenticationToken {
//
//    //认证主体，这里用来存token
//    private final Object principal;
//
//    private Object credentials;
//
//    //初始化的构造方法
//    public UrlTokenAuthenticationToken(Object principal, Object credentials) {
//        super((Collection)null);
//        this.principal = principal;
//        this.credentials = credentials;
//        this.setAuthenticated(false);
//    }
//
//    //认证完成后调用的构造方法
//    public UrlTokenAuthenticationToken(Object principal, Object credentials,Collection<? extends GrantedAuthority> authorities) {
//        super(authorities);
//        this.principal = principal;
//        this.credentials = credentials;
//        super.setAuthenticated(true);
//    }
//
//    @Override
//    public Object getCredentials() {
//        return credentials;
//    }
//
//    @Override
//    public Object getPrincipal() {
//        return principal;
//    }
//
//    @Override
//    public void eraseCredentials() {
//        super.eraseCredentials();
//    }
//}
