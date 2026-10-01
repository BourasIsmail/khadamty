package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamation")
public class Reclamation {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "traite_par")
    private User traitePar;
    
    @Column(length = 500, nullable = false)
    private String objet;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReclamation statut = StatutReclamation.nouvelle;
    
    @Column(columnDefinition = "TEXT")
    private String reponse;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    public enum StatutReclamation {
        nouvelle,
        en_cours,
        resolue,
        rejetee
    }
    
    public Reclamation() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
        this.statut = StatutReclamation.nouvelle;
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
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    public User getTraitePar() { return traitePar; }
    public void setTraitePar(User traitePar) { this.traitePar = traitePar; }
    
    public String getObjet() { return objet; }
    public void setObjet(String objet) { this.objet = objet; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public StatutReclamation getStatut() { return statut; }
    public void setStatut(StatutReclamation statut) { this.statut = statut; }
    
    public String getReponse() { return reponse; }
    public void setReponse(String reponse) { this.reponse = reponse; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
