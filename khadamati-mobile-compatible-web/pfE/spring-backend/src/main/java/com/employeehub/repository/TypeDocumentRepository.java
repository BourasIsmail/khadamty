package com.employeehub.repository;

import com.employeehub.model.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeDocumentRepository extends JpaRepository<TypeDocument, String> {
    
    Optional<TypeDocument> findByLibelle(String libelle);
    
    boolean existsByLibelle(String libelle);
}
