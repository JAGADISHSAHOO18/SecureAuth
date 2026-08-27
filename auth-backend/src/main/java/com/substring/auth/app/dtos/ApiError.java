package com.substring.auth.app.dtos;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
public record ApiError(int status,String error,String message,String path,OffsetDateTime timestamp){
  public static ApiError of(int s,String e,String m,String p){return new ApiError(s,e,m,p,OffsetDateTime.now(ZoneOffset.UTC));}
}
