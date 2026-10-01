# 🧪 Tester l'OTP Première Connexion

**Guide rapide pour tester la nouvelle fonctionnalité**

---

## 🚀 Préparation

### 1. Redémarrer le Backend

**IMPORTANT** : Le backend doit être redémarré pour créer la nouvelle colonne `email_verified` !

```bash
# Arrêtez le backend (Ctrl+C)
# Puis redémarrez
cd spring-backend
mvn spring-boot:run
```

**Attendez de voir** :
```
Started EmployeeManagementApplication in X.XXX seconds
```

### 2. Vérifier la Colonne MySQL

Dans MySQL Workbench :

```sql
USE khadamati_db;

-- Vérifier que la colonne existe
DESCRIBE users;
```

**Vous devriez voir** :
```
email_verified | tinyint(1) | YES | | 0 |
```

---

## 🧪 Test Complet

### Scénario : Nouvel Employé "Alice Dupont"

#### Étape 1 : Créer le Compte

**Via l'API** :

```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@khadamati.com\",\"password\":\"Alice123!\",\"firstName\":\"Alice\",\"lastName\":\"Dupont\",\"phone\":\"0612345678\",\"department\":\"Marketing\",\"position\":\"Chef de projet\",\"hireDate\":\"2024-01-01\"}"
```

**Résultat attendu** :
```json
{
  "message": "Inscription réussie ! Bienvenue dans Khadamati.",
  "employeeId": "EMP1234"
}
```

#### Étape 2 : Vérifier le Statut Initial

```bash
curl http://localhost:8080/api/auth/debug/check/alice@khadamati.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "alice@khadamati.com",
  "role": "EMPLOYEE",
  "isActive": true,
  "emailVerified": false,  ← PAS ENCORE VÉRIFIÉ
  "firstName": "Alice",
  "lastName": "Dupont"
}
```

✅ **Bon signe** : `emailVerified: false`

---

#### Étape 3 : Première Connexion (Avec OTP)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@khadamati.com\",\"password\":\"Alice123!\"}"
```

**Résultat attendu** :
```json
{
  "message": "Code envoyé à a***e@khadamati.com (première connexion)",
  "email": "alice@khadamati.com",
  "requireOtp": true,
  "firstLogin": true  ← INDIQUE QUE C'EST LA PREMIÈRE FOIS
}
```

✅ **Bon signe** : `requireOtp: true` et `firstLogin: true`

**Dans les logs backend** :
```
🔐 Login attempt: alice@khadamati.com | Role: EMPLOYEE | PasswordMatch: true | EmailVerified: false
📧 OTP envoyé à alice@khadamati.com
```

---

#### Étape 4 : Récupérer le Code OTP

**Dans les logs du backend**, cherchez :
```
📧 Code OTP pour alice@khadamati.com : 123456
```

**Ou vérifiez l'email** si le SMTP est configuré.

---

#### Étape 5 : Vérifier l'OTP

```bash
curl -X POST http://localhost:8080/api/auth/verify-otp ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@khadamati.com\",\"code\":\"123456\"}"
```

**Résultat attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "5",
  "email": "alice@khadamati.com",
  "firstName": "Alice",
  "lastName": "Dupont",
  "role": "EMPLOYEE"
}
```

✅ **Connexion réussie !**

**Dans les logs backend** :
```
✅ Email vérifié pour: alice@khadamati.com - Plus besoin d'OTP pour les prochaines connexions
```

---

#### Étape 6 : Vérifier le Statut Après

```bash
curl http://localhost:8080/api/auth/debug/check/alice@khadamati.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "alice@khadamati.com",
  "role": "EMPLOYEE",
  "isActive": true,
  "emailVerified": true,  ← MAINTENANT VÉRIFIÉ !
  "firstName": "Alice",
  "lastName": "Dupont"
}
```

✅ **Parfait** : `emailVerified: true`

---

#### Étape 7 : Deuxième Connexion (SANS OTP)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@khadamati.com\",\"password\":\"Alice123!\"}"
```

**Résultat attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "5",
  "email": "alice@khadamati.com",
  "firstName": "Alice",
  "lastName": "Dupont",
  "role": "EMPLOYEE"
}
```

✅ **PAS DE `requireOtp` !** Connexion directe !

**Dans les logs backend** :
```
🔐 Login attempt: alice@khadamati.com | Role: EMPLOYEE | PasswordMatch: true | EmailVerified: true
✅ Connexion directe (email déjà vérifié)
```

---

#### Étape 8 : Troisième, Quatrième... Connexions

