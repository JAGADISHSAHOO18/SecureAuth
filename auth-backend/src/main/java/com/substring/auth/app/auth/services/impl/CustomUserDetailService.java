package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.repositories.UserRepository; import lombok.RequiredArgsConstructor; import org.springframework.security.core.userdetails.*; import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor public class CustomUserDetailService implements UserDetailsService{private final UserRepository repo;public UserDetails loadUserByUsername(String email)throws UsernameNotFoundException{return repo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Invalid email or password"));}}
