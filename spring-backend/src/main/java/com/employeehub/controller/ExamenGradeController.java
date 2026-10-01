package com.employeehub.controller;

import com.employeehub.model.ExamenGrade;
import com.employeehub.service.ExamenGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/examens")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ExamenGradeController {

    @Autowired
    private ExamenGradeService examenGradeService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Integer annee,
                                    @RequestParam(required = false) String gradeId,
                                    @RequestParam(required = false) Boolean avenir) {
        try {
            if (avenir != null && avenir) return ResponseEntity.ok(examenGradeService.getExamensAvenir());
            if (annee != null) return ResponseEntity.ok(examenGradeService.getExamensByYear(Year.of(annee)));
            if (gradeId != null) return ResponseEntity.ok(examenGradeService.getExamensByGradeCible(gradeId));
            return ResponseEntity.ok(examenGradeService.getAllExamensGrade());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return examenGradeService.getExamenGradeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/passes")
    public ResponseEntity<?> getPasses() {
        try {
            return ResponseEntity.ok(examenGradeService.getExamensPasses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ExamenGrade examenGrade) {
        try {
            ExamenGrade saved = examenGradeService.createExamenGrade(examenGrade);
            return ResponseEntity.ok(Map.of("message", "Examen créé avec succès", "examen", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ExamenGrade examenGrade) {
        try {
            ExamenGrade updated = examenGradeService.updateExamenGrade(id, examenGrade);
            return ResponseEntity.ok(Map.of("message", "Examen mis à jour", "examen", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            examenGradeService.deleteExamenGrade(id);
            return ResponseEntity.ok(Map.of("message", "Examen supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", examenGradeService.getAllExamensGrade().size());
            stats.put("avenir", examenGradeService.getExamensAvenir().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
