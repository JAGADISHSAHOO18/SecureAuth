package com.substring.auth.app.auth.entities;
import jakarta.persistence.*; import lombok.*; import org.springframework.security.core.GrantedAuthority; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.userdetails.UserDetails;
import java.time.Instant; import java.util.*;
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder @Entity
@Table(name="users",indexes=@Index(name="users_email_idx",columnList="user_email",unique=true))
public class User implements UserDetails{
 @Id @GeneratedValue(strategy=GenerationType.UUID) @Column(name="user_id") private UUID id;
 @Column(name="user_email",unique=true,nullable=false,length=300) private String email;
 @Column(name="user_name",nullable=false,length=120) private String name;
 private String password; private String image;
 @Column(nullable=false) private boolean enable=true;
 @Column(nullable=false) private boolean emailVerified=false;
 @Column(nullable=false,updatable=false) private Instant createdAt;
 @Column(nullable=false) private Instant updatedAt;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Provider provider=Provider.LOCAL;
 private String providerId;
 @ManyToMany(fetch=FetchType.EAGER) @JoinTable(name="user_roles",joinColumns=@JoinColumn(name="user_id"),inverseJoinColumns=@JoinColumn(name="role_id"))
 @Builder.Default private Set<Role> roles=new HashSet<>();
 @PrePersist void create(){Instant now=Instant.now();if(createdAt==null)createdAt=now;if(updatedAt==null)updatedAt=now;}
 @PreUpdate void update(){updatedAt=Instant.now();}
 @Override public Collection<? extends GrantedAuthority> getAuthorities(){return roles==null?List.of():roles.stream().map(r->new SimpleGrantedAuthority(r.getName())).toList();}
 @Override public String getUsername(){return email;} @Override public boolean isAccountNonExpired(){return true;} @Override public boolean isAccountNonLocked(){return true;} @Override public boolean isCredentialsNonExpired(){return true;} @Override public boolean isEnabled(){return enable;}
}
