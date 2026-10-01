# 🛠️ Commandes Utiles - Khadamati

**Guide de référence rapide** 📚

---

## 🚀 Démarrage

### Backend
```bash
# Démarrer le backend Spring Boot
cd spring-backend
./mvnw spring-boot:run

# Ou avec Maven installé globalement
mvn spring-boot:run

# Nettoyer et recompiler
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend
```bash
# Démarrer le frontend Next.js
cd frontend
npm run dev

# Ou avec yarn
yarn dev

# Build pour production
npm run build
npm start
```

### MySQL
```bash
# Se connecter à MySQL
mysql -u root -p2003

# Ou avec MySQL Workbench
# Ouvrir MySQL Workbench → Nouvelle connexion
# Host: localhost
# Port: 3306
# Username: root
# Password: 2003
```

---

## 🗄️ Commandes MySQL

### Base de Données

```sql
-- Utiliser la base de données
USE khadamati_db;

-- Voir toutes les tables
SHOW TABLES;

-- Voir la structure d'une table
DESCRIBE users;
DESCRIBE employees;
DESCRIBE leave_requests;
DESCRIBE document_requests;
DESCRIBE attendance;

-- Supprimer la base de données (ATTENTION !)
DROP DATABASE khadamati_db;

-- Recréer la base de données
CREATE DATABASE khadamati_db;
```

### Utilisateurs

```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Voir les utilisateurs avec colonnes spécifiques
SELECT id, email, first_name, last_name, role, email_verified, is_active 
FROM users;

-- Voir un utilisateur spécifique
SELECT * FROM users WHERE email = 'ismailelrhazoui21@gmail.com';

-- Compter les utilisateurs par rôle
SELECT role, COUNT(*) as nombre 
FROM users 
GROUP BY role;

-- Voir les utilisateurs non vérifiés
SELECT email, first_name, last_name, role 
FROM users 
WHERE email_verified = false;

-- Voir les utilisateurs vérifiés
SELECT email, first_name, last_name, role 
FROM users 
WHERE email_verified = true;

-- Mettre à jour un utilisateur
UPDATE users 
SET email_verified = true 
WHERE email = 'test@khadamati.ma';

-- Réinitialiser la vérification d'un utilisateur
UPDATE users 
SET email_verified = false 
WHERE email = 'ismailelrhazoui21@gmail.com';

-- Activer/Désactiver un utilisateur
UPDATE users SET is_active = true WHERE email = 'test@khadamati.ma';
UPDATE users SET is_active = false WHERE email = 'test@khadamati.ma';

-- Supprimer un utilisateur (ATTENTION !)
DELETE FROM users WHERE email = 'test@khadamati.ma';
```

### Employés

```sql
-- Voir tous les employés
SELECT * FROM employees;

-- Voir les employés avec colonnes spécifiques
SELECT id, employee_id, first_name, last_name, email, department, position, hire_date 
FROM employees;

-- Voir un employé spécifique
SELECT * FROM employees WHERE email = 'ismailelrhazoui21@gmail.com';

-- Compter les employés par département
SELECT department, COUNT(*) as nombre 
FROM employees 
GROUP BY department;

-- Voir les employés embauchés cette année
SELECT employee_id, first_name, last_name, hire_date 
FROM employees 
WHERE YEAR(hire_date) = YEAR(CURDATE());

-- Mettre à jour un employé
UPDATE employees 
SET department = 'IT', position = 'Senior Developer' 
WHERE email = 'test@khadamati.ma';

-- Supprimer un employé (ATTENTION !)
DELETE FROM employees WHERE email = 'test@khadamati.ma';
```

### Congés

```sql
-- Voir toutes les demandes de congés
SELECT * FROM leave_requests;

-- Voir les demandes avec informations employé
SELECT 
    lr.id,
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employe,
    lr.leave_type,
    lr.start_date,
    lr.end_date,
    lr.days_requested,
    lr.status,
    lr.created_at
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
ORDER BY lr.created_at DESC;

-- Voir les demandes en attente
SELECT * FROM leave_requests WHERE status = 'PENDING';

-- Voir les demandes approuvées
SELECT * FROM leave_requests WHERE status = 'APPROVED';

-- Voir les demandes rejetées
SELECT * FROM leave_requests WHERE status = 'REJECTED';

-- Compter les demandes par statut
SELECT status, COUNT(*) as nombre 
FROM leave_requests 
GROUP BY status;

-- Approuver une demande
UPDATE leave_requests 
SET status = 'APPROVED' 
WHERE id = 1;

-- Rejeter une demande
UPDATE leave_requests 
SET status = 'REJECTED' 
WHERE id = 1;
```

### Attestations

```sql
-- Voir toutes les demandes d'attestations
SELECT * FROM document_requests;

