package com.employeehub.controller;

import com.employeehub.model.Structure;
import com.employeehub.service.StructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/structures")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class StructureController {

    @Autowired
    private StructureService structureService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean active,
                                    @RequestParam(required = false) String delegationId,
                                    @RequestParam(required = false) String type,
                                    @RequestParam(required = false) Boolean rootOnly) {
        try {
            if (rootOnly != null && rootOnly) return ResponseEntity.ok(structureService.getRootStructures());
            if (delegationId != null) return ResponseEntity.ok(structureService.getStructuresByDelegation(delegationId));
            if (type != null) return ResponseEntity.ok(structureService.getStructuresByType(Structure.TypeStructure.valueOf(type.toUpperCase())));
            if (active != null && active) return ResponseEntity.ok(structureService.getActiveStructures());
            return ResponseEntity.ok(structureService.getAllStructures());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return structureService.getStructureById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<?> getChildren(@PathVariable String id) {
        try {
            return ResponseEntity.ok(structureService.getChildStructures(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String nomFr,
                                    @RequestParam(required = false) String nomAr) {
        try {
            if (nomFr != null) return ResponseEntity.ok(structureService.searchStructuresByNomFr(nomFr));
            if (nomAr != null) return ResponseEntity.ok(structureService.searchStructuresByNomAr(nomAr));
            return ResponseEntity.ok(structureService.getAllStructures());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Structure structure) {
        try {
            if (structureService.existsByCode(structure.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code de structure existe déjà"));
            }
            Structure saved = structureService.createStructure(structure);
            return ResponseEntity.ok(Map.of("message", "Structure créée avec succès", "structure", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Structure structure) {
        try {
            Structure updated = structureService.updateStructure(id, structure);
            return ResponseEntity.ok(Map.of("message", "Structure mise à jour", "structure", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        try {
            Structure updated = structureService.toggleStructureStatus(id);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "structure", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            structureService.deleteStructure(id);
            return ResponseEntity.ok(Map.of("message", "Structure supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", structureService.getAllStructures().size());
            stats.put("actives", structureService.getActiveStructures().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
