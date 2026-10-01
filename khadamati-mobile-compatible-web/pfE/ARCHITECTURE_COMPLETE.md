# 🏗️ ARCHITECTURE COMPLÈTE DU PROJET

## Vue d'Ensemble de l'Architecture Khadamati + Tawassol

---

## 📐 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                            │
│                                                                 │
│  👤 EMPLOYEE    👤 MANAGER    👤 ADMIN    📱 MOBILE (à venir)  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      FRONTEND (Next.js)                         │
│                     Port: 3000                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Pages Dashboard                        │  │
│  │                                                           │  │
│  │  • Annonces        • Grades         • Structures         │  │
│  │  • Salaires        • Primes         • Crédits            │  │
│  │  • Ordres Mission  • Demandes       • Documents          │  │
│  │  • Réclamations    • Notes          • Examens            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Bibliothèques                          │  │
│  │                                                           │  │
│  │  • API Client (lib/api.ts)                               │  │
│  │  • State Management (Zustand)                            │  │
│  │  • UI Components (Tailwind CSS)                          │  │
│  │  • Icons (Heroicons)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         │ http://localhost:8081/api
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                         │
│                     Port: 8081                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Controllers (19)                       │  │
│  │                                                           │  │
│  │  @RestController + @CrossOrigin                          │  │
│  │  • GradeController        • SalaireController            │  │
│  │  • StructureController    • PrimeController              │  │
│  │  • CreditController       • OrdreMissionController       │  │
│  │  • DemandeController      • DocumentController           │  │
│  │  • AnnonceController      • ReclamationController        │  │
│  │  • NoteAnnuelleController • ExamenGradeController        │  │
│  │  • + 7 autres controllers                                │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────────┐  │
│  │                     Services (19)                         │  │
│  │                                                           │  │
│  │  @Service + @Transactional                               │  │
│  │  • Logique métier                                        │  │
│  │  • Validation des données                                │  │
│  │  • Calculs et transformations                            │  │
│  │  • Gestion des workflows                                 │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────────┐  │
│  │                   Repositories (24)                       │  │
│  │                                                           │  │
│  │  @Repository + JpaRepository                             │  │
│  │  • Requêtes CRUD                                         │  │
│  │  • Requêtes personnalisées (JPQL)                        │  │
│  │  • Gestion des relations                                 │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────────┐  │
│  │                     Entities (24)                         │  │
│  │                                                           │  │
│  │  @Entity + JPA Annotations                               │  │
│  │  • Grade, Structure, Salaire, Prime, Credit              │  │
│  │  • OrdreMission, Demande, Document, Annonce              │  │
│  │  • Reclamation, NoteAnnuelle, ExamenGrade                │  │
│  │  • + 12 autres entités                                   │  │
│  └──────────────────────┬────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ JDBC
                         │ jdbc:mysql://localhost:3307/khadamati_db
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   DATABASE (MySQL 8.0)                          │
│                     Port: 3307                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Tables (23)                            │  │
│  │                                                           │  │
│  │  Khadamati (5 tables):                                   │  │
│  │  • users                                                 │  │
│  │  • employees                                             │  │
│  │  • attendance                                            │  │
│  │  • leave_requests                                        │  │
│  │  • document_requests                                     │  │
│  │                                                           │  │
│  │  Tawassol (18 tables):                                   │  │
│  │  • coordination_region    • delegation_province          │  │
│  │  • structure              • grade                        │  │
│  │  • examen_grade           • salaire                      │  │
│  │  • prime                  • credit                       │  │
│  │  • programme_mission      • moyen_transport              │  │
│  │  • ordre_mission          • type_demande                 │  │
│  │  • demande                • piece_jointe                 │  │
│  │  • type_document          • document                     │  │
│  │  • annonce                • reclamation                  │  │
│  │  • note_annuelle                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUX DE DONNÉES

### Exemple : Création d'un Grade