-- Voir les demandes avec informations employé
SELECT 
    dr.id,
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employe,
    dr.document_type,
    dr.reason,
    dr.status,
    dr.created_at
FROM document_requests dr
JOIN employees e ON dr.employee_id = e.id
ORDER BY dr.created_at DESC;

-- Voir les demandes en attente
SELECT * FROM document_requests WHERE status = 'PENDING';

-- Compter les demandes par type
SELECT document_type, COUNT(*) as nombre 
FROM document_requests 
GROUP BY document_type;

-- Approuver une demande
UPDATE document_requests 
SET status = 'APPROVED' 
WHERE id = 1;
```

### Statistiques

```sql
-- Nombre total d'utilisateurs
SELECT COUNT(*) as total_utilisateurs FROM users;

-- Nombre total d'employés
SELECT COUNT(*) as total_employes FROM employees;

-- Nombre de demandes de congés par statut
SELECT 
    status,
    COUNT(*) as nombre,
    SUM(days_requested) as total_jours
FROM leave_requests 
GROUP BY status;

-- Nombre de demandes d'attestations par statut
SELECT status, COUNT(*) as nombre 
FROM document_requests 
GROUP BY status;

-- Employés par département
SELECT department, COUNT(*) as nombre 
FROM employees 
GROUP BY department 
ORDER BY nombre DESC;

-- Statistiques complètes
SELECT 
    (SELECT COUNT(*) FROM users) as total_utilisateurs,
    (SELECT COUNT(*) FROM employees) as total_employes,
    (SELECT COUNT(*) FROM leave_requests WHERE status = 'PENDING') as conges_en_attente,
    (SELECT COUNT(*) FROM document_requests WHERE status = 'PENDING') as attestations_en_attente;
```

### Nettoyage

```sql
-- Supprimer toutes les demandes de congés (ATTENTION !)
DELETE FROM leave_requests;

-- Supprimer toutes les demandes d'attestations (ATTENTION !)
DELETE FROM document_requests;

-- Supprimer tous les employés (ATTENTION !)
DELETE FROM employees;

-- Supprimer tous les utilisateurs (ATTENTION !)
DELETE FROM users;

-- Réinitialiser les auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE leave_requests AUTO_INCREMENT = 1;
ALTER TABLE document_requests AUTO_INCREMENT = 1;
```

---

## 🧪 Commandes de Test (curl)

### Authentification

```bash
# Test de connexion (première fois - avec OTP)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ismailelrhazoui21@gmail.com",
    "password": "smail1234"
  }'

# Vérifier OTP
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ismailelrhazoui21@gmail.com",
    "code": "123456"
  }'

# Renvoyer OTP
curl -X POST http://localhost:8080/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ismailelrhazoui21@gmail.com"
  }'

# Vérifier si un compte existe
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com

# Réinitialiser la vérification email (pour tests)
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/ismailelrhazoui21@gmail.com

# Créer un nouveau compte
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nouveau@khadamati.ma",
    "password": "Test123!",
    "firstName": "Nouveau",
    "lastName": "Employé",
    "phone": "0612345678",
    "department": "IT",
    "position": "Développeur",
    "hireDate": "2026-05-06"
  }'

# Obtenir le profil utilisateur connecté
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Employés

```bash
# Obtenir tous les employés
curl http://localhost:8080/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Obtenir un employé spécifique
curl http://localhost:8080/api/employees/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Créer un employé
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Test",
    "lastName": "Employé",
    "email": "test@khadamati.ma",
    "phone": "0612345678",
    "department": "IT",
    "position": "Développeur",
    "hireDate": "2026-05-06"
  }'

# Mettre à jour un employé
curl -X PUT http://localhost:8080/api/employees/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Test",
    "lastName": "Employé Modifié",
    "department": "RH"
  }'

# Supprimer un employé
curl -X DELETE http://localhost:8080/api/employees/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Congés

```bash
# Obtenir toutes les demandes de congés
curl http://localhost:8080/api/leave-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Créer une demande de congé
curl -X POST http://localhost:8080/api/leave-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employeeId": 1,
    "leaveType": "ANNUAL",
    "startDate": "2026-06-01",
    "endDate": "2026-06-10",
    "daysRequested": 10,
    "reason": "Vacances d'\''été"
  }'

# Approuver une demande
curl -X PUT http://localhost:8080/api/leave-requests/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "APPROVED"
  }'

# Rejeter une demande
curl -X PUT http://localhost:8080/api/leave-requests/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "REJECTED"
  }'
