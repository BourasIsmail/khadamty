package com.employeehub.controller;

import com.employeehub.model.Demande;
import com.employeehub.service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/demandes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DemandeController {

    @Autowired
    private DemandeService demandeService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Long employeeId,
                                    @RequestParam(required = false) String typeId,
                                    @RequestParam(required = false) String statut,
                                    @RequestParam(required = false) Boolean enAttente) {
        try {
            if (enAttente != null && enAttente) return ResponseEntity.ok(demandeService.getDemandesEnAttente());
            if (employeeId != null && statut != null)
                return ResponseEntity.ok(demandeService.getDemandesByEmployeeAndStatut(employeeId, Demande.StatutDemande.valueOf(statut.toUpperCase())));
            if (employeeId != null) return ResponseEntity.ok(demandeService.getDemandesByEmployee(employeeId));
            if (typeId != null) return ResponseEntity.ok(demandeService.getDemandesByType(typeId));
            if (statut != null) return ResponseEntity.ok(demandeService.getDemandesByStatut(Demande.StatutDemande.valueOf(statut.toUpperCase())));
            return ResponseEntity.ok(demandeService.getAllDemandes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return demandeService.getDemandeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<?> getByNumero(@PathVariable String numero) {
        try {
            return demandeService.getDemandeByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Demande demande) {
        try {
            if (demandeService.existsByNumero(demande.getNumero())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce numéro de demande existe déjà"));
            }
            Demande saved = demandeService.createDemande(demande);
            return ResponseEntity.ok(Map.of("message", "Demande créée avec succès", "demande", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Demande demande) {
        try {
            Demande updated = demandeService.updateDemande(id, demande);
            return ResponseEntity.ok(Map.of("message", "Demande mise à jour", "demande", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String traiteePar = data.get("traiteePar");
            Demande updated = demandeService.approveDemande(id, traiteePar);
            return ResponseEntity.ok(Map.of("message", "Demande approuvée", "demande", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id, @RequestBody Map<String, String> data) {
        try {
            String traiteePar = data.get("traiteePar");
            String motifRejet = data.get("motifRejet");
            Demande updated = demandeService.rejectDemande(id, traiteePar, motifRejet);
            return ResponseEntity.ok(Map.of("message", "Demande rejetée", "demande", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            demandeService.deleteDemande(id);
            return ResponseEntity.ok(Map.of("message", "Demande supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", demandeService.getAllDemandes().size());
            stats.put("en_attente", demandeService.countByStatut(Demande.StatutDemande.EN_ATTENTE));
            stats.put("approuvees", demandeService.countByStatut(Demande.StatutDemande.APPROUVEE));
            stats.put("rejetees", demandeService.countByStatut(Demande.StatutDemande.REJETEE));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
