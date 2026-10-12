package com.employeehub.controller;

import com.employeehub.model.User;
import com.employeehub.repository.UserRepository;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.AttendanceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    public AdminController(UserRepository userRepository, EmployeeRepository employeeRepository,
                          AttendanceRepository attendanceRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
    }

    // Liste des utilisateurs avec pagination et recherche
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        
        try {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
            Page<User> userPage;
            
            if (search != null && !search.trim().isEmpty()) {
                if (role != null && !role.trim().isEmpty()) {
                    User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
                    userPage = userRepository.findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseAndRole(
                        search, search, search, roleEnum, pageable);
                } else {
                    userPage = userRepository.findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        search, search, search, pageable);
                }
            } else if (role != null && !role.trim().isEmpty()) {
                User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
                userPage = userRepository.findByRole(roleEnum, pageable);
            } else {
                userPage = userRepository.findAll(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", userPage.getContent());
            response.put("total", userPage.getTotalElements());
            response.put("page", page);
            response.put("totalPages", userPage.getTotalPages());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Détails d'un utilisateur
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Modifier un utilisateur
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            
            if (updates.containsKey("firstName")) {
                user.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("role")) {
                String roleStr = (String) updates.get("role");
                user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
            }
            if (updates.containsKey("isActive")) {
                user.setActive((Boolean) updates.get("isActive"));
            }
            
            user.setUpdatedAt(LocalDateTime.now());
            User saved = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur mis à jour avec succès");
            response.put("user", saved);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Supprimer un utilisateur
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            userRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur supprimé avec succès");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Activer/désactiver un utilisateur
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            user.setActive(!user.isActive());
            user.setUpdatedAt(LocalDateTime.now());
            User saved = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", saved.isActive() ? "Utilisateur activé" : "Utilisateur désactivé");
            response.put("isActive", saved.isActive());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Statistiques du dashboard admin
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalUsers = userRepository.count();
            long totalEmployees = employeeRepository.count();
            long activeEmployees = employeeRepository.countByStatus("active");
            
            // Présents aujourd'hui
            LocalDate today = LocalDate.now();
            long presentToday = attendanceRepository.countByDateAndStatus(today, com.employeehub.model.Attendance.AttendanceStatus.PRESENT) +
                               attendanceRepository.countByDateAndStatus(today, com.employeehub.model.Attendance.AttendanceStatus.LATE);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalEmployees", totalEmployees);
            stats.put("activeEmployees", activeEmployees);
            stats.put("presentToday", presentToday);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
