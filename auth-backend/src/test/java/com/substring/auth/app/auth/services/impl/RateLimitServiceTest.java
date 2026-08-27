package com.substring.auth.app.auth.services.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RateLimitServiceTest {

    @Test
    void blocksAfterFiveFailedAttemptsForTheSameAccount() {
        RateLimitService service = new RateLimitService();
        String email = "user@example.com";

        for (int i = 0; i < 5; i++) {
            service.checkLogin("10.0.0." + (i + 1), email);
            service.recordLoginFailure(email);
        }

        RateLimitExceededException ex = assertThrows(
                RateLimitExceededException.class,
                () -> service.checkLogin("10.0.0.99", email)
        );

        assertEquals(900, ex.getRetryAfterSeconds());
    }

    @Test
    void successfulLoginClearsAccountFailureBucket() {
        RateLimitService service = new RateLimitService();
        String email = "user@example.com";

        for (int i = 0; i < 4; i++) {
            service.checkLogin("10.0.0." + (i + 1), email);
            service.recordLoginFailure(email);
        }

        service.clearLoginFailures(email);

        assertDoesNotThrow(() -> service.checkLogin("10.0.0.99", email));
    }

    @Test
    void blocksAnIpAfterTwentyLoginAttemptsInOneMinute() {
        RateLimitService service = new RateLimitService();
        String ip = "10.0.0.10";

        for (int i = 0; i < 20; i++) {
            service.checkLogin(ip, "user" + i + "@example.com");
        }

        assertThrows(
                RateLimitExceededException.class,
                () -> service.checkLogin(ip, "another@example.com")
        );
    }
}
