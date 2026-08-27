package com.substring.auth.app.auth.payload;
import com.substring.auth.app.auth.entities.Provider; import java.time.Instant; import java.util.Set; import java.util.UUID;
public record UserResponse(UUID id,String email,String name,String image,boolean enabled,boolean emailVerified,Instant createdAt,Instant updatedAt,Provider provider,Set<RoleDto> roles){}
