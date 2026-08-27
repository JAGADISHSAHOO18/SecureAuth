package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.payload.UserResponse;
import com.substring.auth.app.auth.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserServiceImpl users;

    @GetMapping
    public ResponseEntity<List<UserResponse>> all() {
        return ResponseEntity.ok(users.all());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> byId(@PathVariable UUID id) {
        return ResponseEntity.ok(users.byId(id));
    }
}
