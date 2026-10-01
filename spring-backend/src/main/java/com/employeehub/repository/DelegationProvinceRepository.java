package com.employeehub.repository;

import com.employeehub.model.DelegationProvince;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DelegationProvinceRepository extends JpaRepository<DelegationProvince, String> {
    
    Optional<DelegationProvince> findByCodeProvince(String codeProvince);
    
    List<DelegationProvince> findByCoordinationId(String coordinationId);
    
    List<DelegationProvince> findByEstActiveTrue();
    
    boolean existsByCodeProvince(String codeProvince);
}
