package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "programme_mission")
public class ProgrammeMission {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(length = 20, nullable = false, unique = true)
    private String code;
    
    @Column(name = "nom_fr", length = 250, nullable = false)
    private String nomFr;
    
    @Column(name = "nom_ar", length = 250, nullable = false)
    private String nomAr;
    
    @Column(name = "montant_max", precision = 10, scale = 2)
    private BigDecimal montantMax;
    
    @Column(name = "est_actif", nullable = false)
    private Boolean estActif = true;
    
    // Constructeur
    public ProgrammeMission() {
        this.estActif = true;
    }
    
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
    }
    
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getNomFr() { return nomFr; }
    public void setNomFr(String nomFr) { this.nomFr = nomFr; }
    
    public String getNomAr() { return nomAr; }
    public void setNomAr(String nomAr) { this.nomAr = nomAr; }
    
    public BigDecimal getMontantMax() { return montantMax; }
    public void setMontantMax(BigDecimal montantMax) { this.montantMax = montantMax; }
    
    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }
}
