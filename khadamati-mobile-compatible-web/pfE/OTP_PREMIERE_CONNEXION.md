# 🔐 OTP Uniquement à la Première Connexion

**Nouvelle fonctionnalité de sécurité**

---

## 🎯 Concept

**Avant** : OTP demandé à **chaque connexion** ❌  
**Maintenant** : OTP demandé **uniquement à la première connexion** ✅

### Pourquoi ?

1. **Sécurité** : Vérifier l'email lors de la création du compte
2. **Expérience utilisateur** : Pas besoin d'OTP à chaque fois
3. **Pratique** : Connexion rapide après la première fois

---

## 🔄 Comment ça Marche

### 1️⃣ Création du Compte

```
Employé créé → emailVerified = false
```

L'employé reçoit ses identifiants (email + mot de passe).

### 2️⃣ Première Connexion

```
1. Employé entre email + mot de passe
2. Backend vérifie : emailVerified = false ?
3. OUI → Envoyer OTP par email
4. Employé entre le code OTP
5. Backend vérifie le code
6. ✅ Code correct → emailVerified = true
7. Connexion réussie !
```

### 3️⃣ Connexions Suivantes

```
1. Employé entre email + mot de passe
2. Backend vérifie : emailVerified = true ?
3. OUI → Connexion directe, pas d'OTP !
4. ✅ Connexion réussie immédiatement !
```

---

## 📊 Schéma de Flux

### Première Connexion
```
┌─────────────┐
│   Employé   │
└──────┬──────┘
       │ Email + Password
       ▼
┌─────────────────┐
│    Backend      │
│ emailVerified?  │
└──────┬──────────┘
       │ false
       ▼
┌─────────────────┐
│  Envoyer OTP    │
│   par email     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Employé       │
│  Entre le code  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    Backend      │
│  Vérifie OTP    │
│ emailVerified   │
│    = true       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Connexion     │
│    Réussie!     │
└─────────────────┘
```

### Connexions Suivantes
```
┌─────────────┐
│   Employé   │
└──────┬──────┘
       │ Email + Password
       ▼
┌─────────────────┐
│    Backend      │
│ emailVerified?  │
└──────┬──────────┘
       │ true
       ▼
┌─────────────────┐
│   Connexion     │
│    Directe!     │
│   (Pas d'OTP)   │
└─────────────────┘
```

---

## 🔧 Modifications Techniques

### 1. Modèle User

**Nouveau champ ajouté** :

```java
@Column(name = "email_verified")
private boolean emailVerified;
```

**Valeur par défaut** :
```java
this.emailVerified = false; // Non vérifié à la création
```

### 2. AuthController - Login

**Logique modifiée** :

```java
// Si email déjà vérifié → Connexion directe
if (user.isEmailVerified()) {
    String token = jwtUtil.generateToken(...);
    return ResponseEntity.ok(new LoginResponse(...));
}

// Sinon → Envoyer OTP
otpService.generateAndSendOtp(user.getEmail(), user.getFirstName());
return ResponseEntity.ok(Map.of(
    "requireOtp", true,
    "firstLogin", true
));
```

### 3. AuthController - Verify OTP

**Marquer comme vérifié** :

```java
if (!user.isEmailVerified()) {
    user.setEmailVerified(true);
    userRepository.save(user);
    System.out.println("✅ Email vérifié - Plus besoin d'OTP");
}
```

---

## 🧪 Tests

### Test 1 : Première Connexion d'un Nouvel Employé

#### Étape 1 : Créer un Compte
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@khadamati.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "0612345678",
    "department": "IT",
    "position": "Développeur",
    "hireDate": "2024-01-01"
  }'
```

**Résultat** : Compte créé avec `emailVerified = false`

#### Étape 2 : Vérifier le Statut
```bash
curl http://localhost:8080/api/auth/debug/check/test@khadamati.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "test@khadamati.com",
  "emailVerified": false,  ← Pas encore vérifié
  "role": "EMPLOYEE"
}
```

#### Étape 3 : Première Connexion
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@khadamati.com",
    "password": "Test123!"
  }'
```

**Résultat attendu** :
```json
{
  "message": "Code envoyé à t***t@khadamati.com (première connexion)",
  "email": "test@khadamati.com",
  "requireOtp": true,
  "firstLogin": true  ← Indique que c'est la première fois
}
```

#### Étape 4 : Vérifier l'OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@khadamati.com",
    "code": "123456"
  }'
```

**Résultat attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "5",
  "email": "test@khadamati.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "EMPLOYEE"
}
```

**Dans les logs backend** :
```
✅ Email vérifié pour: test@khadamati.com - Plus besoin d'OTP pour les prochaines connexions
```

#### Étape 5 : Vérifier le Statut Après
```bash
curl http://localhost:8080/api/auth/debug/check/test@khadamati.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "test@khadamati.com",
  "emailVerified": true,  ← Maintenant vérifié !
  "role": "EMPLOYEE"
}
```