```
┌─────────────┐
│  UTILISATEUR│
│   (ADMIN)   │
└──────┬──────┘
       │ 1. Clic "Nouveau grade"
       │
┌──────▼──────────────────────────────────────────┐
│  FRONTEND                                       │
│  /dashboard/grades/page.tsx                     │
│                                                 │
│  • Affiche le modal                            │
│  • Utilisateur remplit le formulaire          │
│  • Validation côté client                     │
└──────┬──────────────────────────────────────────┘
       │ 2. POST /api/grades
       │    { code, libelleFr, niveau, ... }
       │
┌──────▼──────────────────────────────────────────┐
│  BACKEND                                        │
│  GradeController.createGrade()                  │
│                                                 │
│  • Reçoit la requête                           │
│  • Valide les données                          │
└──────┬──────────────────────────────────────────┘
       │ 3. Appel service
       │
┌──────▼──────────────────────────────────────────┐
│  GradeService.createGrade()                     │
│                                                 │
│  • Logique métier                              │
│  • Vérifications                               │
│  • Transformations                             │
└──────┬──────────────────────────────────────────┘
       │ 4. Appel repository
       │
┌──────▼──────────────────────────────────────────┐
│  GradeRepository.save()                         │
│                                                 │
│  • Génère l'UUID                               │
│  • Prépare la requête SQL                      │
└──────┬──────────────────────────────────────────┘
       │ 5. INSERT INTO grade
       │
┌──────▼──────────────────────────────────────────┐
│  DATABASE                                       │
│  Table: grade                                   │
│                                                 │
│  • Insère l'enregistrement                     │
│  • Retourne l'ID                               │
└──────┬──────────────────────────────────────────┘
       │ 6. Retour du grade créé
       │
┌──────▼──────────────────────────────────────────┐
│  FRONTEND                                       │
│                                                 │
│  • Reçoit la réponse                           │
│  • Affiche toast "Grade créé"                  │
│  • Ferme le modal                              │
│  • Recharge la liste                           │
└─────────────────────────────────────────────────┘
```

---

## 🔐 ARCHITECTURE DE SÉCURITÉ

```
┌─────────────────────────────────────────────────────────────────┐
│                      COUCHE SÉCURITÉ                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  1. AUTHENTIFICATION                                            │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Login      │─────▶│  JWT Token   │─────▶│   Session    │ │
│  │   Page       │      │  Generation  │      │   Storage    │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. AUTORISATION                                                │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Requête    │─────▶│  Vérif Rôle  │─────▶│   Action     │ │
│  │   API        │      │  EMPLOYEE/   │      │   Autorisée  │ │
│  │              │      │  MANAGER/    │      │   ou Refusée │ │
│  │              │      │  ADMIN       │      │              │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. PROTECTION DES DONNÉES                                      │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Données    │─────▶│  Validation  │─────▶│   Stockage   │ │
│  │   Entrantes  │      │  Sanitization│      │   Sécurisé   │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  4. CORS ET HEADERS                                             │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Requête    │─────▶│  CORS Check  │─────▶│   Headers    │ │
│  │   Cross-     │      │  Origin      │      │   Security   │ │
│  │   Origin     │      │  Allowed     │      │              │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 ARCHITECTURE DES DONNÉES

```
┌─────────────────────────────────────────────────────────────────┐
│                      MODÈLE DE DONNÉES                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  HIÉRARCHIE ORGANISATIONNELLE                                   │
│                                                                 │
│  CoordinationRegion (12 régions)                               │
│         │                                                       │
│         ├─▶ DelegationProvince                                 │
│         │         │                                             │
│         │         └─▶ Structure (hiérarchique)                 │
│         │                   │                                   │
│         │                   └─▶ Employee                        │
│         │                         │                             │
│         └─────────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GESTION RH                                                     │
│                                                                 │
│  Employee                                                       │
│     │                                                           │
│     ├─▶ Grade                                                  │
│     ├─▶ Salaire (mensuel)                                      │
│     ├─▶ Prime (multiple)                                       │
│     ├─▶ Credit (multiple)                                      │
│     ├─▶ NoteAnnuelle (annuelle)                                │
│     ├─▶ OrdreMission (multiple)                                │
│     ├─▶ Demande (multiple)                                     │
│     └─▶ Reclamation (multiple)                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GESTION DOCUMENTAIRE                                           │
│                                                                 │
│  TypeDocument                                                   │
│     │                                                           │
│     └─▶ Document                                               │
│           │                                                     │
│           └─▶ PieceJointe                                      │
│                                                                 │
│  Demande                                                        │
│     │                                                           │
│     └─▶ PieceJointe (multiple)                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GESTION DES EXAMENS                                            │
│                                                                 │
│  Grade                                                          │
│     │                                                           │
│     └─▶ ExamenGrade (concours pour ce grade)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 ARCHITECTURE FRONTEND

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRUCTURE FRONTEND                           │
└─────────────────────────────────────────────────────────────────┘

