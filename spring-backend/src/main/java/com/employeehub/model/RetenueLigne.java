package com.employeehub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Une ligne du détail des retenues mensuelles d'un bulletin : type de retenue, montant du mois et,
 * pour un prêt ou une avance, numéro de dossier, montant total, montant restant et mois restants.
 */
@Entity
@Table(name = "retenue_ligne")
@JsonIgnoreProperties(ignoreUnknown = true)
public class RetenueLigne {

    @Id
    @Column(length = 36)
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salaire_id", nullable = false)
    private Salaire salaire;

    @Column(nullable = false, length = 100)
    private String type;

    /** Retenue du mois. */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant = BigDecimal.ZERO;

    @Column(name = "numero_dossier", length = 50)
    private String numeroDossier;

    /** Montant total du prêt (facultatif). */
    @Column(name = "montant_total", precision = 12, scale = 2)
    private BigDecimal montantTotal;

    /** Montant restant à rembourser après cette retenue (facultatif). */
    @Column(name = "montant_restant", precision = 12, scale = 2)
    private BigDecimal montantRestant;

    @Column(name = "mois_restants")
    private Integer moisRestants;

    @Column(nullable = false)
    private Integer ordre = 0;

    public RetenueLigne() {}

    public RetenueLigne(String type, BigDecimal montant) {
        this.type = type;
        this.montant = montant;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) id = java.util.UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    @JsonIgnore
    public Salaire getSalaire() { return salaire; }
    @JsonIgnore
    public void setSalaire(Salaire salaire) { this.salaire = salaire; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public String getNumeroDossier() { return numeroDossier; }
    public void setNumeroDossier(String numeroDossier) { this.numeroDossier = numeroDossier; }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public BigDecimal getMontantRestant() { return montantRestant; }
    public void setMontantRestant(BigDecimal montantRestant) { this.montantRestant = montantRestant; }

    public Integer getMoisRestants() { return moisRestants; }
    public void setMoisRestants(Integer moisRestants) { this.moisRestants = moisRestants; }

    @JsonIgnore
    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }
}
