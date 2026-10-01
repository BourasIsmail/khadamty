package com.employeehub.controller;

import com.employeehub.model.ProgrammeMission;
import com.employeehub.service.ProgrammeMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/programmes-mission")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProgrammeMissionController {

    @Autowired
    private ProgrammeMissionService programmeMissionService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(programmeMissionService.getAllProgrammesMission());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return programmeMissionService.getProgrammeMissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return programmeMissionService.getProgrammeMissionByCode(code)
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
            if (libelleFr != null) return ResponseEntity.ok(programmeMissionService.searchProgrammesMissionByLibelleFr(libelleFr));
            if (libelleAr != null) return ResponseEntity.ok(programmeMissionService.searchProgrammesMissionByLibelleAr(libelleAr));
            return ResponseEntity.ok(programmeMissionService.getAllProgrammesMission());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProgrammeMission programmeMission) {
        try {
            if (programmeMissionService.existsByCode(programmeMission.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code existe déjà"));
            }
            ProgrammeMission saved = programmeMissionService.createProgrammeMission(programmeMission);
            return ResponseEntity.ok(Map.of("message", "Programme de mission créé avec succès", "programmeMission", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ProgrammeMission programmeMission) {
        try {
            ProgrammeMission updated = programmeMissionService.updateProgrammeMission(id, programmeMission);
            return ResponseEntity.ok(Map.of("message", "Programme de mission mis à jour", "programmeMission", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            programmeMissionService.deleteProgrammeMission(id);
            return ResponseEntity.ok(Map.of("message", "Programme de mission supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", programmeMissionService.getAllProgrammesMission().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
