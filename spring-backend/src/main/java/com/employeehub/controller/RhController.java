package com.employeehub.controller;

import com.employeehub.config.JwtUtil;
import com.employeehub.model.DocumentRequest;
import com.employeehub.model.Employee;
import com.employeehub.model.LeaveRequest;
import com.employeehub.repository.DocumentRequestRepository;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.LeaveRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/rh")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@PreAuthorize("hasRole('ADMIN') or hasRole('RH')")
public class RhController {

    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtil jwtUtil;

    public RhController(LeaveRequestRepository leaveRequestRepository,
                        DocumentRequestRepository documentRequestRepository,
                        EmployeeRepository employeeRepository,
                        JwtUtil jwtUtil) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.employeeRepository = employeeRepository;
        this.jwtUtil = jwtUtil;
    }

    // ── Statistiques RH ──────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<?> getRhStats() {
        try {
            long totalLeaveRequests = leaveRequestRepository.count();
            long pendingLeave = leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.PENDING).size();
            long approvedLeave = leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.APPROVED).size();
            long rejectedLeave = leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.REJECTED).size();

            long totalDocRequests = documentRequestRepository.count();
            long pendingDocs = documentRequestRepository.findByStatus(DocumentRequest.RequestStatus.PENDING).size();
            long completedDocs = documentRequestRepository.findByStatus(DocumentRequest.RequestStatus.COMPLETED).size();

            long totalEmployees = employeeRepository.count();
            long activeEmployees = employeeRepository.countByStatus("active");

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalLeaveRequests", totalLeaveRequests);
            stats.put("pendingLeave", pendingLeave);
            stats.put("approvedLeave", approvedLeave);
            stats.put("rejectedLeave", rejectedLeave);
            stats.put("totalDocRequests", totalDocRequests);
            stats.put("pendingDocs", pendingDocs);
            stats.put("completedDocs", completedDocs);
            stats.put("totalEmployees", totalEmployees);
            stats.put("activeEmployees", activeEmployees);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ── Demandes de congés ───────────────────────────────────────────────────

    @GetMapping("/leave-requests")
    public ResponseEntity<?> getAllLeaveRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employeeId) {
        try {
            List<LeaveRequest> requests;

            if (employeeId != null && !employeeId.isBlank()) {
                if (status != null && !status.isBlank()) {
                    LeaveRequest.LeaveStatus leaveStatus = LeaveRequest.LeaveStatus.valueOf(status.toUpperCase());
                    requests = leaveRequestRepository.findByEmployeeIdAndStatus(employeeId, leaveStatus);
                } else {
                    requests = leaveRequestRepository.findByEmployeeId(employeeId);
                }
            } else if (status != null && !status.isBlank()) {
                LeaveRequest.LeaveStatus leaveStatus = LeaveRequest.LeaveStatus.valueOf(status.toUpperCase());
                requests = leaveRequestRepository.findByStatus(leaveStatus);
            } else {
                requests = leaveRequestRepository.findAll();
            }

            // Trier par date de création décroissante
            requests.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/leave-requests/{id}")
    public ResponseEntity<?> getLeaveRequest(@PathVariable Long id) {
        try {
            Optional<LeaveRequest> req = leaveRequestRepository.findById(id);
            if (req.isEmpty()) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(req.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/leave-calendar")
    public ResponseEntity<?> getLeaveCalendar(@RequestParam(required = false) LocalDate startDate,
                                              @RequestParam(required = false) LocalDate endDate) {
        try {
            LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
            LocalDate end = endDate != null ? endDate : start.plusMonths(1).minusDays(1);

            List<LeaveRequest> requests = leaveRequestRepository
                    .findByStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            List.of(LeaveRequest.LeaveStatus.PENDING, LeaveRequest.LeaveStatus.APPROVED),
                            end,
                            start
                    );

            requests.sort(Comparator
                    .comparing(LeaveRequest::getStartDate)
                    .thenComparing(LeaveRequest::getEmployeeName, Comparator.nullsLast(String::compareTo)));

            List<Map<String, Object>> events = requests.stream().map(req -> {
                Map<String, Object> event = new LinkedHashMap<>();
                event.put("id", req.getId());
                event.put("employeeId", req.getEmployeeId());
                event.put("employeeName", req.getEmployeeName());
                event.put("leaveType", req.getLeaveType());
                event.put("status", req.getStatus());
                event.put("startDate", req.getStartDate());
                event.put("endDate", req.getEndDate());
                event.put("daysRequested", req.getDaysRequested());
                event.put("reason", req.getReason());
                return event;
            }).toList();

            return ResponseEntity.ok(Map.of(
                    "startDate", start,
                    "endDate", end,
                    "maxSimultaneousLeaves", 2,
                    "events", events
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/leave-requests/{id}/approve")
    public ResponseEntity<?> approveLeaveRequest(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        try {
            Optional<LeaveRequest> reqOpt = leaveRequestRepository.findById(id);
            if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

            LeaveRequest req = reqOpt.get();
            if (req.getStatus() != LeaveRequest.LeaveStatus.PENDING) {
                return ResponseEntity.badRequest().body("Cette demande a déjà été traitée");
            }

            String approverEmail = jwtUtil.extractUsername(token.substring(7));
            req.setStatus(LeaveRequest.LeaveStatus.APPROVED);
            req.setApprovedBy(approverEmail);
            req.setUpdatedAt(LocalDateTime.now());

            // Déduire du solde de congés de l'employé
            Optional<Employee> empOpt = employeeRepository.findByEmployeeId(req.getEmployeeId());
            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                int days = req.getDaysRequested() != null ? req.getDaysRequested() : 0;
                switch (req.getLeaveType()) {
                    case ANNUAL_LEAVE:
                        emp.setAnnualLeaveBalance(Math.max(0, emp.getAnnualLeaveBalance() - days));
                        break;
                    case SICK_LEAVE:
                        emp.setSickLeaveBalance(Math.max(0, emp.getSickLeaveBalance() - days));
                        break;
                    case PERSONAL_LEAVE:
                        emp.setPersonalLeaveBalance(Math.max(0, emp.getPersonalLeaveBalance() - days));
                        break;
                    default:
                        break;
                }
                employeeRepository.save(emp);
            }

            LeaveRequest saved = leaveRequestRepository.save(req);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Demande de congé approuvée");
            response.put("leaveRequest", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/leave-requests/{id}/reject")
    public ResponseEntity<?> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        try {
            Optional<LeaveRequest> reqOpt = leaveRequestRepository.findById(id);
            if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

            LeaveRequest req = reqOpt.get();
            if (req.getStatus() != LeaveRequest.LeaveStatus.PENDING) {
                return ResponseEntity.badRequest().body("Cette demande a déjà été traitée");
            }

            String approverEmail = jwtUtil.extractUsername(token.substring(7));
            req.setStatus(LeaveRequest.LeaveStatus.REJECTED);
            req.setApprovedBy(approverEmail);
            req.setRejectionReason(body.getOrDefault("reason", ""));
            req.setUpdatedAt(LocalDateTime.now());

            LeaveRequest saved = leaveRequestRepository.save(req);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Demande de congé rejetée");
            response.put("leaveRequest", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ── Demandes de documents ────────────────────────────────────────────────

    @GetMapping("/document-requests")
    public ResponseEntity<?> getAllDocumentRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employeeId) {
        try {
            List<DocumentRequest> requests;

            if (employeeId != null && !employeeId.isBlank()) {
                if (status != null && !status.isBlank()) {
                    DocumentRequest.RequestStatus reqStatus = DocumentRequest.RequestStatus.valueOf(status.toUpperCase());
                    requests = documentRequestRepository.findByEmployeeIdAndStatus(employeeId, reqStatus);
                } else {
                    requests = documentRequestRepository.findByEmployeeId(employeeId);
                }
            } else if (status != null && !status.isBlank()) {
                DocumentRequest.RequestStatus reqStatus = DocumentRequest.RequestStatus.valueOf(status.toUpperCase());
                requests = documentRequestRepository.findByStatus(reqStatus);
            } else {
                requests = documentRequestRepository.findAll();
            }

            requests.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/document-requests/{id}")
    public ResponseEntity<?> getDocumentRequest(@PathVariable Long id) {
        try {
            Optional<DocumentRequest> req = documentRequestRepository.findById(id);
            if (req.isEmpty()) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(req.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/document-requests/{id}/process")
    public ResponseEntity<?> processDocumentRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        try {
            Optional<DocumentRequest> reqOpt = documentRequestRepository.findById(id);
            if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

            DocumentRequest req = reqOpt.get();
            String processorEmail = jwtUtil.extractUsername(token.substring(7));

            String newStatus = body.getOrDefault("status", "COMPLETED").toUpperCase();
            req.setStatus(DocumentRequest.RequestStatus.valueOf(newStatus));
            req.setProcessedBy(processorEmail);
            req.setNotes(body.getOrDefault("notes", ""));
            req.setUpdatedAt(LocalDateTime.now());

            DocumentRequest saved = documentRequestRepository.save(req);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Demande de document mise à jour");
            response.put("documentRequest", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/document-requests/{id}/reject")
    public ResponseEntity<?> rejectDocumentRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        try {
            Optional<DocumentRequest> reqOpt = documentRequestRepository.findById(id);
            if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();

            DocumentRequest req = reqOpt.get();
            String processorEmail = jwtUtil.extractUsername(token.substring(7));

            req.setStatus(DocumentRequest.RequestStatus.REJECTED);
            req.setProcessedBy(processorEmail);
            req.setNotes(body.getOrDefault("reason", ""));
            req.setUpdatedAt(LocalDateTime.now());

            DocumentRequest saved = documentRequestRepository.save(req);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Demande de document rejetée");
            response.put("documentRequest", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ── Employés (vue RH) ────────────────────────────────────────────────────

    @GetMapping("/employees")
    public ResponseEntity<?> getRhEmployees() {
        try {
            List<Employee> employees = employeeRepository.findAll();
            employees.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
