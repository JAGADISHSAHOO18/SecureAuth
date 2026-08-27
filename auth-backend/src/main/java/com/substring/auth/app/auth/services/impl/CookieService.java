package com.substring.auth.app.auth.services.impl;
import jakarta.servlet.http.HttpServletResponse; import org.springframework.beans.factory.annotation.Value; import org.springframework.http.*; import org.springframework.stereotype.Service; import lombok.Getter;
@Service @Getter public class CookieService{
 private final String refreshTokenCookieName,cookieDomain,cookieSameSite;private final boolean cookieHttpOnly,cookieSecure;
 public CookieService(@Value("${security.jwt.refresh-token-cookie-name}")String name,@Value("${security.jwt.cookie-http-only:true}")boolean httpOnly,@Value("${security.jwt.cookie-secure:false}")boolean secure,@Value("${security.jwt.cookie-same-site:lax}")String sameSite,@Value("${security.jwt.cookie-domain:}")String domain){refreshTokenCookieName=name;cookieHttpOnly=httpOnly;cookieSecure=secure;cookieSameSite=sameSite;cookieDomain=domain;}
 public void attachRefreshCookie(HttpServletResponse r,String v,long age){var b=ResponseCookie.from(refreshTokenCookieName,v).httpOnly(cookieHttpOnly).secure(cookieSecure).path("/").maxAge(age).sameSite(cookieSameSite);if(!cookieDomain.isBlank())b.domain(cookieDomain);r.addHeader(HttpHeaders.SET_COOKIE,b.build().toString());}
 public void clearRefreshCookie(HttpServletResponse r){var b=ResponseCookie.from(refreshTokenCookieName,"").httpOnly(cookieHttpOnly).secure(cookieSecure).path("/").maxAge(0).sameSite(cookieSameSite);if(!cookieDomain.isBlank())b.domain(cookieDomain);r.addHeader(HttpHeaders.SET_COOKIE,b.build().toString());}
 public void addNoStoreHeaders(HttpServletResponse r){r.setHeader(HttpHeaders.CACHE_CONTROL,"no-store");r.setHeader("Pragma","no-cache");}
}
