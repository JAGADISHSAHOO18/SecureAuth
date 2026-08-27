package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.payload.ChangePasswordRequest;
import com.substring.auth.app.auth.payload.UpdateProfileRequest;
import com.substring.auth.app.auth.payload.UserResponse;
import com.substring.auth.app.auth.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserServiceImpl users;

    @PutMapping
    public ResponseEntity<UserResponse> update(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(users.updateCurrent(authentication.getName(), request));
    }

    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        users.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(Authentication authentication) {
        users.deleteCurrent(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
