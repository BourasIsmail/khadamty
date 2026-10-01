package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prime")
public class Prime {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_prime", nullable = false)
    private TypePrime typePrime = TypePrime.gratification;
    
    @Column(name = "montant_brut", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantBrut;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ir = BigDecimal.ZERO;
    
    @Column(name = "montant_net", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantNet;
    
    @Column(name = "date_prime", nullable = false)
    private LocalDate datePrime;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    // Enum
    public enum TypePrime {
        gratification,
        indemnite,
        autre
    }
    
    // Constructeur
    public Prime() {
        this.creeLe = LocalDateTime.now();
        this.typePrime = TypePrime.gratification;
        this.ir = BigDecimal.ZERO;
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
    
    public TypePrime getTypePrime() { return typePrime; }
    public void setTypePrime(TypePrime typePrime) { this.typePrime = typePrime; }
    
    public BigDecimal getMontantBrut() { return montantBrut; }
    public void setMontantBrut(BigDecimal montantBrut) { this.montantBrut = montantBrut; }
    
    public BigDecimal getIr() { return ir; }
    public void setIr(BigDecimal ir) { this.ir = ir; }
    
    public BigDecimal getMontantNet() { return montantNet; }
    public void setMontantNet(BigDecimal montantNet) { this.montantNet = montantNet; }
    
    public LocalDate getDatePrime() { return datePrime; }
    public void setDatePrime(LocalDate datePrime) { this.datePrime = datePrime; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
}
