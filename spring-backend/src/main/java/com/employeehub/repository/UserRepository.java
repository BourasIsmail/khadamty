package com.employeehub.repository;

import com.employeehub.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    Page<User> findByRole(User.Role role, Pageable pageable);
    
    List<User> findByIsActive(boolean isActive);
    
    boolean existsByEmail(String email);
    
    // Méthodes de recherche avec pagination
    Page<User> findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String email, String firstName, String lastName, Pageable pageable);
    
    Page<User> findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseAndRole(
        String email, String firstName, String lastName, User.Role role, Pageable pageable);
}
