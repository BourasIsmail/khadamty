# 🔐 Mon Compte Administrateur - Khadamati

**Date de création** : 6 Mai 2026  
**Statut** : ✅ Actif

---

## 👤 Informations du Compte

**Rôle** : ADMIN (Administrateur)  
**Email** : ismailelrhazoui21@gmail.com  
**Mot de passe** : smail1234  
**Prénom** : Ismail  
**Nom** : Elrhazoui  

---

## 🌐 Connexion

### URL de l'Application
http://localhost:3000

### Identifiants
- **Email** : `ismailelrhazoui21@gmail.com`
- **Mot de passe** : `smail1234`

---

## 🔑 Accès Administrateur

En tant qu'ADMIN, vous avez accès à :

### ✅ Gestion Complète du Système
- Voir tous les utilisateurs
- Créer/modifier/supprimer des utilisateurs
- Activer/désactiver des comptes
- Gérer les permissions

### ✅ Gestion des Employés
- Voir tous les employés
- Ajouter de nouveaux employés
- Modifier les informations des employés
- Supprimer des employés

### ✅ Validation des Demandes
- Approuver/rejeter les demandes de congés
- Traiter les demandes d'attestations
- Voir l'historique des demandes

### ✅ Statistiques et Rapports
- Voir les statistiques globales
- Générer des rapports
- Analyser les données

### ✅ Configuration Système
- Paramètres de l'application
- Configuration des emails
- Gestion des rôles et permissions

---

## 📊 Autres Comptes de Test

Si vous voulez tester avec d'autres rôles :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **RH** | rh@khadamati.com | Rh123456! |
| **EMPLOYEE** | employee@khadamati.com | Employee123! |

---

## 🔐 Sécurité

### Changer le Mot de Passe

Pour changer votre mot de passe :

1. Connectez-vous à l'application
2. Allez dans "Profil" ou "Paramètres"
3. Cliquez sur "Changer le mot de passe"
4. Entrez l'ancien mot de passe : `smail1234`
5. Entrez le nouveau mot de passe
6. Confirmez

**Ou via l'API** :
```bash
curl -X POST http://localhost:8080/api/auth/change-password ^
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" ^
  -H "Content-Type: application/json" ^
  -d "{\"currentPassword\":\"smail1234\",\"newPassword\":\"NouveauMotDePasse123!\"}"
```

### Recommandations
- ✅ Utilisez un mot de passe fort (8+ caractères, majuscules, minuscules, chiffres, symboles)
- ✅ Ne partagez pas votre mot de passe
- ✅ Changez votre mot de passe régulièrement
- ✅ Activez l'authentification à deux facteurs (OTP par email)

---

## 🧪 Tester Votre Compte

### Test 1 : Vérifier que le Compte Existe
```bash
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "ismailelrhazoui21@gmail.com",
  "role": "ADMIN",
  "isActive": true,
  "firstName": "Ismail",
  "lastName": "Elrhazoui"
}
```

### Test 2 : Se Connecter (Étape 1)
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ismailelrhazoui21@gmail.com\",\"password\":\"smail1234\"}"
```

**Résultat attendu** :
```json
{
  "message": "Code envoyé à i***l@gmail.com",
  "email": "ismailelrhazoui21@gmail.com",
  "requireOtp": true
}
```

### Test 3 : Vérifier dans MySQL
```sql
USE khadamati_db;

-- Voir votre compte
SELECT * FROM users WHERE email = 'ismailelrhazoui21@gmail.com';

-- Voir votre profil employé
SELECT * FROM employees WHERE email = 'ismailelrhazoui21@gmail.com';
```

---

## 📱 Configuration de l'Email OTP

L'application envoie des codes OTP à votre email : **ismailelrhazoui21@gmail.com**

### Configuration SMTP Actuelle
D'après `application.yml`, l'email est configuré avec :
- **Serveur SMTP** : Gmail (smtp.gmail.com)
- **Port** : 587
- **Email expéditeur** : ismailelrhazoui2003@gmail.com

**Note** : Vérifiez que cet email expéditeur est bien configuré pour envoyer des emails.

### Recevoir les Codes OTP
Les codes OTP seront envoyés à votre email : **ismailelrhazoui21@gmail.com**

Si vous ne recevez pas les emails :
1. Vérifiez votre dossier spam
2. Vérifiez les logs du backend pour voir le code
3. Vérifiez la configuration SMTP dans `application.yml`

---

## 🎯 Premiers Pas

### 1. Se Connecter
1. Ouvrir http://localhost:3000
2. Entrer votre email et mot de passe
3. Entrer le code OTP reçu par email
4. Accéder au dashboard admin

### 2. Explorer le Dashboard
- Voir les statistiques globales
- Consulter la liste des utilisateurs
- Voir la liste des employés
- Consulter les demandes en attente

### 3. Créer un Nouvel Employé
- Aller dans "Employés"
- Cliquer sur "Ajouter un employé"
- Remplir le formulaire
- Enregistrer

### 4. Gérer les Demandes
- Aller dans "Demandes de congés"
- Voir les demandes en attente
- Approuver ou rejeter les demandes

---

## 📚 Documentation Utile

- **PROJET_TERMINE.md** - Guide complet du projet
- **COMPTES_TEST.md** - Tous les comptes de test
- **DEMARRAGE_RAPIDE.md** - Démarrage en 3 étapes
- **SUCCES_FINALISATION.md** - Détails techniques

---

## 🆘 Support

### Problèmes de Connexion
- Vérifiez l'email et le mot de passe
- Vérifiez que le backend est démarré
- Vérifiez les logs du backend

### Code OTP Non Reçu
- Vérifiez votre dossier spam
- Vérifiez les logs du backend
- Demandez un nouveau code avec "Renvoyer le code"

### Autres Problèmes
- Consultez **PROJET_TERMINE.md**
- Vérifiez les logs du backend et frontend
- Vérifiez la console du navigateur (F12)

---

## ✅ Checklist

- [x] Compte créé
- [x] Compte vérifié dans l'API
- [x] Rôle ADMIN confirmé
- [ ] Connexion testée sur le frontend
- [ ] Dashboard admin exploré
- [ ] Fonctionnalités testées

---

## 🎉 Félicitations !

**Votre compte administrateur est prêt !**

**Connectez-vous maintenant** : http://localhost:3000

**Email** : ismailelrhazoui21@gmail.com  
**Mot de passe** : smail1234

**Bon développement avec Khadamati !** 🚀

---

**Dernière mise à jour** : 6 Mai 2026
