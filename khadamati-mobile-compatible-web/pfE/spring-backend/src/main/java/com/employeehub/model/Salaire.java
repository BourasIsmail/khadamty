package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salaire", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "annee", "mois"})
})
public class Salaire {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private Grade grade;
    
    @Column(nullable = false)
    private Short annee;
    
    @Column(nullable = false)
    private Byte mois;
    
    @Column(length = 10)
    private String echelon;
    
    @Column(name = "salaire_net", nullable = false, precision = 10, scale = 2)
    private BigDecimal salaireNet;
    
    @Column(name = "alloc_familiale", nullable = false, precision = 10, scale = 2)
    private BigDecimal allocFamiliale = BigDecimal.ZERO;
    
    @Column(name = "retenue_mutuelle", nullable = false, precision = 10, scale = 2)
    private BigDecimal retenueMutuelle = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rappel = BigDecimal.ZERO;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    // Constructeur
    public Salaire() {
        this.creeLe = LocalDateTime.now();
        this.allocFamiliale = BigDecimal.ZERO;
        this.retenueMutuelle = BigDecimal.ZERO;
        this.rappel = BigDecimal.ZERO;
    }
    
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
        this.creeLe = LocalDateTime.now();
    }
    
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }
    
    public Short getAnnee() { return annee; }
    public void setAnnee(Short annee) { this.annee = annee; }
    
    public Byte getMois() { return mois; }
    public void setMois(Byte mois) { this.mois = mois; }
    
    public String getEchelon() { return echelon; }
    public void setEchelon(String echelon) { this.echelon = echelon; }
    
    public BigDecimal getSalaireNet() { return salaireNet; }
    public void setSalaireNet(BigDecimal salaireNet) { this.salaireNet = salaireNet; }
    
    public BigDecimal getAllocFamiliale() { return allocFamiliale; }
    public void setAllocFamiliale(BigDecimal allocFamiliale) { this.allocFamiliale = allocFamiliale; }
    
    public BigDecimal getRetenueMutuelle() { return retenueMutuelle; }
    public void setRetenueMutuelle(BigDecimal retenueMutuelle) { this.retenueMutuelle = retenueMutuelle; }
    
    public BigDecimal getRappel() { return rappel; }
    public void setRappel(BigDecimal rappel) { this.rappel = rappel; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
}
