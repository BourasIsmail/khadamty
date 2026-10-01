package com.employeehub.controller;

import com.employeehub.model.DelegationProvince;
import com.employeehub.service.DelegationProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/delegations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DelegationProvinceController {

    @Autowired
    private DelegationProvinceService delegationProvinceService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean active,
                                    @RequestParam(required = false) String coordinationId) {
        try {
            if (coordinationId != null && active != null && active)
                return ResponseEntity.ok(delegationProvinceService.getActiveDelegationsByRegion(coordinationId));
            if (coordinationId != null)
                return ResponseEntity.ok(delegationProvinceService.getDelegationsByRegion(coordinationId));
            if (active != null && active)
                return ResponseEntity.ok(delegationProvinceService.getActiveDelegations());
            return ResponseEntity.ok(delegationProvinceService.getAllDelegations());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return delegationProvinceService.getDelegationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return delegationProvinceService.getDelegationByCode(code)
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
            if (nomFr != null) return ResponseEntity.ok(delegationProvinceService.searchDelegationsByNomFr(nomFr));
            if (nomAr != null) return ResponseEntity.ok(delegationProvinceService.searchDelegationsByNomAr(nomAr));
            return ResponseEntity.ok(delegationProvinceService.getAllDelegations());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DelegationProvince delegation) {
        try {
            if (delegationProvinceService.existsByCode(delegation.getCodeProvince())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code de province existe déjà"));
            }
            DelegationProvince saved = delegationProvinceService.createDelegation(delegation);
            return ResponseEntity.ok(Map.of("message", "Délégation créée avec succès", "delegation", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody DelegationProvince delegation) {
        try {
            DelegationProvince updated = delegationProvinceService.updateDelegation(id, delegation);
            return ResponseEntity.ok(Map.of("message", "Délégation mise à jour", "delegation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        try {
            DelegationProvince updated = delegationProvinceService.toggleDelegationStatus(id);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "delegation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            delegationProvinceService.deleteDelegation(id);
            return ResponseEntity.ok(Map.of("message", "Délégation supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", delegationProvinceService.getAllDelegations().size());
            stats.put("actives", delegationProvinceService.countActiveDelegations());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
