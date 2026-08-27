package com.substring.auth.app.auth.repositories; import com.substring.auth.app.auth.entities.Role; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface RoleRepository extends JpaRepository<Role,UUID>{Optional<Role> findByName(String name);}
