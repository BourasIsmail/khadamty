# 🔓 Désactivation de l'OTP - Khadamati

## ✅ Modification effectuée

**Date** : 11 Mai 2026  
**Statut** : ✅ OTP désactivé

---

## 🎯 Changement

### Avant
- **Première connexion** : OTP envoyé par email
- **Connexions suivantes** : Connexion directe

### Après
- **Toutes les connexions** : Connexion directe sans OTP
- **Pas d'email** : Aucun code OTP envoyé

---

## 🔧 Fichier modifié

**Fichier** : `spring-backend/src/main/java/com/employeehub/controller/AuthController.java`

**Méthode** : `login()`

### Code modifié

```java
// ✅ CONNEXION DIRECTE SANS OTP - OTP désactivé
String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), String.valueOf(user.getId()));

return ResponseEntity.ok(new LoginResponse(
    token, String.valueOf(user.getId()), user.getEmail(),
    user.getFirstName(), user.getLastName(), user.getRole().name()
));
```

---

## 🚀 Comment tester

### 1. Redémarrer le backend

#### Option A : Sans Docker
```bash
cd spring-backend
./mvnw spring-boot:run
```

#### Option B : Avec Docker
```bash
docker-compose down
docker-compose up --build backend
```

### 2. Tester la connexion

1. Ouvrir http://localhost:3001 (ou http://localhost:3000 sans Docker)
2. Entrer email + mot de passe
3. Cliquer sur "Se connecter"
4. ✅ **Connexion directe** sans demande d'OTP

---

## 🔐 Comptes de test

### Admin
```
Email       : ismailelrhazoui954@gmail.com
Mot de passe: 888888
```

### RH
```
Email       : rh@khadamati.com
Mot de passe: 123456
```

### Employé
```
Email       : employee@khadamati.com
Mot de passe: 123456
```

---

## 📝 Notes importantes

1. **Sécurité** : L'OTP est désactivé, la connexion se fait uniquement avec email + mot de passe
2. **Email** : Aucun email ne sera envoyé lors de la connexion
3. **Champ email_verified** : Le champ existe toujours dans la base de données mais n'est plus utilisé
4. **Nouveaux comptes** : Les nouveaux comptes créés pourront se connecter directement

---

## 🔄 Pour réactiver l'OTP

Si vous voulez réactiver l'OTP plus tard, il suffit de restaurer le code original dans `AuthController.java` :

```java
// Si l'email est déjà vérifié, connexion directe sans OTP
if (user.isEmailVerified()) {
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), String.valueOf(user.getId()));
    
    return ResponseEntity.ok(new LoginResponse(
        token, String.valueOf(user.getId()), user.getEmail(),
        user.getFirstName(), user.getLastName(), user.getRole().name()
    ));
}

// Sinon, envoyer OTP pour la première connexion
otpService.generateAndSendOtp(user.getEmail(), user.getFirstName());

return ResponseEntity.ok(Map.of(
    "message",    "Code envoyé à " + maskEmail(user.getEmail()) + " (première connexion)",
    "email",      user.getEmail(),
    "requireOtp", true,
    "firstLogin", true
));
```

---

## ✅ Résultat

- ✅ **OTP désactivé**
- ✅ **Connexion directe** pour tous les utilisateurs
- ✅ **Pas d'email** envoyé
- ✅ **Plus simple** pour les utilisateurs

---

**Date de modification** : 11 Mai 2026  
**Auteur** : Assistant Kiro  
**Statut** : ✅ Terminé
