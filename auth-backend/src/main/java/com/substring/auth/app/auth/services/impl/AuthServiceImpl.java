package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.entities.Provider;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.auth.payload.RegisterRequest;
import com.substring.auth.app.auth.payload.UserResponse;
import com.substring.auth.app.auth.repositories.EmailVerificationTokenRepository;
import com.substring.auth.app.auth.repositories.RoleRepository;
import com.substring.auth.app.auth.repositories.UserRepository;
import com.substring.auth.app.auth.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder encoder;
    private final UserMapper mapper;
    private final EmailVerificationTokenRepository verificationTokens;
    private final TokenHashService hasher;
    private final EmailService mail;
    private final AuditLogService audit;

    @Value("${app.auth.email-verification-required:false}")
    boolean verificationRequired;

    @Value("${app.auth.email-verification-minutes:30}")
    long verificationMinutes;

    @Value("${app.admin.email:}")
    String adminEmail;

    @Transactional
    public UserResponse register(RegisterRequest request, String ip, String userAgent) {
        String email = request.email().trim().toLowerCase();

        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        boolean isAdmin = !adminEmail.isBlank() && adminEmail.equalsIgnoreCase(email);
        String roleName = isAdmin ? AppConstants.ADMIN_ROLE : AppConstants.GUEST_ROLE;
        Role role = roles.findByName("ROLE_" + roleName)
                .orElseThrow(() -> new IllegalStateException("Required role is missing"));

        User user = User.builder()
                .email(email)
                .name(request.name().trim())
                .password(encoder.encode(request.password()))
                .provider(Provider.LOCAL)
                .enable(true)
                .emailVerified(!verificationRequired)
                .build();

        user.getRoles().add(role);
        User saved = users.save(user);

        audit.record(
                saved,
                "ACCOUNT_CREATED",
                isAdmin ? "Administrator account created" : "Local account created",
                ip,
                userAgent
        );

        if (verificationRequired) {
            String rawToken = UUID.randomUUID() + "-" + UUID.randomUUID();

            verificationTokens.deleteByUserId(saved.getId());
            verificationTokens.save(
                    com.substring.auth.app.auth.entities.EmailVerificationToken.builder()
                            .tokenHash(hasher.hash(rawToken))
                            .user(saved)
                            .expiresAt(Instant.now().plusSeconds(verificationMinutes * 60))
                            .used(false)
                            .createdAt(Instant.now())
                            .build()
            );

            mail.sendVerificationEmail(saved.getEmail(), saved.getName(), rawToken);
        }

        return mapper.toResponse(saved);
    }
}
