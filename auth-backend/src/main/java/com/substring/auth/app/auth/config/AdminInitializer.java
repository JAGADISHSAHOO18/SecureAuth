package com.substring.auth.app.auth.config;

import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final RoleRepository roles;

    @Override
    public void run(String... args) {
        ensureRole(AppConstants.GUEST_ROLE);
        ensureRole(AppConstants.ADMIN_ROLE);
    }

    private void ensureRole(String name) {
        String dbName = "ROLE_" + name;
        roles.findByName(dbName).orElseGet(() ->
                roles.save(Role.builder().name(dbName).build())
        );
    }
}
