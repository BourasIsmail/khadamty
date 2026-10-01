# 🚀 Employee Management System - Spring Boot Backend

## 📋 Description
Backend Java Spring Boot pour le système de gestion des employés avec les nouveaux rôles et fonctionnalités.

## 🔧 Technologies
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA (Hibernate)**
- **Maven**
- **MySQL 8**

## 👥 Nouveaux Rôles
1. **ADMIN** - Administrateur système (rouge)
2. **RH** - Ressources Humaines (bleu) 
3. **EMPLOYEE** - Employé (vert)

## ✨ Nouvelles Fonctionnalités Employee
- 📊 **Voir son solde de congés** (annuels, maladie, personnels)
- 🏖️ **Demander des congés** (avec types et motifs)
- 📄 **Demander des attestations** (travail, salaire, etc.)
- 📅 **Consulter ses présences**
- 👤 **Gérer son profil**

## 🚀 Installation et Démarrage

### Prérequis
- Java 17+
- Maven 3.6+
- MongoDB (déjà installé)

### 1. Compilation
```bash
cd spring-backend
mvn clean install
```

### 2. Démarrage
```bash
mvn spring-boot:run
```

Le serveur démarre sur **http://localhost:8080/api**

## 🔐 Comptes de Test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@demo.com | password123 | ADMIN |
| rh@demo.com | password123 | RH |
| employee@demo.com | password123 | EMPLOYEE |

## 📡 API Endpoints

### 🔑 Authentication
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### 👨‍💼 Employee (Employé)
- `GET /api/employee/profile` - Mon profil
- `GET /api/employee/leave-balance` - Mon solde de congés
- `POST /api/employee/leave-request` - Demander un congé
- `GET /api/employee/leave-requests` - Mes demandes de congés
- `POST /api/employee/document-request` - Demander un document
- `GET /api/employee/document-requests` - Mes demandes de documents
- `GET /api/employee/attendances` - Mes présences

### 🏢 RH (Ressources Humaines)
- Gestion des employés
- Validation des demandes de congés
- Traitement des demandes de documents
- Gestion des présences

### ⚙️ Admin (Administrateur)
- Gestion complète du système
- Gestion des utilisateurs
- Statistiques et rapports

## 📊 Modèles de Données

### LeaveRequest (Demande de Congé)
```json
{
  "leaveType": "ANNUAL_LEAVE",
  "startDate": "2024-05-01",
  "endDate": "2024-05-05",
  "daysRequested": 5,
  "reason": "Vacances familiales",
  "status": "PENDING"
}
```

### DocumentRequest (Demande de Document)
```json
{
  "documentType": "WORK_CERTIFICATE",
  "purpose": "Démarches bancaires",
  "status": "PENDING"
}
```

### Employee (Employé)
```json
{
  "employeeId": "EMP001",
  "firstName": "Jean",
  "lastName": "Martin",
  "email": "jean.martin@demo.com",
  "department": "IT",
  "position": "Développeur",
  "annualLeaveBalance": 25,
  "sickLeaveBalance": 10,
  "personalLeaveBalance": 5
}
```

## 🔧 Configuration

### application.yml
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/employee_management
```

## 🎯 Prochaines Étapes
1. ✅ Backend Spring Boot créé
2. 🔄 Adapter le frontend Next.js (URL API: 8080 → 8080)
3. 🎨 Mettre à jour les pages pour les nouvelles fonctionnalités
4. 📱 Tester l'intégration complète

## 🐛 Debug
- Logs disponibles dans la console
- MongoDB sur port 27017
- API sur http://localhost:8080/api
- CORS configuré pour http://localhost:3000

## 📝 Notes
- Le seed automatique crée des données de test au démarrage
- JWT tokens valides 24h
- Mots de passe hashés avec BCrypt
- Base de données MongoDB: `employee_management`