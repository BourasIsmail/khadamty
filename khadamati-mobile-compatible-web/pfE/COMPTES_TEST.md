# 🔐 Comptes de Test - Khadamati

**Date de création** : 6 Mai 2026  
**Statut** : ✅ Actifs et prêts à l'emploi

---

## 📋 Liste des Comptes

### 1️⃣ Compte ADMINISTRATEUR

**Rôle** : ADMIN  
**Email** : `admin@khadamati.com`  
**Mot de passe** : `Admin123!`  
**ID Employé** : EMP6860  

**Accès** :
- ✅ Gestion complète du système
- ✅ Gestion des utilisateurs
- ✅ Statistiques globales
- ✅ Validation des demandes
- ✅ Configuration système

**Couleur du thème** : 🔴 Rouge

---

### 2️⃣ Compte RESSOURCES HUMAINES

**Rôle** : RH  
**Email** : `rh@khadamati.com`  
**Mot de passe** : `Rh123456!`  
**ID Employé** : EMP4867  

**Accès** :
- ✅ Gestion des employés
- ✅ Traitement des demandes de congés
- ✅ Traitement des demandes d'attestations
- ✅ Rapports RH
- ✅ Gestion des présences

**Couleur du thème** : 🔵 Bleu

---

### 3️⃣ Compte EMPLOYÉ

**Rôle** : EMPLOYEE  
**Email** : `employee@khadamati.com`  
**Mot de passe** : `Employee123!`  
**ID Employé** : EMP9364  

**Accès** :
- ✅ Voir son profil
- ✅ Consulter son solde de congés
- ✅ Demander des congés
- ✅ Demander des attestations
- ✅ Voir ses présences

**Couleur du thème** : 🟢 Vert

---

## 🌐 Comment Se Connecter

### Étape 1 : Ouvrir l'Application
**URL** : http://localhost:3000

### Étape 2 : Entrer les Identifiants
Choisissez un compte ci-dessus et entrez :
- Email
- Mot de passe

### Étape 3 : Vérifier l'OTP
Un code OTP sera envoyé par email. 

**Note** : Si l'email n'est pas configuré, vérifiez les logs du backend pour voir le code OTP.

### Étape 4 : Accéder au Dashboard
Après validation de l'OTP, vous accédez au dashboard correspondant à votre rôle.

---

## 📊 Tableau Récapitulatif

| Rôle | Email | Mot de passe | ID Employé | Couleur |
|------|-------|--------------|------------|---------|
| **ADMIN** | admin@khadamati.com | Admin123! | EMP6860 | 🔴 Rouge |
| **RH** | rh@khadamati.com | Rh123456! | EMP4867 | 🔵 Bleu |
| **EMPLOYEE** | employee@khadamati.com | Employee123! | EMP9364 | 🟢 Vert |

---

## 🔍 Vérification dans MySQL

Pour vérifier que les comptes existent :

```sql
USE khadamati_db;

-- Voir tous les utilisateurs
SELECT id, email, first_name, last_name, role, is_active FROM users;

-- Voir tous les employés
SELECT id, employee_id, first_name, last_name, email, department, position FROM employees;

-- Vérifier un compte spécifique
SELECT * FROM users WHERE email = 'admin@khadamati.com';
```

---

## 🧪 Test API

### Vérifier si un Compte Existe

```bash
# Admin
curl http://localhost:8080/api/auth/debug/check/admin@khadamati.com

# RH
curl http://localhost:8080/api/auth/debug/check/rh@khadamati.com

# Employee
curl http://localhost:8080/api/auth/debug/check/employee@khadamati.com
```

### Tester la Connexion

```bash
# Admin
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@khadamati.com\",\"password\":\"Admin123!\"}"

# RH
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"rh@khadamati.com\",\"password\":\"Rh123456!\"}"

# Employee
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"employee@khadamati.com\",\"password\":\"Employee123!\"}"
```

---

## 🔐 Sécurité

### Mots de Passe
Les mots de passe sont hashés avec BCrypt dans la base de données.

