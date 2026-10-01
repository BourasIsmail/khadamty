package com.employeehub.service;

import com.employeehub.model.Reclamation;
import com.employeehub.model.User;
import com.employeehub.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des réclamations
 */
@Service
@Transactional
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    /**
     * Créer une nouvelle réclamation
     */
    public Reclamation createReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    /**
     * Récupérer toutes les réclamations
     */
    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    /**
     * Récupérer une réclamation par ID
     */
    public Optional<Reclamation> getReclamationById(String id) {
        return reclamationRepository.findById(id);
    }

    /**
     * Récupérer les réclamations d'un employé
     */
    public List<Reclamation> getReclamationsByEmployee(Long employeeId) {
        return reclamationRepository.findByEmployeeId(employeeId);
    }

    /**
     * Récupérer les réclamations d'un employé triées par date
     */
    public List<Reclamation> getReclamationsByEmployeeOrderByDate(Long employeeId) {
        return reclamationRepository.findByEmployeeIdOrderByCreeLeDesc(employeeId);
    }

    /**
     * Récupérer les réclamations par statut
     */
    public List<Reclamation> getReclamationsByStatut(Reclamation.StatutReclamation statut) {
        return reclamationRepository.findByStatut(statut);
    }

    /**
     * Récupérer les réclamations par statut triées par date
     */
    public List<Reclamation> getReclamationsByStatutOrderByDate(Reclamation.StatutReclamation statut) {
        return reclamationRepository.findByStatutOrderByCreeLeDesc(statut);
    }

    /**
     * Récupérer les réclamations traitées par un utilisateur
     */
    public List<Reclamation> getReclamationsByTraitePar(Long userId) {
        return reclamationRepository.findByTraiteParId(userId);
    }

    /**
     * Mettre à jour une réclamation
     */
    public Reclamation updateReclamation(String id, Reclamation reclamationDetails) {
        Reclamation reclamation = reclamationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'ID: " + id));

        reclamation.setObjet(reclamationDetails.getObjet());
        reclamation.setDescription(reclamationDetails.getDescription());
        reclamation.setStatut(reclamationDetails.getStatut());
        reclamation.setReponse(reclamationDetails.getReponse());

        return reclamationRepository.save(reclamation);
    }

    /**
     * Traiter une réclamation
     */
    public Reclamation traiterReclamation(String id, User traitePar, String reponse) {
        Reclamation reclamation = reclamationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'ID: " + id));
        
        reclamation.setStatut(Reclamation.StatutReclamation.en_cours);
        reclamation.setTraitePar(traitePar);
        reclamation.setReponse(reponse);
        return reclamationRepository.save(reclamation);
    }

    /**
     * Résoudre une réclamation
     */
    public Reclamation resoudreReclamation(String id, String reponse) {
        Reclamation reclamation = reclamationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'ID: " + id));
        
        reclamation.setStatut(Reclamation.StatutReclamation.resolue);
        reclamation.setReponse(reponse);
        return reclamationRepository.save(reclamation);
    }

    /**
     * Rejeter une réclamation
     */
    public Reclamation rejeterReclamation(String id, String reponse) {
        Reclamation reclamation = reclamationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'ID: " + id));
        
        reclamation.setStatut(Reclamation.StatutReclamation.rejetee);
        reclamation.setReponse(reponse);
        return reclamationRepository.save(reclamation);
    }

    /**
     * Supprimer une réclamation
     */
    public void deleteReclamation(String id) {
        reclamationRepository.deleteById(id);
    }

    /**
     * Compter toutes les réclamations
     */
    public long countAllReclamations() {
        return reclamationRepository.count();
    }
}
