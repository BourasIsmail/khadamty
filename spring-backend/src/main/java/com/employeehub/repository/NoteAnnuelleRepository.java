package com.employeehub.repository;

import com.employeehub.model.NoteAnnuelle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteAnnuelleRepository extends JpaRepository<NoteAnnuelle, String> {
    
    List<NoteAnnuelle> findByEmployeeId(Long employeeId);
    
    Optional<NoteAnnuelle> findByEmployeeIdAndAnnee(Long employeeId, Short annee);
    
    List<NoteAnnuelle> findByAnnee(Short annee);
    
    List<NoteAnnuelle> findBySaisieParId(Long userId);
    
    boolean existsByEmployeeIdAndAnnee(Long employeeId, Short annee);
}
