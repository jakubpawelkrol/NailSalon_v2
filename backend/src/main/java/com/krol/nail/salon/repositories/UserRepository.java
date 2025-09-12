package com.krol.nail.salon.repositories;

import com.krol.nail.salon.entities.Role;
import com.krol.nail.salon.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u.role from User u WHERE u.email = :email")
    Role getRoleWithEmail(@Param("email") String email);
}
