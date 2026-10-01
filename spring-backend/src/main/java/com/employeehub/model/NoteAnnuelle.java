package com.employeehub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "note_annuelle", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "annee"})
})
public class NoteAnnuelle {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saisie_par")
    private User saisiePar;
    
    @Column(nullable = false)
    private Short annee;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal note;
    
    @Column(length = 100)
    private String appreciation;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;
    
    // Constructeur
    public NoteAnnuelle() {
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
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
    
    public User getSaisiePar() { return saisiePar; }
    public void setSaisiePar(User saisiePar) { this.saisiePar = saisiePar; }
    
    public Short getAnnee() { return annee; }
    public void setAnnee(Short annee) { this.annee = annee; }
    
    public BigDecimal getNote() { return note; }
    public void setNote(BigDecimal note) { this.note = note; }
    
    public String getAppreciation() { return appreciation; }
    public void setAppreciation(String appreciation) { this.appreciation = appreciation; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
    
    public LocalDateTime getModifieLe() { return modifieLe; }
    public void setModifieLe(LocalDateTime modifieLe) { this.modifieLe = modifieLe; }
}
