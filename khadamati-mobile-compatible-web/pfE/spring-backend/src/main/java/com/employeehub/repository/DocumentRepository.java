package com.employeehub.repository;

import com.employeehub.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Document
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {

    /**
     * Trouver un document par son numéro de référence
     */
    Optional<Document> findByNumeroReference(String numeroReference);

    /**
     * Trouver les documents par type
     */
    List<Document> findByTypeDocumentId(String typeDocumentId);

    /**
     * Trouver les documents publics
     */
    List<Document> findByEstPublicTrue();

    /**
     * Trouver les documents non archivés
     */
    List<Document> findByEstArchiveFalse();

    /**
     * Trouver les documents publics et non archivés
     */
    List<Document> findByEstPublicTrueAndEstArchiveFalse();

    /**
     * Trouver les documents par titre (recherche partielle)
     */
    List<Document> findByTitreContainingIgnoreCase(String titre);

    /**
     * Trouver les documents publiés entre deux dates
     */
    List<Document> findByDatePublicationBetween(LocalDate dateDebut, LocalDate dateFin);

    /**
     * Trouver les documents publiés par une personne
     */
    List<Document> findByPubliePar(String publiePar);

    /**
     * Trouver les documents les plus téléchargés
     */
    @Query("SELECT d FROM Document d WHERE d.estPublic = true AND d.estArchive = false " +
           "ORDER BY d.nbTelechargements DESC")
    List<Document> findTopDocuments();

    /**
     * Trouver les documents récents
     */
    @Query("SELECT d FROM Document d WHERE d.estPublic = true AND d.estArchive = false " +
           "ORDER BY d.datePublication DESC")
    List<Document> findRecentDocuments();

    /**
     * Compter les documents par type
     */
    long countByTypeDocumentId(String typeDocumentId);

    /**
     * Compter les documents publics
     */
    long countByEstPublicTrue();
}
