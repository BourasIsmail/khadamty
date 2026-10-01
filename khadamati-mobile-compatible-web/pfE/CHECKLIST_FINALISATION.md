# ✅ Checklist de Finalisation - Migration MySQL & Simplification Connexion

## 📋 Vue d'Ensemble

Cette checklist vous guide pour finaliser les modifications effectuées lors de la session du 6 mai 2026.

---

## 🗄️ Étape 1 : Configuration MySQL

### Installation MySQL
- [ ] MySQL est installé sur votre machine
- [ ] MySQL Workbench est installé (optionnel mais recommandé)
- [ ] Le service MySQL est démarré (`net start MySQL80`)
- [ ] Vous pouvez vous connecter : `mysql -u root -p`

### Création de la Base de Données
- [ ] Base de données `khadamati_db` créée
  ```sql
  CREATE DATABASE khadamati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- [ ] Vérification : `SHOW DATABASES;` affiche `khadamati_db`

### Configuration Backend
- [ ] Fichier `spring-backend/src/main/resources/application.yml` mis à jour
- [ ] Mot de passe MySQL configuré dans `spring.datasource.password`
- [ ] URL de connexion correcte : `jdbc:mysql://localhost:3306/khadamati_db`

---

## 🔧 Étape 2 : Modifications Backend Restantes

### Contrôleurs - Changement de Type d'ID

#### AdminController.java
- [ ] `@GetMapping("/users/{id}")` : `String id` → `Long id`
- [ ] `@PutMapping("/users/{id}")` : `String id` → `Long id`
- [ ] `@DeleteMapping("/users/{id}")` : `String id` → `Long id`
- [ ] `@PatchMapping("/users/{id}/toggle-status")` : `String id` → `Long id`

#### EmployeeController.java
- [ ] `@GetMapping("/{id}")` : `String id` → `Long id`
- [ ] `@PutMapping("/{id}")` : `String id` → `Long id`
- [ ] `@DeleteMapping("/{id}")` : `String id` → `Long id`

#### AttendanceController.java
- [ ] `@PutMapping("/{id}")` : `String id` → `Long id`

#### RhController.java
- [ ] `@GetMapping("/leave-requests/{id}")` : `String id` → `Long id`
- [ ] `@PutMapping("/leave-requests/{id}/approve")` : `String id` → `Long id`
- [ ] `@PutMapping("/leave-requests/{id}/reject")` : `String id` → `Long id`
- [ ] `@GetMapping("/document-requests/{id}")` : `String id` → `Long id`
- [ ] `@PutMapping("/document-requests/{id}/process")` : `String id` → `Long id`
- [ ] `@PutMapping("/document-requests/{id}/reject")` : `String id` → `Long id`

### DTOs
- [ ] Vérifier `LoginResponse.java` : type d'ID si nécessaire
- [ ] Vérifier autres DTOs utilisant des IDs

### Compilation
- [ ] `cd spring-backend`
- [ ] `./mvnw clean install` réussit sans erreur
- [ ] Aucune erreur de compilation

---

## 🎨 Étape 3 : Vérification Frontend

### Tests Visuels
- [ ] Page de connexion affiche un seul formulaire
- [ ] Pas de sélection de rôle visible
- [ ] Message "Votre rôle est détecté automatiquement" présent
- [ ] Formulaire contient : Email, Mot de passe, Bouton "Se connecter"

### Tests Fonctionnels
- [ ] `cd frontend`
- [ ] `npm install` réussit
- [ ] `npm run dev` démarre sans erreur
- [ ] Application accessible sur http://localhost:3000

---

## 🚀 Étape 4 : Démarrage de l'Application

### Backend
- [ ] `cd spring-backend`
- [ ] `./mvnw spring-boot:run` démarre sans erreur
- [ ] Logs affichent : "Started EmployeeManagementApplication"
- [ ] Logs affichent la création des tables MySQL
- [ ] API accessible sur http://localhost:8080/api

