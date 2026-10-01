package com.employeehub.repository;

import com.employeehub.model.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StructureRepository extends JpaRepository<Structure, String> {
    
    Optional<Structure> findByCode(String code);
    
    List<Structure> findByDelegationId(String delegationId);
    
    List<Structure> findByParentId(String parentId);
    
    List<Structure> findByEstActiveTrue();
    
    List<Structure> findByType(Structure.TypeStructure type);
    
    boolean existsByCode(String code);
}
