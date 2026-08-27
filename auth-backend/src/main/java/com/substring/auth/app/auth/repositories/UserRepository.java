package com.substring.auth.app.auth.repositories; import com.substring.auth.app.auth.entities.User; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface UserRepository extends JpaRepository<User,UUID>{Optional<User> findByEmail(String email);boolean existsByEmail(String email);}
