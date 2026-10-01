package com.employeehub.config;

import com.employeehub.model.*;
import com.employeehub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, EmployeeRepository employeeRepository,
                     AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository,
                     DocumentRequestRepository documentRequestRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seeder uniquement si la base est vide (évite de supprimer les données existantes)
        if (userRepository.count() > 0) {
            System.out.println("✅ Base de données déjà initialisée, skip du seeder.");
            return;
        }

        System.out.println("🌱 Initialisation de la base de données...");
        seedUsers();
        seedEmployees();
        seedAttendances();
        seedLeaveRequests();
        seedDocumentRequests();
        System.out.println("✅ Base de données initialisée avec succès !");
    }

    private void seedUsers() {
        List<User> users = Arrays.asList(
            // ── Compte ADMIN fixe avec vrai email ──
            new User("ismailelrhazoui21@gmail.com", passwordEncoder.encode("smail1234"), "Ismail", "Elrhazoui", User.Role.ADMIN),
            // ── Comptes RH et EMPLOYEE avec vrais emails ──
            new User("ismailelrhazoui2003@gmail.com", passwordEncoder.encode("password123"), "Marie", "Dupont", User.Role.RH),
            new User("employee@demo.com", passwordEncoder.encode("password123"), "Jean", "Martin", User.Role.EMPLOYEE),
            new User("sophie.bernard@demo.com", passwordEncoder.encode("password123"), "Sophie", "Bernard", User.Role.EMPLOYEE),
            new User("pierre.durand@demo.com", passwordEncoder.encode("password123"), "Pierre", "Durand", User.Role.EMPLOYEE),
            new User("marie.leroy@demo.com", passwordEncoder.encode("password123"), "Marie", "Leroy", User.Role.EMPLOYEE),
            new User("paul.moreau@demo.com", passwordEncoder.encode("password123"), "Paul", "Moreau", User.Role.EMPLOYEE)
        );
        userRepository.saveAll(users);
        System.out.println("👥 Utilisateurs créés : " + users.size());
    }

    private void seedEmployees() {
        List<Employee> employees = Arrays.asList(
            createEmployee("EMP001", "Jean",    "Martin",  "employee@demo.com",       "IT",        "Développeur Senior",  45000.0, 18),
            createEmployee("EMP002", "Sophie",  "Bernard", "sophie.bernard@demo.com", "RH",        "Assistante RH",       38000.0, 24),
            createEmployee("EMP003", "Pierre",  "Durand",  "pierre.durand@demo.com",  "Finance",   "Comptable",           42000.0, 36),
            createEmployee("EMP004", "Marie",   "Leroy",   "marie.leroy@demo.com",    "Marketing", "Chef de projet",      48000.0, 12),
            createEmployee("EMP005", "Paul",    "Moreau",  "paul.moreau@demo.com",    "IT",        "Analyste Système",    41000.0, 6),
            createEmployee("EMP006", "Lucie",   "Petit",   "lucie.petit@demo.com",    "IT",        "DevOps",              46000.0, 9),
            createEmployee("EMP007", "Thomas",  "Roux",    "thomas.roux@demo.com",    "Finance",   "Contrôleur de gestion",44000.0, 30),
            createEmployee("EMP008", "Emma",    "Blanc",   "emma.blanc@demo.com",     "Marketing", "Responsable comm.",   43000.0, 15)
        );
        employeeRepository.saveAll(employees);
        System.out.println("👨‍💼 Employés créés : " + employees.size());
    }

    private Employee createEmployee(String empId, String firstName, String lastName, String email,
                                    String department, String position, Double salary, int monthsAgo) {
        Employee employee = new Employee();
        employee.setEmployeeId(empId);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPhone("+33 6 " + (10000000 + new Random().nextInt(90000000)));
        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setHireDate(LocalDate.now().minusMonths(monthsAgo));
        employee.setSalary(salary);
        employee.setAddress("123 Rue de la Paix, Paris");
        employee.setEmergencyContact("Contact d'urgence");
        employee.setEmergencyPhone("+33 6 " + (10000000 + new Random().nextInt(90000000)));
        employee.setAnnualLeaveBalance(25);
        employee.setSickLeaveBalance(10);
        employee.setPersonalLeaveBalance(5);
        return employee;
    }

    private void seedAttendances() {
        List<Employee> employees = employeeRepository.findAll();
        Random random = new Random();

        for (Employee employee : employees) {
            for (int i = 0; i < 30; i++) {
                LocalDate date = LocalDate.now().minusDays(i);
                // Ignorer weekends
                if (date.getDayOfWeek().getValue() >= 6) continue;

                Attendance attendance = new Attendance();
                attendance.setEmployeeId(employee.getEmployeeId());
                attendance.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                attendance.setDate(date);

                // 85% présent, 10% en retard, 5% absent
                int rand = random.nextInt(100);
                if (rand < 5) {
                    attendance.setStatus(Attendance.AttendanceStatus.ABSENT);
                } else if (rand < 15) {
                    attendance.setStatus(Attendance.AttendanceStatus.LATE);
                    attendance.setCheckIn(LocalTime.of(9, 15 + random.nextInt(45)));
                    attendance.setCheckOut(LocalTime.of(17 + random.nextInt(2), random.nextInt(60)));
                    attendance.setHoursWorked(450 + random.nextInt(60));
                } else {
                    attendance.setStatus(Attendance.AttendanceStatus.PRESENT);
                    attendance.setCheckIn(LocalTime.of(8, random.nextInt(30)));
                    attendance.setCheckOut(LocalTime.of(17 + random.nextInt(2), random.nextInt(60)));
                    attendance.setHoursWorked(480 + random.nextInt(120));
                }

                attendanceRepository.save(attendance);
            }
        }
        System.out.println("📅 Présences créées pour 30 jours");
    }

    private void seedLeaveRequests() {
        List<Employee> employees = employeeRepository.findAll();
        Random random = new Random();

        LeaveRequest.LeaveType[] types = LeaveRequest.LeaveType.values();
        LeaveRequest.LeaveStatus[] statuses = {
            LeaveRequest.LeaveStatus.PENDING,
            LeaveRequest.LeaveStatus.APPROVED,
            LeaveRequest.LeaveStatus.APPROVED,
            LeaveRequest.LeaveStatus.REJECTED
        };

        for (Employee employee : employees) {
            int count = 2 + random.nextInt(3);
            for (int i = 0; i < count; i++) {
                LeaveRequest request = new LeaveRequest();
                request.setEmployeeId(employee.getEmployeeId());
                request.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                request.setLeaveType(types[random.nextInt(types.length)]);
                LocalDate start = LocalDate.now().plusDays(-10 + random.nextInt(70));
                int days = 1 + random.nextInt(7);
                request.setStartDate(start);
                request.setEndDate(start.plusDays(days));
                request.setDaysRequested(days);
                request.setReason("Demande de congé pour raisons personnelles");
                request.setStatus(statuses[random.nextInt(statuses.length)]);
                leaveRequestRepository.save(request);
            }
        }
        System.out.println("🏖️ Demandes de congés créées");
    }

    private void seedDocumentRequests() {
        List<Employee> employees = employeeRepository.findAll();
        Random random = new Random();

        DocumentRequest.DocumentType[] types = DocumentRequest.DocumentType.values();
        DocumentRequest.RequestStatus[] statuses = {
            DocumentRequest.RequestStatus.PENDING,
            DocumentRequest.RequestStatus.COMPLETED,
            DocumentRequest.RequestStatus.IN_PROGRESS
        };

        for (Employee employee : employees) {
            int count = 1 + random.nextInt(2);
            for (int i = 0; i < count; i++) {
                DocumentRequest request = new DocumentRequest();
                request.setEmployeeId(employee.getEmployeeId());
                request.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
                request.setDocumentType(types[random.nextInt(types.length)]);
                request.setPurpose("Demande pour démarches administratives");
                request.setStatus(statuses[random.nextInt(statuses.length)]);
                documentRequestRepository.save(request);
            }
        }
        System.out.println("📄 Demandes de documents créées");
    }
}