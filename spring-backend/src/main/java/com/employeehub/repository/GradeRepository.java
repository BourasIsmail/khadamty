package com.employeehub.repository;

import com.employeehub.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, String> {
    
    Optional<Grade> findByCode(Integer code);
    
    boolean existsByCode(Integer code);
}
