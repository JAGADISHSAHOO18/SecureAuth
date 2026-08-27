package com.substring.auth.app.auth.payload; import jakarta.validation.constraints.*;
public record EmailRequest(@NotBlank(message="Email is required")@Email(message="Enter a valid email")String email){}
