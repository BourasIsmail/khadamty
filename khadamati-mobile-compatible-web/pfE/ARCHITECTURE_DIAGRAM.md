# 🏗️ Architecture Khadamati - Diagramme Complet

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                         KHADAMATI SYSTEM                            │
│                    Système de Gestion RH                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         COUCHE PRÉSENTATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │   Frontend Web       │         │   Application        │        │
│  │   (Next.js 14)       │         │   Mobile (Flutter)   │        │
│  │                      │         │                      │        │
│  │  • React Components  │         │  • Widgets Flutter   │        │
│  │  • Tailwind CSS      │         │  • Material Design   │        │
│  │  • Zustand Store     │         │  • Provider State    │        │
│  │  • TypeScript        │         │  • Dart              │        │
│  └──────────┬───────────┘         └──────────┬───────────┘        │
│             │                                 │                     │
│             └─────────────┬───────────────────┘                     │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │ JSON
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                           ▼                                         │
│                    COUCHE API REST                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Spring Boot Application                        │  │
│  │              (Port 8080 - Context: /api)                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    CONTROLLERS                              │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ AuthController│  │AdminController│  │ RhController │    │  │
│  │  │              │  │              │  │              │    │  │
│  │  │ /auth/*      │  │ /admin/*     │  │ /rh/*        │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐                       │  │
│  │  │EmployeeCtrl  │  │AttendanceCtrl│                       │  │
│  │  │              │  │              │                       │  │
│  │  │ /employees/* │  │ /attendance/*│                       │  │
│  │  └──────────────┘  └──────────────┘                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    SECURITY LAYER                           │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  • Spring Security                                          │  │
│  │  • JWT Authentication                                       │  │
│  │  • Role-Based Authorization (@PreAuthorize)                 │  │
│  │  • OTP Verification                                         │  │
│  │  • CORS Configuration                                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    SERVICE LAYER                            │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  • Business Logic                                           │  │
│  │  • Data Validation                                          │  │
│  │  • Transaction Management                                   │  │
│  │  • Email Service (OTP)                                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    REPOSITORY LAYER                         │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │UserRepository│  │EmployeeRepo  │  │AttendanceRepo│    │  │
│  │  │              │  │              │  │              │    │  │
│  │  │JpaRepository │  │JpaRepository │  │JpaRepository │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐                       │  │
│  │  │LeaveReqRepo  │  │DocumentReqRepo│                      │  │
│  │  │              │  │              │                       │  │
│  │  │JpaRepository │  │JpaRepository │                       │  │
│  │  └──────────────┘  └──────────────┘                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    ENTITY LAYER (JPA)                       │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │     User     │  │   Employee   │  │  Attendance  │    │  │
│  │  │              │  │              │  │              │    │  │
│  │  │ @Entity      │  │ @Entity      │  │ @Entity      │    │  │
│  │  │ @Table       │  │ @Table       │  │ @Table       │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐                       │  │
│  │  │LeaveRequest  │  │DocumentRequest│                      │  │
│  │  │              │  │              │                       │  │
│  │  │ @Entity      │  │ @Entity      │                       │  │
│  │  │ @Table       │  │ @Table       │                       │  │
│  │  └──────────────┘  └──────────────┘                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ JDBC
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                           ▼                                         │
│                    COUCHE DONNÉES                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    MySQL Database                           │  │
│  │                    (Port 3306)                              │  │
│  │                    Database: khadamati_db                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                       TABLES                                │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  • users                  (Comptes utilisateurs)            │  │
│  │  • employees              (Profils employés)                │  │
│  │  • attendances            (Présences)                       │  │
│  │  • leave_requests         (Demandes de congés)              │  │
│  │  • document_requests      (Demandes d'attestations)         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flux d'Authentification

```
┌─────────┐                                                    ┌─────────┐
│ Client  │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │ 1. POST /auth/login                                         │
     │    { email, password }                                      │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    2. Vérifier credentials  │
     │                                    3. Détecter rôle auto    │
     │                                    4. Générer OTP           │
     │                                    5. Envoyer email         │
     │                                                              │
     │ 6. { requireOtp: true, email }                              │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 7. POST /auth/verify-otp                                    │
     │    { email, code }                                          │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    8. Vérifier OTP          │
     │                                    9. Générer JWT           │
     │                                                              │
     │ 10. { token, id, email, role, ... }                         │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 11. Stocker token                                           │
     │ 12. Rediriger vers /dashboard                               │
     │                                                              │
     │ 13. GET /employees (avec JWT)                               │
     │    Authorization: Bearer <token>                            │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    14. Vérifier JWT         │
     │                                    15. Vérifier rôle        │
     │                                    16. Exécuter requête     │
     │                                                              │
     │ 17. { data: [...] }                                         │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

---

## 🗄️ Modèle de Données

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MODÈLE RELATIONNEL                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       users          │
├──────────────────────┤
│ id (PK)              │ BIGINT AUTO_INCREMENT
│ email (UNIQUE)       │ VARCHAR(255)
│ password             │ VARCHAR(255)
│ first_name           │ VARCHAR(100)
│ last_name            │ VARCHAR(100)
│ role                 │ ENUM('ADMIN','RH','EMPLOYEE')
│ is_active            │ BOOLEAN
│ created_at           │ DATETIME
│ updated_at           │ DATETIME
└──────────────────────┘
           │
           │ 1:1
           │
┌──────────▼───────────┐
│     employees        │
├──────────────────────┤
│ id (PK)              │ BIGINT AUTO_INCREMENT
│ employee_id (UNIQUE) │ VARCHAR(50)
│ first_name           │ VARCHAR(100)
│ last_name            │ VARCHAR(100)
│ email (UNIQUE)       │ VARCHAR(255)
│ phone                │ VARCHAR(20)
│ department           │ VARCHAR(100)
│ position             │ VARCHAR(100)
│ hire_date            │ DATE
│ salary               │ DECIMAL(10,2)
│ annual_leave_balance │ INT
│ sick_leave_balance   │ INT
│ personal_leave_balance│ INT
│ address              │ VARCHAR(255)
│ emergency_contact    │ VARCHAR(100)
│ emergency_phone      │ VARCHAR(20)
│ status               │ VARCHAR(50)
│ is_active            │ BOOLEAN
│ created_at           │ DATETIME
│ updated_at           │ DATETIME
└──────────┬───────────┘
           │
           │ 1:N
           │
┌──────────▼───────────┐
│    attendances       │
├──────────────────────┤
│ id (PK)              │ BIGINT AUTO_INCREMENT
│ employee_id (FK)     │ VARCHAR(50)
│ employee_name        │ VARCHAR(200)
│ date                 │ DATE
│ check_in             │ TIME
│ check_out            │ TIME
│ hours_worked         │ INT
│ status               │ ENUM('PRESENT','ABSENT',...)
│ notes                │ TEXT
│ created_at           │ DATETIME
│ updated_at           │ DATETIME
└──────────────────────┘

┌──────────────────────┐
│   leave_requests     │
├──────────────────────┤
│ id (PK)              │ BIGINT AUTO_INCREMENT
│ employee_id (FK)     │ VARCHAR(50)
│ employee_name        │ VARCHAR(200)
│ leave_type           │ ENUM('ANNUAL_LEAVE',...)
│ start_date           │ DATE
│ end_date             │ DATE
│ days_requested       │ INT
│ reason               │ TEXT
│ status               │ ENUM('PENDING','APPROVED',...)
│ approved_by          │ VARCHAR(50)
│ rejection_reason     │ TEXT
│ created_at           │ DATETIME
│ updated_at           │ DATETIME
└──────────────────────┘

┌──────────────────────┐
│  document_requests   │
├──────────────────────┤
│ id (PK)              │ BIGINT AUTO_INCREMENT
│ employee_id (FK)     │ VARCHAR(50)
│ employee_name        │ VARCHAR(200)
│ document_type        │ ENUM('WORK_CERTIFICATE',...)
│ purpose              │ TEXT
│ status               │ ENUM('PENDING','COMPLETED',...)
│ processed_by         │ VARCHAR(50)
│ notes                │ TEXT
│ document_url         │ VARCHAR(500)
│ created_at           │ DATETIME
│ updated_at           │ DATETIME
└──────────────────────┘
```

---

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUX CRUD EMPLOYÉ (Exemple)                      │
└─────────────────────────────────────────────────────────────────────┘

Frontend                Backend                     Database
   │                       │                            │
   │ GET /employees        │                            │
   ├──────────────────────>│                            │
   │                       │ findAll()                  │
   │                       ├───────────────────────────>│
   │                       │                            │
   │                       │ SELECT * FROM employees    │
   │                       │<───────────────────────────┤
   │                       │                            │
   │ [employees]           │                            │
   │<──────────────────────┤                            │
   │                       │                            │
   │ POST /employees       │                            │
   │ { data }              │                            │
   ├──────────────────────>│                            │
   │                       │ save(employee)             │
   │                       ├───────────────────────────>│
   │                       │                            │
   │                       │ INSERT INTO employees      │
   │                       │<───────────────────────────┤
   │                       │                            │
   │ { employee }          │                            │
   │<──────────────────────┤                            │
   │                       │                            │
```

---

## 🎯 Architecture par Rôle

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN (Accès Complet)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Dashboard → Statistiques Globales                                 │
│  Users     → Gestion des utilisateurs (CRUD)                       │
│  Employees → Gestion des employés (CRUD)                           │
│  Attendance→ Gestion des présences                                 │
│  Leaves    → Validation des congés                                 │
│  Documents → Validation des attestations                           │
│  Analytics → Rapports et statistiques                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         RH (Gestion Employés)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Dashboard → Statistiques RH                                       │
│  Employees → Consultation des employés                             │
│  Attendance→ Gestion des présences                                 │
│  Leaves    → Validation des congés                                 │
│  Documents → Traitement des attestations                           │
│  Reports   → Rapports RH                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         EMPLOYEE (Personnel)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Dashboard → Vue d'ensemble personnelle                            │
│  Profile   → Profil personnel                                      │
│  Leaves    → Solde et demandes de congés                           │
│  Documents → Demandes d'attestations                               │
│  Attendance→ Historique des présences                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Stack Technologique

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STACK COMPLET                               │
└─────────────────────────────────────────────────────────────────────┘

Frontend Web
├── Next.js 14 (App Router)
├── React 18
├── TypeScript
├── Tailwind CSS
├── Zustand (State Management)
├── React Hot Toast (Notifications)
└── Heroicons (Icons)

Backend API
├── Spring Boot 3.2.0
├── Spring Security
├── Spring Data JPA
├── JWT (io.jsonwebtoken)
├── Spring Mail
├── Springdoc OpenAPI
└── Maven

Base de Données
├── MySQL 8.0
├── Hibernate (ORM)
└── JDBC Driver

Mobile
├── Flutter 3.x
├── Dart
├── Provider (State Management)
└── HTTP Package

DevOps
├── Git
├── Maven
├── npm
└── MySQL Workbench
```

---

*Architecture mise à jour le 6 mai 2026*
*Khadamati - Système de Gestion RH*
