package com.employeehub.config;

import com.employeehub.model.*;
import com.employeehub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Données de démonstration et référentiel organisationnel.
 * Désactivé par défaut : activer avec SEED_DEMO_DATA=true (développement uniquement).
 */
@Component
@ConditionalOnProperty(name = "app.seed.demo-data", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final TypeDocumentRepository typeDocumentRepository;
    private final DocumentRepository documentRepository;
    private final AnnonceRepository annonceRepository;
    private final OrdreMissionRepository ordreMissionRepository;
    private final SalaireRepository salaireRepository;
    private final StructureRepository structureRepository;
    private final CoordinationRegionRepository coordinationRegionRepository;
    private final DelegationProvinceRepository delegationProvinceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-password:}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository, EmployeeRepository employeeRepository,
                     AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository,
                     DocumentRequestRepository documentRequestRepository,
                     TypeDocumentRepository typeDocumentRepository, DocumentRepository documentRepository,
                     AnnonceRepository annonceRepository, OrdreMissionRepository ordreMissionRepository,
                     SalaireRepository salaireRepository, StructureRepository structureRepository,
                     CoordinationRegionRepository coordinationRegionRepository,
                     DelegationProvinceRepository delegationProvinceRepository,
                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.typeDocumentRepository = typeDocumentRepository;
        this.documentRepository = documentRepository;
        this.annonceRepository = annonceRepository;
        this.ordreMissionRepository = ordreMissionRepository;
        this.salaireRepository = salaireRepository;
        this.structureRepository = structureRepository;
        this.coordinationRegionRepository = coordinationRegionRepository;
        this.delegationProvinceRepository = delegationProvinceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("🌱 Initialisation de la base de données...");
            seedUsers();
            seedEmployees();
            seedAttendances();
            seedLeaveRequests();
            seedDocumentRequests();
        } else {
            System.out.println("✅ Base de données déjà initialisée, vérification des modules métier.");
        }

        if (structureRepository.count() == 0) seedOrganisationStructure();
        assignEmployeesToOrganisation();
        if (salaireRepository.count() == 0) seedSalaires();
        if (ordreMissionRepository.count() == 0) seedOrdresMission();
        if (annonceRepository.count() == 0) seedAnnonces();
        if (documentRepository.count() == 0) seedDocuments();
        System.out.println("✅ Données Khadamati prêtes.");
    }

    private String resolveAdminPassword() {
        if (adminPassword != null && !adminPassword.isBlank()) return adminPassword;
        String generated = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        System.out.println("⚠️ SEED_ADMIN_PASSWORD non défini — mot de passe admin généré (à noter, affiché une seule fois) : " + generated);
        return generated;
    }

    private void seedUsers() {
        List<User> users = Arrays.asList(
            // ── Compte ADMIN fixe avec vrai email ──
            new User("ismailelrhazoui21@gmail.com", passwordEncoder.encode(resolveAdminPassword()), "Ismail", "Elrhazoui", User.Role.ADMIN),
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

    private void seedOrganisationStructure() {
        Structure direction = createStructure("DIR", "Direction", "Direction", Structure.TypeStructure.DIRECTION, null);
        createStructure("INSP", "Inspection", "Inspection", Structure.TypeStructure.INSPECTION, direction);
        Structure directionAdjointe = createStructure("DIR-ADJ", "Direction Adjointe", "Direction Adjointe", Structure.TypeStructure.DIRECTION_ADJOINTE, direction);
        Structure directionsRegionales = createStructure("DIR-REG", "Directions Regionales", "Directions Regionales", Structure.TypeStructure.DIRECTION_REGIONALE, direction);
        createStructure("DIR-PROV", "Directions Provinciales/Prefectorales", "Directions Provinciales/Prefectorales", Structure.TypeStructure.DIRECTION_PROVINCIALE_PREFECTORALE, directionsRegionales);

        Structure ingenierie = createStructure("SD-ISP", "Sous-Direction de l'Ingenierie Sociale et de la Planification", "Ingenierie Sociale et Planification", Structure.TypeStructure.SOUS_DIRECTION, directionAdjointe);
        Structure divisionIngenierie = createStructure("DIV-IS", "Division de l'Ingenierie Sociale", "Ingenierie Sociale", Structure.TypeStructure.DIVISION, ingenierie);
        createStructure("SRV-VS", "Service de l'Ingenierie de la Veille Sociale et des Etudes", "Veille Sociale et Etudes", Structure.TypeStructure.SERVICE, divisionIngenierie);
        createStructure("SRV-STAT", "Service des Statistiques et des Indicateurs", "Statistiques et Indicateurs", Structure.TypeStructure.SERVICE, divisionIngenierie);
        Structure planification = createStructure("DIV-PSP", "Division de la Planification Strategique et de la Programmation", "Planification Strategique", Structure.TypeStructure.DIVISION, ingenierie);
        createStructure("SRV-PLAN", "Service de la Planification, du Suivi et d'Evaluation des Programmes", "Planification et Suivi", Structure.TypeStructure.SERVICE, planification);
        createStructure("SRV-PART", "Service du Partenariat", "Partenariat", Structure.TypeStructure.SERVICE, planification);

        Structure administratif = createStructure("SD-AAF", "Sous-Direction des Affaires Administratives et Financieres", "Affaires Administratives et Financieres", Structure.TypeStructure.SOUS_DIRECTION, directionAdjointe);
        Structure ressourcesFinancieres = createStructure("DIV-RF", "Division des Ressources Financieres", "Ressources Financieres", Structure.TypeStructure.DIVISION, administratif);
        createStructure("SRV-COMP", "Service de la Comptabilite", "Comptabilite", Structure.TypeStructure.SERVICE, ressourcesFinancieres);
        createStructure("SRV-BUD", "Service du Budget et de la Programmation", "Budget et Programmation", Structure.TypeStructure.SERVICE, ressourcesFinancieres);
        createStructure("SRV-REC", "Service du Recouvrement", "Recouvrement", Structure.TypeStructure.SERVICE, ressourcesFinancieres);
        Structure rh = createStructure("DIV-RH", "Division des Ressources Humaines", "Ressources Humaines", Structure.TypeStructure.DIVISION, administratif);
        createStructure("SRV-PERS", "Service de la Gestion du Personnel", "Gestion du Personnel", Structure.TypeStructure.SERVICE, rh);
        createStructure("SRV-CS", "Service de la Couverture Sociale", "Couverture Sociale", Structure.TypeStructure.SERVICE, rh);
        createStructure("SRV-DEV-RH", "Service de Developpement des RH", "Developpement RH", Structure.TypeStructure.SERVICE, rh);
        Structure patrimoine = createStructure("DIV-PL", "Division du Patrimoine et de la Logistique", "Patrimoine et Logistique", Structure.TypeStructure.DIVISION, administratif);
        createStructure("SRV-PAT", "Service du Patrimoine et des Batiments", "Patrimoine et Batiments", Structure.TypeStructure.SERVICE, patrimoine);
        createStructure("SRV-ACH", "Service des Achats", "Achats", Structure.TypeStructure.SERVICE, patrimoine);
        createStructure("SRV-LOG", "Service de la Logistique et des Moyens Generaux", "Logistique et Moyens Generaux", Structure.TypeStructure.SERVICE, patrimoine);

        Structure assistance = createStructure("SD-AS", "Sous-Direction de l'Assistance Sociale", "Assistance Sociale", Structure.TypeStructure.SOUS_DIRECTION, directionAdjointe);
        Structure solidarite = createStructure("DIV-SAS", "Division de la Solidarite et de l'Assistance Sociale", "Solidarite et Assistance Sociale", Structure.TypeStructure.DIVISION, assistance);
        createStructure("SRV-AH", "Service de la Solidarite et de l'Action Humanitaire", "Solidarite et Action Humanitaire", Structure.TypeStructure.SERVICE, solidarite);
        createStructure("SRV-PSH", "Service de l'Assistance et d'Accompagnement des PSH", "Assistance PSH", Structure.TypeStructure.SERVICE, solidarite);
        createStructure("SRV-SA", "Service des Personnes sans Abris", "Personnes sans Abris", Structure.TypeStructure.SERVICE, solidarite);
        Structure famille = createStructure("DIV-PPF", "Division de la Protection et de la Promotion Familiale", "Protection Familiale", Structure.TypeStructure.DIVISION, assistance);
        createStructure("SRV-ENF", "Service d'Accompagnement et de Protection de l'Enfance", "Protection de l'Enfance", Structure.TypeStructure.SERVICE, famille);
        createStructure("SRV-ETAB", "Service des Etablissements d'Accueil et de Protection des Enfants", "Etablissements d'Accueil Enfants", Structure.TypeStructure.SERVICE, famille);
        createStructure("SRV-ACC-PSH", "Service des Structures d'Accueil et d'Aide des PSH", "Structures d'Accueil PSH", Structure.TypeStructure.SERVICE, famille);
        Structure femme = createStructure("DIV-IA", "Division de l'Integration et de l'Autonomisation", "Integration et Autonomisation", Structure.TypeStructure.DIVISION, assistance);
        createStructure("SRV-FEM", "Service d'Assistance Sociale a la Femme", "Assistance Sociale Femme", Structure.TypeStructure.SERVICE, femme);
        createStructure("SRV-CPF", "Service des Centres d'Accueil et de Protection de la Femme", "Centres Protection Femme", Structure.TypeStructure.SERVICE, femme);
        createStructure("SRV-AISF", "Service de l'Autonomisation et de l'Insertion Sociale de la Femme", "Autonomisation Femme", Structure.TypeStructure.SERVICE, femme);

        Structure si = createStructure("DIV-SI", "Division des Systemes d'Information et de la Digitalisation", "Systemes d'Information", Structure.TypeStructure.DIVISION, directionAdjointe);
        createStructure("SRV-ETUDES-SI", "Service d'Etudes et Developpement des SI", "Etudes et Developpement SI", Structure.TypeStructure.SERVICE, si);
        createStructure("SRV-SUPPORT-SI", "Service de Gestion, de Maintenance et de Support des SI", "Support SI", Structure.TypeStructure.SERVICE, si);
        createStructure("SRV-AUDIT", "Service de l'Audit, de la Qualite et du Controle de Gestion", "Audit et Controle", Structure.TypeStructure.SERVICE, si);
        createStructure("SRV-COM", "Service de la Communication", "Communication", Structure.TypeStructure.SERVICE, si);
        createStructure("SRV-COOP", "Service de la Cooperation", "Cooperation", Structure.TypeStructure.SERVICE, si);

        System.out.println("Organigramme Entraide Nationale cree");
    }

    private DelegationProvince getOrCreateCentralDelegation() {
        CoordinationRegion coordination = coordinationRegionRepository.findByCodeRegion("CENTRE").orElseGet(() -> {
            CoordinationRegion item = new CoordinationRegion();
            item.setCodeRegion("CENTRE");
            item.setNomRegionFr("Administration Centrale");
            item.setNomRegionAr("Administration Centrale");
            item.setNomCoordFr("Coordination Centrale");
            item.setNomCoordAr("Coordination Centrale");
            item.setTelephone("+212 5 00 00 00 00");
            item.setAdresse("Rabat");
            item.setEstActive(true);
            return coordinationRegionRepository.save(item);
        });

        return delegationProvinceRepository.findByCodeProvince("CENTRE").orElseGet(() -> {
            DelegationProvince item = new DelegationProvince();
            item.setCoordination(coordination);
            item.setCodeProvince("CENTRE");
            item.setNomProvinceFr("Administration Centrale");
            item.setNomProvinceAr("Administration Centrale");
            item.setNomDelegFr("Delegation Centrale");
            item.setNomDelegAr("Delegation Centrale");
            item.setTelephone("+212 5 00 00 00 00");
            item.setAdresse("Rabat");
            item.setEstActive(true);
            return delegationProvinceRepository.save(item);
        });
    }

    private Structure createStructure(String code, String nomFr, String nomAr, Structure.TypeStructure type, Structure parent) {
        return structureRepository.findByCode(code).orElseGet(() -> {
            Structure structure = new Structure();
            structure.setDelegation(getOrCreateCentralDelegation());
            structure.setCode(code);
            structure.setNomFr(nomFr);
            structure.setNomAr(nomAr);
            structure.setType(type);
            structure.setParent(parent);
            structure.setEstActive(true);
            return structureRepository.save(structure);
        });
    }

    private void assignEmployeesToOrganisation() {
        List<Structure> targets = Arrays.asList(
                structureRepository.findByCode("SRV-PERS").orElse(null),
                structureRepository.findByCode("SRV-DEV-RH").orElse(null),
                structureRepository.findByCode("SRV-COMP").orElse(null),
                structureRepository.findByCode("SRV-COM").orElse(null),
                structureRepository.findByCode("SRV-ETUDES-SI").orElse(null),
                structureRepository.findByCode("SRV-SUPPORT-SI").orElse(null),
                structureRepository.findByCode("SRV-BUD").orElse(null),
                structureRepository.findByCode("SRV-AH").orElse(null)
        ).stream().filter(java.util.Objects::nonNull).toList();

        if (targets.isEmpty()) return;

        List<Employee> employees = employeeRepository.findAll();
        for (int i = 0; i < employees.size(); i++) {
            Employee employee = employees.get(i);
            if (employee.getStructure() == null) {
                Structure structure = targets.get(i % targets.size());
                employee.setStructure(structure);
                employee.setDepartment(structure.getNomFr());
                employeeRepository.save(employee);
            }
        }
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

    private void seedSalaires() {
        List<Employee> employees = employeeRepository.findAll();
        short year = (short) LocalDate.now().getYear();
        byte currentMonth = (byte) LocalDate.now().getMonthValue();

        for (Employee employee : employees) {
            for (int offset = 0; offset < 3; offset++) {
                int month = currentMonth - offset;
                short salaryYear = year;
                if (month <= 0) {
                    month += 12;
                    salaryYear--;
                }

                BigDecimal net = BigDecimal.valueOf(employee.getSalary() != null ? employee.getSalary() / 12 : 3500)
                        .setScale(2, java.math.RoundingMode.HALF_UP);
                Salaire salaire = new Salaire();
                salaire.setEmployee(employee);
                salaire.setAnnee(salaryYear);
                salaire.setMois((byte) month);
                salaire.setEchelon("E" + (1 + offset));
                salaire.setSalaireNet(net);
                salaire.setAllocFamiliale(BigDecimal.valueOf(300));
                salaire.setRetenueMutuelle(BigDecimal.valueOf(150));
                salaire.setRappel(offset == 0 ? BigDecimal.valueOf(250) : BigDecimal.ZERO);
                salaireRepository.save(salaire);
            }
        }
        System.out.println("Bulletins de paie crees");
    }

    private void seedOrdresMission() {
        List<Employee> employees = employeeRepository.findAll();
        int index = 1;

        for (Employee employee : employees.subList(0, Math.min(5, employees.size()))) {
            OrdreMission ordre = new OrdreMission();
            ordre.setEmployee(employee);
            ordre.setNumero(String.format("OM-%d-%03d", LocalDate.now().getYear(), index));
            ordre.setObjet("Mission de coordination administrative et suivi terrain");
            ordre.setLieuDepart("Rabat");
            ordre.setLieuArrivee(index % 2 == 0 ? "Casablanca" : "Marrakech");
            ordre.setDateDepart(LocalDate.now().plusDays(index * 2L));
            ordre.setDateRetour(LocalDate.now().plusDays(index * 2L + 2));
            ordre.setDureeJours(3);
            ordre.setMontantIndemnite(BigDecimal.valueOf(900));
            ordre.setMontantTransport(BigDecimal.valueOf(350));
            ordre.setMontantHebergement(BigDecimal.valueOf(700));
            ordre.setMontantTotal(BigDecimal.valueOf(1950));
            ordre.setStatut(index % 3 == 0 ? OrdreMission.StatutOrdreMission.APPROUVE : OrdreMission.StatutOrdreMission.EN_ATTENTE);
            ordre.setObservations("Ordre de mission genere pour les tests Khadamati");
            ordreMissionRepository.save(ordre);
            index++;
        }
        System.out.println("Ordres de mission crees");
    }

    private void seedAnnonces() {
        List<User> users = userRepository.findAll();
        User admin = users.stream().filter(user -> user.getRole() == User.Role.ADMIN).findFirst().orElse(null);

        Annonce first = new Annonce();
        first.setTitre("Ouverture du portail Khadamati");
        first.setMessage("Le portail RH est disponible pour les demandes, documents, salaires et ordres de mission.");
        first.setCreePar(admin);
        first.setEstActive(true);
        first.setPublieLe(LocalDateTime.now().minusDays(1));
        annonceRepository.save(first);

        Annonce second = new Annonce();
        second.setTitre("Mise a jour des dossiers administratifs");
        second.setMessage("Merci de verifier vos informations personnelles depuis la page Mon Profil.");
        second.setCreePar(admin);
        second.setEstActive(true);
        second.setPublieLe(LocalDateTime.now());
        second.setExpireLe(LocalDateTime.now().plusMonths(1));
        annonceRepository.save(second);

        System.out.println("Annonces creees");
    }

    private void seedDocuments() {
        TypeDocument noteService = createTypeDocument("Note de service", "notes");
        TypeDocument procedure = createTypeDocument("Procedure RH", "procedures");

        Document first = createDocument(noteService, "Reglement interieur",
                "Synthese des regles internes et obligations administratives.",
                "reglement-interieur.pdf", "DOC-RH-001");
        first.setEstPublic(true);
        documentRepository.save(first);

        Document second = createDocument(procedure, "Procedure demande attestation",
                "Guide de demande et suivi des attestations depuis Khadamati.",
                "procedure-attestation.pdf", "DOC-RH-002");
        second.setEstPublic(true);
        documentRepository.save(second);

        System.out.println("Documents RH crees");
    }

    private TypeDocument createTypeDocument(String libelle, String dossier) {
        return typeDocumentRepository.findByLibelle(libelle).orElseGet(() -> {
            TypeDocument type = new TypeDocument();
            type.setLibelle(libelle);
            type.setDossier(dossier);
            return typeDocumentRepository.save(type);
        });
    }

    private Document createDocument(TypeDocument type, String titre, String description, String fileName, String reference) {
        Document document = new Document();
        document.setTypeDocument(type);
        document.setTitre(titre);
        document.setDescription(description);
        document.setNomFichier(fileName);
        document.setCheminFichier("/documents/" + fileName);
        document.setTypeMime("application/pdf");
        document.setTailleOctets(0L);
        document.setNumeroReference(reference);
        document.setDatePublication(LocalDate.now());
        document.setPubliePar("systeme");
        document.setEstArchive(false);
        document.setNbTelechargements(0);
        return document;
    }
}
