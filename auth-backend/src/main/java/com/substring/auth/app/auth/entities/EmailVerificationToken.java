package com.substring.auth.app.auth.entities;
import jakarta.persistence.*; import lombok.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="email_verification_tokens",indexes={@Index(name="email_verification_token_hash_idx",columnList="token_hash",unique=true)})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailVerificationToken{
 @Id @GeneratedValue(strategy=GenerationType.UUID)private UUID id;
 @Column(name="token_hash",nullable=false,unique=true,length=64)private String tokenHash;
 @ManyToOne(optional=false,fetch=FetchType.LAZY)@JoinColumn(name="user_id",nullable=false)private User user;
 @Column(nullable=false)private Instant expiresAt;@Column(nullable=false)private boolean used;@Column(nullable=false,updatable=false)private Instant createdAt;
}
