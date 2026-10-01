package com.employeehub.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité Document - Documents publiés et partagés
 */
@Entity
@Table(name = "document")
public class Document {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_document_id", nullable = false)
    private TypeDocument typeDocument;

    @Column(name = "titre", length = 250, nullable = false)
    private String titre;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "nom_fichier", length = 255, nullable = false)
    private String nomFichier;

    @Column(name = "chemin_fichier", length = 500, nullable = false)
    private String cheminFichier;

    @Column(name = "type_mime", length = 100)
    private String typeMime;

    @Column(name = "taille_octets")
    private Long tailleOctets;

    @Column(name = "numero_reference", length = 100)
    private String numeroReference;

    @Column(name = "date_publication")
    private LocalDate datePublication;

    @Column(name = "publie_par", length = 100)
    private String publiePar;

    @Column(name = "est_public", nullable = false)
    private Boolean estPublic = false;

    @Column(name = "est_archive", nullable = false)
    private Boolean estArchive = false;

    @Column(name = "nb_telechargements")
    private Integer nbTelechargements = 0;

    @Column(name = "cree_le", nullable = false, updatable = false)
    private LocalDateTime creeLe;

    @Column(name = "modifie_le", nullable = false)
    private LocalDateTime modifieLe;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.creeLe = LocalDateTime.now();
        this.modifieLe = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.modifieLe = LocalDateTime.now();
    }

    // Constructeurs
    public Document() {
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TypeDocument getTypeDocument() {
        return typeDocument;
    }

    public void setTypeDocument(TypeDocument typeDocument) {
        this.typeDocument = typeDocument;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNomFichier() {
        return nomFichier;
    }

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public String getCheminFichier() {
        return cheminFichier;
    }

    public void setCheminFichier(String cheminFichier) {
        this.cheminFichier = cheminFichier;
    }

    public String getTypeMime() {
        return typeMime;
    }

    public void setTypeMime(String typeMime) {
        this.typeMime = typeMime;
    }

    public Long getTailleOctets() {
        return tailleOctets;
    }

    public void setTailleOctets(Long tailleOctets) {
        this.tailleOctets = tailleOctets;
    }

    public String getNumeroReference() {
        return numeroReference;
    }

    public void setNumeroReference(String numeroReference) {
        this.numeroReference = numeroReference;
    }

    public LocalDate getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(LocalDate datePublication) {
        this.datePublication = datePublication;
    }

    public String getPubliePar() {
        return publiePar;
    }

    public void setPubliePar(String publiePar) {
        this.publiePar = publiePar;
    }

    public Boolean getEstPublic() {
        return estPublic;
    }

    public void setEstPublic(Boolean estPublic) {
        this.estPublic = estPublic;
    }

    public Boolean getEstArchive() {
        return estArchive;
    }

    public void setEstArchive(Boolean estArchive) {
        this.estArchive = estArchive;
    }

    public Integer getNbTelechargements() {
        return nbTelechargements;
    }

    public void setNbTelechargements(Integer nbTelechargements) {
        this.nbTelechargements = nbTelechargements;
    }

    public LocalDateTime getCreeLe() {
        return creeLe;
    }

    public void setCreeLe(LocalDateTime creeLe) {
        this.creeLe = creeLe;
    }

    public LocalDateTime getModifieLe() {
        return modifieLe;
    }

    public void setModifieLe(LocalDateTime modifieLe) {
        this.modifieLe = modifieLe;
    }

    @Transient
    public String getTypeDocumentLibelle() {
        return typeDocument != null ? typeDocument.getLibelle() : "Document";
    }

    @Transient
    public Boolean getEstPublie() {
        return Boolean.TRUE.equals(estPublic);
    }

    @Transient
    public LocalDate getDateCreation() {
        return datePublication;
    }
}
