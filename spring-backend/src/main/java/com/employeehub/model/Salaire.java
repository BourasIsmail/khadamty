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
    
    // ── Détail mensuel (saisi par l'administrateur). Nuls sur les anciens bulletins. ──
    @Column(name = "salaire_base", precision = 10, scale = 2)
    private BigDecimal salaireBase;

    @Column(name = "indemnite_logement", precision = 10, scale = 2)
    private BigDecimal indemniteLogement;

    @Column(name = "indemnite_transport", precision = 10, scale = 2)
    private BigDecimal indemniteTransport;

    @Column(name = "indemnite_fonction", precision = 10, scale = 2)
    private BigDecimal indemniteFonction;

    @Column(precision = 10, scale = 2)
    private BigDecimal primes;

    @Column(name = "retenue_retraite", precision = 10, scale = 2)
    private BigDecimal retenueRetraite;

    @Column(name = "retenue_amo", precision = 10, scale = 2)
    private BigDecimal retenueAmo;

    @Column(name = "retenue_ir", precision = 10, scale = 2)
    private BigDecimal retenueIr;

    @Column(name = "autres_retenues", precision = 10, scale = 2)
    private BigDecimal autresRetenues;

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
    
    public BigDecimal getSalaireBase() { return salaireBase; }
    public void setSalaireBase(BigDecimal salaireBase) { this.salaireBase = salaireBase; }

    public BigDecimal getIndemniteLogement() { return indemniteLogement; }
    public void setIndemniteLogement(BigDecimal v) { this.indemniteLogement = v; }

    public BigDecimal getIndemniteTransport() { return indemniteTransport; }
    public void setIndemniteTransport(BigDecimal v) { this.indemniteTransport = v; }

    public BigDecimal getIndemniteFonction() { return indemniteFonction; }
    public void setIndemniteFonction(BigDecimal v) { this.indemniteFonction = v; }

    public BigDecimal getPrimes() { return primes; }
    public void setPrimes(BigDecimal primes) { this.primes = primes; }

    public BigDecimal getRetenueRetraite() { return retenueRetraite; }
    public void setRetenueRetraite(BigDecimal v) { this.retenueRetraite = v; }

    public BigDecimal getRetenueAmo() { return retenueAmo; }
    public void setRetenueAmo(BigDecimal v) { this.retenueAmo = v; }

    public BigDecimal getRetenueIr() { return retenueIr; }
    public void setRetenueIr(BigDecimal v) { this.retenueIr = v; }

    public BigDecimal getAutresRetenues() { return autresRetenues; }
    public void setAutresRetenues(BigDecimal v) { this.autresRetenues = v; }

    // ── Calculs (non persistés) ──────────────────────────────────────────────

    private static BigDecimal z(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }

    /** Salaire de base saisi ; pour un ancien bulletin sans détail, il est déduit du net. */
    public BigDecimal getSalaireBaseEffectif() {
        if (salaireBase != null) return salaireBase;
        BigDecimal estimated = z(salaireNet).add(z(retenueMutuelle)).subtract(z(allocFamiliale)).subtract(z(rappel));
        return estimated.signum() < 0 ? BigDecimal.ZERO : estimated;
    }

    public BigDecimal getTotalGains() {
        return getSalaireBaseEffectif()
            .add(z(indemniteLogement)).add(z(indemniteTransport)).add(z(indemniteFonction))
            .add(z(primes)).add(z(allocFamiliale)).add(z(rappel));
    }

    public BigDecimal getTotalRetenues() {
        return z(retenueRetraite).add(z(retenueAmo)).add(z(retenueMutuelle))
            .add(z(retenueIr)).add(z(autresRetenues));
    }

    /** Recalcule le net à payer = total gains - total retenues (bulletins saisis avec détail). */
    public void recomputeNet() {
        this.salaireNet = getTotalGains().subtract(getTotalRetenues());
    }

    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
}
