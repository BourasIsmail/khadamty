package com.employeehub.repository;

import com.employeehub.model.MoyenTransport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MoyenTransportRepository extends JpaRepository<MoyenTransport, String> {
    
    Optional<MoyenTransport> findByCode(String code);
    
    List<MoyenTransport> findByEstActifTrue();
    
    boolean existsByCode(String code);
}