Toutes les connexions suivantes seront **directes, sans OTP** ! 🎉

---

## 🔄 Test de Réinitialisation

### Si Vous Voulez Tester à Nouveau l'OTP

```bash
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/alice@khadamati.com
```

**Résultat** :
```json
{
  "message": "Vérification email réinitialisée pour: alice@khadamati.com",
  "emailVerified": false
}
```

Maintenant, la prochaine connexion demandera à nouveau l'OTP !

---

## 🎯 Test avec Votre Compte

### Votre Compte : ismailelrhazoui21@gmail.com

#### Vérifier le Statut Actuel

```bash
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com
```

**Si `emailVerified: false`** :
- Votre prochaine connexion demandera l'OTP
- Après validation, plus besoin d'OTP

**Si `emailVerified: true`** :
- Vous avez déjà fait votre première connexion
- Plus besoin d'OTP !

#### Pour Tester l'OTP avec Votre Compte

```bash
# Réinitialiser
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/ismailelrhazoui21@gmail.com

# Puis se connecter
# → OTP sera demandé
```

---

## 📊 Vérification dans MySQL

### Voir Tous les Statuts

```sql
USE khadamati_db;

SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    email_verified,
    CASE 
        WHEN email_verified = 1 THEN '✅ Vérifié'
        ELSE '❌ Non vérifié'
    END AS statut
FROM users
ORDER BY created_at DESC;
```

**Résultat attendu** :

| id | email | first_name | last_name | role | email_verified | statut |
|----|-------|------------|-----------|------|----------------|--------|
| 5 | alice@... | Alice | Dupont | EMPLOYEE | 1 | ✅ Vérifié |
| 4 | employee@... | Employé | Test | EMPLOYEE | 0 | ❌ Non vérifié |
| 3 | rh@... | Responsable | RH | RH | 0 | ❌ Non vérifié |
| 2 | admin@... | Admin | Système | ADMIN | 0 | ❌ Non vérifié |
| 1 | ismail@... | Ismail | Elrhazoui | ADMIN | 0 | ❌ Non vérifié |

---

## ✅ Checklist de Test

### Création de Compte
- [ ] Compte créé avec succès
- [ ] `emailVerified = false` par défaut

### Première Connexion
- [ ] Login retourne `requireOtp: true`
- [ ] Login retourne `firstLogin: true`
- [ ] OTP envoyé par email (ou dans les logs)
- [ ] Code OTP reçu

### Vérification OTP
- [ ] Code OTP accepté
- [ ] Token JWT reçu
- [ ] Connexion réussie
- [ ] Log : "Email vérifié"
- [ ] `emailVerified = true` dans la DB

### Connexions Suivantes
- [ ] Login retourne directement le token
- [ ] Pas de `requireOtp`
- [ ] Pas d'OTP envoyé
- [ ] Connexion immédiate

### Réinitialisation
- [ ] Reset fonctionne
- [ ] `emailVerified = false` après reset
- [ ] Prochaine connexion demande OTP

---

## 🐛 Problèmes Possibles

### Erreur : "Column 'email_verified' not found"

**Cause** : Le backend n'a pas créé la colonne  
**Solution** : 
1. Arrêtez le backend
2. Redémarrez : `mvn spring-boot:run`
3. Hibernate créera la colonne automatiquement

### OTP Toujours Demandé

**Cause** : `emailVerified` n'est pas mis à jour  
**Solution** : Vérifiez les logs backend lors de la vérification OTP

### Connexion Directe Même à la Première Fois

**Cause** : `emailVerified` est déjà `true`  
**Solution** : Réinitialisez avec l'endpoint de debug

---

## 🎉 Résultat Attendu

Après tous les tests :

✅ **Première connexion** : OTP demandé  
✅ **Connexions suivantes** : Directes, sans OTP  
✅ **Base de données** : `email_verified = 1` après première connexion  
✅ **Logs** : Messages clairs dans le backend  

---

## 📝 Commandes Rapides

### Créer un Compte de Test
```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"Test123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"0612345678\",\"department\":\"IT\",\"position\":\"Dev\",\"hireDate\":\"2024-01-01\"}"
```

### Vérifier le Statut
```bash
curl http://localhost:8080/api/auth/debug/check/test@test.com
```

### Se Connecter
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"Test123!\"}"
```

### Vérifier OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"code\":\"123456\"}"
```

### Réinitialiser
```bash
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/test@test.com
```

---

**Testez maintenant et profitez de la connexion rapide !** 🚀✨
