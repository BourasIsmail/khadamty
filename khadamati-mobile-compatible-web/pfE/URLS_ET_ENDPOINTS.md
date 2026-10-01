# 🔗 URLS ET ENDPOINTS COMPLETS

## Guide Complet des URLs Frontend et Endpoints Backend

---

## 🌐 URLS FRONTEND

### Base URL
```
http://localhost:3000
```

### Pages Publiques

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Page d'accueil |
| Login | `/login` | Page de connexion |

### Pages Dashboard

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/dashboard` | Dashboard principal |
| **Employés** | `/dashboard/employees` | Liste des employés |
| **Nouvel Employé** | `/dashboard/employees/new` | Créer un employé |
| **Profil** | `/dashboard/profile` | Profil utilisateur |
| **Analytics** | `/dashboard/analytics` | Statistiques |
| **Admin** | `/dashboard/admin` | Administration |
| **RH** | `/dashboard/rh` | Ressources Humaines |

### Pages Tawassol (Nouvelles) ⭐

| Page | URL | Description |
|------|-----|-------------|
| **Annonces** | `/dashboard/annonces` | Gestion des annonces |
| **Grades** | `/dashboard/grades` | Gestion des grades |
| **Structures** | `/dashboard/structures` | Hiérarchie organisationnelle |
| **Salaires** | `/dashboard/salaires` | Consultation des salaires |
| **Primes** | `/dashboard/primes` | Gestion des primes |
| **Crédits** | `/dashboard/credits` | Suivi des crédits |
| **Ordres Mission** | `/dashboard/ordres-mission` | Ordres de mission |
| **Demandes** | `/dashboard/demandes` | Gestion des demandes |
| **Documents** | `/dashboard/documents` | Bibliothèque de documents |
| **Réclamations** | `/dashboard/reclamations` | Suivi des réclamations |
| **Notes Annuelles** | `/dashboard/notes-annuelles` | Évaluations annuelles |
| **Examens** | `/dashboard/examens` | Concours et examens |

---

## 🔌 ENDPOINTS BACKEND

### Base URL
```
http://localhost:8081/api
```

---

## 📋 ENDPOINTS PAR MODULE

### 1. Grades (`/api/grades`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/grades` | Liste tous les grades | - |
| GET | `/api/grades/{id}` | Grade par ID | `id` (UUID) |
| GET | `/api/grades/code/{code}` | Grade par code | `code` (String) |
| GET | `/api/grades/search` | Recherche par libellé | `libelle` (String) |
| GET | `/api/grades/niveau/{niveau}` | Grades par niveau | `niveau` (Integer) |
| GET | `/api/grades/actifs` | Grades actifs | - |
| GET | `/api/grades/stats` | Statistiques | - |
| POST | `/api/grades` | Créer un grade | Body: Grade |
| PUT | `/api/grades/{id}` | Modifier un grade | `id` + Body: Grade |
| DELETE | `/api/grades/{id}` | Supprimer un grade | `id` (UUID) |

**Exemple de requête :**
```bash
# Créer un grade
curl -X POST http://localhost:8081/api/grades \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GR-01",
    "libelleFr": "Ingénieur Principal",
    "libelleAr": "مهندس رئيسي",
    "niveauHierarchique": 5,
    "salaireBase": 12000,
    "actif": true
  }'
```

---

### 2. Structures (`/api/structures`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/structures` | Liste toutes les structures | - |
| GET | `/api/structures/{id}` | Structure par ID | `id` (UUID) |
| GET | `/api/structures/code/{code}` | Structure par code | `code` (String) |
| GET | `/api/structures/type/{type}` | Structures par type | `type` (Enum) |
| GET | `/api/structures/niveau/{niveau}` | Structures par niveau | `niveau` (Integer) |
| GET | `/api/structures/parente/{id}` | Structures enfants | `id` (UUID) |
| GET | `/api/structures/hierarchie` | Hiérarchie complète | - |
| POST | `/api/structures` | Créer une structure | Body: Structure |
| PUT | `/api/structures/{id}` | Modifier une structure | `id` + Body: Structure |
| DELETE | `/api/structures/{id}` | Supprimer une structure | `id` (UUID) |

