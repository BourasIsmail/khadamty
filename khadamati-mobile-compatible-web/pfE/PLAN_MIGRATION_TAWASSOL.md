# 📋 Plan de Migration : Khadamati → Tawassol (Extension Complète)

## 🎯 Objectif
Étendre le projet Khadamati existant avec toutes les fonctionnalités du système Tawassol (système RH complet marocain).

---

## 📊 État Actuel de Khadamati

### Base de données actuelle :
- ✅ **users** (8 utilisateurs)
- ✅ **employees** (9 employés)
- ✅ **attendances** (168 présences)
- ✅ **leave_requests** (demandes de congé)
- ✅ **document_requests** (demandes de documents)

### Fonctionnalités actuelles :
- Authentification (JWT + OTP)
- Gestion des employés
- Gestion des présences
- Demandes de congé
- Demandes de documents

---

## 🆕 Nouvelles Fonctionnalités à Ajouter (Tawassol)

### 1. Structure Organisationnelle Hiérarchique
- ✨ **Coordinations régionales** (12 régions du Maroc)
- ✨ **Délégations provinciales**
- ✨ **Structures** (associations, établissements, centres, complexes)
- ✨ Hiérarchie parent-enfant

### 2. Gestion Avancée du Personnel
- ✨ **Grades** (échelles et échelons)
- ✨ **Examens de grade** (concours internes)
- ✨ **Notes annuelles** (évaluations)
- ✨ Matricules
- ✨ Dates de recrutement et d'échelon

### 3. Gestion Financière
- ✨ **Salaires mensuels** (avec allocations familiales, retenues mutuelle, rappels)
- ✨ **Primes** (gratifications, indemnités)
- ✨ **Crédits** (bancaires et internes AOS)
- ✨ Calcul automatique IR (impôt sur le revenu)

### 4. Ordres de Mission
- ✨ **Programmes de mission** (catégories)
- ✨ **Moyens de transport** (voiture de service, privée, transports en commun)
- ✨ **Indemnités de déplacement** (taux 1 et taux 2)
- ✨ Numéros d'ordre et d'état
- ✨ Cycles trimestriels

### 5. Gestion des Demandes (Extension)
- ✨ **Types de demandes** prédéfinis (8 types)
- ✨ **Pièces jointes** multiples
- ✨ Workflow d'approbation
- ✨ Commentaires RH

