package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.auth.payload.ChangePasswordRequest;
import com.substring.auth.app.auth.payload.UpdateProfileRequest;
import com.substring.auth.app.auth.payload.UserResponse;
import com.substring.auth.app.auth.repositories.AuditLogRepository;
import com.substring.auth.app.auth.repositories.EmailVerificationTokenRepository;
import com.substring.auth.app.auth.repositories.PasswordResetTokenRepository;
import com.substring.auth.app.auth.repositories.RefreshTokenRepository;
import com.substring.auth.app.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final UserMapper mapper;
    private final RefreshTokenRepository refresh;
    private final EmailVerificationTokenRepository verificationTokens;
    private final PasswordResetTokenRepository resetTokens;
    private final AuditLogRepository auditLogs;
    private final AuditLogService audit;

    private User requireUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
    }

    public UserResponse current(String email) {
        return mapper.toResponse(requireUser(email));
    }

    @Transactional
    public UserResponse updateCurrent(String email, UpdateProfileRequest request) {
        User user = requireUser(email);

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        if (request.image() != null) {
            user.setImage(request.image().trim().isBlank() ? null : request.image().trim());
        }

        audit.record(user, "PROFILE_UPDATED", "Profile information updated", null, null);
        return mapper.toResponse(users.save(user));
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = requireUser(email);

        if (user.getPassword() == null || !encoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        if (encoder.matches(request.newPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from the current password");
        }

        user.setPassword(encoder.encode(request.newPassword()));
        users.save(user);
        refresh.deleteByUserId(user.getId());
        audit.record(user, "PASSWORD_CHANGED", "Password changed; active sessions revoked", null, null);
    }

    @Transactional
    public void deleteCurrent(String email) {
        User user = requireUser(email);
        UUID id = user.getId();

        refresh.deleteByUserId(id);
        verificationTokens.deleteByUserId(id);
        resetTokens.deleteByUserId(id);
        auditLogs.deleteByUserId(id);
        users.delete(user);
    }

    public List<UserResponse> all() {
        return users.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public UserResponse byId(UUID id) {
        return mapper.toResponse(
                users.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"))
        );
    }
}
