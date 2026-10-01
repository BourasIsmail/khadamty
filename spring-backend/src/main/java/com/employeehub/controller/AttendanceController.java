package com.employeehub.controller;

import com.employeehub.config.JwtUtil;
import com.employeehub.model.Attendance;
import com.employeehub.model.Employee;
import com.employeehub.repository.AttendanceRepository;
import com.employeehub.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtil jwtUtil;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                EmployeeRepository employeeRepository,
                                JwtUtil jwtUtil) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.jwtUtil = jwtUtil;
    }

    // Liste des présences avec filtres
    @GetMapping("")
    public ResponseEntity<?> getAttendance(
            @RequestParam(required = false) String employee_id,
            @RequestParam(required = false) String start_date,
            @RequestParam(required = false) String end_date,
            @RequestParam(required = false) String status,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            List<Attendance> records;

            if (employee_id != null && !employee_id.isBlank()) {
                if (start_date != null && end_date != null) {
                    records = attendanceRepository.findByEmployeeIdAndDateBetween(
                        employee_id, LocalDate.parse(start_date), LocalDate.parse(end_date));
                } else {
                    records = attendanceRepository.findByEmployeeId(employee_id);
                }
            } else if (start_date != null && end_date != null) {
                records = attendanceRepository.findByDateBetween(
                    LocalDate.parse(start_date), LocalDate.parse(end_date));
            } else if (status != null && !status.isBlank()) {
                Attendance.AttendanceStatus attStatus = Attendance.AttendanceStatus.valueOf(status.toUpperCase());
                records = attendanceRepository.findByStatus(attStatus);
            } else {
                records = attendanceRepository.findAll();
            }

            // Trier par date décroissante
            records.sort((a, b) -> {
                if (a.getDate() == null || b.getDate() == null) return 0;
                return b.getDate().compareTo(a.getDate());
            });

            // Mapper vers format frontend
            List<Map<String, Object>> mapped = new ArrayList<>();
            for (Attendance rec : records) {
                mapped.add(mapAttendance(rec));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("records", mapped);
            response.put("total", mapped.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Pointage entrée
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        try {
            String employeeId = body.get("employee_id");
            if (employeeId == null || employeeId.isBlank()) {
                // Utiliser l'email du token pour trouver l'employé
                String email = jwtUtil.extractUsername(token.substring(7));
                Optional<Employee> empOpt = employeeRepository.findByEmail(email);
                if (empOpt.isEmpty()) return ResponseEntity.badRequest().body("Employé non trouvé");
                employeeId = empOpt.get().getEmployeeId();
            }

            LocalDate today = LocalDate.now();
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

            if (existing.isPresent() && existing.get().getCheckIn() != null) {
                return ResponseEntity.badRequest().body("Vous avez déjà pointé l'entrée aujourd'hui");
            }

            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
            } else {
                attendance = new Attendance();
                attendance.setEmployeeId(employeeId);
                attendance.setDate(today);

                // Récupérer le nom de l'employé
                Optional<Employee> empOpt = employeeRepository.findByEmployeeId(employeeId);
                empOpt.ifPresent(emp -> attendance.setEmployeeName(emp.getFirstName() + " " + emp.getLastName()));
            }

            LocalTime now = LocalTime.now();
            attendance.setCheckIn(now);

            // Déterminer le statut (en retard si après 9h)
            if (now.isAfter(LocalTime.of(9, 15))) {
                attendance.setStatus(Attendance.AttendanceStatus.LATE);
            } else {
                attendance.setStatus(Attendance.AttendanceStatus.PRESENT);
            }

            attendance.setUpdatedAt(LocalDateTime.now());
            Attendance saved = attendanceRepository.save(attendance);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pointage d'entrée enregistré");
            response.put("attendance", mapAttendance(saved));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Pointage sortie
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        try {
            String employeeId = body.get("employee_id");
            if (employeeId == null || employeeId.isBlank()) {
                String email = jwtUtil.extractUsername(token.substring(7));
                Optional<Employee> empOpt = employeeRepository.findByEmail(email);
                if (empOpt.isEmpty()) return ResponseEntity.badRequest().body("Employé non trouvé");
                employeeId = empOpt.get().getEmployeeId();
            }

            LocalDate today = LocalDate.now();
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

            if (existing.isEmpty() || existing.get().getCheckIn() == null) {
                return ResponseEntity.badRequest().body("Vous devez d'abord pointer l'entrée");
            }

            Attendance attendance = existing.get();
            if (attendance.getCheckOut() != null) {
                return ResponseEntity.badRequest().body("Vous avez déjà pointé la sortie aujourd'hui");
            }

            LocalTime now = LocalTime.now();
            attendance.setCheckOut(now);

            // Calculer les heures travaillées en minutes
            int minutes = (int) java.time.Duration.between(attendance.getCheckIn(), now).toMinutes();
            attendance.setHoursWorked(minutes);
            attendance.setUpdatedAt(LocalDateTime.now());

            Attendance saved = attendanceRepository.save(attendance);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pointage de sortie enregistré");
            response.put("attendance", mapAttendance(saved));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Créer une présence manuellement (ADMIN/RH)
    @PostMapping("")
    public ResponseEntity<?> createAttendance(@RequestBody Map<String, Object> data) {
        try {
            String employeeId = (String) data.get("employee_id");
            String dateStr = (String) data.get("date");

            Optional<Employee> empOpt = employeeRepository.findByEmployeeId(employeeId);
            if (empOpt.isEmpty()) return ResponseEntity.badRequest().body("Employé non trouvé");

            Employee emp = empOpt.get();
            LocalDate date = LocalDate.parse(dateStr);

            // Vérifier si une présence existe déjà
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
            if (existing.isPresent()) {
                return ResponseEntity.badRequest().body("Une présence existe déjà pour cet employé à cette date");
            }

            Attendance attendance = new Attendance();
            attendance.setEmployeeId(employeeId);
            attendance.setEmployeeName(emp.getFirstName() + " " + emp.getLastName());
            attendance.setDate(date);

            if (data.containsKey("check_in") && data.get("check_in") != null) {
                attendance.setCheckIn(LocalTime.parse((String) data.get("check_in")));
            }
            if (data.containsKey("check_out") && data.get("check_out") != null) {
                attendance.setCheckOut(LocalTime.parse((String) data.get("check_out")));
            }
            if (data.containsKey("status") && data.get("status") != null) {
                attendance.setStatus(Attendance.AttendanceStatus.valueOf(((String) data.get("status")).toUpperCase()));
            }
            if (data.containsKey("notes")) {
                attendance.setNotes((String) data.get("notes"));
            }

            // Calculer heures si check_in et check_out présents
            if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
                int minutes = (int) java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toMinutes();
                attendance.setHoursWorked(minutes);
            }

            Attendance saved = attendanceRepository.save(attendance);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Présence créée avec succès");
            response.put("attendance", mapAttendance(saved));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Modifier une présence
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Optional<Attendance> attOpt = attendanceRepository.findById(id);
            if (attOpt.isEmpty()) return ResponseEntity.notFound().build();

            Attendance attendance = attOpt.get();

            if (updates.containsKey("check_in") && updates.get("check_in") != null) {
                attendance.setCheckIn(LocalTime.parse((String) updates.get("check_in")));
            }
            if (updates.containsKey("check_out") && updates.get("check_out") != null) {
                attendance.setCheckOut(LocalTime.parse((String) updates.get("check_out")));
            }
            if (updates.containsKey("status") && updates.get("status") != null) {
                attendance.setStatus(Attendance.AttendanceStatus.valueOf(((String) updates.get("status")).toUpperCase()));
            }
            if (updates.containsKey("notes")) {
                attendance.setNotes((String) updates.get("notes"));
            }

            // Recalculer heures
            if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
                int minutes = (int) java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toMinutes();
                attendance.setHoursWorked(minutes);
            }

            attendance.setUpdatedAt(LocalDateTime.now());
            Attendance saved = attendanceRepository.save(attendance);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Présence mise à jour");
            response.put("attendance", mapAttendance(saved));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Résumé mensuel d'un employé
    @GetMapping("/summary/{employeeId}")
    public ResponseEntity<?> getAttendanceSummary(
            @PathVariable String employeeId,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        try {
            LocalDate now = LocalDate.now();
            int targetMonth = month > 0 ? month : now.getMonthValue();
            int targetYear = year > 0 ? year : now.getYear();

            LocalDate start = LocalDate.of(targetYear, targetMonth, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

            List<Attendance> records = attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, start, end);

            long present = records.stream().filter(r -> r.getStatus() == Attendance.AttendanceStatus.PRESENT).count();
            long late = records.stream().filter(r -> r.getStatus() == Attendance.AttendanceStatus.LATE).count();
            long absent = records.stream().filter(r -> r.getStatus() == Attendance.AttendanceStatus.ABSENT).count();
            long halfDay = records.stream().filter(r -> r.getStatus() == Attendance.AttendanceStatus.HALF_DAY).count();
            long onLeave = records.stream().filter(r -> r.getStatus() == Attendance.AttendanceStatus.ON_LEAVE).count();

            int totalMinutes = records.stream()
                .filter(r -> r.getHoursWorked() != null)
                .mapToInt(Attendance::getHoursWorked)
                .sum();

            Map<String, Object> summary = new HashMap<>();
            summary.put("employeeId", employeeId);
            summary.put("month", targetMonth);
            summary.put("year", targetYear);
            summary.put("present", present);
            summary.put("late", late);
            summary.put("absent", absent);
            summary.put("halfDay", halfDay);
            summary.put("onLeave", onLeave);
            summary.put("totalDays", records.size());
            summary.put("totalHours", Math.round(totalMinutes / 60.0 * 10.0) / 10.0);
            summary.put("records", records.stream().map(this::mapAttendance).toList());

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Helper : mapper Attendance vers Map pour le frontend
    private Map<String, Object> mapAttendance(Attendance att) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", att.getId());
        map.put("employee_id", att.getEmployeeId());
        map.put("employee_name", att.getEmployeeName());
        map.put("date", att.getDate() != null ? att.getDate().toString() : null);
        map.put("check_in", att.getCheckIn() != null ? att.getCheckIn().toString() : null);
        map.put("check_out", att.getCheckOut() != null ? att.getCheckOut().toString() : null);
        map.put("total_hours", att.getHoursWorked() != null ? Math.round(att.getHoursWorked() / 60.0 * 10.0) / 10.0 : 0);
        map.put("status", att.getStatus() != null ? att.getStatus().name().toLowerCase().replace("_", "-") : "present");
        map.put("notes", att.getNotes());
        return map;
    }
}
