package com.employeehub.service;

import com.employeehub.model.PieceJointe;
import com.employeehub.repository.PieceJointeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des pièces jointes
 */
@Service
@Transactional
public class PieceJointeService {

    @Autowired
    private PieceJointeRepository pieceJointeRepository;

    /**
     * Créer une nouvelle pièce jointe
     */
    public PieceJointe createPieceJointe(PieceJointe pieceJointe) {
        return pieceJointeRepository.save(pieceJointe);
    }

    /**
     * Récupérer toutes les pièces jointes
     */
    public List<PieceJointe> getAllPiecesJointes() {
        return pieceJointeRepository.findAll();
    }

    /**
     * Récupérer une pièce jointe par ID
     */
    public Optional<PieceJointe> getPieceJointeById(String id) {
        return pieceJointeRepository.findById(id);
    }

    /**
     * Récupérer les pièces jointes d'une demande
     */
    public List<PieceJointe> getPiecesJointesByDemande(String demandeId) {
        return pieceJointeRepository.findByDemandeId(demandeId);
    }

    /**
     * Récupérer les pièces jointes par nom de fichier
     */
    public List<PieceJointe> getPiecesJointesByNomFichier(String nomFichier) {
        return pieceJointeRepository.findByNomFichier(nomFichier);
    }

    /**
     * Récupérer les pièces jointes par type MIME
     */
    public List<PieceJointe> getPiecesJointesByTypeMime(String typeMime) {
        return pieceJointeRepository.findByTypeMime(typeMime);
    }

    /**
     * Mettre à jour une pièce jointe
     */
    public PieceJointe updatePieceJointe(String id, PieceJointe pieceJointeDetails) {
        PieceJointe pieceJointe = pieceJointeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pièce jointe non trouvée avec l'ID: " + id));

        pieceJointe.setDemande(pieceJointeDetails.getDemande());
        pieceJointe.setNomFichier(pieceJointeDetails.getNomFichier());
        pieceJointe.setCheminFichier(pieceJointeDetails.getCheminFichier());
        pieceJointe.setTypeMime(pieceJointeDetails.getTypeMime());
        pieceJointe.setTailleOctets(pieceJointeDetails.getTailleOctets());
        pieceJointe.setDescription(pieceJointeDetails.getDescription());

        return pieceJointeRepository.save(pieceJointe);
    }

    /**
     * Supprimer une pièce jointe
     */
    public void deletePieceJointe(String id) {
        pieceJointeRepository.deleteById(id);
    }

    /**
     * Supprimer toutes les pièces jointes d'une demande
     */
    public void deletePiecesJointesByDemande(String demandeId) {
        pieceJointeRepository.deleteByDemandeId(demandeId);
    }

    /**
     * Compter les pièces jointes d'une demande
     */
    public long countByDemande(String demandeId) {
        return pieceJointeRepository.countByDemandeId(demandeId);
    }
}
