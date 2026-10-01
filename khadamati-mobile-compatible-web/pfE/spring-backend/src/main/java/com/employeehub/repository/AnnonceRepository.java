package com.employeehub.repository;

import com.employeehub.model.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, String> {
    
    List<Annonce> findByEstActiveTrue();
    
    List<Annonce> findByEstActiveTrueOrderByPublieLeDesc();
    
    @Query("SELECT a FROM Annonce a WHERE a.estActive = true AND (a.expireLe IS NULL OR a.expireLe > :now) ORDER BY a.publieLe DESC")
    List<Annonce> findActiveAndNotExpired(LocalDateTime now);
    
    List<Annonce> findByCreeParId(Long userId);
}
