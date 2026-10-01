package com.employeehub.controller;

import com.employeehub.model.Reclamation;
import com.employeehub.service.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/reclamations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Long employeeId,
                                    @RequestParam(required = false) String statut,
                                    @RequestParam(required = false) Long traiteParId) {
        try {
            if (employeeId != null && statut != null) {
                // Not supported in simplified version - just return by employee
                return ResponseEntity.ok(reclamationService.getReclamationsByEmployeeOrderByDate(employeeId));
            }
            if (employeeId != null) {
                return ResponseEntity.ok(reclamationService.getReclamationsByEmployeeOrderByDate(employeeId));
            }
            if (statut != null) {
                return ResponseEntity.ok(reclamationService.getReclamationsByStatutOrderByDate(
                    Reclamation.StatutReclamation.valueOf(statut.toLowerCase())
                ));
            }
            if (traiteParId != null) {
                return ResponseEntity.ok(reclamationService.getReclamationsByTraitePar(traiteParId));
            }
            return ResponseEntity.ok(reclamationService.getAllReclamations());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return reclamationService.getReclamationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Reclamation reclamation) {
        try {
            Reclamation saved = reclamationService.createReclamation(reclamation);
            return ResponseEntity.ok(Map.of("message", "Réclamation créée avec succès", "reclamation", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Reclamation reclamation) {
        try {
            Reclamation updated = reclamationService.updateReclamation(id, reclamation);
            return ResponseEntity.ok(Map.of("message", "Réclamation mise à jour", "reclamation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            // Simplified - just set status to en_cours
            String reponse = (String) data.get("reponse");
            Reclamation updated = reclamationService.traiterReclamation(id, null, reponse);
            return ResponseEntity.ok(Map.of("message", "Réclamation en cours de traitement", "reclamation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/resoudre")
    public ResponseEntity<?> resoudre(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String reponse = data.get("reponse");
            Reclamation updated = reclamationService.resoudreReclamation(id, reponse);
            return ResponseEntity.ok(Map.of("message", "Réclamation résolue", "reclamation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/rejeter")
    public ResponseEntity<?> rejeter(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String reponse = data.get("reponse");
            Reclamation updated = reclamationService.rejeterReclamation(id, reponse);
            return ResponseEntity.ok(Map.of("message", "Réclamation rejetée", "reclamation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            reclamationService.deleteReclamation(id);
            return ResponseEntity.ok(Map.of("message", "Réclamation supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", reclamationService.countAllReclamations());
            stats.put("nouvelle", reclamationService.getReclamationsByStatut(Reclamation.StatutReclamation.nouvelle).size());
            stats.put("en_cours", reclamationService.getReclamationsByStatut(Reclamation.StatutReclamation.en_cours).size());
            stats.put("resolue", reclamationService.getReclamationsByStatut(Reclamation.StatutReclamation.resolue).size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
