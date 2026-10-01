package com.employeehub.repository;

import com.employeehub.model.PieceJointe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité PieceJointe
 */
@Repository
public interface PieceJointeRepository extends JpaRepository<PieceJointe, String> {

    /**
     * Trouver toutes les pièces jointes d'une demande
     */
    List<PieceJointe> findByDemandeId(String demandeId);

    /**
     * Trouver une pièce jointe par nom de fichier
     */
    List<PieceJointe> findByNomFichier(String nomFichier);

    /**
     * Trouver les pièces jointes par type MIME
     */
    List<PieceJointe> findByTypeMime(String typeMime);

    /**
     * Compter le nombre de pièces jointes d'une demande
     */
    long countByDemandeId(String demandeId);

    /**
     * Supprimer toutes les pièces jointes d'une demande
     */
    void deleteByDemandeId(String demandeId);
}
