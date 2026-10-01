# 🚀 Commandes de Démarrage Rapide

## 📋 Prérequis

- ✅ Node.js installé
- ✅ Java 17+ installé
- ✅ Maven installé
- ⚠️ MySQL installé et démarré

---

## 🗄️ Configuration MySQL

### Installation MySQL (Windows)

#### Option 1 : Téléchargement Direct
```bash
# Télécharger depuis : https://dev.mysql.com/downloads/mysql/
# Installer MySQL Server + MySQL Workbench
```

#### Option 2 : Chocolatey
```bash
choco install mysql
```

### Démarrer MySQL
```bash
# Démarrer le service MySQL
net start MySQL80

# Vérifier que MySQL fonctionne
mysql --version
```

### Créer la Base de Données
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE khadamati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Vérifier
SHOW DATABASES;

# Quitter
exit;
```

### Configuration du Mot de Passe

Modifier le fichier `spring-backend/src/main/resources/application.yml` :
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/khadamati_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: VOTRE_MOT_DE_PASSE_ICI  # ⚠️ Modifier ici
```

---

## 🔧 Backend Spring Boot

### Première Installation
```bash
cd spring-backend

# Nettoyer et compiler
./mvnw clean install

# Ou sur Windows avec Maven installé
mvn clean install
```

### Démarrer le Backend
```bash
cd spring-backend

# Démarrer l'application
./mvnw spring-boot:run

# Ou
mvn spring-boot:run
```

Le backend sera disponible sur : **http://localhost:8080/api**

### Vérifier le Backend
```bash
# Tester l'API
curl http://localhost:8080/api/auth/debug/check/admin@demo.com
```

---

## 🎨 Frontend Next.js

### Première Installation
```bash
cd frontend

# Installer les dépendances
npm install
```

### Démarrer le Frontend
```bash
cd frontend

# Mode développement
npm run dev
```

Le frontend sera disponible sur : **http://localhost:3000**

### Build Production
```bash
cd frontend

# Créer le build
npm run build

# Démarrer en production
npm start
```

---

## 📱 Mobile Flutter (Optionnel)

### Installation
```bash
cd mobile

# Installer les dépendances
flutter pub get
```

### Démarrer l'Application
```bash
cd mobile

# Lister les devices disponibles
flutter devices

# Lancer sur Chrome
flutter run -d chrome

# Lancer sur un émulateur Android
flutter run -d android

# Lancer sur un émulateur iOS (Mac uniquement)
flutter run -d ios
```

---

## 🧪 Créer des Comptes de Test

### Via l'API (Postman ou curl)

#### 1. Créer un compte Admin
```bash
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
```

#### 2. Créer un compte RH
```bash
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
```

#### 3. Créer un compte Employé
```bash
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

## 🔍 Vérification

### 1. Vérifier MySQL
```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la base de données
USE khadamati_db;

# Lister les tables
SHOW TABLES;

# Vérifier les utilisateurs
SELECT * FROM users;

# Quitter
exit;
```

### 2. Vérifier le Backend
```bash
# Tester l'endpoint de santé
curl http://localhost:8080/api/auth/debug/check/admin@demo.com

# Devrait retourner :
# {
#   "exists": true,
#   "email": "admin@demo.com",
#   "role": "ADMIN",
#   "isActive": true,
#   "firstName": "Admin",
#   "lastName": "System"
# }
```

### 3. Vérifier le Frontend
Ouvrir dans le navigateur : **http://localhost:3000**

Vous devriez voir la page de connexion avec un seul formulaire.

---

## 🐛 Dépannage

### Problème : MySQL ne démarre pas
```bash
# Vérifier le statut du service
sc query MySQL80

# Redémarrer le service
net stop MySQL80
net start MySQL80
```

### Problème : Port 8080 déjà utilisé
```bash
# Trouver le processus utilisant le port 8080
netstat -ano | findstr :8080

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Problème : Port 3000 déjà utilisé
```bash
# Trouver le processus utilisant le port 3000
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID <PID> /F

# Ou démarrer sur un autre port
cd frontend
npm run dev -- -p 3001
```

### Problème : Erreur de connexion MySQL
```bash
# Vérifier que MySQL est démarré
net start MySQL80

# Vérifier le mot de passe dans application.yml
# Vérifier que la base de données existe
mysql -u root -p -e "SHOW DATABASES;"
```

### Problème : Tables non créées
```bash
# Vérifier les logs du backend
# Les tables sont créées automatiquement au premier démarrage
# Si elles n'existent pas, vérifier :
# 1. La connexion MySQL
# 2. Les logs d'erreur dans la console
# 3. Le paramètre ddl-auto: update dans application.yml
```

---

## 📊 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur |
| Backend API | http://localhost:8080/api | API REST |
| Swagger UI | http://localhost:8080/api/swagger-ui/index.html | Documentation API |
| MySQL | localhost:3306 | Base de données |

---

## 🔐 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@demo.com | password123 |
| RH | rh@demo.com | password123 |
| Employé | employee@demo.com | password123 |

---

## 📝 Commandes Utiles

### Backend
```bash
# Nettoyer le projet
./mvnw clean

# Compiler sans tests
./mvnw clean install -DskipTests

# Lancer les tests
./mvnw test

# Créer un JAR
./mvnw package
```

### Frontend
```bash
# Installer les dépendances
npm install

# Démarrer en dev
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linter
npm run lint
```

### MySQL
```bash
# Se connecter
mysql -u root -p

# Exporter la base
mysqldump -u root -p khadamati_db > backup.sql

# Importer la base
mysql -u root -p khadamati_db < backup.sql

# Réinitialiser la base
mysql -u root -p -e "DROP DATABASE khadamati_db; CREATE DATABASE khadamati_db;"
```

---

## 🎯 Workflow de Développement

### 1. Démarrage Quotidien
```bash
# Terminal 1 : MySQL (si pas démarré automatiquement)
net start MySQL80

# Terminal 2 : Backend
cd spring-backend
./mvnw spring-boot:run

# Terminal 3 : Frontend
cd frontend
npm run dev
```

### 2. Après Modifications du Code

#### Backend
```bash
# Le backend redémarre automatiquement avec spring-boot-devtools
# Sinon, arrêter (Ctrl+C) et relancer :
./mvnw spring-boot:run
```

#### Frontend
```bash
# Next.js recharge automatiquement
# Sinon, arrêter (Ctrl+C) et relancer :
npm run dev
```

### 3. Avant de Commiter
```bash
# Backend : Vérifier la compilation
cd spring-backend
./mvnw clean install

# Frontend : Vérifier le build
cd frontend
npm run build
```

---

*Guide créé le 6 mai 2026*
