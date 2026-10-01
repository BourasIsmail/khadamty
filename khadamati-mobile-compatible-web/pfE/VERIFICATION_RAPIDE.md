# ✅ Vérification Rapide du Projet

**Guide de test en 5 minutes** ⏱️

---

## 🎯 Objectif

Vérifier que toutes les fonctionnalités principales fonctionnent correctement.

---

## 📋 Checklist de Vérification

### 1️⃣ MySQL (30 secondes)

```bash
# Ouvrir MySQL Workbench ou terminal MySQL
mysql -u root -p2003

# Vérifier la base de données
USE khadamati_db;
SHOW TABLES;

# Vérifier les utilisateurs
SELECT id, email, first_name, last_name, role, email_verified FROM users;
```

**Résultat attendu** :
- ✅ 5 tables : users, employees, leave_requests, document_requests, attendance
- ✅ 4 utilisateurs minimum
- ✅ Colonne `email_verified` présente

---

### 2️⃣ Backend (1 minute)

```bash
# Démarrer le backend
cd spring-backend
./mvnw spring-boot:run
```

**Résultat attendu** :
```
Started EmployeeManagementApplication in X seconds
Tomcat started on port(s): 8080 (http)
```

**Test rapide** :
```bash
# Tester l'endpoint de santé
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com
```

**Résultat attendu** :
```json
{
  "exists": true,
  "email": "ismailelrhazoui21@gmail.com",
  "role": "ADMIN",
  "isActive": true,
  "emailVerified": false,
  "firstName": "Ismail",
  "lastName": "Elrhazoui"
}
```

---

### 3️⃣ Frontend (1 minute)

```bash
# Démarrer le frontend
cd frontend
npm run dev
```

**Résultat attendu** :
```
✓ Ready in Xms
○ Local:   http://localhost:3000
```

**Ouvrir dans le navigateur** : http://localhost:3000

---

### 4️⃣ Test de Connexion (2 minutes)

#### Test 1 : Connexion Admin (Première fois)

1. **Aller sur** : http://localhost:3000/login
2. **Entrer** :
   - Email : `ismailelrhazoui21@gmail.com`
   - Mot de passe : `smail1234`
3. **Cliquer** : Se connecter
4. **Résultat attendu** : 
   - ✅ Message "Code envoyé à i***l@gmail.com (première connexion)"
   - ✅ Champ OTP apparaît

5. **Vérifier l'email** : ismailelrhazoui2003@gmail.com
6. **Copier le code OTP** (6 chiffres)
7. **Entrer le code** et cliquer "Vérifier"
8. **Résultat attendu** :
   - ✅ Redirection vers `/dashboard`
   - ✅ Message "Connexion réussie"

#### Test 2 : Connexion Admin (Deuxième fois)

1. **Se déconnecter** (cliquer sur le profil → Se déconnecter)
2. **Se reconnecter** avec les mêmes identifiants
3. **Résultat attendu** :
   - ✅ Connexion directe SANS OTP
   - ✅ Redirection immédiate vers `/dashboard`

---

### 5️⃣ Test du Dashboard (1 minute)

#### Vérifier le Menu

**Pour ADMIN, vous devriez voir** :
- ✅ Tableau de bord
- ✅ Employés
- ✅ Gestion RH
- ✅ Statistiques
- ✅ Mon Profil
- ✅ Administration
- ❌ PAS de menu "Présences"

#### Vérifier les Notifications

1. **Cliquer sur l'icône cloche** (en haut à droite)
2. **Résultat attendu** :
   - ✅ Dropdown s'ouvre
   - ✅ Badge avec nombre de notifications non lues
   - ✅ Liste de notifications avec types (success, info, warning)
   - ✅ Bouton "Tout marquer comme lu"

#### Vérifier le Profil

1. **Cliquer sur le profil** (en haut à droite)
2. **Résultat attendu** :
   - ✅ Dropdown s'ouvre
   - ✅ Photo de profil (initiales par défaut)
   - ✅ Nom et email affichés
   - ✅ Badge du rôle (Administrateur)
   - ✅ Point vert (en ligne)
   - ✅ Options : Mon Profil, Paramètres, Se déconnecter

3. **Survoler la photo de profil**
4. **Résultat attendu** :
   - ✅ Icône caméra apparaît

5. **Cliquer sur l'icône caméra**
6. **Sélectionner une image** (max 5 MB)
7. **Résultat attendu** :
   - ✅ Photo uploadée et affichée
   - ✅ Message "Photo de profil mise à jour !"

---

## 🧪 Tests Avancés (Optionnel)

### Test 1 : Créer un Nouvel Employé

1. **Aller sur** : `/dashboard/employees`
2. **Cliquer** : "Nouvel employé"
3. **Remplir le formulaire** :
   - Prénom : Test
   - Nom : Employé
   - Email : test.employe@khadamati.ma
   - Téléphone : 0612345678
   - Département : IT
   - Poste : Développeur
   - Date d'embauche : 2026-05-06
   - Mot de passe : Test123!
4. **Cliquer** : Créer
5. **Résultat attendu** :
   - ✅ Message "Employé créé avec succès"
   - ✅ Redirection vers la liste des employés
   - ✅ Nouvel employé visible dans la liste

### Test 2 : Vérifier dans MySQL

```sql
-- Vérifier le nouvel employé
SELECT * FROM users WHERE email = 'test.employe@khadamati.ma';
SELECT * FROM employees WHERE email = 'test.employe@khadamati.ma';
```

**Résultat attendu** :
- ✅ 1 ligne dans `users` avec `email_verified = false`
- ✅ 1 ligne dans `employees` avec un `employee_id` unique (ex: EMP1234)

