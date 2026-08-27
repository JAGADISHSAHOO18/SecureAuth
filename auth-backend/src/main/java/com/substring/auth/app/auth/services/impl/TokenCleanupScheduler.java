package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.repositories.EmailVerificationTokenRepository;
import com.substring.auth.app.auth.repositories.PasswordResetTokenRepository;
import com.substring.auth.app.auth.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private final RefreshTokenRepository refreshTokens;
    private final EmailVerificationTokenRepository verificationTokens;
    private final PasswordResetTokenRepository resetTokens;

    @Scheduled(cron = "${app.auth.token-cleanup-cron:0 0 */6 * * *}")
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        refreshTokens.deleteByExpiresAtBefore(now);
        verificationTokens.deleteByExpiresAtBefore(now);
        resetTokens.deleteByExpiresAtBefore(now);
    }
}
