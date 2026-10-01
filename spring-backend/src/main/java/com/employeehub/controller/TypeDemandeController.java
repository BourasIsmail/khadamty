package com.employeehub.controller;

import com.employeehub.model.TypeDemande;
import com.employeehub.service.TypeDemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/types-demandes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TypeDemandeController {

    @Autowired
    private TypeDemandeService typeDemandeService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean actif) {
        try {
            if (actif != null && actif) return ResponseEntity.ok(typeDemandeService.getActiveTypesDemandes());
            return ResponseEntity.ok(typeDemandeService.getAllTypesDemandes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return typeDemandeService.getTypeDemandeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return typeDemandeService.getTypeDemandeByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String libelleFr,
                                    @RequestParam(required = false) String libelleAr) {
        try {
            if (libelleFr != null) return ResponseEntity.ok(typeDemandeService.searchTypesDemandesByLibelleFr(libelleFr));
            if (libelleAr != null) return ResponseEntity.ok(typeDemandeService.searchTypesDemandesByLibelleAr(libelleAr));
            return ResponseEntity.ok(typeDemandeService.getAllTypesDemandes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TypeDemande typeDemande) {
        try {
            if (typeDemandeService.existsByCode(typeDemande.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code existe déjà"));
            }
            TypeDemande saved = typeDemandeService.createTypeDemande(typeDemande);
            return ResponseEntity.ok(Map.of("message", "Type de demande créé avec succès", "typeDemande", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody TypeDemande typeDemande) {
        try {
            TypeDemande updated = typeDemandeService.updateTypeDemande(id, typeDemande);
            return ResponseEntity.ok(Map.of("message", "Type de demande mis à jour", "typeDemande", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        try {
            TypeDemande updated = typeDemandeService.toggleTypeDemandeStatus(id);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "typeDemande", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            typeDemandeService.deleteTypeDemande(id);
            return ResponseEntity.ok(Map.of("message", "Type de demande supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", typeDemandeService.getAllTypesDemandes().size());
            stats.put("actifs", typeDemandeService.countActiveTypesDemandes());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
