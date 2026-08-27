package com.substring.auth.app.auth.repositories;
import com.substring.auth.app.auth.entities.RefreshToken; import jakarta.persistence.LockModeType; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.time.Instant; import java.util.*;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,UUID>{
 Optional<RefreshToken> findByJti(String jti);
 @Lock(LockModeType.PESSIMISTIC_WRITE)@Query("select r from RefreshToken r where r.jti=:jti") Optional<RefreshToken> findByJtiForUpdate(@Param("jti")String jti);
 List<RefreshToken> findByUserIdAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(UUID userId,Instant now);
 void deleteByUserId(UUID userId); long deleteByExpiresAtBefore(Instant now);
}
