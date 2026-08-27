package com.substring.auth.app.auth.entities;
import jakarta.persistence.*; import lombok.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="password_reset_tokens",indexes={@Index(name="password_reset_token_hash_idx",columnList="token_hash",unique=true)})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PasswordResetToken{
 @Id @GeneratedValue(strategy=GenerationType.UUID)private UUID id;
 @Column(name="token_hash",nullable=false,unique=true,length=64)private String tokenHash;
 @ManyToOne(optional=false,fetch=FetchType.LAZY)@JoinColumn(name="user_id",nullable=false)private User user;
 @Column(nullable=false)private Instant expiresAt;@Column(nullable=false)private boolean used;@Column(nullable=false,updatable=false)private Instant createdAt;
}
