package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.payload.SessionResponse; import com.substring.auth.app.auth.repositories.RefreshTokenRepository; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.time.Instant; import java.util.*;
@Service @RequiredArgsConstructor public class SessionService{
 private final RefreshTokenRepository repo;
 public List<SessionResponse> list(UUID uid,String current){return repo.findByUserIdAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(uid,Instant.now()).stream().map(x->new SessionResponse(x.getId(),x.getCreatedAt(),x.getExpiresAt(),x.getLastUsedAt(),x.getIpAddress(),x.getUserAgent(),x.getJti().equals(current))).toList();}
 @Transactional public void revoke(UUID uid,UUID sid){var t=repo.findById(sid).orElseThrow(()->new IllegalArgumentException("Session not found"));if(!t.getUser().getId().equals(uid))throw new IllegalArgumentException("Session not found");t.setRevoked(true);}
}
