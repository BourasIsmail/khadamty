package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "grade")
public class Grade {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(nullable = false, unique = true)
    private Integer code;
    
    @Column(name = "libelle_fr", length = 100, nullable = false)
    private String libelleFr;
    
    @Column(name = "libelle_ar", length = 150, nullable = false)
    private String libelleAr;
    
    @Column
    private Integer echelle;
    
    @Column(name = "nb_echelons", nullable = false)
    private Integer nbEchelons = 10;
    
    @Column(precision = 10, scale = 4)
    private BigDecimal taux;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    // Constructeurs
    public Grade() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
        this.nbEchelons = 10;
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
    
    public Integer getCode() { return code; }
    public void setCode(Integer code) { this.code = code; }
    
    public String getLibelleFr() { return libelleFr; }
    public void setLibelleFr(String libelleFr) { this.libelleFr = libelleFr; }
    
    public String getLibelleAr() { return libelleAr; }
    public void setLibelleAr(String libelleAr) { this.libelleAr = libelleAr; }
    
    public Integer getEchelle() { return echelle; }
    public void setEchelle(Integer echelle) { this.echelle = echelle; }
    
    public Integer getNbEchelons() { return nbEchelons; }
    public void setNbEchelons(Integer nbEchelons) { this.nbEchelons = nbEchelons; }
    
    public BigDecimal getTaux() { return taux; }
    public void setTaux(BigDecimal taux) { this.taux = taux; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
