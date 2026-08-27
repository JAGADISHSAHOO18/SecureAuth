package com.substring.auth.app.auth.payload;
public record TokenResponse(String accessToken,long expiresIn,String tokenType,UserResponse user){
 public static TokenResponse bearer(String a,long e,UserResponse u){return new TokenResponse(a,e,"Bearer",u);}
}
