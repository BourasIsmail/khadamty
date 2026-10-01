package com.employeehub.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "annonce")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Annonce {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cree_par")
    private User creePar;
    
    @Column(length = 250, nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(name = "est_active", nullable = false)
    private Boolean estActive = true;
    
    @Column(name = "publie_le", nullable = false)
    private LocalDateTime publieLe;
    
    @Column(name = "expire_le")
    private LocalDateTime expireLe;
    
    @Column(name = "cree_le", nullable = false)
    private LocalDateTime creeLe;
    
    public Annonce() {
        this.creeLe = LocalDateTime.now();
        this.publieLe = LocalDateTime.now();
        this.estActive = true;
    }
    
    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
        this.creeLe = LocalDateTime.now();
        if (this.publieLe == null) {
            this.publieLe = LocalDateTime.now();
        }
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getCreePar() { return creePar; }
    public void setCreePar(User creePar) { this.creePar = creePar; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Boolean getEstActive() { return estActive; }
    public void setEstActive(Boolean estActive) { this.estActive = estActive; }
    
    public LocalDateTime getPublieLe() { return publieLe; }
    public void setPublieLe(LocalDateTime publieLe) { this.publieLe = publieLe; }
    
    public LocalDateTime getExpireLe() { return expireLe; }
    public void setExpireLe(LocalDateTime expireLe) { this.expireLe = expireLe; }
    
    public LocalDateTime getCreeLe() { return creeLe; }
    public void setCreeLe(LocalDateTime creeLe) { this.creeLe = creeLe; }
}
