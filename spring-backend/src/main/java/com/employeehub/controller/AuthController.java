package com.employeehub.controller;

import com.employeehub.config.JwtUtil;
import com.employeehub.dto.LoginRequest;
import com.employeehub.dto.LoginResponse;
import com.employeehub.dto.RegisterRequest;
import com.employeehub.model.Employee;
import com.employeehub.model.User;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001","http://localhost:3002"})
public class AuthController {

    private final UserRepository     userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder    passwordEncoder;
    private final JwtUtil            jwtUtil;

    public AuthController(UserRepository userRepository, EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository     = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder    = passwordEncoder;
        this.jwtUtil            = jwtUtil;
    }

    // ── Connexion : email + mot de passe → JWT ───────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            String key = req.getEmail() == null ? "" : req.getEmail().toLowerCase();
            if (isLockedOut(key))
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Trop de tentatives. Réessayez dans quelques minutes."));

            Optional<User> opt = userRepository.findByEmail(req.getEmail());
            if (opt.isEmpty() || !passwordEncoder.matches(req.getPassword(), opt.get().getPassword())) {
                recordFailure(key);
                return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe incorrect"));
            }

            User user = opt.get();
            if (!user.isActive())
                return ResponseEntity.badRequest().body(Map.of("message", "Compte désactivé"));

            failedLogins.remove(key);
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), String.valueOf(user.getId()));
            
            return ResponseEntity.ok(new LoginResponse(
                token, String.valueOf(user.getId()), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name(),
                user.isPasswordChangeRequired()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Inscription nouvel employé ────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            // Email déjà utilisé ?
            if (userRepository.findByEmail(req.getEmail()).isPresent())
                return ResponseEntity.badRequest().body(Map.of("message", "Cet email est déjà utilisé"));

            // Générer ID employé unique
            String empId = "EMP" + String.format("%04d", (int)(Math.random() * 9000) + 1000);
            while (employeeRepository.existsByEmployeeId(empId)) {
                empId = "EMP" + String.format("%04d", (int)(Math.random() * 9000) + 1000);
            }

            // Créer le compte User
            User user = new User();
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setFirstName(req.getFirstName());
            user.setLastName(req.getLastName());
            // L'inscription publique crée toujours un EMPLOYEE.
            // Les comptes RH/ADMIN sont attribués par un administrateur (/admin/users).
            user.setRole(User.Role.EMPLOYEE);
            user.setActive(true);
            userRepository.save(user);

            // Créer le profil Employee
            Employee emp = new Employee();
            emp.setEmployeeId(empId);
            emp.setFirstName(req.getFirstName());
            emp.setLastName(req.getLastName());
            emp.setEmail(req.getEmail());
            emp.setPhone(req.getPhone());
            emp.setDepartment(req.getDepartment());
            emp.setPosition(req.getPosition());
            emp.setAddress(buildAddress(req.getAddress(), req.getCity()));
            emp.setEmergencyContact(req.getEmergencyContactName());
            emp.setEmergencyPhone(req.getEmergencyContactPhone());
            if (req.getHireDate() != null && !req.getHireDate().isBlank()) {
                emp.setHireDate(LocalDate.parse(req.getHireDate()));
            } else {
                emp.setHireDate(LocalDate.now());
            }
            employeeRepository.save(emp);

            return ResponseEntity.ok(Map.of(
                "message",    "Inscription réussie ! Bienvenue dans Khadamati.",
                "employeeId", empId
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Modifier le profil ────────────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();

            if (body.containsKey("firstName") && !body.get("firstName").isBlank())
                user.setFirstName(body.get("firstName"));
            if (body.containsKey("lastName") && !body.get("lastName").isBlank())
                user.setLastName(body.get("lastName"));

            userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                "message",   "Profil mis à jour",
                "firstName", user.getFirstName(),
                "lastName",  user.getLastName(),
                "email",     user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Changer le mot de passe ───────────────────────────────────────────────
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();

            String currentPwd = body.get("currentPassword");
            String newPwd     = body.get("newPassword");

            if (!passwordEncoder.matches(currentPwd, user.getPassword()))
                return ResponseEntity.badRequest().body(Map.of("message", "Mot de passe actuel incorrect"));
            if (newPwd == null || newPwd.length() < 6)
                return ResponseEntity.badRequest().body(Map.of("message", "Le nouveau mot de passe doit contenir au moins 6 caractères"));

            user.setPassword(passwordEncoder.encode(newPwd));
            user.setPasswordChangeRequired(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Profil utilisateur connecté ───────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();
            return ResponseEntity.ok(new LoginResponse(
                null, String.valueOf(user.getId()), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name(),
                user.isPasswordChangeRequired()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token invalide"));
        }
    }

    // ── Limitation des tentatives de connexion (en mémoire) ───────────────────
    private static final int MAX_FAILED_LOGINS = 5;
    private static final long LOCKOUT_MILLIS = 15 * 60 * 1000L;
    private final Map<String, long[]> failedLogins = new ConcurrentHashMap<>(); // {count, firstFailureAt}

    private boolean isLockedOut(String key) {
        long[] e = failedLogins.get(key);
        if (e == null) return false;
        if (System.currentTimeMillis() - e[1] > LOCKOUT_MILLIS) {
            failedLogins.remove(key);
            return false;
        }
        return e[0] >= MAX_FAILED_LOGINS;
    }

    private void recordFailure(String key) {
        failedLogins.merge(key, new long[]{1, System.currentTimeMillis()},
            (old, fresh) -> new long[]{old[0] + 1, old[1]});
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 2) return email;
        return email.charAt(0) + "***" + email.charAt(at - 1) + email.substring(at);
    }

    private String buildAddress(String address, String city) {
        if (address == null && city == null) return null;
        if (address == null) return city;
        if (city == null) return address;
        return address + ", " + city;
    }
}
