package com.substring.auth.app.auth.entities;
import jakarta.persistence.*; import lombok.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="audit_logs",indexes=@Index(name="audit_logs_user_idx",columnList="user_id,created_at"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog{
 @Id @GeneratedValue(strategy=GenerationType.UUID)private UUID id;
 @ManyToOne(fetch=FetchType.LAZY)@JoinColumn(name="user_id")private User user;
 @Column(nullable=false,length=80)private String event;@Column(length=1000)private String details;@Column(length=64)private String ipAddress;@Column(length=500)private String userAgent;
 @Column(nullable=false,updatable=false)private Instant createdAt;@PrePersist void init(){if(createdAt==null)createdAt=Instant.now();}
}