---

### Test 2 : Deuxième Connexion (Sans OTP)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@khadamati.com",
    "password": "Test123!"
  }'
```

**Résultat attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "5",
  "email": "test@khadamati.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "EMPLOYEE"
}
```

**Pas de `requireOtp` !** Connexion directe ! ✅

---

### Test 3 : Réinitialiser la Vérification (Pour Tests)

Si vous voulez tester à nouveau l'OTP :

```bash
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/test@khadamati.com
```

**Résultat** :
```json
{
  "message": "Vérification email réinitialisée pour: test@khadamati.com",
  "emailVerified": false
}
```

Maintenant, la prochaine connexion demandera à nouveau l'OTP.

---

## 📊 Base de Données

### Table `users`

**Nouvelle colonne** :

```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

**Vérifier les données** :

```sql
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    email_verified,
    created_at
FROM users;
```

**Résultat attendu** :

| id | email | first_name | last_name | role | email_verified | created_at |
|----|-------|------------|-----------|------|----------------|------------|
| 1 | ismail... | Ismail | Elrhazoui | ADMIN | false | 2026-05-06 |
| 2 | admin... | Admin | Système | ADMIN | false | 2026-05-06 |
| 3 | rh... | Responsable | RH | RH | false | 2026-05-06 |
| 4 | employee... | Employé | Test | EMPLOYEE | false | 2026-05-06 |

**Après première connexion** :

| id | email | email_verified |
|----|-------|----------------|
| 1 | ismail... | **true** ✅ |

---

## 🎯 Cas d'Usage

### Cas 1 : Nouvel Employé

1. **RH crée le compte** de l'employé
2. **Employé reçoit** email + mot de passe
3. **Première connexion** :
   - Entre email + mot de passe
   - Reçoit OTP par email
   - Entre le code OTP
   - ✅ Connexion réussie
4. **Connexions suivantes** :
   - Entre email + mot de passe
   - ✅ Connexion directe, pas d'OTP !

### Cas 2 : Employé Existant

Si l'employé a déjà fait sa première connexion :
- Entre email + mot de passe
- ✅ Connexion directe immédiatement

### Cas 3 : Sécurité Compromise

Si vous suspectez que le compte est compromis :

```bash
# Réinitialiser la vérification
curl -X POST http://localhost:8080/api/auth/debug/reset-verification/email@example.com
```

La prochaine connexion demandera à nouveau l'OTP.

---

## 🔐 Sécurité

### Avantages

✅ **Vérification de l'email** : S'assure que l'employé a accès à son email  
✅ **Première connexion sécurisée** : Validation lors de la première utilisation  
✅ **Expérience utilisateur** : Pas d'OTP à chaque connexion  
✅ **Flexibilité** : Possibilité de réinitialiser si nécessaire  

### Considérations

⚠️ **Sécurité vs Commodité** : Balance entre sécurité et facilité d'utilisation  
⚠️ **Accès email** : L'employé doit avoir accès à son email  
⚠️ **Réinitialisation** : Possibilité de forcer une nouvelle vérification si besoin  

---

## 📝 Logs Backend

### Première Connexion
```
🔐 Login attempt: test@khadamati.com | Role: EMPLOYEE | PasswordMatch: true | EmailVerified: false
📧 OTP envoyé à test@khadamati.com
```

### Vérification OTP
```
✅ Email vérifié pour: test@khadamati.com - Plus besoin d'OTP pour les prochaines connexions
```

### Connexions Suivantes
```
🔐 Login attempt: test@khadamati.com | Role: EMPLOYEE | PasswordMatch: true | EmailVerified: true
✅ Connexion directe (email déjà vérifié)
```

---

## 🎯 Résumé

### Avant
```
Connexion 1 : Email + Password → OTP → Connexion
Connexion 2 : Email + Password → OTP → Connexion
Connexion 3 : Email + Password → OTP → Connexion
...
```

### Maintenant
```
Connexion 1 : Email + Password → OTP → Connexion ✅ emailVerified = true
Connexion 2 : Email + Password → Connexion directe ✅
Connexion 3 : Email + Password → Connexion directe ✅
...
```

---

## ✅ Checklist

- [x] Champ `emailVerified` ajouté au modèle User
- [x] Logique de vérification dans le login
- [x] Marquage automatique après OTP
- [x] Connexion directe si déjà vérifié
- [x] Endpoint de debug pour vérifier le statut
- [x] Endpoint pour réinitialiser (tests)
- [x] Documentation complète

---

## 🚀 Prochaines Étapes

1. **Redémarrer le backend** pour appliquer les changements
2. **Tester avec un nouveau compte**
3. **Vérifier que l'OTP n'est demandé qu'une fois**
4. **Profiter de la connexion rapide !**

---

**OTP uniquement à la première connexion - Sécurité + Commodité !** 🔐✨
