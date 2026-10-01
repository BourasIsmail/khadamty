package com.employeehub.service;

import com.employeehub.model.OrdreMission;
import com.employeehub.repository.OrdreMissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des ordres de mission
 */
@Service
@Transactional
public class OrdreMissionService {

    @Autowired
    private OrdreMissionRepository ordreMissionRepository;

    /**
     * Créer un nouvel ordre de mission
     */
    public OrdreMission createOrdreMission(OrdreMission ordreMission) {
        return ordreMissionRepository.save(ordreMission);
    }

    /**
     * Récupérer tous les ordres de mission
     */
    public List<OrdreMission> getAllOrdreMissions() {
        return ordreMissionRepository.findAll();
    }

    /**
     * Récupérer un ordre de mission par ID
     */
    public Optional<OrdreMission> getOrdreMissionById(String id) {
        return ordreMissionRepository.findById(id);
    }

    /**
     * Récupérer un ordre de mission par numéro
     */
    public Optional<OrdreMission> getOrdreMissionByNumero(String numero) {
        return ordreMissionRepository.findByNumero(numero);
    }

    /**
     * Récupérer les ordres de mission d'un employé
     */
    public List<OrdreMission> getOrdreMissionsByEmployee(String employeeId) {
        return ordreMissionRepository.findByEmployeeId(Long.parseLong(employeeId));
    }

    /**
     * Récupérer les ordres de mission par statut
     */
    public List<OrdreMission> getOrdreMissionsByStatut(OrdreMission.StatutOrdreMission statut) {
        return ordreMissionRepository.findByStatut(statut);
    }

    /**
     * Récupérer les ordres de mission d'un employé par statut
     */
    public List<OrdreMission> getOrdreMissionsByEmployeeAndStatut(String employeeId, OrdreMission.StatutOrdreMission statut) {
        return ordreMissionRepository.findByEmployeeIdAndStatut(Long.parseLong(employeeId), statut);
    }

    /**
     * Récupérer les ordres de mission par programme
     */
    public List<OrdreMission> getOrdreMissionsByProgramme(String programmeId) {
        return ordreMissionRepository.findByProgrammeId(programmeId);
    }

    /**
     * Récupérer les ordres de mission par moyen de transport
     */
    public List<OrdreMission> getOrdreMissionsByMoyenTransport(String moyenTransportId) {
        return ordreMissionRepository.findByMoyenTransportId(moyenTransportId);
    }

    /**
     * Récupérer les ordres de mission pour une période
     */
    public List<OrdreMission> getOrdreMissionsByPeriode(LocalDate dateDebut, LocalDate dateFin) {
        return ordreMissionRepository.findByDateDepartBetween(dateDebut, dateFin);
    }

    /**
     * Récupérer les ordres de mission en cours
     */
    public List<OrdreMission> getOrdreMissionsEnCours() {
        return ordreMissionRepository.findOrdreMissionsEnCours(LocalDate.now());
    }

    /**
     * Récupérer les ordres de mission d'un employé pour une période
     */
    public List<OrdreMission> getOrdreMissionsByEmployeeAndPeriode(String employeeId, LocalDate dateDebut, LocalDate dateFin) {
        return ordreMissionRepository.findOrdreMissionsByEmployeeAndPeriode(Long.parseLong(employeeId), dateDebut, dateFin);
    }

    /**
     * Calculer le montant total des ordres de mission d'un employé
     */
    public Double calculateTotalMontantByEmployee(String employeeId) {
        Double total = ordreMissionRepository.calculateTotalMontantByEmployee(Long.parseLong(employeeId));
        return total != null ? total : 0.0;
    }

    /**
     * Mettre à jour un ordre de mission
     */
    public OrdreMission updateOrdreMission(String id, OrdreMission ordreMissionDetails) {
        OrdreMission ordreMission = ordreMissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));

        ordreMission.setEmployee(ordreMissionDetails.getEmployee());
        ordreMission.setProgramme(ordreMissionDetails.getProgramme());
        ordreMission.setMoyenTransport(ordreMissionDetails.getMoyenTransport());
        ordreMission.setNumero(ordreMissionDetails.getNumero());
        ordreMission.setObjet(ordreMissionDetails.getObjet());
        ordreMission.setLieuDepart(ordreMissionDetails.getLieuDepart());
        ordreMission.setLieuArrivee(ordreMissionDetails.getLieuArrivee());
        ordreMission.setDateDepart(ordreMissionDetails.getDateDepart());
        ordreMission.setDateRetour(ordreMissionDetails.getDateRetour());
        ordreMission.setDureeJours(ordreMissionDetails.getDureeJours());
        ordreMission.setMontantIndemnite(ordreMissionDetails.getMontantIndemnite());
        ordreMission.setMontantTransport(ordreMissionDetails.getMontantTransport());
        ordreMission.setMontantHebergement(ordreMissionDetails.getMontantHebergement());
        ordreMission.setMontantTotal(ordreMissionDetails.getMontantTotal());
        ordreMission.setStatut(ordreMissionDetails.getStatut());
        ordreMission.setDateValidation(ordreMissionDetails.getDateValidation());
        ordreMission.setValidateur(ordreMissionDetails.getValidateur());
        ordreMission.setObservations(ordreMissionDetails.getObservations());

        return ordreMissionRepository.save(ordreMission);
    }

    /**
     * Approuver un ordre de mission
     */
    public OrdreMission approveOrdreMission(String id, String validateur) {
        OrdreMission ordreMission = ordreMissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
        
        ordreMission.setStatut(OrdreMission.StatutOrdreMission.APPROUVE);
        ordreMission.setDateValidation(LocalDate.now());
        ordreMission.setValidateur(validateur);
        return ordreMissionRepository.save(ordreMission);
    }

    /**
     * Rejeter un ordre de mission
     */
    public OrdreMission rejectOrdreMission(String id, String validateur, String observations) {
        OrdreMission ordreMission = ordreMissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
        
        ordreMission.setStatut(OrdreMission.StatutOrdreMission.REJETE);
        ordreMission.setDateValidation(LocalDate.now());
        ordreMission.setValidateur(validateur);
        ordreMission.setObservations(observations);
        return ordreMissionRepository.save(ordreMission);
    }

    /**
     * Supprimer un ordre de mission
     */
    public void deleteOrdreMission(String id) {
        ordreMissionRepository.deleteById(id);
    }

    /**
     * Vérifier si un numéro d'ordre de mission existe
     */
    public boolean existsByNumero(String numero) {
        return ordreMissionRepository.existsByNumero(numero);
    }

    /**
     * Compter les ordres de mission par statut
     */
    public long countByStatut(OrdreMission.StatutOrdreMission statut) {
        return ordreMissionRepository.countByStatut(statut);
    }

    /**
     * Compter les ordres de mission d'un employé
     */
    public long countByEmployee(String employeeId) {
        return ordreMissionRepository.countByEmployeeId(Long.parseLong(employeeId));
    }
}
