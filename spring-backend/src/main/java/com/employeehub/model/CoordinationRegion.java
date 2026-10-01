package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coordination_region")
public class CoordinationRegion {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(name = "code_region", length = 10, nullable = false, unique = true)
    private String codeRegion;
    
    @Column(name = "nom_region_ar", length = 200, nullable = false)
    private String nomRegionAr;
    
    @Column(name = "nom_region_fr", length = 200, nullable = false)
    private String nomRegionFr;
    
    @Column(name = "nom_coord_ar", length = 200, nullable = false)
    private String nomCoordAr;
    
    @Column(name = "nom_coord_fr", length = 200, nullable = false)
    private String nomCoordFr;
    
    @Column(length = 20)
    private String telephone;
    
    @Column(columnDefinition = "TEXT")
    private String adresse;
    
    @Column(name = "est_active", nullable = false)
    private Boolean estActive = true;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    // Constructeurs
    public CoordinationRegion() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
        this.estActive = true;
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
    
    public String getCodeRegion() { return codeRegion; }
    public void setCodeRegion(String codeRegion) { this.codeRegion = codeRegion; }
    
    public String getNomRegionAr() { return nomRegionAr; }
    public void setNomRegionAr(String nomRegionAr) { this.nomRegionAr = nomRegionAr; }
    
    public String getNomRegionFr() { return nomRegionFr; }
    public void setNomRegionFr(String nomRegionFr) { this.nomRegionFr = nomRegionFr; }
    
    public String getNomCoordAr() { return nomCoordAr; }
    public void setNomCoordAr(String nomCoordAr) { this.nomCoordAr = nomCoordAr; }
    
    public String getNomCoordFr() { return nomCoordFr; }
    public void setNomCoordFr(String nomCoordFr) { this.nomCoordFr = nomCoordFr; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public Boolean getEstActive() { return estActive; }
    public void setEstActive(Boolean estActive) { this.estActive = estActive; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
