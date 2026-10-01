package com.employeehub.repository;

import com.employeehub.model.OrdreMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité OrdreMission
 */
@Repository
public interface OrdreMissionRepository extends JpaRepository<OrdreMission, String> {

    /**
     * Trouver un ordre de mission par son numéro
     */
    Optional<OrdreMission> findByNumero(String numero);

    /**
     * Vérifier si un numéro d'ordre de mission existe
     */
    boolean existsByNumero(String numero);

    /**
     * Trouver tous les ordres de mission d'un employé
     */
    List<OrdreMission> findByEmployeeId(Long employeeId);

    /**
     * Trouver les ordres de mission par statut
     */
    List<OrdreMission> findByStatut(OrdreMission.StatutOrdreMission statut);

    /**
     * Trouver les ordres de mission d'un employé par statut
     */
    List<OrdreMission> findByEmployeeIdAndStatut(Long employeeId, OrdreMission.StatutOrdreMission statut);

    /**
     * Trouver les ordres de mission par programme
     */
    List<OrdreMission> findByProgrammeId(String programmeId);

    /**
     * Trouver les ordres de mission par moyen de transport
     */
    List<OrdreMission> findByMoyenTransportId(String moyenTransportId);

    /**
     * Trouver les ordres de mission pour une période de départ
     */
    List<OrdreMission> findByDateDepartBetween(LocalDate dateDebut, LocalDate dateFin);

    /**
     * Trouver les ordres de mission en cours
     */
    @Query("SELECT om FROM OrdreMission om WHERE om.statut = 'EN_COURS' " +
           "AND om.dateDepart <= :today AND om.dateRetour >= :today")
    List<OrdreMission> findOrdreMissionsEnCours(@Param("today") LocalDate today);

    /**
     * Trouver les ordres de mission d'un employé pour une période
     */
    @Query("SELECT om FROM OrdreMission om WHERE om.employee.id = :employeeId " +
           "AND om.dateDepart <= :dateFin AND om.dateRetour >= :dateDebut")
    List<OrdreMission> findOrdreMissionsByEmployeeAndPeriode(
        @Param("employeeId") Long employeeId,
        @Param("dateDebut") LocalDate dateDebut,
        @Param("dateFin") LocalDate dateFin
    );

    /**
     * Calculer le montant total des ordres de mission d'un employé
     */
    @Query("SELECT SUM(om.montantTotal) FROM OrdreMission om WHERE om.employee.id = :employeeId " +
           "AND om.statut = 'APPROUVE'")
    Double calculateTotalMontantByEmployee(@Param("employeeId") Long employeeId);

    /**
     * Compter les ordres de mission par statut
     */
    long countByStatut(OrdreMission.StatutOrdreMission statut);

    /**
     * Compter les ordres de mission d'un employé
     */
    long countByEmployeeId(Long employeeId);
}