### Test 3 : Première Connexion du Nouvel Employé

1. **Se déconnecter**
2. **Se connecter avec** :
   - Email : test.employe@khadamati.ma
   - Mot de passe : Test123!
3. **Résultat attendu** :
   - ✅ OTP demandé (première connexion)
   - ✅ Email reçu avec le code
4. **Entrer le code OTP**
5. **Résultat attendu** :
   - ✅ Connexion réussie
   - ✅ Dashboard EMPLOYEE (4 menus seulement)

### Test 4 : Deuxième Connexion du Nouvel Employé

1. **Se déconnecter**
2. **Se reconnecter** avec les mêmes identifiants
3. **Résultat attendu** :
   - ✅ Connexion directe SANS OTP

---

## 🔍 Vérification de la Base de Données

### Requêtes Utiles

```sql
-- Voir tous les utilisateurs avec leur statut de vérification
SELECT 
    id,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    is_active,
    email_verified,
    created_at
FROM users
ORDER BY created_at DESC;

-- Voir tous les employés
SELECT 
    id,
    employee_id,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    email,
    department,
    position,
    hire_date
FROM employees
ORDER BY created_at DESC;

-- Compter les utilisateurs par rôle
SELECT 
    role,
    COUNT(*) AS nombre,
    SUM(CASE WHEN email_verified = true THEN 1 ELSE 0 END) AS verifies,
    SUM(CASE WHEN email_verified = false THEN 1 ELSE 0 END) AS non_verifies
FROM users
GROUP BY role;

-- Voir les demandes de congés
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

-- Voir les demandes d'attestations
SELECT 
    dr.id,
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employe,
    dr.document_type,
    dr.status,
    dr.created_at
FROM document_requests dr
JOIN employees e ON dr.employee_id = e.id
ORDER BY dr.created_at DESC;
```

---

## 📊 Résultats Attendus

### Backend
- ✅ Démarre sans erreur
- ✅ Se connecte à MySQL
- ✅ Crée les tables automatiquement
- ✅ Répond aux requêtes API
- ✅ Envoie les emails OTP

### Frontend
- ✅ Démarre sans erreur
- ✅ Se connecte au backend
- ✅ Affiche la page de connexion
- ✅ Gère l'authentification
- ✅ Affiche le dashboard
- ✅ Notifications fonctionnelles
- ✅ Menu profil fonctionnel
- ✅ Upload de photo fonctionnel

### Base de Données
- ✅ Base `khadamati_db` existe
- ✅ 5 tables créées
- ✅ Colonne `email_verified` présente
- ✅ Données de test présentes
- ✅ Relations entre tables correctes

### Authentification
- ✅ Connexion avec email + mot de passe
- ✅ OTP envoyé à la première connexion
- ✅ OTP vérifié correctement
- ✅ `email_verified` mis à jour après OTP
- ✅ Connexion directe après première fois
- ✅ JWT token généré
- ✅ Redirection selon le rôle

---

## 🐛 Problèmes Courants

### Problème 1 : Backend ne démarre pas
**Erreur** : `Could not connect to MySQL`

**Solution** :
```bash
# Vérifier que MySQL est démarré
# Vérifier le mot de passe dans application.yml (2003)
# Vérifier que le port 3306 est libre
```

### Problème 2 : OTP non reçu
**Erreur** : Email OTP non reçu

**Solution** :
```bash
# Vérifier les logs backend pour les erreurs SMTP
# Vérifier le dossier spam
# Vérifier la configuration SMTP dans application.yml
```

### Problème 3 : Frontend ne se connecte pas
**Erreur** : `Network Error` ou `CORS Error`

**Solution** :
```bash
# Vérifier que le backend est sur http://localhost:8080/api
# Vérifier la configuration CORS dans application.yml
# Vérifier l'URL dans frontend/lib/api.ts
```

### Problème 4 : Photo de profil ne s'affiche pas
**Erreur** : Photo uploadée mais pas visible

**Solution** :
```bash
# Vérifier la taille de l'image (max 5 MB)
# Vider le cache du navigateur (Ctrl + Shift + R)
# Vérifier le localStorage du navigateur (F12 → Application → Local Storage)
```

---

## ✅ Checklist Finale

- [ ] MySQL démarré et accessible
- [ ] Backend démarré sur port 8080
- [ ] Frontend démarré sur port 3000
- [ ] Connexion admin réussie (première fois avec OTP)
- [ ] Connexion admin réussie (deuxième fois sans OTP)
- [ ] Dashboard affiché correctement
- [ ] Menu adapté au rôle (pas de "Présences")
- [ ] Notifications dropdown fonctionnel
- [ ] Menu profil fonctionnel
- [ ] Upload photo de profil fonctionnel
- [ ] Création d'employé réussie
- [ ] Données visibles dans MySQL

---

## 🎉 Si Tous les Tests Passent

**Félicitations !** 🎊

Votre projet Khadamati est **100% opérationnel** !

Vous pouvez maintenant :
1. ✅ Créer des employés
2. ✅ Gérer les congés
3. ✅ Gérer les attestations
4. ✅ Voir les statistiques
5. ✅ Administrer le système

---

## 📞 Besoin d'Aide ?

Si un test échoue, consultez :
- `ETAT_ACTUEL_COMPLET.md` - État complet du projet
- `GUIDE_TEST_CORRECTIONS.md` - Guide de test détaillé
- `COMMENT_VERIFIER_DONNEES.md` - Vérification MySQL
- Les logs du backend et du frontend

---

**Temps total de vérification** : ⏱️ 5 minutes  
**Dernière mise à jour** : 6 Mai 2026