**Types de structures :**
- `DIRECTION`
- `SERVICE`
- `DIVISION`
- `DEPARTEMENT`
- `UNITE`

---

### 3. Salaires (`/api/salaires`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/salaires` | Liste tous les salaires | - |
| GET | `/api/salaires/{id}` | Salaire par ID | `id` (UUID) |
| GET | `/api/salaires/employe/{id}` | Salaires d'un employé | `id` (UUID) |
| GET | `/api/salaires/mois` | Salaires par mois | `mois`, `annee` |
| GET | `/api/salaires/annee/{annee}` | Salaires par année | `annee` (Integer) |
| GET | `/api/salaires/statut/{statut}` | Salaires par statut | `statut` (Enum) |
| GET | `/api/salaires/stats` | Statistiques | - |
| POST | `/api/salaires` | Créer un salaire | Body: Salaire |
| PUT | `/api/salaires/{id}` | Modifier un salaire | `id` + Body: Salaire |
| DELETE | `/api/salaires/{id}` | Supprimer un salaire | `id` (UUID) |

**Statuts de salaire :**
- `EN_ATTENTE`
- `EN_COURS`
- `PAYE`
- `ANNULE`

---

### 4. Primes (`/api/primes`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/primes` | Liste toutes les primes | - |
| GET | `/api/primes/{id}` | Prime par ID | `id` (UUID) |
| GET | `/api/primes/employe/{id}` | Primes d'un employé | `id` (UUID) |
| GET | `/api/primes/type/{type}` | Primes par type | `type` (Enum) |
| GET | `/api/primes/annee/{annee}` | Primes par année | `annee` (Integer) |
| GET | `/api/primes/stats` | Statistiques | - |
| POST | `/api/primes` | Créer une prime | Body: Prime |
| PUT | `/api/primes/{id}` | Modifier une prime | `id` + Body: Prime |
| DELETE | `/api/primes/{id}` | Supprimer une prime | `id` (UUID) |

**Types de prime :**
- `PERFORMANCE`
- `ANCIENNETE`
- `RESPONSABILITE`
- `RISQUE`
- `EXCEPTIONNELLE`

---

### 5. Crédits (`/api/credits`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/credits` | Liste tous les crédits | - |
| GET | `/api/credits/{id}` | Crédit par ID | `id` (UUID) |
| GET | `/api/credits/employe/{id}` | Crédits d'un employé | `id` (UUID) |
| GET | `/api/credits/statut/{statut}` | Crédits par statut | `statut` (Enum) |
| GET | `/api/credits/stats` | Statistiques | - |
| POST | `/api/credits` | Créer un crédit | Body: Credit |
| PUT | `/api/credits/{id}` | Modifier un crédit | `id` + Body: Credit |
| DELETE | `/api/credits/{id}` | Supprimer un crédit | `id` (UUID) |

**Statuts de crédit :**
- `EN_COURS`
- `REMBOURSE`
- `EN_RETARD`
- `ANNULE`

---

### 6. Ordres de Mission (`/api/ordres-mission`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/ordres-mission` | Liste tous les ordres | - |
| GET | `/api/ordres-mission/{id}` | Ordre par ID | `id` (UUID) |
| GET | `/api/ordres-mission/employe/{id}` | Ordres d'un employé | `id` (UUID) |
| GET | `/api/ordres-mission/statut/{statut}` | Ordres par statut | `statut` (Enum) |
| GET | `/api/ordres-mission/destination` | Ordres par destination | `destination` (String) |
| POST | `/api/ordres-mission` | Créer un ordre | Body: OrdreMission |
| PUT | `/api/ordres-mission/{id}` | Modifier un ordre | `id` + Body: OrdreMission |
| POST | `/api/ordres-mission/{id}/approve` | Approuver un ordre | `id` (UUID) |
| POST | `/api/ordres-mission/{id}/reject` | Rejeter un ordre | `id` + Body: motif |
| DELETE | `/api/ordres-mission/{id}` | Supprimer un ordre | `id` (UUID) |

**Statuts d'ordre de mission :**
- `EN_ATTENTE`
- `APPROUVE`
- `REJETE`
- `EN_COURS`
- `TERMINE`
- `ANNULE`

---

