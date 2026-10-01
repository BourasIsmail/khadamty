# Khadamati — Système RH · Entraide Nationale

Plateforme moderne de gestion des ressources humaines avec **Spring Boot**, **MySQL**, **Next.js** et **Flutter**.

> 🆕 **Dernière mise à jour** : 6 mai 2026
> - ✅ Connexion simplifiée avec détection automatique du rôle
> - ✅ Migration vers MySQL pour une meilleure robustesse

---

## 🏗️ Architecture

```
khadamati/
├── spring-backend/   → API REST (Spring Boot 3.2 + MySQL + JPA)
├── frontend/         → Interface web (Next.js 14 + Tailwind)
└── mobile/           → Application mobile (Flutter)
```

---

## 🚀 Démarrage Rapide

### Prérequis

- ✅ Java 17+
- ✅ Node.js 18+
- ✅ MySQL 8.0+
- ✅ Maven
- ✅ Flutter (pour mobile)

### 1. Configuration MySQL

```bash
# Démarrer MySQL
net start MySQL80

# Créer la base de données
mysql -u root -p
CREATE DATABASE khadamati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

Modifier `spring-backend/src/main/resources/application.yml` :
```yaml
spring:
  datasource:
    password: VOTRE_MOT_DE_PASSE_MYSQL
```

### 2. Backend Spring Boot

```bash
cd spring-backend

# Compiler
./mvnw clean install

# Démarrer
./mvnw spring-boot:run
```

Le backend sera disponible sur : **http://localhost:8080/api**

### 3. Frontend Next.js

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer
npm run dev
```

Le frontend sera disponible sur : **http://localhost:3000**

### 4. Mobile Flutter (Optionnel)

```bash
cd mobile

# Installer les dépendances
flutter pub get

# Lancer
flutter run -d chrome
```

---

## 🔐 Authentification

### Connexion Simplifiée

Le système utilise maintenant **un seul formulaire de connexion** avec détection automatique du rôle.

**Flux d'authentification :**
1. Saisir email + mot de passe
2. Le système détecte automatiquement votre rôle (Admin, RH, ou Employé)
3. Un code OTP est envoyé par email
4. Saisir le code OTP pour se connecter
5. Redirection automatique vers le dashboard approprié

### Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@demo.com | password123 |
| **RH** | rh@demo.com | password123 |
| **Employé** | employee@demo.com | password123 |

> ⚠️ **Note** : Vous devez créer ces comptes via l'endpoint `/auth/register` au premier démarrage.

### Créer les Comptes de Test

```bash
# Compte Admin
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "System",
    "phone": "0612345678",
    "department": "Administration",
    "position": "Administrateur",
    "hireDate": "2024-01-01",
    "role": "ADMIN"
  }'

# Compte RH
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rh@demo.com",
    "password": "password123",
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "0612345679",
    "department": "Ressources Humaines",
    "position": "Responsable RH",
    "hireDate": "2024-01-01",
    "role": "RH"
  }'

# Compte Employé
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@demo.com",
    "password": "password123",
    "firstName": "Jean",
    "lastName": "Martin",
    "phone": "0612345680",
    "department": "Développement",
    "position": "Développeur",
    "hireDate": "2024-01-01"
  }'
```

---

## 👥 Rôles et Accès

### 🔴 ADMIN - Accès Complet
- ✅ Gestion complète des utilisateurs
- ✅ Gestion des employés (CRUD)
- ✅ Création de comptes Employé ou RH
- ✅ Gestion des présences
- ✅ Validation des demandes
- ✅ Statistiques globales
- ✅ Administration système

### 🔵 RH - Gestion Employés
- ✅ Consultation des employés
- ✅ Gestion des présences
- ✅ Validation des demandes de congés
- ✅ Traitement des demandes d'attestations
- ✅ Statistiques RH

### 🟢 EMPLOYEE - Fonctionnalités Personnelles
- ✅ Consultation du profil
- ✅ Solde de congés
- ✅ Demande de congé
- ✅ Demande d'attestations
- ✅ Historique des présences

