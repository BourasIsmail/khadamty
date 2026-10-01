package com.employeehub.controller;

import com.employeehub.model.Annonce;
import com.employeehub.service.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/annonces")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean active,
                                    @RequestParam(required = false) Long userId) {
        try {
            if (active != null && active) {
                return ResponseEntity.ok(annonceService.getAnnoncesActivesOrderByDate());
            }
            if (userId != null) {
                return ResponseEntity.ok(annonceService.getAnnoncesByCreateur(userId));
            }
            return ResponseEntity.ok(annonceService.getAllAnnonces());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return annonceService.getAnnonceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveNotExpired() {
        try {
            return ResponseEntity.ok(annonceService.getAnnoncesActiveAndNotExpired());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Annonce annonce) {
        try {
            Annonce saved = annonceService.createAnnonce(annonce);
            return ResponseEntity.ok(Map.of("message", "Annonce créée avec succès", "annonce", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Annonce annonce) {
        try {
            Annonce updated = annonceService.updateAnnonce(id, annonce);
            return ResponseEntity.ok(Map.of("message", "Annonce mise à jour", "annonce", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/activer")
    public ResponseEntity<?> activer(@PathVariable String id) {
        try {
            Annonce updated = annonceService.activerAnnonce(id);
            return ResponseEntity.ok(Map.of("message", "Annonce activée", "annonce", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/desactiver")
    public ResponseEntity<?> desactiver(@PathVariable String id) {
        try {
            Annonce updated = annonceService.desactiverAnnonce(id);
            return ResponseEntity.ok(Map.of("message", "Annonce désactivée", "annonce", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            annonceService.deleteAnnonce(id);
            return ResponseEntity.ok(Map.of("message", "Annonce supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", annonceService.countAllAnnonces());
            stats.put("actives", annonceService.getAnnoncesActives().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
