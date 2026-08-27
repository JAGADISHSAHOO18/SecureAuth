package com.substring.auth.app.auth.services.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenHashServiceTest {

    private final TokenHashService service = new TokenHashService();

    @Test
    void hashIsDeterministic() {
        assertEquals(service.hash("hello"), service.hash("hello"));
    }

    @Test
    void hashChangesWhenInputChanges() {
        assertNotEquals(service.hash("hello"), service.hash("hello2"));
    }

    @Test
    void hashIsSha256Length() {
        assertEquals(64, service.hash("hello").length());
    }
}
