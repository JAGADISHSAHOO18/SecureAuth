package com.substring.auth.app.auth.payload; import jakarta.validation.constraints.Size;
public record UpdateProfileRequest(@Size(min=2,max=120,message="Name must be 2-120 characters")String name,@Size(max=1000,message="Image URL is too long")String image){}
