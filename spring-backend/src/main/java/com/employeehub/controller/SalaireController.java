package com.employeehub.controller;

import com.employeehub.model.Salaire;
import com.employeehub.service.PdfGenerationService;
import com.employeehub.service.SalaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/salaires")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SalaireController {

    @Autowired
    private SalaireService salaireService;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId,
                                    @RequestParam(required = false) Integer annee,
                                    @RequestParam(required = false) Integer mois) {
        try {
            if (employeeId != null) return ResponseEntity.ok(salaireService.getSalairesByEmployee(employeeId));
            if (annee != null && mois != null) return ResponseEntity.ok(salaireService.getSalairesByMonth(annee, mois));
            if (annee != null) return ResponseEntity.ok(salaireService.getSalairesByYear(annee));
            return ResponseEntity.ok(salaireService.getAllSalaires());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return salaireService.getSalaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/bulletin-pdf")
    public ResponseEntity<?> downloadBulletinPdf(@PathVariable String id) {
        try {
            Salaire salaire = salaireService.getSalaireById(id)
                .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'ID: " + id));
            byte[] pdf = pdfGenerationService.generatePayslipPdf(salaire);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + bulletinFilename(salaire) + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Salaire salaire) {
        try {
            Salaire saved = salaireService.createSalaire(salaire);
            return ResponseEntity.ok(Map.of("message", "Salaire créé avec succès", "salaire", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Saisie en masse d'un mois de paie. Chaque ligne est traitée indépendamment :
     * une ligne invalide (ou déjà saisie) n'empêche pas l'enregistrement des autres.
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> createBulk(@RequestBody List<Salaire> salaires) {
        if (salaires == null || salaires.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("message", "Aucun bulletin à enregistrer"));
        if (salaires.size() > 1000)
            return ResponseEntity.badRequest().body(Map.of("message", "Maximum 1000 bulletins par envoi"));

        int created = 0;
        List<Map<String, Object>> failed = new ArrayList<>();
        for (int i = 0; i < salaires.size(); i++) {
            try {
                salaireService.createSalaire(salaires.get(i));
                created++;
            } catch (Exception e) {
                Map<String, Object> error = new LinkedHashMap<>();
                error.put("index", i);
                error.put("message", e.getMessage() != null ? e.getMessage() : "Erreur inattendue");
                failed.add(error);
            }
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total", salaires.size());
        result.put("created", created);
        result.put("failed", failed);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Salaire salaire) {
        try {
            Salaire updated = salaireService.updateSalaire(id, salaire);
            return ResponseEntity.ok(Map.of("message", "Salaire mis à jour", "salaire", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            salaireService.deleteSalaire(id);
            return ResponseEntity.ok(Map.of("message", "Salaire supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", salaireService.getAllSalaires().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private String bulletinFilename(Salaire salaire) {
        String employeeCode = salaire.getEmployee() != null ? salaire.getEmployee().getEmployeeId() : "employee";
        return "bulletin-paie-" + safeFilePart(employeeCode) + "-" + salaire.getAnnee() + "-" + salaire.getMois() + ".pdf";
    }

    private String safeFilePart(String value) {
        if (value == null || value.isBlank()) return "document";
        return value.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