frontend/
│
├── app/                          (Pages Next.js)
│   ├── page.tsx                  (Page d'accueil)
│   ├── layout.tsx                (Layout principal)
│   │
│   └── dashboard/                (Dashboard)
│       ├── layout.tsx            (Navigation + Sidebar)
│       ├── page.tsx              (Dashboard principal)
│       │
│       ├── grades/               (Module Grades)
│       │   └── page.tsx          (CRUD + Modal)
│       │
│       ├── structures/           (Module Structures)
│       │   └── page.tsx          (Hiérarchie + CRUD)
│       │
│       ├── salaires/             (Module Salaires)
│       │   └── page.tsx          (Consultation + Stats)
│       │
│       ├── primes/               (Module Primes)
│       │   └── page.tsx          (Gestion + Stats)
│       │
│       ├── credits/              (Module Crédits)
│       │   └── page.tsx          (Suivi + Stats)
│       │
│       ├── ordres-mission/       (Module Ordres Mission)
│       │   └── page.tsx          (Approbation + Cartes)
│       │
│       ├── demandes/             (Module Demandes)
│       │   └── page.tsx          (Gestion + Approbation)
│       │
│       ├── documents/            (Module Documents)
│       │   └── page.tsx          (Bibliothèque + Publication)
│       │
│       ├── reclamations/         (Module Réclamations)
│       │   └── page.tsx          (Suivi + Résolution)
│       │
│       ├── notes-annuelles/      (Module Notes)
│       │   └── page.tsx          (Évaluations + Validation)
│       │
│       └── examens/              (Module Examens)
│           └── page.tsx          (Concours + Suivi)
│
├── lib/                          (Bibliothèques)
│   ├── api.ts                    (Client API REST)
│   └── store.ts                  (État global Zustand)
│
└── public/                       (Assets statiques)
```

---

## 🔧 ARCHITECTURE BACKEND

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRUCTURE BACKEND                            │
└─────────────────────────────────────────────────────────────────┘

spring-backend/src/main/java/com/employeehub/
│
├── controller/                   (Controllers REST)
│   ├── GradeController.java
│   ├── StructureController.java
│   ├── SalaireController.java
│   ├── PrimeController.java
│   ├── CreditController.java
│   ├── OrdreMissionController.java
│   ├── DemandeController.java
│   ├── DocumentController.java
│   ├── AnnonceController.java
│   ├── ReclamationController.java
│   ├── NoteAnnuelleController.java
│   ├── ExamenGradeController.java
│   └── ... (7 autres)
│
├── service/                      (Services métier)
│   ├── GradeService.java
│   ├── StructureService.java
│   ├── SalaireService.java
│   ├── PrimeService.java
│   ├── CreditService.java
│   ├── OrdreMissionService.java
│   ├── DemandeService.java
│   ├── DocumentService.java
│   ├── AnnonceService.java
│   ├── ReclamationService.java
│   ├── NoteAnnuelleService.java
│   ├── ExamenGradeService.java
│   └── ... (7 autres)
│
├── repository/                   (Repositories JPA)
│   ├── GradeRepository.java
│   ├── StructureRepository.java
│   ├── SalaireRepository.java
│   ├── PrimeRepository.java
│   ├── CreditRepository.java
│   ├── OrdreMissionRepository.java
│   ├── DemandeRepository.java
│   ├── DocumentRepository.java
│   ├── AnnonceRepository.java
│   ├── ReclamationRepository.java
│   ├── NoteAnnuelleRepository.java
│   ├── ExamenGradeRepository.java
│   └── ... (12 autres)
│
└── model/                        (Entités JPA)
    ├── Grade.java
    ├── Structure.java
    ├── Salaire.java
    ├── Prime.java
    ├── Credit.java
    ├── OrdreMission.java
    ├── Demande.java
    ├── Document.java
    ├── Annonce.java
    ├── Reclamation.java
    ├── NoteAnnuelle.java
    ├── ExamenGrade.java
    └── ... (12 autres)
```

---

## 🚀 ARCHITECTURE DE DÉPLOIEMENT

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENVIRONNEMENT DE PRODUCTION                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INTERNET                                                       │
│                                                                 │
│  https://khadamati.ma                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS (443)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│  LOAD BALANCER / REVERSE PROXY                                  │
│  (Nginx / Apache)                                               │
│                                                                 │
│  • SSL/TLS Termination                                         │
│  • Load Balancing                                              │
│  • Caching                                                     │
└────────┬────────────────────────────┬───────────────────────────┘
         │                            │
         │ HTTP (3000)                │ HTTP (8081)
         │                            │
┌────────▼────────────┐      ┌────────▼────────────┐
│  FRONTEND           │      │  BACKEND            │
│  (Next.js)          │      │  (Spring Boot)      │
│                     │      │                     │
│  • Static Files     │      │  • REST API         │
│  • SSR/SSG          │      │  • Business Logic   │
│  • Client-side      │      │  • Authentication   │
└─────────────────────┘      └────────┬────────────┘
                                      │
                                      │ JDBC (3306)
                                      │
                             ┌────────▼────────────┐
                             │  DATABASE           │
                             │  (MySQL)            │
                             │                     │
                             │  • Data Storage     │
                             │  • Backups          │
                             │  • Replication      │
                             └─────────────────────┘
```

---

## 📊 ARCHITECTURE DES PERFORMANCES

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMISATIONS                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND                                                       │
│                                                                 │
│  • Code Splitting (Next.js automatique)                        │
│  • Lazy Loading des images                                     │
│  • Caching côté client                                         │
│  • Compression des assets                                      │
│  • CDN pour les fichiers statiques                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BACKEND                                                        │
│                                                                 │
│  • Connection Pooling (HikariCP)                               │
│  • Caching (Spring Cache)                                      │
│  • Pagination des résultats                                    │
│  • Indexation des tables                                       │
│  • Requêtes optimisées (JPQL)                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATABASE                                                       │
│                                                                 │
│  • Index sur les clés étrangères                               │
│  • Index sur les colonnes de recherche                         │
│  • Partitionnement des grandes tables                          │
│  • Réplication Master-Slave                                    │
│  • Backups réguliers                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONCLUSION

### Architecture Complète et Scalable
- ✅ Séparation claire des responsabilités
- ✅ Architecture en couches (MVC)
- ✅ API REST RESTful
- ✅ Sécurité intégrée
- ✅ Performance optimisée
- ✅ Prête pour le déploiement

### Points Forts
- ✅ Modulaire et maintenable
- ✅ Scalable horizontalement
- ✅ Testable (unitaire + intégration)
- ✅ Documentée complètement
- ✅ Suivant les best practices

---

**Architecture solide et prête pour la production !** 🏗️
