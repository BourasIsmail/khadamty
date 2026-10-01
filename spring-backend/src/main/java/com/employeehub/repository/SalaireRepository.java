package com.employeehub.repository;

import com.employeehub.model.Salaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaireRepository extends JpaRepository<Salaire, String> {
    
    List<Salaire> findByEmployeeId(Long employeeId);
    
    Optional<Salaire> findByEmployeeIdAndAnneeAndMois(Long employeeId, Short annee, Byte mois);
    
    List<Salaire> findByAnneeAndMois(Short annee, Byte mois);
    
    List<Salaire> findByEmployeeIdAndAnnee(Long employeeId, Short annee);
    
    boolean existsByEmployeeIdAndAnneeAndMois(Long employeeId, Short annee, Byte mois);
}
