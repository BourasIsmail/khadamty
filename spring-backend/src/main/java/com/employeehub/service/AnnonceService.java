package com.employeehub.service;

import com.employeehub.model.Annonce;
import com.employeehub.repository.AnnonceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des annonces
 */
@Service
@Transactional
public class AnnonceService {

    @Autowired
    private AnnonceRepository annonceRepository;

    /**
     * Créer une nouvelle annonce
     */
    public Annonce createAnnonce(Annonce annonce) {
        return annonceRepository.save(annonce);
    }

    /**
     * Récupérer toutes les annonces
     */
    public List<Annonce> getAllAnnonces() {
        return annonceRepository.findAll();
    }

    /**
     * Récupérer une annonce par ID
     */
    public Optional<Annonce> getAnnonceById(String id) {
        return annonceRepository.findById(id);
    }

    /**
     * Récupérer les annonces actives
     */
    public List<Annonce> getAnnoncesActives() {
        return annonceRepository.findByEstActiveTrue();
    }

    /**
     * Récupérer les annonces actives triées par date
     */
    public List<Annonce> getAnnoncesActivesOrderByDate() {
        return annonceRepository.findByEstActiveTrueOrderByPublieLeDesc();
    }

    /**
     * Récupérer les annonces actives et non expirées
     */
    public List<Annonce> getAnnoncesActiveAndNotExpired() {
        return annonceRepository.findActiveAndNotExpired(LocalDateTime.now());
    }

    /**
     * Récupérer les annonces créées par un utilisateur
     */
    public List<Annonce> getAnnoncesByCreateur(Long userId) {
        return annonceRepository.findByCreeParId(userId);
    }

    /**
     * Mettre à jour une annonce
     */
    public Annonce updateAnnonce(String id, Annonce annonceDetails) {
        Annonce annonce = annonceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));

        annonce.setTitre(annonceDetails.getTitre());
        annonce.setMessage(annonceDetails.getMessage());
        annonce.setEstActive(annonceDetails.getEstActive());
        annonce.setExpireLe(annonceDetails.getExpireLe());

        return annonceRepository.save(annonce);
    }

    /**
     * Activer une annonce
     */
    public Annonce activerAnnonce(String id) {
        Annonce annonce = annonceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));
        
        annonce.setEstActive(true);
        return annonceRepository.save(annonce);
    }

    /**
     * Désactiver une annonce
     */
    public Annonce desactiverAnnonce(String id) {
        Annonce annonce = annonceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));
        
        annonce.setEstActive(false);
        return annonceRepository.save(annonce);
    }

    /**
     * Supprimer une annonce
     */
    public void deleteAnnonce(String id) {
        annonceRepository.deleteById(id);
    }

    /**
     * Compter toutes les annonces
     */
    public long countAllAnnonces() {
        return annonceRepository.count();
    }
}
