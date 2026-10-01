package com.employeehub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "type_demande")
public class TypeDemande {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(length = 30, nullable = false, unique = true)
    private String code;
    
    @Column(length = 150, nullable = false)
    private String libelle;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "est_actif", nullable = false)
    private Boolean estActif = true;
    
    // Constructeurs
    public TypeDemande() {
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
    
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }
}