---

## 📋 Fonctionnalités

### Gestion des Employés
- ✅ CRUD complet (Admin/RH)
- ✅ Recherche et filtres
- ✅ Pagination
- ✅ Import/Export (à venir)

### Gestion des Présences
- ✅ Pointage entrée/sortie
- ✅ Historique des présences
- ✅ Statistiques mensuelles
- ✅ Gestion des absences

### Gestion des Congés
- ✅ Solde de congés (annuel, maladie, personnel)
- ✅ Demande de congé
- ✅ Validation par RH/Admin
- ✅ Historique des demandes

### Gestion des Attestations
- ✅ Demande d'attestations (travail, salaire, fiscal...)
- ✅ Traitement par RH/Admin
- ✅ Génération de documents (à venir)

### Statistiques
- ✅ Dashboard Admin avec métriques globales
- ✅ Dashboard RH avec statistiques employés
- ✅ Graphiques et visualisations

---

## 📡 API Endpoints

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Connexion (email + mot de passe) |
| POST | `/auth/verify-otp` | Vérification OTP |
| POST | `/auth/resend-otp` | Renvoyer OTP |
| GET | `/auth/me` | Profil connecté |
| PUT | `/auth/profile` | Modifier profil |
| POST | `/auth/change-password` | Changer mot de passe |
| POST | `/auth/register` | Créer un compte |

### Employés
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/employees` | Liste paginée |
| POST | `/employees` | Créer employé |
| GET | `/employees/{id}` | Détails |
| PUT | `/employees/{id}` | Modifier |
| DELETE | `/employees/{id}` | Supprimer |
| GET | `/employees/stats` | Statistiques |

### Admin
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/users` | Liste utilisateurs |
| PUT | `/admin/users/{id}` | Modifier utilisateur |
| DELETE | `/admin/users/{id}` | Supprimer utilisateur |
| PATCH | `/admin/users/{id}/toggle-status` | Activer/désactiver |
| GET | `/admin/dashboard-stats` | Stats dashboard |

### RH
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rh/stats` | Statistiques RH |
| GET | `/rh/leave-requests` | Demandes de congés |
| PUT | `/rh/leave-requests/{id}/approve` | Approuver congé |
| PUT | `/rh/leave-requests/{id}/reject` | Rejeter congé |
| GET | `/rh/document-requests` | Demandes d'attestations |
| PUT | `/rh/document-requests/{id}/process` | Traiter attestation |

### Présences
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/attendance` | Liste avec filtres |
| POST | `/attendance/check-in` | Pointer entrée |
| POST | `/attendance/check-out` | Pointer sortie |
| POST | `/attendance` | Créer manuellement |
| PUT | `/attendance/{id}` | Modifier |

---

## 🛠️ Technologies

### Backend
- **Spring Boot 3.2.0** - Framework Java
- **Spring Security + JWT** - Authentification et autorisation
- **Spring Data JPA** - Persistance des données
- **MySQL 8.0** - Base de données relationnelle
- **Spring Mail** - Envoi d'emails (OTP)
- **Springdoc OpenAPI** - Documentation API (Swagger)

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état
- **React Hot Toast** - Notifications

### Mobile
- **Flutter 3.x** - Framework mobile cross-platform
- **Provider** - Gestion d'état
- **HTTP package** - Requêtes API

---

## 📊 Base de Données MySQL

### Tables Principales

```sql
-- Utilisateurs (comptes de connexion)
users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('ADMIN', 'RH', 'EMPLOYEE'),
  is_active BOOLEAN,
  created_at DATETIME,
  updated_at DATETIME
)

-- Employés (profils)
employees (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  hire_date DATE,
  salary DECIMAL(10,2),
  annual_leave_balance INT,
  sick_leave_balance INT,
  personal_leave_balance INT,
  ...
)

-- Présences
attendances (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(50),
  date DATE,
  check_in TIME,
  check_out TIME,
  hours_worked INT,
  status ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'),
  ...
)

-- Demandes de congés
leave_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(50),
  leave_type ENUM('ANNUAL_LEAVE', 'SICK_LEAVE', ...),
  start_date DATE,
  end_date DATE,
  days_requested INT,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
  ...
)

-- Demandes d'attestations
document_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(50),
  document_type ENUM('WORK_CERTIFICATE', 'SALARY_CERTIFICATE', ...),
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'),
  ...
)
```

