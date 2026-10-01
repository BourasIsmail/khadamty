package com.employeehub.controller;

import com.employeehub.model.Prime;
import com.employeehub.service.PrimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/primes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PrimeController {

    @Autowired
    private PrimeService primeService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String employeeId) {
        try {
            if (employeeId != null) return ResponseEntity.ok(primeService.getPrimesByEmployee(employeeId));
            return ResponseEntity.ok(primeService.getAllPrimes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return primeService.getPrimeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Prime prime) {
        try {
            return ResponseEntity.ok(Map.of("message", "Prime créée", "prime", primeService.createPrime(prime)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Prime prime) {
        try {
            return ResponseEntity.ok(Map.of("message", "Prime mise à jour", "prime", primeService.updatePrime(id, prime)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            primeService.deletePrime(id);
            return ResponseEntity.ok(Map.of("message", "Prime supprimée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(Map.of("total", primeService.getAllPrimes().size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
