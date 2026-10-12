package com.employeehub.controller;

import com.employeehub.config.CurrentUser;
import com.employeehub.model.OrdreMission;
import com.employeehub.service.OrdreMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private CurrentUser currentUser;

    private static final ResponseEntity<Map<String, String>> FORBIDDEN =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Accès refusé"));

    /** Un employé ne peut voir que ses propres ordres de mission. */
    private boolean canView(OrdreMission o) {
        return currentUser.isStaff() || (o.getEmployee() != null && currentUser.isSelf(o.getEmployee().getId()));
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId,
                                    @RequestParam(required = false) String statut,
                                    @RequestParam(required = false) Boolean enCours) {
        try {
            if (!currentUser.isStaff()) {
                // Les paramètres de filtre sont ignorés : seul le périmètre de l'appelant est renvoyé
                return ResponseEntity.ok(currentUser.employee()
                    .map(e -> statut != null
                        ? ordreMissionService.getOrdreMissionsByEmployeeAndStatut(String.valueOf(e.getId()), OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase()))
                        : ordreMissionService.getOrdreMissionsByEmployee(String.valueOf(e.getId())))
                    .orElse(java.util.List.of()));
            }
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
                .<ResponseEntity<?>>map(o -> canView(o) ? ResponseEntity.ok(o) : FORBIDDEN)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<?> getByNumero(@PathVariable String numero) {
        try {
            return ordreMissionService.getOrdreMissionByNumero(numero)
                .<ResponseEntity<?>>map(o -> canView(o) ? ResponseEntity.ok(o) : FORBIDDEN)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeId}/total")
    public ResponseEntity<?> getTotalByEmployee(@PathVariable String employeeId) {
        try {
            if (!currentUser.isStaff() && !currentUser.employee().map(e -> String.valueOf(e.getId()).equals(employeeId)).orElse(false))
                return FORBIDDEN;
            Double total = ordreMissionService.calculateTotalMontantByEmployee(employeeId);
            return ResponseEntity.ok(Map.of("total", total));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrdreMission ordreMission) {
        try {
            if (!currentUser.isStaff()) {
                // Un employé crée une demande pour lui-même, toujours en attente de validation
                var self = currentUser.employee();
                if (self.isEmpty()) return FORBIDDEN;
                ordreMission.setEmployee(self.get());
                ordreMission.setStatut(OrdreMission.StatutOrdreMission.EN_ATTENTE);
                ordreMission.setValidateur(null);
                ordreMission.setDateValidation(null);
            }
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