### Frontend
- [ ] `cd frontend`
- [ ] `npm run dev` démarre sans erreur
- [ ] Application accessible sur http://localhost:3000
- [ ] Page de connexion s'affiche correctement

---

## 🧪 Étape 5 : Création des Comptes de Test

### Via MySQL Workbench ou ligne de commande

#### Compte Admin
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
- [ ] Compte Admin créé avec succès

#### Compte RH
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
- [ ] Compte RH créé avec succès

#### Compte Employé
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
- [ ] Compte Employé créé avec succès

### Vérification dans MySQL
```sql
USE khadamati_db;
SELECT * FROM users;
SELECT * FROM employees;
```
- [ ] 3 utilisateurs présents dans la table `users`
- [ ] 3 employés présents dans la table `employees`

---

## 🔍 Étape 6 : Tests de Connexion

### Test Compte Admin
- [ ] Ouvrir http://localhost:3000
- [ ] Saisir : `admin@demo.com` / `password123`
- [ ] Cliquer sur "Se connecter"
- [ ] Code OTP reçu (vérifier les logs backend si email non configuré)
- [ ] Saisir le code OTP
- [ ] Redirection vers `/dashboard`
- [ ] Menu Admin visible (Gestion utilisateurs, etc.)

### Test Compte RH
- [ ] Se déconnecter
- [ ] Saisir : `rh@demo.com` / `password123`
- [ ] Code OTP reçu
- [ ] Connexion réussie
- [ ] Menu RH visible (Employés, Présences, etc.)

### Test Compte Employé
- [ ] Se déconnecter
- [ ] Saisir : `employee@demo.com` / `password123`
- [ ] Code OTP reçu
- [ ] Connexion réussie
- [ ] Menu Employé visible (Profil, Congés, etc.)

---

## 🧪 Étape 7 : Tests Fonctionnels

### Tests CRUD Employés (Admin/RH)
- [ ] Connexion en tant qu'Admin
- [ ] Accéder à "Employés"
- [ ] Liste des employés s'affiche
- [ ] Créer un nouvel employé
- [ ] Modifier un employé existant
- [ ] Supprimer un employé (optionnel)

### Tests Présences
- [ ] Accéder à "Présences"
- [ ] Liste des présences s'affiche
- [ ] Créer une nouvelle présence
- [ ] Modifier une présence

### Tests Profil (Employé)
- [ ] Connexion en tant qu'Employé
- [ ] Accéder à "Profil"
- [ ] Informations personnelles affichées
- [ ] Modifier le profil
- [ ] Changer le mot de passe

---

## 🔒 Étape 8 : Tests de Sécurité

### Autorisation par Rôle
- [ ] Employé ne peut pas accéder à `/dashboard/admin`
- [ ] Employé ne peut pas accéder à `/dashboard/employees/new`
- [ ] RH ne peut pas accéder à `/dashboard/admin`
- [ ] Admin peut accéder à toutes les pages

### Tests d'Erreur
- [ ] Email incorrect → Message d'erreur
- [ ] Mot de passe incorrect → Message d'erreur
- [ ] OTP incorrect → Message d'erreur
- [ ] OTP expiré → Message d'erreur

---

## 📊 Étape 9 : Vérification Base de Données

### Tables Créées
```sql
USE khadamati_db;
SHOW TABLES;
```
- [ ] Table `users` existe
- [ ] Table `employees` existe
- [ ] Table `attendances` existe
- [ ] Table `leave_requests` existe
- [ ] Table `document_requests` existe

### Structure des Tables
```sql
DESCRIBE users;
DESCRIBE employees;
```
- [ ] Colonnes correctes dans `users`
- [ ] Type `id` est `BIGINT`
- [ ] Contraintes `UNIQUE` sur `email`
- [ ] Enum `role` avec valeurs ADMIN, RH, EMPLOYEE

