package com.employeehub.controller;

import com.employeehub.config.JwtUtil;
import com.employeehub.dto.LoginRequest;
import com.employeehub.dto.LoginResponse;
import com.employeehub.dto.RegisterRequest;
import com.employeehub.model.Employee;
import com.employeehub.model.User;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.UserRepository;
import com.employeehub.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001","http://localhost:3002"})
public class AuthController {

    private final UserRepository     userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder    passwordEncoder;
    private final JwtUtil            jwtUtil;
    private final OtpService         otpService;

    public AuthController(UserRepository userRepository, EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil, OtpService otpService) {
        this.userRepository     = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder    = passwordEncoder;
        this.jwtUtil            = jwtUtil;
        this.otpService         = otpService;
    }

    // ── Étape 1 : email + mot de passe → envoyer OTP seulement si email non vérifié ─────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            Optional<User> opt = userRepository.findByEmail(req.getEmail());
            if (opt.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe incorrect"));

            User user = opt.get();
            if (!user.isActive())
                return ResponseEntity.badRequest().body(Map.of("message", "Compte désactivé"));
            
            boolean passwordMatch = passwordEncoder.matches(req.getPassword(), user.getPassword());
            System.out.println("🔐 Login attempt: " + req.getEmail() + " | Role: " + user.getRole().name() + " | PasswordMatch: " + passwordMatch);
            
            if (!passwordMatch)
                return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe incorrect"));

            // ✅ CONNEXION DIRECTE SANS OTP - OTP désactivé
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

    // ── Étape 2 : vérifier OTP → retourner JWT et marquer email comme vérifié ───────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code  = body.get("code");
            if (email == null || code == null)
                return ResponseEntity.badRequest().body(Map.of("message", "Email et code requis"));

            if (!otpService.verifyOtp(email, code))
                return ResponseEntity.badRequest().body(Map.of("message", "Code incorrect ou expiré"));

            User user = userRepository.findByEmail(email).orElseThrow();
            
            // Marquer l'email comme vérifié (première connexion réussie)
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
                System.out.println("✅ Email vérifié pour: " + email + " - Plus besoin d'OTP pour les prochaines connexions");
            }
            
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

    // ── Renvoyer OTP ──────────────────────────────────────────────────────────
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Email non trouvé"));
            otpService.generateAndSendOtp(user.getEmail(), user.getFirstName());
            return ResponseEntity.ok(Map.of("message", "Nouveau code envoyé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Debug : vérifier si un compte existe ─────────────────────────────────
    @GetMapping("/debug/check/{email}")
    public ResponseEntity<?> debugCheck(@PathVariable String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("exists", false, "message", "Aucun compte trouvé pour: " + email));
            }
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "exists", true,
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "isActive", user.isActive(),
                "emailVerified", user.isEmailVerified(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Debug : Réinitialiser la vérification email (pour tests) ─────────────────────────────────
    @PostMapping("/debug/reset-verification/{email}")
    public ResponseEntity<?> resetEmailVerification(@PathVariable String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Utilisateur non trouvé"));
            }
            User user = userOpt.get();
            user.setEmailVerified(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                "message", "Vérification email réinitialisée pour: " + email,
                "emailVerified", false
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
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
            // Rôle : RH si spécifié, sinon EMPLOYEE par défaut
            User.Role role = User.Role.EMPLOYEE;
            if ("RH".equalsIgnoreCase(req.getRole())) role = User.Role.RH;
            user.setRole(role);
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