```

### Attestations

```bash
# Obtenir toutes les demandes d'attestations
curl http://localhost:8080/api/document-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Créer une demande d'attestation
curl -X POST http://localhost:8080/api/document-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employeeId": 1,
    "documentType": "WORK_CERTIFICATE",
    "reason": "Demande de visa"
  }'

# Approuver une demande
curl -X PUT http://localhost:8080/api/document-requests/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "APPROVED"
  }'
```

---

## 🔧 Commandes Git

```bash
# Initialiser un dépôt Git
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit - Khadamati v1.0"

# Ajouter un remote
git remote add origin https://github.com/votre-username/khadamati.git

# Push vers GitHub
git push -u origin main

# Voir le statut
git status

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge feature/nouvelle-fonctionnalite
```

---

## 📦 Commandes NPM/Maven

### Frontend (NPM)

```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Nettoyer le cache
rm -rf .next
rm -rf node_modules
npm install
```

### Backend (Maven)

```bash
# Installer les dépendances
./mvnw clean install

# Démarrer l'application
./mvnw spring-boot:run

# Compiler sans tests
./mvnw clean install -DskipTests

# Exécuter les tests
./mvnw test

# Créer un JAR
./mvnw package

# Nettoyer
./mvnw clean
```

---

## 🐛 Commandes de Débogage

### Logs Backend

```bash
# Voir les logs en temps réel
tail -f spring-backend/logs/application.log

# Chercher une erreur spécifique
grep "ERROR" spring-backend/logs/application.log

# Voir les dernières 100 lignes
tail -n 100 spring-backend/logs/application.log
```

### Logs Frontend

```bash
# Les logs s'affichent directement dans le terminal où vous avez lancé npm run dev
# Ou dans la console du navigateur (F12)
```

### Vérifier les Ports

```bash
# Vérifier si le port 8080 est utilisé (Backend)
netstat -ano | findstr :8080

# Vérifier si le port 3000 est utilisé (Frontend)
netstat -ano | findstr :3000

# Vérifier si le port 3306 est utilisé (MySQL)
netstat -ano | findstr :3306

# Tuer un processus sur un port (Windows)
# Trouver le PID avec netstat, puis :
taskkill /PID <PID> /F
```

### Vérifier les Services

```bash
# Vérifier si MySQL est démarré (Windows)
sc query MySQL80

# Démarrer MySQL (Windows)
net start MySQL80

# Arrêter MySQL (Windows)
net stop MySQL80
```

---

## 🔄 Commandes de Réinitialisation

### Réinitialiser le Frontend

```bash
cd frontend
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Réinitialiser le Backend

```bash
cd spring-backend
./mvnw clean
./mvnw clean install
./mvnw spring-boot:run
```

### Réinitialiser la Base de Données

```sql
-- ATTENTION : Cela supprime TOUTES les données !
DROP DATABASE khadamati_db;
CREATE DATABASE khadamati_db;

-- Redémarrer le backend pour recréer les tables
```

---

## 📊 Commandes de Monitoring

### Vérifier l'État du Backend

```bash
# Health check
curl http://localhost:8080/api/auth/debug/check/test@example.com

# Vérifier la version Java
java -version

# Vérifier Maven
./mvnw -version
```

### Vérifier l'État du Frontend

```bash
# Vérifier la version Node
node -v

# Vérifier la version NPM
npm -v

# Vérifier les dépendances
npm list
```

### Vérifier l'État de MySQL

```bash
# Se connecter à MySQL
mysql -u root -p2003

# Vérifier la version
SELECT VERSION();

# Vérifier les bases de données
SHOW DATABASES;

# Vérifier les connexions actives
SHOW PROCESSLIST;
```

---

## 🎯 Commandes Rapides

### Démarrage Complet

```bash
# Terminal 1 : MySQL (si pas déjà démarré)
net start MySQL80

# Terminal 2 : Backend
cd spring-backend && ./mvnw spring-boot:run

# Terminal 3 : Frontend
cd frontend && npm run dev

# Ouvrir dans le navigateur
start http://localhost:3000
```

### Arrêt Complet

```bash
# Arrêter le frontend (Ctrl + C dans le terminal)
# Arrêter le backend (Ctrl + C dans le terminal)
# Arrêter MySQL (optionnel)
net stop MySQL80
```

---

## 📝 Notes Importantes

### Ports Utilisés
- **3000** : Frontend Next.js
- **8080** : Backend Spring Boot
- **3306** : MySQL

### Mots de Passe
- **MySQL** : 2003
- **Admin** : smail1234
- **Email SMTP** : qlxiexgjbwibvnyd

### URLs Importantes
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080/api
- **Login** : http://localhost:3000/login
- **Dashboard** : http://localhost:3000/dashboard

---

**Dernière mise à jour** : 6 Mai 2026  
**Version** : 1.0.0
