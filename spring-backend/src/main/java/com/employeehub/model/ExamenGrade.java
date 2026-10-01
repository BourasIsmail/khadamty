package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "examen_grade")
public class ExamenGrade {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_cible_id")
    private Grade gradeCible;
    
    @Column(nullable = false)
    private Short annee;
    
    @Column(name = "date_examen", nullable = false)
    private LocalDate dateExamen;
    
    @Column(name = "date_depot")
    private LocalDate dateDepot;
    
    @Column(name = "nb_postes", nullable = false)
    private Integer nbPostes = 0;
    
    @Column(length = 250)
    private String lieu;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    @Column(name = "resultats_ecrit", length = 255)
    private String resultatsEcrit;
    
    @Column(name = "resultats_final", length = 255)
    private String resultatsFinal;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    // Constructeur
    public ExamenGrade() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
        this.nbPostes = 0;
    }
    
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.modifieLe = LocalDateTime.now();
    }
    
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Grade getGradeCible() { return gradeCible; }
    public void setGradeCible(Grade gradeCible) { this.gradeCible = gradeCible; }
    
    public Short getAnnee() { return annee; }
    public void setAnnee(Short annee) { this.annee = annee; }
    
    public LocalDate getDateExamen() { return dateExamen; }
    public void setDateExamen(LocalDate dateExamen) { this.dateExamen = dateExamen; }
    
    public LocalDate getDateDepot() { return dateDepot; }
    public void setDateDepot(LocalDate dateDepot) { this.dateDepot = dateDepot; }
    
    public Integer getNbPostes() { return nbPostes; }
    public void setNbPostes(Integer nbPostes) { this.nbPostes = nbPostes; }
    
    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public String getResultatsEcrit() { return resultatsEcrit; }
    public void setResultatsEcrit(String resultatsEcrit) { this.resultatsEcrit = resultatsEcrit; }
    
    public String getResultatsFinal() { return resultatsFinal; }
    public void setResultatsFinal(String resultatsFinal) { this.resultatsFinal = resultatsFinal; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
