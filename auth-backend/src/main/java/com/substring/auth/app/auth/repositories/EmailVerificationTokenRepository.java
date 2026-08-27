package com.substring.auth.app.auth.repositories; import com.substring.auth.app.auth.entities.EmailVerificationToken; import org.springframework.data.jpa.repository.JpaRepository; import java.time.Instant; import java.util.*;
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken,UUID>{
 Optional<EmailVerificationToken> findByTokenHash(String tokenHash); void deleteByUserId(UUID userId); long deleteByExpiresAtBefore(Instant now);
}