### Tokens JWT
Après connexion, un token JWT est généré avec :
- Email de l'utilisateur
- Rôle
- ID utilisateur
- Expiration : 24 heures

### OTP
Un code OTP à 6 chiffres est envoyé par email et expire après 5 minutes.

---

## 📝 Créer de Nouveaux Comptes

### Via l'API

```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"nouveau@khadamati.com\",\"password\":\"Password123!\",\"firstName\":\"Prénom\",\"lastName\":\"Nom\",\"phone\":\"0612345678\",\"department\":\"Département\",\"position\":\"Poste\",\"hireDate\":\"2024-01-01\",\"role\":\"EMPLOYEE\"}"
```

### Via le Script PowerShell

Modifiez `creer_comptes_test.ps1` et ajoutez de nouveaux comptes.

---

## 🎯 Cas d'Usage par Rôle

### ADMIN (admin@khadamati.com)
**Scénarios de test** :
1. Voir tous les utilisateurs du système
2. Créer un nouvel utilisateur
3. Désactiver/activer un compte
4. Voir les statistiques globales
5. Gérer les permissions

### RH (rh@khadamati.com)
**Scénarios de test** :
1. Voir la liste des employés
2. Approuver une demande de congé
3. Rejeter une demande d'attestation
4. Générer un rapport de présences
5. Ajouter un nouvel employé

### EMPLOYEE (employee@khadamati.com)
**Scénarios de test** :
1. Voir son profil
2. Consulter son solde de congés
3. Demander un congé annuel
4. Demander une attestation de travail
5. Voir l'historique de ses présences

---

## 🔄 Réinitialiser un Mot de Passe

### Via MySQL

```sql
-- Réinitialiser le mot de passe de l'admin
-- Le mot de passe sera "NewPassword123!" (hashé avec BCrypt)
UPDATE users 
SET password = '$2a$10$...' -- Hash BCrypt de "NewPassword123!"
WHERE email = 'admin@khadamati.com';
```

**Note** : Utilisez l'endpoint `/auth/change-password` pour changer le mot de passe de manière sécurisée.

---

## 📊 Statistiques des Comptes

| Métrique | Valeur |
|----------|--------|
| Nombre total de comptes | 3 |
| Comptes ADMIN | 1 |
| Comptes RH | 1 |
| Comptes EMPLOYEE | 1 |
| Comptes actifs | 3 |
| Comptes désactivés | 0 |

---

## 🆘 Problèmes Courants

### "Email ou mot de passe incorrect"
- Vérifiez l'orthographe de l'email
- Vérifiez que le mot de passe respecte la casse
- Vérifiez que le compte existe dans MySQL

### "Compte désactivé"
- Vérifiez le champ `is_active` dans MySQL
- Réactivez le compte si nécessaire

### "Code OTP incorrect ou expiré"
- Vérifiez les logs du backend pour voir le code
- Le code expire après 5 minutes
- Demandez un nouveau code avec "Renvoyer le code"

---

## 📚 Documentation Associée

- **PROJET_TERMINE.md** - Guide complet du projet
- **SUCCES_FINALISATION.md** - Détails de la finalisation
- **README_FINALISATION.md** - Guide de finalisation
- **creer_comptes_test.ps1** - Script de création de comptes

---

## ✅ Checklist de Test

### Pour Chaque Compte
- [ ] Connexion réussie (email + mot de passe)
- [ ] OTP reçu et validé
- [ ] Accès au dashboard
- [ ] Fonctionnalités du rôle accessibles
- [ ] Déconnexion réussie

### Tests Spécifiques
- [ ] Admin peut voir tous les utilisateurs
- [ ] RH peut approuver une demande
- [ ] Employee peut demander un congé

---

## 🎉 Comptes Prêts !

**Les 3 comptes de test sont créés et opérationnels !**

**Connectez-vous maintenant** : http://localhost:3000

**Bon test !** 🚀

---

**Dernière mise à jour** : 6 Mai 2026
