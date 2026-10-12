package com.employeehub.controller;

import com.employeehub.config.CurrentUser;
import com.employeehub.model.Document;
import com.employeehub.service.DocumentService;
import com.employeehub.service.PdfGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private CurrentUser currentUser;

    /** Un employé ne voit que les documents publics non archivés. */
    private boolean visible(Document d) {
        return currentUser.isStaff() || (Boolean.TRUE.equals(d.getEstPublic()) && !Boolean.TRUE.equals(d.getEstArchive()));
    }

    private List<Document> filterVisible(List<Document> docs) {
        return docs.stream().filter(this::visible).toList();
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String typeId,
                                    @RequestParam(required = false) Boolean publique,
                                    @RequestParam(required = false) Boolean archive,
                                    @RequestParam(required = false) String search) {
        try {
            if (search != null) return ResponseEntity.ok(filterVisible(documentService.searchDocumentsByTitre(search)));
            if (typeId != null) return ResponseEntity.ok(filterVisible(documentService.getDocumentsByType(typeId)));
            if (publique != null && publique && archive != null && !archive)
                return ResponseEntity.ok(filterVisible(documentService.getPublicNonArchivedDocuments()));
            if (publique != null && publique) return ResponseEntity.ok(filterVisible(documentService.getPublicDocuments()));
            if (archive != null && !archive) return ResponseEntity.ok(filterVisible(documentService.getNonArchivedDocuments()));
            return ResponseEntity.ok(filterVisible(documentService.getAllDocuments()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return documentService.getDocumentById(id)
                .<ResponseEntity<?>>map(d -> visible(d) ? ResponseEntity.ok(d)
                    : ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Accès refusé")))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/download-pdf")
    public ResponseEntity<?> downloadPdf(@PathVariable String id) {
        try {
            Document document = documentService.getDocumentById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
            if (!visible(document))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Accès refusé"));
            byte[] pdf = pdfGenerationService.generateDocumentSummaryPdf(document);
            documentService.incrementDownloadCount(id);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + documentFilename(document) + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/top")
    public ResponseEntity<?> getTopDocuments() {
        try {
            return ResponseEntity.ok(filterVisible(documentService.getTopDocuments()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentDocuments() {
        try {
            return ResponseEntity.ok(filterVisible(documentService.getRecentDocuments()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Document document) {
        try {
            Document saved = documentService.createDocument(document);
            return ResponseEntity.ok(Map.of("message", "Document créé avec succès", "document", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Document document) {
        try {
            Document updated = documentService.updateDocument(id, document);
            return ResponseEntity.ok(Map.of("message", "Document mis à jour", "document", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/download")
    public ResponseEntity<?> incrementDownload(@PathVariable String id) {
        try {
            Document updated = documentService.incrementDownloadCount(id);
            return ResponseEntity.ok(Map.of("message", "Téléchargement enregistré", "document", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<?> archive(@PathVariable String id) {
        try {
            Document updated = documentService.archiveDocument(id);
            return ResponseEntity.ok(Map.of("message", "Document archivé", "document", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/unarchive")
    public ResponseEntity<?> unarchive(@PathVariable String id) {
        try {
            Document updated = documentService.unarchiveDocument(id);
            return ResponseEntity.ok(Map.of("message", "Document désarchivé", "document", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.ok(Map.of("message", "Document supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", documentService.getAllDocuments().size());
            stats.put("publics", documentService.countPublicDocuments());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private String documentFilename(Document document) {
        String baseName = document.getTitre() != null ? document.getTitre() : document.getNomFichier();
        if (baseName == null || baseName.isBlank()) baseName = "document";
        return safeFilePart(baseName) + ".pdf";
    }

    private String safeFilePart(String value) {
        return value.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
