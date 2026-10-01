package com.employeehub.controller;

import com.employeehub.model.Credit;
import com.employeehub.service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/credits")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CreditController {

    @Autowired
    private CreditService creditService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId) {
        try {
            if (employeeId != null) return ResponseEntity.ok(creditService.getCreditsByEmployee(employeeId));
            return ResponseEntity.ok(creditService.getAllCredits());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return creditService.getCreditById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Credit credit) {
        try {
            return ResponseEntity.ok(Map.of("message", "Crédit créé", "credit", creditService.createCredit(credit)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Credit credit) {
        try {
            return ResponseEntity.ok(Map.of("message", "Crédit mis à jour", "credit", creditService.updateCredit(id, credit)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            creditService.deleteCredit(id);
            return ResponseEntity.ok(Map.of("message", "Crédit supprimé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(Map.of("total", creditService.getAllCredits().size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
