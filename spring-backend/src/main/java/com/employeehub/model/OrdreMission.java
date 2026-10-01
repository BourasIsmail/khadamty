package com.employeehub.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité OrdreMission - Ordres de mission des employés
 */
@Entity
@Table(name = "ordre_mission")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrdreMission {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programme_id")
    private ProgrammeMission programme;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moyen_transport_id")
    private MoyenTransport moyenTransport;

    @Column(name = "numero", length = 50, nullable = false, unique = true)
    private String numero;

    @Column(name = "objet", columnDefinition = "TEXT", nullable = false)
    private String objet;

    @Column(name = "lieu_depart", length = 200, nullable = false)
    private String lieuDepart;

    @Column(name = "lieu_arrivee", length = 200, nullable = false)
    private String lieuArrivee;

    @Column(name = "date_depart", nullable = false)
    private LocalDate dateDepart;

    @Column(name = "date_retour", nullable = false)
    private LocalDate dateRetour;

    @Column(name = "duree_jours", nullable = false)
    private Integer dureeJours;

    @Column(name = "montant_indemnite", precision = 10, scale = 2)
    private BigDecimal montantIndemnite;

    @Column(name = "montant_transport", precision = 10, scale = 2)
    private BigDecimal montantTransport;

    @Column(name = "montant_hebergement", precision = 10, scale = 2)
    private BigDecimal montantHebergement;

    @Column(name = "montant_total", precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutOrdreMission statut = StatutOrdreMission.EN_ATTENTE;

    @Column(name = "date_validation")
    private LocalDate dateValidation;

    @Column(name = "validateur", length = 100)
    private String validateur;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "cree_le", nullable = false, updatable = false)
    private LocalDateTime creeLe;

    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;

    // Enum pour le statut
    public enum StatutOrdreMission {
        EN_ATTENTE,
        APPROUVE,
        REJETE,
        EN_COURS,
        TERMINE,
        ANNULE
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.modifieLe = LocalDateTime.now();
    }

    // Constructeurs
    public OrdreMission() {
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public ProgrammeMission getProgramme() {
        return programme;
    }

    public void setProgramme(ProgrammeMission programme) {
        this.programme = programme;
    }

    public MoyenTransport getMoyenTransport() {
        return moyenTransport;
    }

    public void setMoyenTransport(MoyenTransport moyenTransport) {
        this.moyenTransport = moyenTransport;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getObjet() {
        return objet;
    }

    public void setObjet(String objet) {
        this.objet = objet;
    }

    public String getLieuDepart() {
        return lieuDepart;
    }

    public void setLieuDepart(String lieuDepart) {
        this.lieuDepart = lieuDepart;
    }

    public String getLieuArrivee() {
        return lieuArrivee;
    }

    public void setLieuArrivee(String lieuArrivee) {
        this.lieuArrivee = lieuArrivee;
    }

    public LocalDate getDateDepart() {
        return dateDepart;
    }

    public void setDateDepart(LocalDate dateDepart) {
        this.dateDepart = dateDepart;
    }

    public LocalDate getDateRetour() {
        return dateRetour;
    }

    public void setDateRetour(LocalDate dateRetour) {
        this.dateRetour = dateRetour;
    }

    public Integer getDureeJours() {
        return dureeJours;
    }

    public void setDureeJours(Integer dureeJours) {
        this.dureeJours = dureeJours;
    }

    public BigDecimal getMontantIndemnite() {
        return montantIndemnite;
    }

    public void setMontantIndemnite(BigDecimal montantIndemnite) {
        this.montantIndemnite = montantIndemnite;
    }

    public BigDecimal getMontantTransport() {
        return montantTransport;
    }

    public void setMontantTransport(BigDecimal montantTransport) {
        this.montantTransport = montantTransport;
    }

    public BigDecimal getMontantHebergement() {
        return montantHebergement;
    }

    public void setMontantHebergement(BigDecimal montantHebergement) {
        this.montantHebergement = montantHebergement;
    }

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }

    public StatutOrdreMission getStatut() {
        return statut;
    }

    public void setStatut(StatutOrdreMission statut) {
        this.statut = statut;
    }

    public LocalDate getDateValidation() {
        return dateValidation;
    }

    public void setDateValidation(LocalDate dateValidation) {
        this.dateValidation = dateValidation;
    }

    public String getValidateur() {
        return validateur;
    }

    public void setValidateur(String validateur) {
        this.validateur = validateur;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public LocalDateTime getCreeLe() {
        return creeLe;
    }

    public void setCreeLe(LocalDateTime creeLe) {
        this.creeLe = creeLe;
    }

    public LocalDateTime getModifieLe() {
        return modifieLe;
    }

    public void setModifieLe(LocalDateTime modifieLe) {
        this.modifieLe = modifieLe;
    }
}
