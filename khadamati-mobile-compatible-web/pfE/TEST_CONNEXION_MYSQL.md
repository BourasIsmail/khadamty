# 🧪 Test de Connexion MySQL - Guide Rapide

## 🎯 Objectif
Vérifier que le backend Spring Boot peut se connecter à MySQL et créer les tables automatiquement.

## 📋 Prérequis

- [x] MySQL installé et en cours d'exécution
- [x] Base de données `khadamati_db` créée
- [x] Code backend compilé avec succès
- [ ] **Mot de passe MySQL configuré dans application.yml**

## 🔧 Étape 1 : Configurer le Mot de Passe

### Trouver Votre Mot de Passe MySQL

**Dans MySQL Workbench** :
1. Regardez la connexion que vous utilisez
2. Notez le mot de passe (ou testez la connexion pour confirmer)

**Mots de passe courants à essayer** :
- Mot de passe vide (rien)
- `root`
- `mysql`
- `admin`
- `password`
- Le mot de passe que vous avez défini lors de l'installation

### Mettre à Jour application.yml

**Fichier** : `spring-backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/khadamati_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: VOTRE_MOT_DE_PASSE_ICI  # ← Remplacer par le vrai mot de passe
```

## 🚀 Étape 2 : Démarrer le Backend

```bash
cd spring-backend
mvn spring-boot:run
```

## ✅ Étape 3 : Vérifier le Démarrage

### Logs à Surveiller

**✅ Connexion MySQL réussie** :
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

**✅ Tables créées** :
```
Hibernate: create table users (...)
Hibernate: create table employees (...)
Hibernate: create table attendance (...)
Hibernate: create table leave_requests (...)
Hibernate: create table document_requests (...)
```

**✅ Application démarrée** :
```
Started EmployeeManagementApplication in X.XXX seconds
```

### ❌ Erreurs Possibles

**Erreur 1** : `Access denied for user 'root'@'localhost' (using password: NO)`
- **Cause** : Mot de passe vide mais MySQL nécessite un mot de passe
- **Solution** : Ajouter le mot de passe dans `application.yml`

**Erreur 2** : `Access denied for user 'root'@'localhost' (using password: YES)`
- **Cause** : Mot de passe incorrect
- **Solution** : Vérifier le mot de passe dans MySQL Workbench

**Erreur 3** : `Connection refused`
- **Cause** : MySQL n'est pas démarré ou mauvais port
- **Solution** : Vérifier que MySQL est en cours d'exécution sur le port 3306

## 🔍 Étape 4 : Vérifier les Tables dans MySQL

### Dans MySQL Workbench

```sql
-- Sélectionner la base de données
USE khadamati_db;

-- Lister toutes les tables
SHOW TABLES;
```

**Résultat attendu** :
```
+-------------------------+
| Tables_in_khadamati_db  |
+-------------------------+
| attendance              |
| document_requests       |
| employees               |
| leave_requests          |
| users                   |
+-------------------------+
5 rows in set
```

### Vérifier la Structure des Tables

```sql
-- Structure de la table users
DESCRIBE users;

-- Structure de la table employees
DESCRIBE employees;

-- Structure de la table leave_requests
DESCRIBE leave_requests;

-- Structure de la table document_requests
DESCRIBE document_requests;

-- Structure de la table attendance
DESCRIBE attendance;
```

## 🧪 Étape 5 : Tester l'API

### Test 1 : Vérifier que l'API répond

```bash
curl http://localhost:8080/api/auth/debug/check/test@test.com
```

**Résultat attendu** :
```json
{
  "exists": false,
  "message": "Aucun compte trouvé pour: test@test.com"
}
```

### Test 2 : Créer un Compte Admin

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@khadamati.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "Système",
    "phone": "0612345678",
    "department": "Administration",
    "position": "Administrateur Système",
    "hireDate": "2024-01-01",
    "role": "ADMIN"
  }'
```

**Résultat attendu** :
```json
{
  "message": "Inscription réussie ! Bienvenue dans Khadamati.",
  "employeeId": "EMP1234"
}
```

### Test 3 : Vérifier le Compte dans MySQL

```sql
-- Voir tous les utilisateurs
SELECT id, email, first_name, last_name, role, is_active FROM users;

-- Voir tous les employés
SELECT id, employee_id, first_name, last_name, email, department, position FROM employees;
```

### Test 4 : Tester la Connexion (Étape 1 - Email/Password)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@khadamati.com",
    "password": "Admin123!"
  }'
```

**Résultat attendu** :
```json
{
  "message": "Code envoyé à a***n@khadamati.com",
  "email": "admin@khadamati.com",
  "requireOtp": true
}
```

## 📊 Résumé des Tests

| Test | Commande | Résultat Attendu |
|------|----------|------------------|
| Backend démarré | `mvn spring-boot:run` | "Started EmployeeManagementApplication" |
| Tables créées | `SHOW TABLES;` | 5 tables listées |
| API répond | `curl .../debug/check/...` | JSON avec "exists": false |
| Inscription | `curl .../register` | "Inscription réussie" |
| Données en DB | `SELECT * FROM users;` | 1 ligne avec l'admin |
| Login | `curl .../login` | "Code envoyé" |

## 🎯 Checklist de Validation

- [ ] Backend démarre sans erreur
- [ ] 5 tables créées dans MySQL
- [ ] API répond sur http://localhost:8080/api
- [ ] Inscription d'un compte réussie
- [ ] Compte visible dans la table `users`
- [ ] Employé visible dans la table `employees`
- [ ] Login retourne "Code envoyé"

## 🔄 Prochaines Étapes

Une fois tous les tests passés :

1. **Créer des comptes de test** pour chaque rôle :
   - Admin : `admin@test.com`
   - RH : `rh@test.com`
   - Employee : `employee@test.com`

2. **Démarrer le frontend** :
   ```bash
   cd frontend
   npm run dev
   ```

3. **Tester la connexion complète** :
   - Ouvrir http://localhost:3000
   - Se connecter avec un compte
   - Vérifier l'accès au dashboard

## 💡 Astuces

### Réinitialiser la Base de Données

Si vous voulez repartir de zéro :

```sql
-- Supprimer toutes les tables
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS document_requests;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;
```

Puis redémarrez le backend - Hibernate recréera les tables automatiquement.

### Voir les Logs SQL

Les logs SQL sont activés dans `application.yml` :
```yaml
spring:
  jpa:
    show-sql: true
```

Vous verrez toutes les requêtes SQL dans les logs du backend.

---

## 🆘 Problème ?

**Le backend ne démarre pas** → Vérifiez le mot de passe MySQL dans `application.yml`

**Les tables ne sont pas créées** → Vérifiez les logs pour voir les erreurs Hibernate

**L'API ne répond pas** → Vérifiez que le backend est bien démarré sur le port 8080

**Prêt à tester dès que le mot de passe MySQL est configuré !** 🚀
