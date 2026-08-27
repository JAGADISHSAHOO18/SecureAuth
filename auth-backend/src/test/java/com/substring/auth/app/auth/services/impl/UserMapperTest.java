package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.entities.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    @Test
    void mapsUserWithoutExposingPassword() {
        User user = User.builder()
                .email("test@example.com")
                .name("Test User")
                .password("hashed")
                .enable(true)
                .emailVerified(true)
                .build();
        user.getRoles().add(Role.builder().name("ROLE_GUEST").build());

        var response = new UserMapper().toResponse(user);

        assertEquals("test@example.com", response.email());
        assertEquals("Test User", response.name());
        assertTrue(response.enabled());
        assertTrue(response.emailVerified());
        assertEquals(1, response.roles().size());
    }
}
