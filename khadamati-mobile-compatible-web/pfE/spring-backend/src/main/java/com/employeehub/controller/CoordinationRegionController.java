package com.employeehub.controller;

import com.employeehub.model.CoordinationRegion;
import com.employeehub.service.CoordinationRegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coordinations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CoordinationRegionController {

    @Autowired
    private CoordinationRegionService coordinationRegionService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean active) {
        try {
            List<CoordinationRegion> regions = (active != null && active)
                ? coordinationRegionService.getActiveRegions()
                : coordinationRegionService.getAllRegions();
            return ResponseEntity.ok(regions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return coordinationRegionService.getRegionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return coordinationRegionService.getRegionByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String nomFr,
                                    @RequestParam(required = false) String nomAr) {
        try {
            if (nomFr != null) return ResponseEntity.ok(coordinationRegionService.searchRegionsByNomFr(nomFr));
            if (nomAr != null) return ResponseEntity.ok(coordinationRegionService.searchRegionsByNomAr(nomAr));
            return ResponseEntity.ok(coordinationRegionService.getAllRegions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CoordinationRegion region) {
        try {
            if (coordinationRegionService.existsByCode(region.getCodeRegion())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code de région existe déjà"));
            }
            CoordinationRegion saved = coordinationRegionService.createRegion(region);
            return ResponseEntity.ok(Map.of("message", "Région créée avec succès", "region", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody CoordinationRegion region) {
        try {
            CoordinationRegion updated = coordinationRegionService.updateRegion(id, region);
            return ResponseEntity.ok(Map.of("message", "Région mise à jour", "region", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        try {
            CoordinationRegion updated = coordinationRegionService.toggleRegionStatus(id);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "region", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            coordinationRegionService.deleteRegion(id);
            return ResponseEntity.ok(Map.of("message", "Région supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", coordinationRegionService.getAllRegions().size());
            stats.put("actives", coordinationRegionService.countActiveRegions());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
