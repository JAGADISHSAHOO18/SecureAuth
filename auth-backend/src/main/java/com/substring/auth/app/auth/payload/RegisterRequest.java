package com.substring.auth.app.auth.payload;
import jakarta.validation.constraints.*; 
public record RegisterRequest(@NotBlank(message="Name is required")@Size(min=2,max=120,message="Name must be 2-120 characters")String name,
@NotBlank(message="Email is required")@Email(message="Enter a valid email")String email,
@NotBlank(message="Password is required")@Size(min=8,max=72,message="Password must be 8-72 characters")String password){}
