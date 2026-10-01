package com.employeehub.controller;

import com.employeehub.model.TypeDocument;
import com.employeehub.service.TypeDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/types-documents")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TypeDocumentController {

    @Autowired
    private TypeDocumentService typeDocumentService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Boolean actif) {
        try {
            if (actif != null && actif) return ResponseEntity.ok(typeDocumentService.getActiveTypesDocuments());
            return ResponseEntity.ok(typeDocumentService.getAllTypesDocuments());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return typeDocumentService.getTypeDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return typeDocumentService.getTypeDocumentByCode(code)
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
            if (libelleFr != null) return ResponseEntity.ok(typeDocumentService.searchTypesDocumentsByLibelleFr(libelleFr));
            if (libelleAr != null) return ResponseEntity.ok(typeDocumentService.searchTypesDocumentsByLibelleAr(libelleAr));
            return ResponseEntity.ok(typeDocumentService.getAllTypesDocuments());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TypeDocument typeDocument) {
        try {
            TypeDocument saved = typeDocumentService.createTypeDocument(typeDocument);
            return ResponseEntity.ok(Map.of("message", "Type de document créé avec succès", "typeDocument", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody TypeDocument typeDocument) {
        try {
            TypeDocument updated = typeDocumentService.updateTypeDocument(id, typeDocument);
            return ResponseEntity.ok(Map.of("message", "Type de document mis à jour", "typeDocument", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        try {
            TypeDocument updated = typeDocumentService.toggleTypeDocumentStatus(id);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "typeDocument", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            typeDocumentService.deleteTypeDocument(id);
            return ResponseEntity.ok(Map.of("message", "Type de document supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", typeDocumentService.getAllTypesDocuments().size());
            stats.put("actifs", typeDocumentService.countActiveTypesDocuments());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
