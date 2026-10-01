package com.employeehub.service;

import com.employeehub.model.Demande;
import com.employeehub.repository.DemandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des demandes
 */
@Service
@Transactional
public class DemandeService {

    @Autowired
    private DemandeRepository demandeRepository;

    /**
     * Créer une nouvelle demande
     */
    public Demande createDemande(Demande demande) {
        return demandeRepository.save(demande);
    }

    /**
     * Récupérer toutes les demandes
     */
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    /**
     * Récupérer une demande par ID
     */
    public Optional<Demande> getDemandeById(String id) {
        return demandeRepository.findById(id);
    }

    /**
     * Récupérer une demande par numéro
     */
    public Optional<Demande> getDemandeByNumero(String numero) {
        return demandeRepository.findByNumero(numero);
    }

    /**
     * Récupérer les demandes d'un employé
     */
    public List<Demande> getDemandesByEmployee(Long employeeId) {
        return demandeRepository.findByEmployeeId(employeeId);
    }

    /**
     * Récupérer les demandes par type
     */
    public List<Demande> getDemandesByType(String typeDemandeId) {
        return demandeRepository.findByTypeDemandeId(typeDemandeId);
    }

    /**
     * Récupérer les demandes par statut
     */
    public List<Demande> getDemandesByStatut(Demande.StatutDemande statut) {
        return demandeRepository.findByStatut(statut);
    }

    /**
     * Récupérer les demandes d'un employé par statut
     */
    public List<Demande> getDemandesByEmployeeAndStatut(Long employeeId, Demande.StatutDemande statut) {
        return demandeRepository.findByEmployeeIdAndStatut(employeeId, statut);
    }

    /**
     * Récupérer les demandes en attente
     */
    public List<Demande> getDemandesEnAttente() {
        return demandeRepository.findDemandesEnAttente();
    }

    /**
     * Récupérer les demandes d'un employé pour une période
     */
    public List<Demande> getDemandesByEmployeeAndPeriode(Long employeeId, LocalDate dateDebut, LocalDate dateFin) {
        return demandeRepository.findDemandesByEmployeeAndPeriode(employeeId, dateDebut, dateFin);
    }

    /**
     * Mettre à jour une demande
     */
    public Demande updateDemande(String id, Demande demandeDetails) {
        Demande demande = demandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée avec l'ID: " + id));

        demande.setEmployee(demandeDetails.getEmployee());
        demande.setTypeDemande(demandeDetails.getTypeDemande());
        demande.setNumero(demandeDetails.getNumero());
        demande.setObjet(demandeDetails.getObjet());
        demande.setDescription(demandeDetails.getDescription());
        demande.setDateDebut(demandeDetails.getDateDebut());
        demande.setDateFin(demandeDetails.getDateFin());
        demande.setDureeJours(demandeDetails.getDureeJours());
        demande.setStatut(demandeDetails.getStatut());
        demande.setDateTraitement(demandeDetails.getDateTraitement());
        demande.setTraiteePar(demandeDetails.getTraiteePar());
        demande.setMotifRejet(demandeDetails.getMotifRejet());
        demande.setObservations(demandeDetails.getObservations());

        return demandeRepository.save(demande);
    }

    /**
     * Approuver une demande
     */
    public Demande approveDemande(String id, String traiteePar) {
        Demande demande = demandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée avec l'ID: " + id));
        
        demande.setStatut(Demande.StatutDemande.APPROUVEE);
        demande.setDateTraitement(LocalDate.now());
        demande.setTraiteePar(traiteePar);
        return demandeRepository.save(demande);
    }

    /**
     * Rejeter une demande
     */
    public Demande rejectDemande(String id, String traiteePar, String motifRejet) {
        Demande demande = demandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée avec l'ID: " + id));
        
        demande.setStatut(Demande.StatutDemande.REJETEE);
        demande.setDateTraitement(LocalDate.now());
        demande.setTraiteePar(traiteePar);
        demande.setMotifRejet(motifRejet);
        return demandeRepository.save(demande);
    }

    /**
     * Supprimer une demande
     */
    public void deleteDemande(String id) {
        demandeRepository.deleteById(id);
    }

    /**
     * Vérifier si un numéro de demande existe
     */
    public boolean existsByNumero(String numero) {
        return demandeRepository.existsByNumero(numero);
    }

    /**
     * Compter les demandes par statut
     */
    public long countByStatut(Demande.StatutDemande statut) {
        return demandeRepository.countByStatut(statut);
    }

    /**
     * Compter les demandes d'un employé
     */
    public long countByEmployee(Long employeeId) {
        return demandeRepository.countByEmployeeId(employeeId);
    }
}
