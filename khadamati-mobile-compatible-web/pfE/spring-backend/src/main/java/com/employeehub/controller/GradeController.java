package com.employeehub.controller;

import com.employeehub.model.Grade;
import com.employeehub.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/grades")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Grade> grades = gradeService.getAllGrades();
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return gradeService.getGradeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable Integer code) {
        try {
            return gradeService.getGradeByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/echelle/{echelle}")
    public ResponseEntity<?> getByEchelle(@PathVariable Integer echelle) {
        try {
            return ResponseEntity.ok(gradeService.getGradesByEchelle(echelle));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String libelleFr,
                                    @RequestParam(required = false) String libelleAr) {
        try {
            if (libelleFr != null) return ResponseEntity.ok(gradeService.searchGradesByLibelleFr(libelleFr));
            if (libelleAr != null) return ResponseEntity.ok(gradeService.searchGradesByLibelleAr(libelleAr));
            return ResponseEntity.ok(gradeService.getAllGrades());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Grade grade) {
        try {
            if (gradeService.existsByCode(grade.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ce code de grade existe déjà"));
            }
            Grade saved = gradeService.createGrade(grade);
            return ResponseEntity.ok(Map.of("message", "Grade créé avec succès", "grade", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Grade grade) {
        try {
            Grade updated = gradeService.updateGrade(id, grade);
            return ResponseEntity.ok(Map.of("message", "Grade mis à jour", "grade", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            gradeService.deleteGrade(id);
            return ResponseEntity.ok(Map.of("message", "Grade supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", gradeService.countGrades());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
