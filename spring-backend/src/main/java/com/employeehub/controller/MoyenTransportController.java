package com.employeehub.controller;

import com.employeehub.model.MoyenTransport;
import com.employeehub.service.MoyenTransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/moyens-transport")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class MoyenTransportController {

    @Autowired
    private MoyenTransportService moyenTransportService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(moyenTransportService.getAllMoyensTransport());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return moyenTransportService.getMoyenTransportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return moyenTransportService.getMoyenTransportByCode(code)
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
            if (libelleFr != null) return ResponseEntity.ok(moyenTransportService.searchMoyensTransportByLibelleFr(libelleFr));
            if (libelleAr != null) return ResponseEntity.ok(moyenTransportService.searchMoyensTransportByLibelleAr(libelleAr));
            return ResponseEntity.ok(moyenTransportService.getAllMoyensTransport());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MoyenTransport moyenTransport) {
        try {
            if (moyenTransportService.existsByCode(moyenTransport.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code existe déjà"));
            }
            MoyenTransport saved = moyenTransportService.createMoyenTransport(moyenTransport);
            return ResponseEntity.ok(Map.of("message", "Moyen de transport créé avec succès", "moyenTransport", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody MoyenTransport moyenTransport) {
        try {
            MoyenTransport updated = moyenTransportService.updateMoyenTransport(id, moyenTransport);
            return ResponseEntity.ok(Map.of("message", "Moyen de transport mis à jour", "moyenTransport", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            moyenTransportService.deleteMoyenTransport(id);
            return ResponseEntity.ok(Map.of("message", "Moyen de transport supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", moyenTransportService.getAllMoyensTransport().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
