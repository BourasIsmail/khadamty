package com.employeehub.controller;

import com.employeehub.model.NoteAnnuelle;
import com.employeehub.service.NoteAnnuelleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notes-annuelles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class NoteAnnuelleController {

    @Autowired
    private NoteAnnuelleService noteAnnuelleService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId,
                                    @RequestParam(required = false) Integer annee) {
        try {
            if (employeeId != null) return ResponseEntity.ok(noteAnnuelleService.getNotesByEmployee(employeeId));
            if (annee != null) return ResponseEntity.ok(noteAnnuelleService.getNotesByYear(annee));
            return ResponseEntity.ok(noteAnnuelleService.getAllNotesAnnuelles());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return noteAnnuelleService.getNoteAnnuelleById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody NoteAnnuelle note) {
        try {
            return ResponseEntity.ok(Map.of("message", "Note créée", "note", noteAnnuelleService.createNoteAnnuelle(note)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody NoteAnnuelle note) {
        try {
            return ResponseEntity.ok(Map.of("message", "Note mise à jour", "note", noteAnnuelleService.updateNoteAnnuelle(id, note)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            noteAnnuelleService.deleteNoteAnnuelle(id);
            return ResponseEntity.ok(Map.of("message", "Note supprimée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(Map.of("total", noteAnnuelleService.getAllNotesAnnuelles().size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
