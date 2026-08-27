package com.substring.auth.app.auth.config;

import com.substring.auth.app.auth.entities.Provider;
import com.substring.auth.app.auth.entities.RefreshToken;
import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.repositories.RefreshTokenRepository;
import com.substring.auth.app.auth.repositories.RoleRepository;
import com.substring.auth.app.auth.repositories.UserRepository;
import com.substring.auth.app.auth.services.impl.AuditLogService;
import com.substring.auth.app.auth.services.impl.ClientInfoService;
import com.substring.auth.app.auth.services.impl.CookieService;
import com.substring.auth.app.auth.services.impl.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository users;
    private final RoleRepository roles;
    private final RefreshTokenRepository refresh;
    private final JwtService jwt;
    private final CookieService cookies;
    private final ClientInfoService clientInfo;
    private final AuditLogService audit;
    private final OAuth2AuthorizedClientService authorizedClients;
    private final RestClient restClient = RestClient.create();

    @Value("${app.auth.frontend.success-redirect}")
    String successUrl;

    @Value("${app.admin.email:}")
    String adminEmail;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String provider = authentication instanceof OAuth2AuthenticationToken token
                ? token.getAuthorizedClientRegistrationId()
                : "unknown";

        User user = switch (provider) {
            case "google" -> upsertGoogle(oauthUser);
            case "github" -> upsertGithub(oauthUser, authentication);
            default -> throw new IllegalArgumentException("Unsupported OAuth2 provider");
        };

        ensureRole(user);
        user.setEnable(true);
        user.setEmailVerified(true);
        user = users.save(user);

        String jti = UUID.randomUUID().toString();
        refresh.save(
                RefreshToken.builder()
                        .jti(jti)
                        .user(user)
                        .createdAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(jwt.getRefreshTtlSeconds()))
                        .revoked(false)
                        .ipAddress(clientInfo.ip(request))
                        .userAgent(clientInfo.userAgent(request))
                        .build()
        );

        cookies.attachRefreshCookie(
                response,
                jwt.generateRefreshToken(user, jti),
                jwt.getRefreshTtlSeconds()
        );
        cookies.addNoStoreHeaders(response);

        audit.record(
                user,
                "OAUTH_LOGIN",
                provider + " login",
                clientInfo.ip(request),
                clientInfo.userAgent(request)
        );

        response.sendRedirect(successUrl);
    }

    private void ensureRole(User user) {
        boolean admin = !adminEmail.isBlank() && adminEmail.equalsIgnoreCase(user.getEmail());

        if (admin) {
            roles.findByName("ROLE_" + AppConstants.ADMIN_ROLE)
                    .ifPresent(role -> user.getRoles().add(role));
            return;
        }

        if (user.getRoles().isEmpty()) {
            roles.findByName("ROLE_" + AppConstants.GUEST_ROLE)
                    .ifPresent(user.getRoles()::add);
        }
    }

    private User upsertGoogle(OAuth2User oauthUser) {
        String email = String.valueOf(
                oauthUser.getAttributes().getOrDefault("email", "")
        ).trim().toLowerCase();

        if (email.isBlank()) {
            throw new IllegalArgumentException("Google did not return an email");
        }

        String providerId = String.valueOf(
                oauthUser.getAttributes().getOrDefault("sub", "")
        );

        return users.findByEmail(email)
                .map(user -> {
                    user.setProvider(Provider.GOOGLE);
                    user.setProviderId(providerId);
                    user.setName(String.valueOf(
                            oauthUser.getAttributes().getOrDefault("name", user.getName())
                    ));
                    user.setImage(String.valueOf(
                            oauthUser.getAttributes().getOrDefault("picture", user.getImage() == null ? "" : user.getImage())
                    ));
                    return user;
                })
                .orElseGet(() -> User.builder()
                        .email(email)
                        .name(String.valueOf(oauthUser.getAttributes().getOrDefault("name", email)))
                        .image(String.valueOf(oauthUser.getAttributes().getOrDefault("picture", "")))
                        .enable(true)
                        .emailVerified(true)
                        .provider(Provider.GOOGLE)
                        .providerId(providerId)
                        .build());
    }

    private User upsertGithub(OAuth2User oauthUser, Authentication authentication) {
        String email = String.valueOf(oauthUser.getAttributes().getOrDefault("email", ""))
                .trim()
                .toLowerCase();

        if (email.isBlank()) {
            email = getVerifiedGithubEmail(authentication);
        }

        if (email.isBlank()) {
            throw new IllegalArgumentException("GitHub did not provide a verified email");
        }

        String providerId = String.valueOf(oauthUser.getAttributes().getOrDefault("id", ""));
        String name = String.valueOf(oauthUser.getAttributes().getOrDefault("login", email));
        String image = String.valueOf(oauthUser.getAttributes().getOrDefault("avatar_url", ""));

        String normalizedEmail = email.toLowerCase();

        return users.findByEmail(normalizedEmail)
                .map(user -> {
                    user.setProvider(Provider.GITHUB);
                    user.setProviderId(providerId);
                    user.setName(name);
                    user.setImage(image);
                    return user;
                })
                .orElseGet(() -> User.builder()
                        .email(normalizedEmail)
                        .name(name)
                        .image(image)
                        .enable(true)
                        .emailVerified(true)
                        .provider(Provider.GITHUB)
                        .providerId(providerId)
                        .build());
    }

    private String getVerifiedGithubEmail(Authentication authentication) {
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            return "";
        }

        OAuth2AuthorizedClient client = authorizedClients.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                authentication.getName()
        );

        if (client == null || client.getAccessToken() == null) {
            return "";
        }

        List<Map<String, Object>> emails = restClient.get()
                .uri("https://api.github.com/user/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + client.getAccessToken().getTokenValue())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (emails == null) return "";

        return emails.stream()
                .filter(item -> Boolean.TRUE.equals(item.get("verified")))
                .sorted((left, right) -> Boolean.compare(
                        Boolean.TRUE.equals(right.get("primary")),
                        Boolean.TRUE.equals(left.get("primary"))
                ))
                .map(item -> String.valueOf(item.getOrDefault("email", "")))
                .filter(value -> !value.isBlank())
                .findFirst()
                .orElse("");
    }
}
