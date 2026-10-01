package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit")
public class Credit {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @Column(length = 150, nullable = false)
    private String banque;
    
    @Column(name = "num_dossier", length = 100)
    private String numDossier;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_credit", nullable = false)
    private TypeCredit typeCredit = TypeCredit.bancaire;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mensualite;
    
    @Column(name = "montant_global", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantGlobal = BigDecimal.ZERO;
    
    @Column(name = "montant_restant", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantRestant = BigDecimal.ZERO;
    
    @Column(name = "nb_mois_restants", nullable = false)
    private Integer nbMoisRestants = 0;
    
    @Column(name = "date_debut")
    private LocalDate dateDebut;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    // Enum
    public enum TypeCredit {
        bancaire,
        interne_AOS
    }
    
    // Constructeur
    public Credit() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
        this.typeCredit = TypeCredit.bancaire;
        this.montantGlobal = BigDecimal.ZERO;
        this.montantRestant = BigDecimal.ZERO;
        this.nbMoisRestants = 0;
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
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    public String getBanque() { return banque; }
    public void setBanque(String banque) { this.banque = banque; }
    
    public String getNumDossier() { return numDossier; }
    public void setNumDossier(String numDossier) { this.numDossier = numDossier; }
    
    public TypeCredit getTypeCredit() { return typeCredit; }
    public void setTypeCredit(TypeCredit typeCredit) { this.typeCredit = typeCredit; }
    
    public BigDecimal getMensualite() { return mensualite; }
    public void setMensualite(BigDecimal mensualite) { this.mensualite = mensualite; }
    
    public BigDecimal getMontantGlobal() { return montantGlobal; }
    public void setMontantGlobal(BigDecimal montantGlobal) { this.montantGlobal = montantGlobal; }
    
    public BigDecimal getMontantRestant() { return montantRestant; }
    public void setMontantRestant(BigDecimal montantRestant) { this.montantRestant = montantRestant; }
    
    public Integer getNbMoisRestants() { return nbMoisRestants; }
    public void setNbMoisRestants(Integer nbMoisRestants) { this.nbMoisRestants = nbMoisRestants; }
    
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
