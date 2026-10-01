package com.employeehub.controller;

import com.employeehub.model.OrdreMission;
import com.employeehub.service.OrdreMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ordres-mission")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrdreMissionController {

    @Autowired
    private OrdreMissionService ordreMissionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId,
                                    @RequestParam(required = false) String statut,
                                    @RequestParam(required = false) Boolean enCours) {
        try {
            if (enCours != null && enCours) return ResponseEntity.ok(ordreMissionService.getOrdreMissionsEnCours());
            if (employeeId != null && statut != null)
                return ResponseEntity.ok(ordreMissionService.getOrdreMissionsByEmployeeAndStatut(employeeId, OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase())));
            if (employeeId != null) return ResponseEntity.ok(ordreMissionService.getOrdreMissionsByEmployee(employeeId));
            if (statut != null) return ResponseEntity.ok(ordreMissionService.getOrdreMissionsByStatut(OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase())));
            return ResponseEntity.ok(ordreMissionService.getAllOrdreMissions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ordreMissionService.getOrdreMissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<?> getByNumero(@PathVariable String numero) {
        try {
            return ordreMissionService.getOrdreMissionByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeId}/total")
    public ResponseEntity<?> getTotalByEmployee(@PathVariable String employeeId) {
        try {
            Double total = ordreMissionService.calculateTotalMontantByEmployee(employeeId);
            return ResponseEntity.ok(Map.of("total", total));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrdreMission ordreMission) {
        try {
            if (ordreMissionService.existsByNumero(ordreMission.getNumero())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce numéro d'ordre de mission existe déjà"));
            }
            OrdreMission saved = ordreMissionService.createOrdreMission(ordreMission);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission créé avec succès", "ordreMission", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody OrdreMission ordreMission) {
        try {
            OrdreMission updated = ordreMissionService.updateOrdreMission(id, ordreMission);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission mis à jour", "ordreMission", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String validateur = data.get("validateur");
            OrdreMission updated = ordreMissionService.approveOrdreMission(id, validateur);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission approuvé", "ordreMission", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String validateur = data.get("validateur");
            String observations = data.get("observations");
            OrdreMission updated = ordreMissionService.rejectOrdreMission(id, validateur, observations);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission rejeté", "ordreMission", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            ordreMissionService.deleteOrdreMission(id);
            return ResponseEntity.ok(Map.of("message", "Ordre de mission supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", ordreMissionService.getAllOrdreMissions().size());
            stats.put("en_attente", ordreMissionService.countByStatut(OrdreMission.StatutOrdreMission.EN_ATTENTE));
            stats.put("approuves", ordreMissionService.countByStatut(OrdreMission.StatutOrdreMission.APPROUVE));
            stats.put("en_cours", ordreMissionService.getOrdreMissionsEnCours().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
