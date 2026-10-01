package com.employeehub.repository;

import com.employeehub.model.TypeDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypeDemandeRepository extends JpaRepository<TypeDemande, String> {
    
    Optional<TypeDemande> findByCode(String code);
    
    List<TypeDemande> findByEstActifTrue();
    
    boolean existsByCode(String code);
}
