package com.employeehub.controller;

import com.employeehub.config.JwtUtil;
import com.employeehub.dto.DocumentRequestDto;
import com.employeehub.dto.LeaveRequestDto;
import com.employeehub.model.*;
import com.employeehub.repository.*;
import com.employeehub.service.OtpService;
import com.employeehub.service.PasswordGeneratorService;
import com.employeehub.service.PdfGenerationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaireRepository salaireRepository;
    private final OrdreMissionRepository ordreMissionRepository;
    private final AnnonceRepository annonceRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final PasswordGeneratorService passwordGeneratorService;
    private final PdfGenerationService pdfGenerationService;

    public EmployeeController(EmployeeRepository employeeRepository, UserRepository userRepository,
                             LeaveRequestRepository leaveRequestRepository, 
                             DocumentRequestRepository documentRequestRepository,
                             AttendanceRepository attendanceRepository,
                             SalaireRepository salaireRepository,
                             OrdreMissionRepository ordreMissionRepository,
                             AnnonceRepository annonceRepository,
                             DocumentRepository documentRepository,
                             PasswordEncoder passwordEncoder, JwtUtil jwtUtil, OtpService otpService,
                             PasswordGeneratorService passwordGeneratorService,
                             PdfGenerationService pdfGenerationService) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaireRepository = salaireRepository;
        this.ordreMissionRepository = ordreMissionRepository;
        this.annonceRepository = annonceRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.passwordGeneratorService = passwordGeneratorService;
        this.pdfGenerationService = pdfGenerationService;
    }

    // ==================== ENDPOINTS EMPLOYEE (rôle EMPLOYEE) ====================

    // Obtenir le profil de l'employé connecté
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employee = employeeRepository.findByEmail(email);
            
            if (employee.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(employee.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Voir le solde de congés
    @GetMapping("/leave-balance")
    public ResponseEntity<?> getLeaveBalance(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            
            // Créer un objet avec les soldes
            var leaveBalance = new Object() {
                public final Integer annualLeave = employee.getAnnualLeaveBalance();
                public final Integer sickLeave = employee.getSickLeaveBalance();
                public final Integer personalLeave = employee.getPersonalLeaveBalance();
                public final Integer totalLeave = annualLeave + sickLeave + personalLeave;
            };
            
            return ResponseEntity.ok(leaveBalance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Demander un congé
    @PostMapping("/leave-request")
    public ResponseEntity<?> requestLeave(@Valid @RequestBody LeaveRequestDto requestDto,
                                         @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setEmployeeId(employee.getEmployeeId());
            leaveRequest.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
            leaveRequest.setLeaveType(requestDto.getLeaveType());
            leaveRequest.setStartDate(requestDto.getStartDate());
            leaveRequest.setEndDate(requestDto.getEndDate());
            leaveRequest.setDaysRequested(requestDto.getDaysRequested());
            leaveRequest.setReason(requestDto.getReason());
            
            LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
            return ResponseEntity.ok(saved);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Voir ses demandes de congés
    @GetMapping("/leave-requests")
    public ResponseEntity<?> getMyLeaveRequests(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeId(employee.getEmployeeId());
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Demander un document
    @PostMapping("/document-request")
    public ResponseEntity<?> requestDocument(@Valid @RequestBody DocumentRequestDto requestDto,
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            
            DocumentRequest documentRequest = new DocumentRequest();
            documentRequest.setEmployeeId(employee.getEmployeeId());
            documentRequest.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
            documentRequest.setDocumentType(requestDto.getDocumentType());
            documentRequest.setPurpose(requestDto.getPurpose());
            
            DocumentRequest saved = documentRequestRepository.save(documentRequest);
            return ResponseEntity.ok(saved);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Voir ses demandes de documents
    @GetMapping("/document-requests")
    public ResponseEntity<?> getMyDocumentRequests(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            List<DocumentRequest> requests = documentRequestRepository.findByEmployeeId(employee.getEmployeeId());
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Voir ses présences
    @GetMapping("/attendances")
    public ResponseEntity<?> getMyAttendances(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            List<Attendance> attendances = attendanceRepository.findByEmployeeId(employee.getEmployeeId());
            
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/announcements")
    public ResponseEntity<?> getEmployeeAnnouncements() {
        try {
            return ResponseEntity.ok(
                annonceRepository.findActiveAndNotExpired(LocalDateTime.now())
                    .stream()
                    .map(this::toAnnouncementResponse)
                    .toList()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/documents")
    public ResponseEntity<?> getEmployeeDocuments(@RequestParam(required = false) String typeId) {
        try {
            List<Document> documents = (typeId != null && !typeId.isBlank())
                ? documentRepository.findByTypeDocumentId(typeId).stream()
                    .filter(d -> Boolean.TRUE.equals(d.getEstPublic()) && !Boolean.TRUE.equals(d.getEstArchive()))
                    .toList()
                : documentRepository.findByEstPublicTrueAndEstArchiveFalse();

            return ResponseEntity.ok(documents.stream().map(this::toDocumentResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/documents/{id}/download-pdf")
    public ResponseEntity<?> downloadEmployeeDocumentPdf(@PathVariable String id) {
        try {
            Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + id));

            if (!Boolean.TRUE.equals(document.getEstPublic()) || Boolean.TRUE.equals(document.getEstArchive())) {
                return ResponseEntity.status(403).body(Map.of("message", "Document non disponible pour les employés"));
            }

            byte[] pdf = pdfGenerationService.generateDocumentSummaryPdf(document);
            document.setNbTelechargements((document.getNbTelechargements() != null ? document.getNbTelechargements() : 0) + 1);
            documentRepository.save(document);

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + documentFilename(document) + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/mission-orders")
    public ResponseEntity<?> getMyMissionOrders(@RequestHeader("Authorization") String token,
                                                @RequestParam(required = false) String statut) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Employee employee = employeeOpt.get();
            List<OrdreMission> ordres;
            if (statut != null && !statut.isBlank()) {
                ordres = ordreMissionRepository.findByEmployeeIdAndStatut(
                    employee.getId(),
                    OrdreMission.StatutOrdreMission.valueOf(statut.toUpperCase())
                );
            } else {
                ordres = ordreMissionRepository.findByEmployeeId(employee.getId());
            }

            return ResponseEntity.ok(ordres.stream().map(this::toMissionOrderResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Voir ses bulletins de paie
    @GetMapping("/pay-slips")
    public ResponseEntity<?> getMyPaySlips(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) Integer annee,
            @RequestParam(required = false) Integer mois) {
        try {
            if (mois != null && (mois < 1 || mois > 12)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Le mois doit être entre 1 et 12"));
            }

            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Employee employee = employeeOpt.get();
            Long employeeId = employee.getId();
            List<Salaire> salaires;

            if (annee != null && mois != null) {
                salaires = salaireRepository.findByEmployeeIdAndAnneeAndMois(employeeId, annee.shortValue(), mois.byteValue())
                        .map(List::of)
                        .orElseGet(List::of);
            } else if (annee != null) {
                salaires = salaireRepository.findByEmployeeIdAndAnnee(employeeId, annee.shortValue());
            } else {
                salaires = salaireRepository.findByEmployeeId(employeeId);
            }

            salaires.sort(Comparator
                    .comparing(Salaire::getAnnee, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Salaire::getMois, Comparator.nullsLast(Comparator.reverseOrder())));

            List<Map<String, Object>> bulletins = salaires.stream()
                    .map(this::toPayslip)
                    .toList();

            if (bulletins.isEmpty() && employee.getSalary() != null) {
                Integer bulletinAnnee = annee != null ? annee : LocalDate.now().getYear();
                Integer bulletinMois = mois != null ? mois : LocalDate.now().getMonthValue();
                bulletins = List.of(toVirtualPayslip(employee, bulletinAnnee, bulletinMois));
            }

            return ResponseEntity.ok(bulletins);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/pay-slips/{salaireId}/pdf")
    public ResponseEntity<?> downloadMyPaySlipPdf(@PathVariable String salaireId,
                                                  @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employe introuvable"));

            if (salaireId.startsWith("virtual-")) {
                String[] parts = salaireId.split("-");
                Integer annee = parts.length >= 3 ? Integer.parseInt(parts[1]) : LocalDate.now().getYear();
                Integer mois = parts.length >= 3 ? Integer.parseInt(parts[2]) : LocalDate.now().getMonthValue();
                byte[] pdf = pdfGenerationService.generateEmployeePayslipPdf(employee, annee, mois);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bulletin-paie-" + safeFilePart(employee.getEmployeeId()) + "-" + annee + "-" + mois + ".pdf\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(pdf);
            }

            Salaire salaire = salaireRepository.findById(salaireId)
                    .orElseThrow(() -> new RuntimeException("Bulletin introuvable"));

            if (salaire.getEmployee() == null || !employee.getId().equals(salaire.getEmployee().getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Acces refuse a ce bulletin"));
            }

            byte[] pdf = pdfGenerationService.generatePayslipPdf(salaire);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + payslipFilename(salaire) + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/profile/salary")
    public ResponseEntity<?> revealMySalary(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employe introuvable"));
            return ResponseEntity.ok(Map.of(
                    "employeeId", employee.getId(),
                    "employeeMatricule", employee.getEmployeeId(),
                    "salary", employee.getSalary() != null ? employee.getSalary() : 0
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==================== ENDPOINTS ADMIN/RH ====================

    // Statistiques des employés
    @GetMapping("/stats")
    public ResponseEntity<?> getEmployeeStats() {
        try {
            long totalEmployees = employeeRepository.count();
            long activeEmployees = employeeRepository.countByStatus("active");
            long inactiveEmployees = employeeRepository.countByStatus("inactive");
            long terminatedEmployees = employeeRepository.countByStatus("terminated");
            
            // Statistiques par département - version simplifiée
            List<Map<String, Object>> departmentStats = new ArrayList<>();
            List<Employee> allEmployees = employeeRepository.findAll();
            Map<String, Long> deptCounts = new HashMap<>();
            
            for (Employee emp : allEmployees) {
                String dept = emp.getDepartment();
                deptCounts.put(dept, deptCounts.getOrDefault(dept, 0L) + 1);
            }
            
            for (Map.Entry<String, Long> entry : deptCounts.entrySet()) {
                Map<String, Object> deptStat = new HashMap<>();
                deptStat.put("department", entry.getKey());
                deptStat.put("count", entry.getValue());
                departmentStats.add(deptStat);
            }
            
            // Nouveaux ce mois
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            long newThisMonth = employeeRepository.countByCreatedAtAfter(startOfMonth);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total_employees", totalEmployees);
            stats.put("active_employees", activeEmployees);
            stats.put("inactive_employees", inactiveEmployees);
            stats.put("terminated_employees", terminatedEmployees);
            stats.put("department_stats", departmentStats);
            stats.put("new_this_month", newThisMonth);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Liste des employés avec pagination et filtres
    @GetMapping("")
    public ResponseEntity<?> getEmployees(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status) {
        
        try {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
            Page<Employee> employeePage = employeeRepository.findAll(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("employees", employeePage.getContent());
            response.put("total", employeePage.getTotalElements());
            response.put("page", page);
            response.put("total_pages", employeePage.getTotalPages());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Détails d'un employé
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(employeeOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Créer un employé
    @PostMapping("")
    public ResponseEntity<?> createEmployee(@RequestBody Map<String, Object> employeeData) {
        try {
            String email      = (String) employeeData.get("email");
            String employeeId = (String) employeeData.get("employee_id");

            // Vérifier les doublons
            if (employeeRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cet email est déjà utilisé"));
            }
            if (employeeId != null && employeeRepository.existsByEmployeeId(employeeId)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cet ID employé est déjà utilisé"));
            }
            if (employeeId == null || employeeId.isBlank()) {
                employeeId = generateEmployeeId();
            }

            Employee employee = new Employee();
            employee.setEmployeeId(employeeId);
            employee.setFirstName((String) employeeData.get("first_name"));
            employee.setLastName((String) employeeData.get("last_name"));
            employee.setEmail(email);
            employee.setPhone((String) employeeData.get("phone"));
            employee.setPosition((String) employeeData.get("position"));
            employee.setDepartment((String) employeeData.get("department"));

            // Salary — peut être String ou Number
            Object salaryObj = employeeData.get("salary");
            if (salaryObj != null) {
                if (salaryObj instanceof Number) {
                    employee.setSalary(((Number) salaryObj).doubleValue());
                } else {
                    employee.setSalary(Double.parseDouble(salaryObj.toString()));
                }
            }

            // Hire date
            String hireDateStr = (String) employeeData.get("hire_date");
            if (hireDateStr != null && !hireDateStr.isBlank()) {
                // Accepte yyyy-MM-dd ou ISO datetime
                employee.setHireDate(LocalDate.parse(hireDateStr.length() > 10
                    ? hireDateStr.substring(0, 10) : hireDateStr));
            } else {
                employee.setHireDate(LocalDate.now());
            }

            // Champs optionnels
            employee.setAddress((String) employeeData.get("street"));
            employee.setEmergencyContact((String) employeeData.get("ec_name"));
            employee.setEmergencyPhone((String) employeeData.get("ec_phone"));

            // Déterminer le rôle du compte à créer (user_role du frontend)
            String roleStr = (String) employeeData.get("user_role");
            User.Role accountRole = User.Role.EMPLOYEE;
            if ("user".equalsIgnoreCase(roleStr) || "RH".equalsIgnoreCase(roleStr)) {
                accountRole = User.Role.RH;
            }

            String password = passwordGeneratorService.generateTemporaryPassword();

            // Vérifier si un compte existe déjà pour cet email
            if (userRepository.findByEmail(email).isEmpty()) {
                User user = new User();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(password));
                user.setFirstName(employee.getFirstName());
                user.setLastName(employee.getLastName());
                user.setRole(accountRole);
                user.setActive(true);
                user.setPasswordChangeRequired(true);
                userRepository.save(user);
                System.out.println("✅ Compte créé pour: " + email + " | Rôle: " + accountRole.name());
            } else {
                System.out.println("⚠️ Compte déjà existant pour: " + email);
            }

            Employee saved = employeeRepository.save(employee);

            // Envoyer email de bienvenue avec les credentials
            try {
                otpService.sendWelcomeEmail(email, employee.getFirstName(), employee.getLastName(),
                    employeeId, password, accountRole.name());
            } catch (Exception mailEx) {
                System.err.println("❌ Email de bienvenue non envoyé: " + mailEx.getMessage());
                // Afficher dans les logs en cas d'échec d'envoi
                System.out.println("═══════════════════════════════════════════════");
                System.out.println("📧 NOUVEAU COMPTE CRÉÉ");
                System.out.println("═══════════════════════════════════════════════");
                System.out.println("Nom: " + employee.getFirstName() + " " + employee.getLastName());
                System.out.println("Email: " + email);
                System.out.println("ID Employé: " + employeeId);
                System.out.println("Mot de passe: " + password);
                System.out.println("Rôle: " + (accountRole == User.Role.RH ? "RH (Ressources Humaines)" : "Employé"));
                System.out.println("═══════════════════════════════════════════════");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employé créé avec succès. Un email de bienvenue a été envoyé.");
            response.put("employee", saved);
            response.put("temporaryPasswordGenerated", true);
            response.put("passwordChangeRequired", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    // Modifier un employé
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            
            // Mettre à jour les champs fournis
            if (updates.containsKey("first_name")) {
                employee.setFirstName((String) updates.get("first_name"));
            }
            if (updates.containsKey("last_name")) {
                employee.setLastName((String) updates.get("last_name"));
            }
            if (updates.containsKey("email")) {
                employee.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("phone")) {
                employee.setPhone((String) updates.get("phone"));
            }
            if (updates.containsKey("position")) {
                employee.setPosition((String) updates.get("position"));
            }
            if (updates.containsKey("department")) {
                employee.setDepartment((String) updates.get("department"));
            }
            if (updates.containsKey("salary")) {
                employee.setSalary(((Number) updates.get("salary")).doubleValue());
            }
            if (updates.containsKey("status")) {
                employee.setStatus((String) updates.get("status"));
            }
            
            employee.setUpdatedAt(LocalDateTime.now());
            Employee saved = employeeRepository.save(employee);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employé mis à jour avec succès");
            response.put("employee", saved);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Supprimer un employé
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee employee = employeeOpt.get();
            
            // Supprimer le compte utilisateur associé s'il existe
            Optional<User> userOpt = userRepository.findByEmail(employee.getEmail());
            if (userOpt.isPresent()) {
                userRepository.delete(userOpt.get());
            }
            
            employeeRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employé supprimé avec succès");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/salary")
    public ResponseEntity<?> revealEmployeeSalary(@PathVariable Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employe introuvable"));
            return ResponseEntity.ok(Map.of(
                    "employeeId", employee.getId(),
                    "employeeMatricule", employee.getEmployeeId(),
                    "employeeName", employee.getFirstName() + " " + employee.getLastName(),
                    "salary", employee.getSalary() != null ? employee.getSalary() : 0
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Map<String, Object> toPayslip(Salaire salaire) {
        BigDecimal net = defaultZero(salaire.getSalaireNet());
        BigDecimal allocFamiliale = defaultZero(salaire.getAllocFamiliale());
        BigDecimal retenueMutuelle = defaultZero(salaire.getRetenueMutuelle());
        BigDecimal rappel = defaultZero(salaire.getRappel());

        BigDecimal salaireBase = net.add(retenueMutuelle).subtract(allocFamiliale).subtract(rappel);
        if (salaireBase.compareTo(BigDecimal.ZERO) < 0) {
            salaireBase = BigDecimal.ZERO;
        }

        BigDecimal totalGains = salaireBase.add(allocFamiliale).add(rappel);
        BigDecimal totalDeductions = retenueMutuelle;

        Employee employee = salaire.getEmployee();
        Grade grade = salaire.getGrade();

        Map<String, Object> remuneration = new LinkedHashMap<>();
        remuneration.put("salaireBase", salaireBase);
        remuneration.put("allocFamiliale", allocFamiliale);
        remuneration.put("rappel", rappel);
        remuneration.put("totalGains", totalGains);

        Map<String, Object> deductions = new LinkedHashMap<>();
        deductions.put("mutuelle", retenueMutuelle);
        deductions.put("totalDeductions", totalDeductions);

        Map<String, Object> bulletin = new LinkedHashMap<>();
        bulletin.put("id", salaire.getId());
        bulletin.put("annee", salaire.getAnnee());
        bulletin.put("mois", salaire.getMois());
        bulletin.put("periodeLabel", monthLabel(salaire.getMois()) + " " + salaire.getAnnee());
        bulletin.put("employeeId", employee != null ? employee.getId() : null);
        bulletin.put("employeeMatricule", employee != null ? employee.getEmployeeId() : null);
        bulletin.put("employeeName", employee != null ? employee.getFirstName() + " " + employee.getLastName() : null);
        bulletin.put("department", employee != null ? employee.getDepartment() : null);
        bulletin.put("position", employee != null ? employee.getPosition() : null);
        bulletin.put("grade", grade != null ? grade.getLibelleFr() : null);
        bulletin.put("echelon", salaire.getEchelon());
        bulletin.put("dateGeneration", salaire.getCreeLe());
        bulletin.put("remuneration", remuneration);
        bulletin.put("deductions", deductions);
        bulletin.put("netAPayer", net);
        return bulletin;
    }

    private Map<String, Object> toVirtualPayslip(Employee employee, Integer annee, Integer mois) {
        BigDecimal net = BigDecimal.valueOf(employee.getSalary() != null ? employee.getSalary() : 0)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal retenueMutuelle = net.multiply(new BigDecimal("0.04")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal salaireBase = net.add(retenueMutuelle);

        Map<String, Object> remuneration = new LinkedHashMap<>();
        remuneration.put("salaireBase", salaireBase);
        remuneration.put("allocFamiliale", BigDecimal.ZERO);
        remuneration.put("rappel", BigDecimal.ZERO);
        remuneration.put("totalGains", salaireBase);

        Map<String, Object> deductions = new LinkedHashMap<>();
        deductions.put("mutuelle", retenueMutuelle);
        deductions.put("totalDeductions", retenueMutuelle);

        Map<String, Object> bulletin = new LinkedHashMap<>();
        bulletin.put("id", "virtual-" + annee + "-" + mois);
        bulletin.put("annee", annee);
        bulletin.put("mois", mois);
        bulletin.put("periodeLabel", monthLabel(mois.byteValue()) + " " + annee);
        bulletin.put("employeeId", employee.getId());
        bulletin.put("employeeMatricule", employee.getEmployeeId());
        bulletin.put("employeeName", employee.getFirstName() + " " + employee.getLastName());
        bulletin.put("department", employee.getDepartment());
        bulletin.put("position", employee.getPosition());
        bulletin.put("grade", null);
        bulletin.put("echelon", null);
        bulletin.put("dateGeneration", LocalDateTime.now());
        bulletin.put("remuneration", remuneration);
        bulletin.put("deductions", deductions);
        bulletin.put("netAPayer", net);
        bulletin.put("autoGenerated", true);
        return bulletin;
    }

    private Map<String, Object> toMissionOrderResponse(OrdreMission ordre) {
        Employee employee = ordre.getEmployee();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", ordre.getId());
        response.put("numero", ordre.getNumero());
        response.put("objet", ordre.getObjet());
        response.put("lieuDepart", ordre.getLieuDepart());
        response.put("lieuArrivee", ordre.getLieuArrivee());
        response.put("destination", ordre.getLieuArrivee());
        response.put("dateDepart", ordre.getDateDepart());
        response.put("dateRetour", ordre.getDateRetour());
        response.put("dateDebut", ordre.getDateDepart());
        response.put("dateFin", ordre.getDateRetour());
        response.put("dureeJours", ordre.getDureeJours());
        response.put("montantIndemnite", ordre.getMontantIndemnite());
        response.put("montantTransport", ordre.getMontantTransport());
        response.put("montantHebergement", ordre.getMontantHebergement());
        response.put("montantTotal", ordre.getMontantTotal());
        response.put("statut", ordre.getStatut());
        response.put("dateValidation", ordre.getDateValidation());
        response.put("validateur", ordre.getValidateur());
        response.put("observations", ordre.getObservations());
        response.put("creeLe", ordre.getCreeLe());
        response.put("employeNom", employee != null ? employee.getLastName() : null);
        response.put("employePrenom", employee != null ? employee.getFirstName() : null);
        response.put("employeMatricule", employee != null ? employee.getEmployeeId() : null);
        return response;
    }

    private Map<String, Object> toAnnouncementResponse(Annonce annonce) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", annonce.getId());
        response.put("titre", annonce.getTitre());
        response.put("message", annonce.getMessage());
        response.put("contenu", annonce.getMessage());
        response.put("estActive", annonce.getEstActive());
        response.put("estPubliee", Boolean.TRUE.equals(annonce.getEstActive()));
        response.put("type", "INFORMATION");
        response.put("priorite", "MOYENNE");
        response.put("publieLe", annonce.getPublieLe());
        response.put("datePublication", annonce.getPublieLe());
        response.put("expireLe", annonce.getExpireLe());
        response.put("publiePar", annonce.getPubliePar());
        return response;
    }

    private Map<String, Object> toDocumentResponse(Document document) {
        TypeDocument typeDocument = document.getTypeDocument();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", document.getId());
        response.put("titre", document.getTitre());
        response.put("description", document.getDescription());
        response.put("nomFichier", document.getNomFichier());
        response.put("typeMime", document.getTypeMime());
        response.put("tailleOctets", document.getTailleOctets());
        response.put("numeroReference", document.getNumeroReference());
        response.put("datePublication", document.getDatePublication());
        response.put("dateCreation", document.getDatePublication());
        response.put("publiePar", document.getPubliePar());
        response.put("estPublic", document.getEstPublic());
        response.put("estArchive", document.getEstArchive());
        response.put("estPublie", Boolean.TRUE.equals(document.getEstPublic()));
        response.put("nbTelechargements", document.getNbTelechargements());
        response.put("typeDocumentId", typeDocument != null ? typeDocument.getId() : null);
        response.put("typeDocumentLibelle", typeDocument != null ? typeDocument.getLibelle() : "Document");
        return response;
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String monthLabel(Byte monthNumber) {
        if (monthNumber == null || monthNumber < 1 || monthNumber > 12) {
            return "Mois inconnu";
        }
        String[] months = {
                "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
        };
        return months[monthNumber - 1];
    }

    private String generateEmployeeId() {
        String empId = "EMP" + String.format("%04d", (int)(Math.random() * 9000) + 1000);
        while (employeeRepository.existsByEmployeeId(empId)) {
            empId = "EMP" + String.format("%04d", (int)(Math.random() * 9000) + 1000);
        }
        return empId;
    }

    private String payslipFilename(Salaire salaire) {
        String employeeCode = salaire.getEmployee() != null ? salaire.getEmployee().getEmployeeId() : "employee";
        return "bulletin-paie-" + safeFilePart(employeeCode) + "-" + salaire.getAnnee() + "-" + salaire.getMois() + ".pdf";
    }

    private String documentFilename(Document document) {
        String baseName = document.getTitre() != null ? document.getTitre() : document.getNomFichier();
        if (baseName == null || baseName.isBlank()) baseName = "document";
        return safeFilePart(baseName) + ".pdf";
    }

    private String safeFilePart(String value) {
        if (value == null || value.isBlank()) return "document";
        return value.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
