package com.employeehub.repository;

import com.employeehub.model.CoordinationRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoordinationRegionRepository extends JpaRepository<CoordinationRegion, String> {
    
    Optional<CoordinationRegion> findByCodeRegion(String codeRegion);
    
    List<CoordinationRegion> findByEstActiveTrue();
    
    boolean existsByCodeRegion(String codeRegion);
}
