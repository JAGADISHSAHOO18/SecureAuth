package com.substring.auth.app.auth.services.impl;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    // Layer 1: burst protection for a single client IP.
    private static final int LOGIN_IP_CAPACITY = 20;
    private static final Duration LOGIN_IP_WINDOW = Duration.ofMinutes(1);

    // Layer 2: failed-credential protection for one account identifier.
    private static final int LOGIN_ACCOUNT_FAILURE_CAPACITY = 5;
    private static final Duration LOGIN_ACCOUNT_FAILURE_WINDOW = Duration.ofMinutes(15);

    // Other auth endpoints are intentionally stricter.
    private static final int REGISTER_CAPACITY = 5;
    private static final Duration REGISTER_WINDOW = Duration.ofMinutes(15);
    private static final int FORGOT_PASSWORD_CAPACITY = 5;
    private static final Duration FORGOT_PASSWORD_WINDOW = Duration.ofMinutes(15);

    // Keep the in-memory limiter bounded on a single-node deployment.
    private static final int MAX_TRACKED_BUCKETS = 50_000;
    private static final Duration EVICTION_AFTER_IDLE = Duration.ofMinutes(30);

    private final Map<String, BucketEntry> buckets = new ConcurrentHashMap<>();

    public void check(String operation, String key, int capacity, Duration period) {
        consume(
                bucket("general", operation + ":" + key, capacity, period),
                "Too many requests. Please try again later."
        );
    }

    public void checkRegister(String ipAddress) {
        check("register", ipAddress, REGISTER_CAPACITY, REGISTER_WINDOW);
    }

    public void checkForgotPassword(String ipAddress) {
        check("forgot", ipAddress, FORGOT_PASSWORD_CAPACITY, FORGOT_PASSWORD_WINDOW);
    }

    /**
     * Login protection combines client burst control and per-account failure control.
     * The IP bucket is consumed for every attempt; the account bucket is consumed only
     * after invalid credentials are observed.
     */
    public void checkLogin(String ipAddress, String normalizedEmail) {
        consume(
                bucket("login-ip", ipAddress, LOGIN_IP_CAPACITY, LOGIN_IP_WINDOW),
                "Too many login attempts from this client. Please try again later."
        );

        Bucket accountBucket = bucket(
                "login-account",
                normalizedEmail,
                LOGIN_ACCOUNT_FAILURE_CAPACITY,
                LOGIN_ACCOUNT_FAILURE_WINDOW
        );

        if (accountBucket.getAvailableTokens() == 0) {
            throw new RateLimitExceededException(
                    "Too many failed login attempts for this account. Please try again later.",
                    LOGIN_ACCOUNT_FAILURE_WINDOW.toSeconds()
            );
        }
    }

    /** Record one failed credential attempt against the account bucket. */
    public void recordLoginFailure(String normalizedEmail) {
        consume(
                bucket("login-account", normalizedEmail, LOGIN_ACCOUNT_FAILURE_CAPACITY, LOGIN_ACCOUNT_FAILURE_WINDOW),
                "Too many failed login attempts for this account. Please try again later."
        );
    }

    /** Successful authentication clears the account failure window. */
    public void clearLoginFailures(String normalizedEmail) {
        buckets.remove(bucketKey("login-account", normalizedEmail));
    }

    public long getLoginIpLimit() {
        return LOGIN_IP_CAPACITY;
    }

    public long getLoginAccountFailureLimit() {
        return LOGIN_ACCOUNT_FAILURE_CAPACITY;
    }

    public long getRegisterLimit() {
        return REGISTER_CAPACITY;
    }

    public long getForgotPasswordLimit() {
        return FORGOT_PASSWORD_CAPACITY;
    }

    /**
     * Periodically remove idle entries so a large number of distinct IPs/emails cannot
     * grow the in-memory map forever on a single instance.
     */
    @Scheduled(fixedDelay = 300_000)
    public void cleanupIdleBuckets() {
        long cutoff = System.nanoTime() - EVICTION_AFTER_IDLE.toNanos();
        buckets.entrySet().removeIf(entry -> entry.getValue().lastAccessNanos() < cutoff);
    }

    private Bucket bucket(String namespace, String key, int capacity, Duration period) {
        String bucketKey = bucketKey(namespace, key);
        BucketEntry existing = buckets.get(bucketKey);
        if (existing != null) {
            existing.touch();
            return existing.bucket();
        }

        enforceBound();
        BucketEntry created = new BucketEntry(
                Bucket.builder()
                        .addLimit(Bandwidth.classic(capacity, Refill.intervally(capacity, period)))
                        .build(),
                System.nanoTime()
        );
        BucketEntry previous = buckets.putIfAbsent(bucketKey, created);
        return previous == null ? created.bucket() : previous.touch().bucket();
    }

    private void enforceBound() {
        if (buckets.size() < MAX_TRACKED_BUCKETS) return;

        String oldestKey = null;
        long oldestAccess = Long.MAX_VALUE;
        for (Map.Entry<String, BucketEntry> entry : buckets.entrySet()) {
            long lastAccess = entry.getValue().lastAccessNanos();
            if (lastAccess < oldestAccess) {
                oldestAccess = lastAccess;
                oldestKey = entry.getKey();
            }
        }
        if (oldestKey != null) {
            buckets.remove(oldestKey);
        }
    }

    private void consume(Bucket bucket, String message) {
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            long retryAfterSeconds = Math.max(
                    1,
                    (long) Math.ceil(probe.getNanosToWaitForRefill() / 1_000_000_000.0)
            );
            throw new RateLimitExceededException(message, retryAfterSeconds);
        }
    }

    private String bucketKey(String namespace, String key) {
        return namespace + ":" + key;
    }

    private static final class BucketEntry {
        private final Bucket bucket;
        private volatile long lastAccessNanos;

        private BucketEntry(Bucket bucket, long lastAccessNanos) {
            this.bucket = bucket;
            this.lastAccessNanos = lastAccessNanos;
        }

        private Bucket bucket() {
            return bucket;
        }

        private BucketEntry touch() {
            lastAccessNanos = System.nanoTime();
            return this;
        }

        private long lastAccessNanos() {
            return lastAccessNanos;
        }
    }
}
