package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new JwtService(
                "replace-with-a-secret-that-is-at-least-64-characters-long-for-tests-123456789",
                900,
                3600,
                "secure-auth-test"
        );

        user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .name("Test User")
                .enable(true)
                .build();
        user.getRoles().add(Role.builder().name("ROLE_GUEST").build());
    }

    @Test
    void accessTokenContainsExpectedClaims() {
        String token = service.generateAccessToken(user);

        assertTrue(service.isAccessToken(token));
        assertFalse(service.isRefreshToken(token));
        assertEquals(user.getId(), service.getUserId(token));
        assertNotNull(service.getJti(token));
    }

    @Test
    void refreshTokenContainsExpectedClaims() {
        String jti = UUID.randomUUID().toString();
        String token = service.generateRefreshToken(user, jti);

        assertTrue(service.isRefreshToken(token));
        assertFalse(service.isAccessToken(token));
        assertEquals(user.getId(), service.getUserId(token));
        assertEquals(jti, service.getJti(token));
    }

    @Test
    void invalidTokenIsRejected() {
        assertThrows(Exception.class, () -> service.parse("not-a-valid-token"));
    }
}
