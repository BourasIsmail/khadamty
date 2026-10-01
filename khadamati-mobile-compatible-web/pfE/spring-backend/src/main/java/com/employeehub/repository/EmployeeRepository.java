package com.employeehub.repository;

import com.employeehub.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByIsActive(boolean isActive);
    
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName);
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
    
    // Méthodes pour les statistiques
    long countByStatus(String status);
    
    long countByCreatedAtAfter(LocalDateTime date);
}