### 6. Gestion Documentaire
- ✨ **Types de documents** (circulaires, notes de service, formulaires, guides, décisions, résultats d'examens)
- ✨ Publication et expiration
- ✨ Stockage de fichiers

### 7. Communication Interne
- ✨ **Annonces** (avec dates d'expiration)
- ✨ **Réclamations** (avec suivi et réponses)

---

## 🗂️ Phase 1 : Migration de la Base de Données

### Étape 1.1 : Créer les Nouvelles Tables

#### Tables de Structure Organisationnelle
```sql
- coordination_region (12 régions)
- delegation_province (provinces/préfectures)
- structure (hiérarchie organisationnelle)
```

#### Tables de Gestion du Personnel
```sql
- grade (échelles et échelons)
- examen_grade (concours internes)
- note_annuelle (évaluations)
```

#### Tables Financières
```sql
- salaire (salaires mensuels)
- prime (primes et gratifications)
- credit (crédits bancaires et internes)
```

#### Tables Ordres de Mission
```sql
- programme_mission (catégories)
- moyen_transport (moyens de transport)
- ordre_mission (ordres de mission complets)
```

#### Tables de Gestion des Demandes
```sql
- type_demande (8 types prédéfinis)
- demande (extension de l'existant)
- piece_jointe (pièces jointes)
```

#### Tables Documentaires
```sql
- type_document (6 types)
- document (documents publiés)
```

#### Tables de Communication
```sql
- annonce (annonces internes)
- reclamation (réclamations)
```

### Étape 1.2 : Modifier les Tables Existantes

#### Transformer `employees` → `personnel`
```sql
- Ajouter : grade_id, structure_id, matricule
- Ajouter : nom_ar, prenom_ar, nom_fr, prenom_fr
- Ajouter : date_recrutement, echelon, echelle, date_echelon
- Ajouter : photo, est_actif
```

#### Transformer `users` → `utilisateur`
```sql
- Ajouter : personnel_id (lien avec personnel)
- Modifier : role (agent, rh, responsable, admin)
- Ajouter : derniere_cnx
```

#### Transformer `attendances` → Garder tel quel
```sql
- Peut rester inchangé ou être lié à personnel_id
```

#### Transformer `leave_requests` → Intégrer dans `demande`
```sql
- Migrer vers la table demande avec type_demande_id
```

#### Transformer `document_requests` → Intégrer dans `demande`
```sql
- Migrer vers la table demande avec type_demande_id
```

---

## 🔧 Phase 2 : Backend Spring Boot

### Étape 2.1 : Créer les Entités JPA

#### Nouvelles Entités
```
✨ CoordinationRegion.java
✨ DelegationProvince.java
✨ Structure.java
✨ Grade.java
✨ ExamenGrade.java
✨ NoteAnnuelle.java
✨ Salaire.java
✨ Prime.java
✨ Credit.java
✨ ProgrammeMission.java
✨ MoyenTransport.java
✨ OrdreMission.java
✨ TypeDemande.java
✨ Demande.java
✨ PieceJointe.java
✨ TypeDocument.java
✨ Document.java
✨ Annonce.java
✨ Reclamation.java
```

#### Entités à Modifier
```
🔄 Employee → Personnel
🔄 User → Utilisateur
🔄 Attendance (garder ou adapter)
🔄 LeaveRequest → Migrer vers Demande
🔄 DocumentRequest → Migrer vers Demande
```

### Étape 2.2 : Créer les Repositories

```
✨ CoordinationRegionRepository
✨ DelegationProvinceRepository
✨ StructureRepository
✨ GradeRepository
✨ ExamenGradeRepository
✨ NoteAnnuelleRepository
✨ SalaireRepository
✨ PrimeRepository
✨ CreditRepository
✨ ProgrammeMissionRepository
✨ MoyenTransportRepository
✨ OrdreMissionRepository
✨ TypeDemandeRepository
✨ DemandeRepository
✨ PieceJointeRepository
✨ TypeDocumentRepository
✨ DocumentRepository
✨ AnnonceRepository
✨ ReclamationRepository
```

### Étape 2.3 : Créer les Services

```
✨ CoordinationRegionService
✨ DelegationProvinceService
✨ StructureService
✨ GradeService
✨ ExamenGradeService
✨ NoteAnnuelleService
✨ SalaireService
✨ PrimeService
✨ CreditService
✨ OrdreMissionService
✨ DemandeService
✨ DocumentService
✨ AnnonceService
✨ ReclamationService
```

### Étape 2.4 : Créer les Controllers REST

```
✨ /api/coordinations
✨ /api/delegations
✨ /api/structures
✨ /api/grades
✨ /api/examens
✨ /api/notes-annuelles
✨ /api/salaires
✨ /api/primes
✨ /api/credits
✨ /api/ordres-mission
✨ /api/demandes
✨ /api/documents
✨ /api/annonces
✨ /api/reclamations
```

### Étape 2.5 : Créer les DTOs

```
✨ PersonnelDTO
✨ OrdreMissionDTO
✨ SalaireDTO
✨ DemandeDTO
✨ DocumentDTO
✨ etc.
```

---

## 🎨 Phase 3 : Frontend Next.js

### Étape 3.1 : Nouvelles Pages Dashboard

```
✨ /dashboard/personnel (liste et détails)
✨ /dashboard/structures (hiérarchie)
✨ /dashboard/ordres-mission (liste et création)
✨ /dashboard/salaires (consultation et gestion)
✨ /dashboard/primes (gestion des primes)
✨ /dashboard/credits (suivi des crédits)
✨ /dashboard/demandes (toutes les demandes)
✨ /dashboard/documents (bibliothèque)
✨ /dashboard/annonces (fil d'actualités)
✨ /dashboard/reclamations (suivi)
✨ /dashboard/examens (concours)
✨ /dashboard/notes-annuelles (évaluations)
```

### Étape 3.2 : Composants Réutilisables

```
✨ PersonnelCard
✨ OrdreMissionForm
✨ SalaireTable
✨ DemandeWorkflow
✨ DocumentViewer
✨ AnnonceCard
✨ ReclamationForm
✨ StructureTree (hiérarchie)
```

### Étape 3.3 : Gestion d'État (Redux)

```
✨ personnelSlice
✨ ordreMissionSlice
✨ salaireSlice
✨ demandeSlice
✨ documentSlice
✨ annonceSlice
✨ reclamationSlice
```

---

## 📱 Phase 4 : Application Mobile Flutter

### Étape 4.1 : Nouvelles Fonctionnalités

```
✨ Consultation des salaires
✨ Consultation des primes
✨ Suivi des crédits
✨ Demandes (tous types)
✨ Ordres de mission
✨ Documents
✨ Annonces
✨ Réclamations
✨ Notes annuelles
```

### Étape 4.2 : Nouveaux Écrans

```
✨ SalaireScreen
✨ OrdreMissionScreen
✨ DemandeScreen
✨ DocumentScreen
✨ AnnonceScreen
✨ ReclamationScreen
```

---

## 🔐 Phase 5 : Sécurité et Permissions

### Rôles et Permissions

#### Agent (Personnel)
- ✅ Consulter ses propres données
- ✅ Soumettre des demandes
- ✅ Consulter ses salaires et primes
- ✅ Voir les annonces
- ✅ Soumettre des réclamations

#### RH (Ressources Humaines)
- ✅ Gérer le personnel
- ✅ Approuver/rejeter les demandes
- ✅ Gérer les salaires et primes
- ✅ Gérer les ordres de mission
- ✅ Publier des documents
- ✅ Répondre aux réclamations

#### Responsable
- ✅ Valider les ordres de mission
- ✅ Saisir les notes annuelles
- ✅ Consulter les rapports

#### Admin
- ✅ Accès complet
- ✅ Gérer les structures
- ✅ Gérer les grades
- ✅ Gérer les utilisateurs

---

## 📦 Phase 6 : Données Initiales

### Données à Insérer

```sql
✅ 12 coordinations régionales (Maroc)
✅ Types de demandes (8 types)
✅ Types de documents (6 types)
✅ Moyens de transport (3 types)
✅ Grade temporaire (pour migration)
✅ Utilisateur admin
```

---

## 🧪 Phase 7 : Tests

### Tests Backend
```
✅ Tests unitaires (JUnit)
✅ Tests d'intégration
✅ Tests des endpoints REST
```

### Tests Frontend
```
✅ Tests des composants
✅ Tests d'intégration
✅ Tests E2E
```

---

## 📚 Phase 8 : Documentation

```
✅ Documentation API (Swagger)
✅ Guide utilisateur
✅ Guide d'installation
✅ Diagrammes UML
```

---

## ⏱️ Estimation du Temps

| Phase | Durée Estimée |
|-------|---------------|
| Phase 1 : Base de données | 2-3 jours |
| Phase 2 : Backend | 5-7 jours |
| Phase 3 : Frontend | 5-7 jours |
| Phase 4 : Mobile | 3-5 jours |
| Phase 5 : Sécurité | 2-3 jours |
| Phase 6 : Données initiales | 1 jour |
| Phase 7 : Tests | 3-4 jours |
| Phase 8 : Documentation | 2-3 jours |
| **TOTAL** | **23-35 jours** |

---

## 🚀 Ordre d'Exécution Recommandé

1. ✅ **Créer le script de migration SQL complet**
2. ✅ **Exécuter la migration sur la base de données**
3. ✅ **Créer toutes les entités JPA**
4. ✅ **Créer les repositories**
5. ✅ **Créer les services**
6. ✅ **Créer les controllers REST**
7. ✅ **Tester les endpoints avec Postman**
8. ✅ **Créer les pages frontend**
9. ✅ **Intégrer frontend avec backend**
10. ✅ **Adapter l'application mobile**
11. ✅ **Tests complets**
12. ✅ **Documentation**

---

## 📝 Notes Importantes

- ⚠️ **Sauvegarder la base de données actuelle avant migration**
- ⚠️ **Migrer les données existantes (users, employees, attendances)**
- ⚠️ **Adapter les endpoints existants**
- ⚠️ **Maintenir la compatibilité avec le frontend existant**
- ⚠️ **Tester chaque fonctionnalité après implémentation**

---

## 🎯 Prochaine Étape

**Commencer par la Phase 1 : Migration de la Base de Données**

Voulez-vous que je commence par créer le script SQL complet de migration ?
