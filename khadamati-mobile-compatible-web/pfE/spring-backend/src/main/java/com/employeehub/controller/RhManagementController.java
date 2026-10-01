package com.employeehub.controller;

import com.employeehub.model.Annonce;
import com.employeehub.model.Document;
import com.employeehub.model.Employee;
import com.employeehub.model.OrdreMission;
import com.employeehub.model.TypeDocument;
import com.employeehub.repository.AnnonceRepository;
import com.employeehub.repository.DocumentRepository;
import com.employeehub.repository.OrdreMissionRepository;
import com.employeehub.service.PdfGenerationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rh/management")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RhManagementController {

    private final AnnonceRepository annonceRepository;
    private final DocumentRepository documentRepository;
    private final OrdreMissionRepository ordreMissionRepository;
    private final PdfGenerationService pdfGenerationService;

    public RhManagementController(AnnonceRepository annonceRepository,
                                  DocumentRepository documentRepository,
                                  OrdreMissionRepository ordreMissionRepository,
                                  PdfGenerationService pdfGenerationService) {
        this.annonceRepository = annonceRepository;
        this.documentRepository = documentRepository;
        this.ordreMissionRepository = ordreMissionRepository;
        this.pdfGenerationService = pdfGenerationService;
    }

    @GetMapping("/announcements")
    public ResponseEntity<?> getAnnouncements(@RequestParam(required = false) Boolean active) {
        try {
            List<Annonce> annonces = Boolean.TRUE.equals(active)
                ? annonceRepository.findActiveAndNotExpired(LocalDateTime.now())
                : annonceRepository.findAll();
            return ResponseEntity.ok(annonces.stream().map(this::toAnnouncementResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> createAnnouncement(@RequestBody Annonce annonce) {
        try {
            if (annonce.getEstActive() == null) annonce.setEstActive(true);
            if (annonce.getPublieLe() == null) annonce.setPublieLe(LocalDateTime.now());
            Annonce saved = annonceRepository.save(annonce);
            return ResponseEntity.ok(Map.of("message", "Annonce créée", "annonce", toAnnouncementResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/announcements/{id}")
    public ResponseEntity<?> getAnnouncement(@PathVariable String id) {
        try {
            Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));
            return ResponseEntity.ok(toAnnouncementResponse(annonce));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable String id, @RequestBody Annonce data) {
        try {
            Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));
            annonce.setTitre(data.getTitre());
            annonce.setMessage(data.getMessage());
            if (data.getEstActive() != null) annonce.setEstActive(data.getEstActive());
            annonce.setExpireLe(data.getExpireLe());
            Annonce saved = annonceRepository.save(annonce);
            return ResponseEntity.ok(Map.of("message", "Annonce mise à jour", "annonce", toAnnouncementResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/announcements/{id}/publish")
    public ResponseEntity<?> publishAnnouncement(@PathVariable String id) {
        try {
            Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'ID: " + id));
            annonce.setEstActive(true);
            if (annonce.getPublieLe() == null) annonce.setPublieLe(LocalDateTime.now());
            Annonce saved = annonceRepository.save(annonce);
            return ResponseEntity.ok(Map.of("message", "Annonce publiée", "annonce", toAnnouncementResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable String id) {
        try {
            annonceRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Annonce supprimée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/documents")
    public ResponseEntity<?> getDocuments(@RequestParam(required = false) String typeId,
                                          @RequestParam(required = false) String search) {
        try {
            List<Document> documents;
            if (search != null && !search.isBlank()) {
                documents = documentRepository.findByTitreContainingIgnoreCase(search);
            } else if (typeId != null && !typeId.isBlank()) {
                documents = documentRepository.findByTypeDocumentId(typeId);
            } else {
                documents = documentRepository.findAll();
            }
            return ResponseEntity.ok(documents.stream().map(this::toDocumentResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/documents")
    public ResponseEntity<?> createDocument(@RequestBody Document document) {
        try {
            if (document.getEstPublic() == null) document.setEstPublic(true);
            if (document.getEstArchive() == null) document.setEstArchive(false);
            if (document.getDatePublication() == null) document.setDatePublication(LocalDate.now());
            Document saved = documentRepository.save(document);
            return ResponseEntity.ok(Map.of("message", "Document créé", "document", toDocumentResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<?> getDocument(@PathVariable String id) {
        try {
            Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
            return ResponseEntity.ok(toDocumentResponse(document));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable String id, @RequestBody Document data) {
        try {
            Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
            document.setTypeDocument(data.getTypeDocument());
            document.setTitre(data.getTitre());
            document.setDescription(data.getDescription());
            document.setNomFichier(data.getNomFichier());
            document.setCheminFichier(data.getCheminFichier());
            document.setTypeMime(data.getTypeMime());
            document.setTailleOctets(data.getTailleOctets());
            document.setNumeroReference(data.getNumeroReference());
            document.setDatePublication(data.getDatePublication());
            document.setPubliePar(data.getPubliePar());
            if (data.getEstPublic() != null) document.setEstPublic(data.getEstPublic());
            if (data.getEstArchive() != null) document.setEstArchive(data.getEstArchive());
            Document saved = documentRepository.save(document);
            return ResponseEntity.ok(Map.of("message", "Document mis à jour", "document", toDocumentResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/documents/{id}/publish")
    public ResponseEntity<?> publishDocument(@PathVariable String id) {
        try {
            Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
            document.setEstPublic(true);
            document.setEstArchive(false);
            if (document.getDatePublication() == null) document.setDatePublication(LocalDate.now());
            Document saved = documentRepository.save(document);
            return ResponseEntity.ok(Map.of("message", "Document publié", "document", toDocumentResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/documents/{id}/download-pdf")
    public ResponseEntity<?> downloadDocumentPdf(@PathVariable String id) {
        try {
            Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));
            byte[] pdf = pdfGenerationService.generateDocumentSummaryPdf(document);
            document.setNbTelechargements((document.getNbTelechargements() != null ? document.getNbTelechargements() : 0) + 1);
            documentRepository.save(document);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + documentFilename(document) + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable String id) {
        try {
            documentRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Document supprimé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/mission-orders")
    public ResponseEntity<?> getMissionOrders(@RequestParam(required = false) String employeeId,
                                              @RequestParam(required = false) String statut) {
        try {
            List<OrdreMission> ordres;
            if (employeeId != null && !employeeId.isBlank() && statut != null && !statut.isBlank()) {
                ordres = ordreMissionRepository.findByEmployeeIdAndStatut(
                    Long.parseLong(employeeId),
                    OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase())
                );
            } else if (employeeId != null && !employeeId.isBlank()) {
                ordres = ordreMissionRepository.findByEmployeeId(Long.parseLong(employeeId));
            } else if (statut != null && !statut.isBlank()) {
                ordres = ordreMissionRepository.findByStatut(OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase()));
            } else {
                ordres = ordreMissionRepository.findAll();
            }
            return ResponseEntity.ok(ordres.stream().map(this::toMissionOrderResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mission-orders")
    public ResponseEntity<?> createMissionOrder(@RequestBody OrdreMission ordreMission) {
        try {
            if (ordreMission.getStatut() == null) ordreMission.setStatut(OrdreMission.StatutOrdreMission.EN_ATTENTE);
            OrdreMission saved = ordreMissionRepository.save(ordreMission);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission créé", "ordreMission", toMissionOrderResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/mission-orders/{id}")
    public ResponseEntity<?> getMissionOrder(@PathVariable String id) {
        try {
            OrdreMission ordre = ordreMissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
            return ResponseEntity.ok(toMissionOrderResponse(ordre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/mission-orders/{id}")
    public ResponseEntity<?> updateMissionOrder(@PathVariable String id, @RequestBody OrdreMission data) {
        try {
            OrdreMission ordre = ordreMissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
            ordre.setEmployee(data.getEmployee());
            ordre.setProgramme(data.getProgramme());
            ordre.setMoyenTransport(data.getMoyenTransport());
            ordre.setNumero(data.getNumero());
            ordre.setObjet(data.getObjet());
            ordre.setLieuDepart(data.getLieuDepart());
            ordre.setLieuArrivee(data.getLieuArrivee());
            ordre.setDateDepart(data.getDateDepart());
            ordre.setDateRetour(data.getDateRetour());
            ordre.setDureeJours(data.getDureeJours());
            ordre.setMontantIndemnite(data.getMontantIndemnite());
            ordre.setMontantTransport(data.getMontantTransport());
            ordre.setMontantHebergement(data.getMontantHebergement());
            ordre.setMontantTotal(data.getMontantTotal());
            if (data.getStatut() != null) ordre.setStatut(data.getStatut());
            ordre.setObservations(data.getObservations());
            OrdreMission saved = ordreMissionRepository.save(ordre);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission mis à jour", "ordreMission", toMissionOrderResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mission-orders/{id}/approve")
    public ResponseEntity<?> approveMissionOrder(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            OrdreMission ordre = ordreMissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
            ordre.setStatut(OrdreMission.StatutOrdreMission.APPROUVE);
            ordre.setDateValidation(LocalDate.now());
            ordre.setValidateur(data.getOrDefault("validateur", "Service RH"));
            OrdreMission saved = ordreMissionRepository.save(ordre);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission approuvé", "ordreMission", toMissionOrderResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mission-orders/{id}/reject")
    public ResponseEntity<?> rejectMissionOrder(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            OrdreMission ordre = ordreMissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordre de mission non trouvé avec l'ID: " + id));
            ordre.setStatut(OrdreMission.StatutOrdreMission.REJETE);
            ordre.setDateValidation(LocalDate.now());
            ordre.setValidateur(data.getOrDefault("validateur", "Service RH"));
            ordre.setObservations(data.get("observations"));
            OrdreMission saved = ordreMissionRepository.save(ordre);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission rejeté", "ordreMission", toMissionOrderResponse(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/mission-orders/{id}")
    public ResponseEntity<?> deleteMissionOrder(@PathVariable String id) {
        try {
            ordreMissionRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission supprimé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Map<String, Object> toAnnouncementResponse(Annonce annonce) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", annonce.getId());
        response.put("titre", annonce.getTitre());
        response.put("message", annonce.getMessage());
        response.put("contenu", annonce.getMessage());
        response.put("estActive", annonce.getEstActive());
        response.put("estPubliee", Boolean.TRUE.equals(annonce.getEstActive()));
        response.put("type", "INFORMATION");
        response.put("priorite", "MOYENNE");
        response.put("publieLe", annonce.getPublieLe());
        response.put("datePublication", annonce.getPublieLe());
        response.put("expireLe", annonce.getExpireLe());
        response.put("publiePar", annonce.getPubliePar());
        return response;
    }

    private Map<String, Object> toDocumentResponse(Document document) {
        TypeDocument typeDocument = document.getTypeDocument();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", document.getId());
        response.put("titre", document.getTitre());
        response.put("description", document.getDescription());
        response.put("nomFichier", document.getNomFichier());
        response.put("typeMime", document.getTypeMime());
        response.put("tailleOctets", document.getTailleOctets());
        response.put("numeroReference", document.getNumeroReference());
        response.put("datePublication", document.getDatePublication());
        response.put("dateCreation", document.getDatePublication());
        response.put("publiePar", document.getPubliePar());
        response.put("estPublic", document.getEstPublic());
        response.put("estArchive", document.getEstArchive());
        response.put("estPublie", Boolean.TRUE.equals(document.getEstPublic()));
        response.put("nbTelechargements", document.getNbTelechargements());
        response.put("typeDocumentId", typeDocument != null ? typeDocument.getId() : null);
        response.put("typeDocumentLibelle", typeDocument != null ? typeDocument.getLibelle() : "Document");
        return response;
    }

    private Map<String, Object> toMissionOrderResponse(OrdreMission ordre) {
        Employee employee = ordre.getEmployee();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", ordre.getId());
        response.put("numero", ordre.getNumero());
        response.put("objet", ordre.getObjet());
        response.put("lieuDepart", ordre.getLieuDepart());
        response.put("lieuArrivee", ordre.getLieuArrivee());
        response.put("destination", ordre.getLieuArrivee());
        response.put("dateDepart", ordre.getDateDepart());
        response.put("dateRetour", ordre.getDateRetour());
        response.put("dateDebut", ordre.getDateDepart());
        response.put("dateFin", ordre.getDateRetour());
        response.put("dureeJours", ordre.getDureeJours());
        response.put("montantIndemnite", ordre.getMontantIndemnite());
        response.put("montantTransport", ordre.getMontantTransport());
        response.put("montantHebergement", ordre.getMontantHebergement());
        response.put("montantTotal", ordre.getMontantTotal());
        response.put("statut", ordre.getStatut());
        response.put("dateValidation", ordre.getDateValidation());
        response.put("validateur", ordre.getValidateur());
        response.put("observations", ordre.getObservations());
        response.put("creeLe", ordre.getCreeLe());
        response.put("employeNom", employee != null ? employee.getLastName() : null);
        response.put("employePrenom", employee != null ? employee.getFirstName() : null);
        response.put("employeMatricule", employee != null ? employee.getEmployeeId() : null);
        return response;
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