### 7. Demandes (`/api/demandes`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/demandes` | Liste toutes les demandes | - |
| GET | `/api/demandes/{id}` | Demande par ID | `id` (UUID) |
| GET | `/api/demandes/employe/{id}` | Demandes d'un employé | `id` (UUID) |
| GET | `/api/demandes/statut/{statut}` | Demandes par statut | `statut` (Enum) |
| GET | `/api/demandes/type/{typeId}` | Demandes par type | `typeId` (UUID) |
| GET | `/api/demandes/numero/{numero}` | Demande par numéro | `numero` (String) |
| POST | `/api/demandes` | Créer une demande | Body: Demande |
| PUT | `/api/demandes/{id}` | Modifier une demande | `id` + Body: Demande |
| POST | `/api/demandes/{id}/approve` | Approuver une demande | `id` (UUID) |
| POST | `/api/demandes/{id}/reject` | Rejeter une demande | `id` + Body: motif |
| DELETE | `/api/demandes/{id}` | Supprimer une demande | `id` (UUID) |

**Statuts de demande :**
- `EN_ATTENTE`
- `APPROUVEE`
- `REJETEE`
- `EN_COURS`
- `TRAITEE`
- `ANNULEE`

---

### 8. Documents (`/api/documents`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/documents` | Liste tous les documents | - |
| GET | `/api/documents/{id}` | Document par ID | `id` (UUID) |
| GET | `/api/documents/type/{typeId}` | Documents par type | `typeId` (UUID) |
| GET | `/api/documents/publies` | Documents publiés | - |
| GET | `/api/documents/search` | Recherche par titre | `titre` (String) |
| POST | `/api/documents` | Créer un document | Body: Document |
| PUT | `/api/documents/{id}` | Modifier un document | `id` + Body: Document |
| POST | `/api/documents/{id}/publish` | Publier un document | `id` (UUID) |
| DELETE | `/api/documents/{id}` | Supprimer un document | `id` (UUID) |

---

### 9. Annonces (`/api/annonces`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/annonces` | Liste toutes les annonces | - |
| GET | `/api/annonces/{id}` | Annonce par ID | `id` (UUID) |
| GET | `/api/annonces/type/{type}` | Annonces par type | `type` (Enum) |
| GET | `/api/annonces/priorite/{priorite}` | Annonces par priorité | `priorite` (Enum) |
| GET | `/api/annonces/actives` | Annonces actives | - |
| GET | `/api/annonces/publiees` | Annonces publiées | - |
| POST | `/api/annonces` | Créer une annonce | Body: Annonce |
| PUT | `/api/annonces/{id}` | Modifier une annonce | `id` + Body: Annonce |
| POST | `/api/annonces/{id}/publish` | Publier une annonce | `id` (UUID) |
| DELETE | `/api/annonces/{id}` | Supprimer une annonce | `id` (UUID) |

**Types d'annonce :**
- `INFORMATION`
- `ALERTE`
- `EVENEMENT`
- `URGENT`

**Priorités :**
- `HAUTE`
- `MOYENNE`
- `BASSE`

---

### 10. Réclamations (`/api/reclamations`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/reclamations` | Liste toutes les réclamations | - |
| GET | `/api/reclamations/{id}` | Réclamation par ID | `id` (UUID) |
| GET | `/api/reclamations/employe/{id}` | Réclamations d'un employé | `id` (UUID) |
| GET | `/api/reclamations/statut/{statut}` | Réclamations par statut | `statut` (Enum) |
| GET | `/api/reclamations/priorite/{priorite}` | Réclamations par priorité | `priorite` (Enum) |
| POST | `/api/reclamations` | Créer une réclamation | Body: Reclamation |
| PUT | `/api/reclamations/{id}` | Modifier une réclamation | `id` + Body: Reclamation |
| POST | `/api/reclamations/{id}/resolve` | Résoudre une réclamation | `id` + Body: reponse |
| DELETE | `/api/reclamations/{id}` | Supprimer une réclamation | `id` (UUID) |

**Statuts de réclamation :**
- `OUVERTE`
- `EN_COURS`
- `RESOLUE`
- `FERMEE`
- `REJETEE`

---

