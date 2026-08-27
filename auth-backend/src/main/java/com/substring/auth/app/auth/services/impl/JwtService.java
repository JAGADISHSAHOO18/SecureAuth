package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.entities.*; import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.time.Instant; import java.util.*;
@Service public class JwtService{
 private final SecretKey key;private final long accessTtlSeconds,refreshTtlSeconds;private final String issuer;
 public JwtService(@Value("${security.jwt.secret}")String secret,@Value("${security.jwt.access-ttl-seconds}")long access,@Value("${security.jwt.refresh-ttl-seconds}")long refresh,@Value("${security.jwt.issuer}")String issuer){
  if(secret==null||secret.length()<64)throw new IllegalArgumentException("JWT secret must be at least 64 characters");if(access<=0||refresh<=0)throw new IllegalArgumentException("JWT TTL must be positive");
  key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));accessTtlSeconds=access;refreshTtlSeconds=refresh;this.issuer=issuer;
 }
 public String generateAccessToken(User u){Instant n=Instant.now();var roles=u.getRoles()==null?List.<String>of():u.getRoles().stream().map(Role::getName).toList();return Jwts.builder().id(UUID.randomUUID().toString()).subject(u.getId().toString()).issuer(issuer).issuedAt(Date.from(n)).expiration(Date.from(n.plusSeconds(accessTtlSeconds))).claim("email",u.getEmail()).claim("roles",roles).claim("typ","access").signWith(key,Jwts.SIG.HS512).compact();}
 public String generateRefreshToken(User u,String jti){Instant n=Instant.now();return Jwts.builder().id(jti).subject(u.getId().toString()).issuer(issuer).issuedAt(Date.from(n)).expiration(Date.from(n.plusSeconds(refreshTtlSeconds))).claim("typ","refresh").signWith(key,Jwts.SIG.HS512).compact();}
 public Jws<Claims> parse(String t){return Jwts.parser().verifyWith(key).requireIssuer(issuer).build().parseSignedClaims(t);}
 public boolean isAccessToken(String t){return "access".equals(parse(t).getPayload().get("typ"));}public boolean isRefreshToken(String t){return "refresh".equals(parse(t).getPayload().get("typ"));}public UUID getUserId(String t){return UUID.fromString(parse(t).getPayload().getSubject());}public String getJti(String t){return parse(t).getPayload().getId();}
 public long getAccessTtlSeconds(){return accessTtlSeconds;}public long getRefreshTtlSeconds(){return refreshTtlSeconds;}
}
