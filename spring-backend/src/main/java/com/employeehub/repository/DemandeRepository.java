package com.employeehub.repository;

import com.employeehub.model.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Demande
 */
@Repository
public interface DemandeRepository extends JpaRepository<Demande, String> {

    /**
     * Trouver une demande par son numéro
     */
    Optional<Demande> findByNumero(String numero);

    /**
     * Vérifier si un numéro de demande existe
     */
    boolean existsByNumero(String numero);

    /**
     * Trouver toutes les demandes d'un employé
     */
    List<Demande> findByEmployeeId(Long employeeId);

    /**
     * Trouver les demandes par type
     */
    List<Demande> findByTypeDemandeId(String typeDemandeId);

    /**
     * Trouver les demandes par statut
     */
    List<Demande> findByStatut(Demande.StatutDemande statut);

    /**
     * Trouver les demandes d'un employé par statut
     */
    List<Demande> findByEmployeeIdAndStatut(Long employeeId, Demande.StatutDemande statut);

    /**
     * Trouver les demandes créées entre deux dates
     */
    List<Demande> findByCreeLeBetween(java.time.LocalDateTime dateDebut, java.time.LocalDateTime dateFin);

    /**
     * Trouver les demandes en attente
     */
    @Query("SELECT d FROM Demande d WHERE d.statut = 'EN_ATTENTE' ORDER BY d.creeLe ASC")
    List<Demande> findDemandesEnAttente();

    /**
     * Trouver les demandes d'un employé pour une période
     */
    @Query("SELECT d FROM Demande d WHERE d.employee.id = :employeeId " +
           "AND d.dateDebut <= :dateFin AND d.dateFin >= :dateDebut")
    List<Demande> findDemandesByEmployeeAndPeriode(
        @Param("employeeId") Long employeeId,
        @Param("dateDebut") LocalDate dateDebut,
        @Param("dateFin") LocalDate dateFin
    );

    /**
     * Compter les demandes par statut
     */
    long countByStatut(Demande.StatutDemande statut);

    /**
     * Compter les demandes d'un employé
     */
    long countByEmployeeId(Long employeeId);
}
