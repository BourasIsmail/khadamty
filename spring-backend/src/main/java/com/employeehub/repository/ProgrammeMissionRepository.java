package com.employeehub.repository;

import com.employeehub.model.ProgrammeMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammeMissionRepository extends JpaRepository<ProgrammeMission, String> {
    
    Optional<ProgrammeMission> findByCode(String code);
    
    List<ProgrammeMission> findByEstActifTrue();
    
    boolean existsByCode(String code);
}
