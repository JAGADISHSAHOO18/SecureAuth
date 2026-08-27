package com.substring.auth.app.auth.payload; import jakarta.validation.constraints.*;
public record ResetPasswordRequest(@NotBlank String token,@NotBlank@Size(min=8,max=72,message="Password must be 8-72 characters")String newPassword){}
