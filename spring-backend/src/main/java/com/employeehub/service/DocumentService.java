package com.employeehub.service;

import com.employeehub.model.Document;
import com.employeehub.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des documents
 */
@Service
@Transactional
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * Créer un nouveau document
     */
    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    /**
     * Récupérer tous les documents
     */
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    /**
     * Récupérer un document par ID
     */
    public Optional<Document> getDocumentById(String id) {
        return documentRepository.findById(id);
    }

    /**
     * Récupérer un document par numéro de référence
     */
    public Optional<Document> getDocumentByNumeroReference(String numeroReference) {
        return documentRepository.findByNumeroReference(numeroReference);
    }

    /**
     * Récupérer les documents par type
     */
    public List<Document> getDocumentsByType(String typeDocumentId) {
        return documentRepository.findByTypeDocumentId(typeDocumentId);
    }

    /**
     * Récupérer les documents publics
     */
    public List<Document> getPublicDocuments() {
        return documentRepository.findByEstPublicTrue();
    }

    /**
     * Récupérer les documents non archivés
     */
    public List<Document> getNonArchivedDocuments() {
        return documentRepository.findByEstArchiveFalse();
    }

    /**
     * Récupérer les documents publics et non archivés
     */
    public List<Document> getPublicNonArchivedDocuments() {
        return documentRepository.findByEstPublicTrueAndEstArchiveFalse();
    }

    /**
     * Rechercher des documents par titre
     */
    public List<Document> searchDocumentsByTitre(String titre) {
        return documentRepository.findByTitreContainingIgnoreCase(titre);
    }

    /**
     * Récupérer les documents publiés entre deux dates
     */
    public List<Document> getDocumentsByPeriode(LocalDate dateDebut, LocalDate dateFin) {
        return documentRepository.findByDatePublicationBetween(dateDebut, dateFin);
    }

    /**
     * Récupérer les documents publiés par une personne
     */
    public List<Document> getDocumentsByPubliePar(String publiePar) {
        return documentRepository.findByPubliePar(publiePar);
    }

    /**
     * Récupérer les documents les plus téléchargés
     */
    public List<Document> getTopDocuments() {
        return documentRepository.findTopDocuments();
    }

    /**
     * Récupérer les documents récents
     */
    public List<Document> getRecentDocuments() {
        return documentRepository.findRecentDocuments();
    }

    /**
     * Mettre à jour un document
     */
    public Document updateDocument(String id, Document documentDetails) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));

        document.setTypeDocument(documentDetails.getTypeDocument());
        document.setTitre(documentDetails.getTitre());
        document.setDescription(documentDetails.getDescription());
        document.setNomFichier(documentDetails.getNomFichier());
        document.setCheminFichier(documentDetails.getCheminFichier());
        document.setTypeMime(documentDetails.getTypeMime());
        document.setTailleOctets(documentDetails.getTailleOctets());
        document.setNumeroReference(documentDetails.getNumeroReference());
        document.setDatePublication(documentDetails.getDatePublication());
        document.setPubliePar(documentDetails.getPubliePar());
        document.setEstPublic(documentDetails.getEstPublic());
        document.setEstArchive(documentDetails.getEstArchive());

        return documentRepository.save(document);
    }

    /**
     * Incrémenter le nombre de téléchargements
     */
    public Document incrementDownloadCount(String id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
        
        document.setNbTelechargements(document.getNbTelechargements() + 1);
        return documentRepository.save(document);
    }

    /**
     * Archiver un document
     */
    public Document archiveDocument(String id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
        
        document.setEstArchive(true);
        return documentRepository.save(document);
    }

    /**
     * Désarchiver un document
     */
    public Document unarchiveDocument(String id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
        
        document.setEstArchive(false);
        return documentRepository.save(document);
    }

    /**
     * Supprimer un document
     */
    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }

    /**
     * Compter les documents par type
     */
    public long countByType(String typeDocumentId) {
        return documentRepository.countByTypeDocumentId(typeDocumentId);
    }

    /**
     * Compter les documents publics
     */
    public long countPublicDocuments() {
        return documentRepository.countByEstPublicTrue();
    }
}
