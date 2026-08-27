package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.repositories.EmailVerificationTokenRepository; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.time.Instant;
@Service @RequiredArgsConstructor public class EmailVerificationService{
 private final EmailVerificationTokenRepository repo;private final TokenHashService hasher;private final AuditLogService audit;
 @Transactional public void verify(String raw){var t=repo.findByTokenHash(hasher.hash(raw)).orElseThrow(()->new IllegalArgumentException("Invalid or expired verification token"));if(t.isUsed()||t.getExpiresAt().isBefore(Instant.now()))throw new IllegalArgumentException("Invalid or expired verification token");t.setUsed(true);t.getUser().setEmailVerified(true);repo.save(t);audit.record(t.getUser(),"EMAIL_VERIFIED","Email address verified",null,null);}
}
