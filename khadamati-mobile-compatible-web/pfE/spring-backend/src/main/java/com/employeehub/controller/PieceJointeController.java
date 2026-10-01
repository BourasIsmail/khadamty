package com.employeehub.controller;

import com.employeehub.model.PieceJointe;
import com.employeehub.service.PieceJointeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pieces-jointes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PieceJointeController {

    @Autowired
    private PieceJointeService pieceJointeService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String demandeId) {
        try {
            if (demandeId != null) return ResponseEntity.ok(pieceJointeService.getPiecesJointesByDemande(demandeId));
            return ResponseEntity.ok(pieceJointeService.getAllPiecesJointes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return pieceJointeService.getPieceJointeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PieceJointe pieceJointe) {
        try {
            PieceJointe saved = pieceJointeService.createPieceJointe(pieceJointe);
            return ResponseEntity.ok(Map.of("message", "Pièce jointe créée avec succès", "pieceJointe", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody PieceJointe pieceJointe) {
        try {
            PieceJointe updated = pieceJointeService.updatePieceJointe(id, pieceJointe);
            return ResponseEntity.ok(Map.of("message", "Pièce jointe mise à jour", "pieceJointe", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            pieceJointeService.deletePieceJointe(id);
            return ResponseEntity.ok(Map.of("message", "Pièce jointe supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/demande/{demandeId}")
    public ResponseEntity<?> deleteByDemande(@PathVariable String demandeId) {
        try {
            pieceJointeService.deletePiecesJointesByDemande(demandeId);
            return ResponseEntity.ok(Map.of("message", "Pièces jointes supprimées avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/demande/{demandeId}/count")
    public ResponseEntity<?> countByDemande(@PathVariable String demandeId) {
        try {
            long count = pieceJointeService.countByDemande(demandeId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