### 11. Notes Annuelles (`/api/notes-annuelles`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/notes-annuelles` | Liste toutes les notes | - |
| GET | `/api/notes-annuelles/{id}` | Note par ID | `id` (UUID) |
| GET | `/api/notes-annuelles/employe/{id}` | Notes d'un employé | `id` (UUID) |
| GET | `/api/notes-annuelles/annee/{annee}` | Notes par année | `annee` (Integer) |
| GET | `/api/notes-annuelles/validees` | Notes validées | - |
| GET | `/api/notes-annuelles/stats` | Statistiques | - |
| POST | `/api/notes-annuelles` | Créer une note | Body: NoteAnnuelle |
| PUT | `/api/notes-annuelles/{id}` | Modifier une note | `id` + Body: NoteAnnuelle |
| POST | `/api/notes-annuelles/{id}/validate` | Valider une note | `id` (UUID) |
| DELETE | `/api/notes-annuelles/{id}` | Supprimer une note | `id` (UUID) |

**Appréciations :**
- `EXCELLENT`
- `TRES_BIEN`
- `BIEN`
- `PASSABLE`
- `INSUFFISANT`

---

### 12. Examens (`/api/examens`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/examens` | Liste tous les examens | - |
| GET | `/api/examens/{id}` | Examen par ID | `id` (UUID) |
| GET | `/api/examens/grade/{gradeId}` | Examens par grade | `gradeId` (UUID) |
| GET | `/api/examens/type/{type}` | Examens par type | `type` (Enum) |
| GET | `/api/examens/a-venir` | Examens à venir | - |
| POST | `/api/examens` | Créer un examen | Body: ExamenGrade |
| PUT | `/api/examens/{id}` | Modifier un examen | `id` + Body: ExamenGrade |
| DELETE | `/api/examens/{id}` | Supprimer un examen | `id` (UUID) |

**Types d'examen :**
- `CONCOURS`
- `EXAMEN_PROFESSIONNEL`
- `FORMATION_QUALIFIANTE`
- `CERTIFICATION`

---

## 📊 ENDPOINTS DE STATISTIQUES

| Module | Endpoint | Description |
|--------|----------|-------------|
| Grades | `/api/grades/stats` | Nombre de grades, par niveau |
| Salaires | `/api/salaires/stats` | Total, moyenne, par statut |
| Primes | `/api/primes/stats` | Total, par type, par année |
| Crédits | `/api/credits/stats` | Total, restant, par statut |
| Notes | `/api/notes-annuelles/stats` | Moyenne, par appréciation |

---

## 🔐 AUTHENTIFICATION

### Endpoints d'Authentification

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| POST | `/api/auth/login` | Connexion | `{ email, password }` |
| POST | `/api/auth/logout` | Déconnexion | - |
| POST | `/api/auth/refresh` | Rafraîchir le token | `{ refreshToken }` |
| GET | `/api/auth/me` | Utilisateur actuel | - |

---

## 📝 FORMAT DES RÉPONSES

### Succès
```json
{
  "id": "uuid",
  "code": "GR-01",
  "libelleFr": "Ingénieur Principal",
  "niveauHierarchique": 5,
  "salaireBase": 12000,
  "actif": true,
  "dateCreation": "2024-01-15T10:30:00",
  "dateModification": "2024-01-15T10:30:00"
}
```

### Erreur
```json
{
  "message": "Grade non trouvé",
  "status": 404,
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## 🧪 EXEMPLES DE REQUÊTES

### Créer un Grade
```bash
curl -X POST http://localhost:8081/api/grades \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GR-01",
    "libelleFr": "Ingénieur Principal",
    "niveauHierarchique": 5,
    "salaireBase": 12000
  }'
```

### Approuver une Demande
```bash
curl -X POST http://localhost:8081/api/demandes/uuid-123/approve \
  -H "Content-Type: application/json"
```

### Rechercher des Salaires
```bash
curl "http://localhost:8081/api/salaires/mois?mois=1&annee=2024"
```

---

## 📚 DOCUMENTATION API

### Swagger UI (à configurer)
```
http://localhost:8081/swagger-ui.html
```

### OpenAPI JSON (à configurer)
```
http://localhost:8081/v3/api-docs
```

---

**Tous les endpoints sont prêts et fonctionnels !** 🔌
