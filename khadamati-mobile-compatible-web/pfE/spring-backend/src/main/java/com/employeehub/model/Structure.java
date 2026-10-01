package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "structure")
public class Structure {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delegation_id", nullable = false)
    private DelegationProvince delegation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Structure parent;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeStructure type;
    
    @Column(length = 30, nullable = false, unique = true)
    private String code;
    
    @Column(name = "nom_ar", length = 250, nullable = false)
    private String nomAr;
    
    @Column(name = "nom_fr", length = 250, nullable = false)
    private String nomFr;
    
    @Column(columnDefinition = "TEXT")
    private String adresse;
    
    @Column(name = "est_active", nullable = false)
    private Boolean estActive = true;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    public enum TypeStructure {
        association,
        etablissement,
        centre,
        complexe
    }
    
    public Structure() {
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
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public DelegationProvince getDelegation() { return delegation; }
    public void setDelegation(DelegationProvince delegation) { this.delegation = delegation; }
    
    public Structure getParent() { return parent; }
    public void setParent(Structure parent) { this.parent = parent; }
    
    public TypeStructure getType() { return type; }
    public void setType(TypeStructure type) { this.type = type; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getNomAr() { return nomAr; }
    public void setNomAr(String nomAr) { this.nomAr = nomAr; }
    
    public String getNomFr() { return nomFr; }
    public void setNomFr(String nomFr) { this.nomFr = nomFr; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public Boolean getEstActive() { return estActive; }
    public void setEstActive(Boolean estActive) { this.estActive = estActive; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
