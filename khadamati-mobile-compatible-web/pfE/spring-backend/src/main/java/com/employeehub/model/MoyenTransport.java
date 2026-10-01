package com.employeehub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "moyen_transport")
public class MoyenTransport {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(length = 50, nullable = false, unique = true)
    private String code;
    
    @Column(name = "libelle_fr", length = 100, nullable = false)
    private String libelleFr;
    
    @Column(name = "libelle_ar", length = 100, nullable = false)
    private String libelleAr;
    
    @Column(name = "est_actif", nullable = false)
    private Boolean estActif = true;
    
    // Constructeur
    public MoyenTransport() {
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
    
    public String getLibelleFr() { return libelleFr; }
    public void setLibelleFr(String libelleFr) { this.libelleFr = libelleFr; }
    
    public String getLibelleAr() { return libelleAr; }
    public void setLibelleAr(String libelleAr) { this.libelleAr = libelleAr; }
    
    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }
}
