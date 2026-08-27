package com.substring.auth.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthBackend {
    public static void main(String[] args) {
        SpringApplication.run(AuthBackend.class, args);
    }
}
