package com.employeehub.repository;

import com.employeehub.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, String> {
    
    List<Reclamation> findByEmployeeId(Long employeeId);
    
    List<Reclamation> findByStatut(Reclamation.StatutReclamation statut);
    
    List<Reclamation> findByTraiteParId(Long userId);
    
    List<Reclamation> findByEmployeeIdOrderByCreeLeDesc(Long employeeId);
    
    List<Reclamation> findByStatutOrderByCreeLeDesc(Reclamation.StatutReclamation statut);
}
