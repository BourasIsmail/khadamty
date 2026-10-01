package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delegation_province")
public class DelegationProvince {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordination_id", nullable = false)
    private CoordinationRegion coordination;
    
    @Column(name = "code_province", length = 10, nullable = false, unique = true)
    private String codeProvince;
    
    @Column(name = "nom_province_ar", length = 200, nullable = false)
    private String nomProvinceAr;
    
    @Column(name = "nom_province_fr", length = 200, nullable = false)
    private String nomProvinceFr;
    
    @Column(name = "nom_deleg_ar", length = 200, nullable = false)
    private String nomDelegAr;
    
    @Column(name = "nom_deleg_fr", length = 200, nullable = false)
    private String nomDelegFr;
    
    @Column(length = 20)
    private String telephone;
    
    @Column(name = "telephone_inwi", length = 20)
    private String telephoneInwi;
    
    @Column(name = "telephone_flotte", length = 20)
    private String telephoneFlotte;
    
    @Column(columnDefinition = "TEXT")
    private String adresse;
    
    @Column(name = "est_active", nullable = false)
    private Boolean estActive = true;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    public DelegationProvince() {
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
    
    public CoordinationRegion getCoordination() { return coordination; }
    public void setCoordination(CoordinationRegion coordination) { this.coordination = coordination; }
    
    public String getCodeProvince() { return codeProvince; }
    public void setCodeProvince(String codeProvince) { this.codeProvince = codeProvince; }
    
    public String getNomProvinceAr() { return nomProvinceAr; }
    public void setNomProvinceAr(String nomProvinceAr) { this.nomProvinceAr = nomProvinceAr; }
    
    public String getNomProvinceFr() { return nomProvinceFr; }
    public void setNomProvinceFr(String nomProvinceFr) { this.nomProvinceFr = nomProvinceFr; }
    
    public String getNomDelegAr() { return nomDelegAr; }
    public void setNomDelegAr(String nomDelegAr) { this.nomDelegAr = nomDelegAr; }
    
    public String getNomDelegFr() { return nomDelegFr; }
    public void setNomDelegFr(String nomDelegFr) { this.nomDelegFr = nomDelegFr; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getTelephoneInwi() { return telephoneInwi; }
    public void setTelephoneInwi(String telephoneInwi) { this.telephoneInwi = telephoneInwi; }
    
    public String getTelephoneFlotte() { return telephoneFlotte; }
    public void setTelephoneFlotte(String telephoneFlotte) { this.telephoneFlotte = telephoneFlotte; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public Boolean getEstActive() { return estActive; }
    public void setEstActive(Boolean estActive) { this.estActive = estActive; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