---

## 📚 Documentation

### Guides Disponibles

- **[MIGRATION_MYSQL_GUIDE.md](MIGRATION_MYSQL_GUIDE.md)** - Guide de migration MongoDB → MySQL
- **[MODIFICATIONS_CONNEXION.md](MODIFICATIONS_CONNEXION.md)** - Détails des changements de connexion
- **[COMMANDES_DEMARRAGE.md](COMMANDES_DEMARRAGE.md)** - Toutes les commandes utiles
- **[CHECKLIST_FINALISATION.md](CHECKLIST_FINALISATION.md)** - Checklist pour finaliser
- **[AVANT_APRES_COMPARAISON.md](AVANT_APRES_COMPARAISON.md)** - Comparaison visuelle
- **[RESUME_VISUEL_MODIFICATIONS.md](RESUME_VISUEL_MODIFICATIONS.md)** - Résumé visuel

### Swagger UI

Documentation interactive de l'API disponible sur :
```
http://localhost:8080/api/swagger-ui/index.html
```

---

## 🔧 Configuration

### Backend (`application.yml`)

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/khadamati_db?createDatabaseIfNotExist=true
    username: root
    password: votre_mot_de_passe
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: votre-email@gmail.com
    password: votre-mot-de-passe-app

jwt:
  secret: votre-secret-jwt
  expiration: 86400000  # 24h
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Mobile (`constants.dart`)

```dart
static const String apiBase = 'http://localhost:8080/api';
```

---

## 🐛 Dépannage

### MySQL ne démarre pas
```bash
# Vérifier le service
sc query MySQL80

# Redémarrer
net stop MySQL80
net start MySQL80
```

### Port 8080 déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :8080

# Tuer le processus
taskkill /PID <PID> /F
```

### Erreur de connexion MySQL
- Vérifier que MySQL est démarré
- Vérifier le mot de passe dans `application.yml`
- Vérifier que la base de données existe

### Email OTP non reçu
Les codes OTP s'affichent dans les logs du backend :
```
>>> CODE OTP pour email@example.com : 123456 <<<
```

---

## 📝 Notes Importantes

1. **Hibernate** : Les tables sont créées automatiquement au premier démarrage (`ddl-auto: update`)
2. **Rôles** : `ADMIN`, `RH`, `EMPLOYEE` (majuscules dans la base de données)
3. **CORS** : Configuré pour `localhost:*` (tous les ports)
4. **JWT** : Expire après 24h, OTP après 5 minutes
5. **Sécurité** : Les endpoints sont protégés par `@PreAuthorize`

---

## 🎯 Roadmap

### Version Actuelle (v1.0)
- ✅ Authentification JWT avec OTP
- ✅ Gestion des employés
- ✅ Gestion des présences
- ✅ Gestion des congés
- ✅ Gestion des attestations
- ✅ Statistiques et analytics

### Prochaines Versions
- 🔄 Génération de documents PDF
- 🔄 Notifications en temps réel
- 🔄 Rapports avancés
- 🔄 Import/Export Excel
- 🔄 Gestion des contrats
- 🔄 Gestion de la paie

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@khadamati.ma
- 📚 Documentation : [docs.khadamati.ma](https://docs.khadamati.ma)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/issues)

---

## 🙏 Remerciements

- **Entraide Nationale** - Client et sponsor du projet
- **Spring Boot** - Framework backend
- **Next.js** - Framework frontend
- **Flutter** - Framework mobile
- **MySQL** - Base de données

---

*Khadamati · خدماتي · Entraide Nationale · Royaume du Maroc*

**Version 1.0** - Mise à jour le 6 mai 2026