### Données de Test
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM employees;
```
- [ ] Au moins 3 utilisateurs
- [ ] Au moins 3 employés

---

## 📝 Étape 10 : Documentation

### Fichiers de Documentation
- [ ] `MIGRATION_MYSQL_GUIDE.md` lu et compris
- [ ] `MODIFICATIONS_CONNEXION.md` lu et compris
- [ ] `RESUME_MODIFICATIONS_SESSION.md` lu et compris
- [ ] `AVANT_APRES_COMPARAISON.md` lu et compris
- [ ] `COMMANDES_DEMARRAGE.md` lu et compris

### README Principal
- [ ] `README.md` mis à jour avec les nouvelles informations
- [ ] Comptes de test documentés
- [ ] Instructions MySQL ajoutées

---

## 🎯 Étape 11 : Finalisation

### Code
- [ ] Tous les fichiers compilent sans erreur
- [ ] Aucun warning critique
- [ ] Code formaté correctement

### Git (Optionnel)
- [ ] Modifications commitées
  ```bash
  git add .
  git commit -m "feat: simplification connexion + migration MySQL"
  ```
- [ ] Branch créée si nécessaire
  ```bash
  git checkout -b feature/mysql-migration
  ```

### Backup
- [ ] Backup de la base de données MySQL
  ```bash
  mysqldump -u root -p khadamati_db > backup_$(date +%Y%m%d).sql
  ```
- [ ] Backup du code (si pas de Git)

---

## ✅ Validation Finale

### Checklist Globale
- [ ] ✅ MySQL installé et configuré
- [ ] ✅ Backend compile et démarre
- [ ] ✅ Frontend compile et démarre
- [ ] ✅ Comptes de test créés
- [ ] ✅ Connexion fonctionne pour tous les rôles
- [ ] ✅ CRUD employés fonctionne
- [ ] ✅ Autorisations par rôle fonctionnent
- [ ] ✅ Base de données MySQL opérationnelle
- [ ] ✅ Documentation à jour

### Tests de Non-Régression
- [ ] Toutes les fonctionnalités existantes fonctionnent
- [ ] Aucune régression détectée
- [ ] Performance acceptable

---

## 🐛 Dépannage

### Problèmes Courants

#### MySQL ne démarre pas
```bash
# Vérifier le service
sc query MySQL80

# Redémarrer
net stop MySQL80
net start MySQL80
```

#### Erreur de connexion MySQL
- [ ] Vérifier le mot de passe dans `application.yml`
- [ ] Vérifier que MySQL est démarré
- [ ] Vérifier le port 3306

#### Tables non créées
- [ ] Vérifier `ddl-auto: update` dans `application.yml`
- [ ] Vérifier les logs du backend
- [ ] Vérifier la connexion MySQL

#### Erreur de compilation Backend
- [ ] `./mvnw clean install`
- [ ] Vérifier les imports
- [ ] Vérifier les types d'ID (Long vs String)

#### Erreur Frontend
- [ ] `npm install`
- [ ] Supprimer `node_modules` et `.next`
- [ ] Réinstaller : `npm install`

---

## 📞 Support

### Ressources
- Documentation MySQL : https://dev.mysql.com/doc/
- Documentation Spring Data JPA : https://spring.io/projects/spring-data-jpa
- Documentation Next.js : https://nextjs.org/docs

### Fichiers de Référence
- `MIGRATION_MYSQL_GUIDE.md` - Guide de migration
- `COMMANDES_DEMARRAGE.md` - Commandes utiles
- `AVANT_APRES_COMPARAISON.md` - Comparaison des changements

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre migration est terminée avec succès ! 🚀

Votre application utilise maintenant :
- ✅ Un formulaire de connexion unique et simplifié
- ✅ Une détection automatique du rôle
- ✅ MySQL comme base de données
- ✅ JPA pour la persistance
- ✅ Une architecture plus robuste

**Prochaines étapes suggérées :**
1. Ajouter plus de données de test
2. Implémenter les fonctionnalités manquantes (congés, attestations)
3. Améliorer l'interface utilisateur
4. Ajouter des tests unitaires et d'intégration
5. Déployer en production

---

*Checklist créée le 6 mai 2026*
*Bonne chance ! 🍀*
