package com.employeehub.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "type_document")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TypeDocument {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(length = 150, nullable = false, unique = true)
    private String libelle;
    
    @Column(length = 200)
    private String dossier;
    
    // Constructeur
    public TypeDocument() {}
    
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
    }
    
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    
    public String getDossier() { return dossier; }
    public void setDossier(String dossier) { this.dossier = dossier; }
}
