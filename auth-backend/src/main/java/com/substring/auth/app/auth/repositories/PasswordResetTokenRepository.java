package com.substring.auth.app.auth.repositories; import com.substring.auth.app.auth.entities.PasswordResetToken; import org.springframework.data.jpa.repository.JpaRepository; import java.time.Instant; import java.util.*;
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,UUID>{
 Optional<PasswordResetToken> findByTokenHash(String tokenHash); void deleteByUserId(UUID userId); long deleteByExpiresAtBefore(Instant now);
}
