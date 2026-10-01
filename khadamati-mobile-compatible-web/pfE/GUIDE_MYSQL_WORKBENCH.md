# 📊 Guide MySQL Workbench - Khadamati

**Comment voir vos données dans MySQL Workbench**

---

## 🎯 Concept : Même Chose que MongoDB

### Avant (MongoDB)
```javascript
// Voir les utilisateurs
db.users.find()

// Voir les employés
db.employees.find()
```

### Maintenant (MySQL)
```sql
-- Voir les utilisateurs
SELECT * FROM users;

-- Voir les employés
SELECT * FROM employees;
```

**C'est exactement le même concept**, juste une syntaxe différente !

---

## 📋 Étapes pour Voir Vos Données

### 1️⃣ Ouvrir MySQL Workbench ✅
Vous l'avez déjà ouvert !

### 2️⃣ Sélectionner la Base de Données

Dans la zone de requête (Query), tapez :

```sql
USE khadamati_db;
```

Puis cliquez sur l'éclair ⚡ (ou appuyez sur Ctrl+Enter)

### 3️⃣ Voir Toutes les Tables

```sql
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
```

### 4️⃣ Voir les Utilisateurs

```sql
SELECT * FROM users;
```

**Ou pour une vue plus claire** :

```sql
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active
FROM users;
```

### 5️⃣ Voir les Employés

```sql
SELECT * FROM employees;
```

**Ou pour une vue plus claire** :

```sql
SELECT 
    id,
    employee_id,
    first_name,
    last_name,
    email,
    department,
    position
FROM employees;
```

---

## 🔍 Requêtes Utiles

### Compter les Utilisateurs
```sql
SELECT COUNT(*) AS total_users FROM users;
```

### Compter les Employés
```sql
SELECT COUNT(*) AS total_employees FROM employees;
```

### Voir Votre Compte
```sql
SELECT * FROM users 
WHERE email = 'ismailelrhazoui21@gmail.com';
```

### Voir les Utilisateurs par Rôle
```sql
SELECT 
    role,
    COUNT(*) AS nombre
FROM users
GROUP BY role;
```

### Voir les Employés par Département
```sql
SELECT 
    department,
    COUNT(*) AS nombre
FROM employees
GROUP BY department;
```

---

## 📊 Script Complet : Voir Tout

J'ai créé un script SQL complet : **`voir_toutes_donnees.sql`**

### Comment l'utiliser :

1. **Ouvrir le fichier** dans MySQL Workbench :
   - File → Open SQL Script
   - Sélectionner `voir_toutes_donnees.sql`

2. **Exécuter le script** :
   - Cliquer sur l'éclair ⚡
   - Ou appuyer sur Ctrl+Shift+Enter

3. **Voir les résultats** :
   - Tous les résultats s'affichent dans l'onglet "Result Grid"
   - Vous pouvez naviguer entre les différents résultats

---

## 🎨 Interface MySQL Workbench

### Zone de Navigation (Gauche)
```
SCHEMAS
└── khadamati_db
    └── Tables
        ├── attendance
        ├── document_requests
        ├── employees
        ├── leave_requests
        └── users
```

**Astuce** : Double-cliquez sur une table pour voir sa structure !

### Zone de Requête (Centre)
C'est ici que vous tapez vos requêtes SQL.

### Zone de Résultats (Bas)
Les résultats de vos requêtes s'affichent ici.

---

## 📝 Comparaison MongoDB vs MySQL

### Voir Tous les Utilisateurs

**MongoDB** :
```javascript
db.users.find()
```

**MySQL** :
```sql
SELECT * FROM users;
```

### Voir un Utilisateur Spécifique

**MongoDB** :
```javascript
db.users.findOne({ email: "admin@khadamati.com" })
```

**MySQL** :
```sql
SELECT * FROM users 
WHERE email = 'admin@khadamati.com';
```

### Compter les Utilisateurs

**MongoDB** :
```javascript
db.users.count()
```

**MySQL** :
```sql
SELECT COUNT(*) FROM users;
```

### Voir les Utilisateurs ADMIN

**MongoDB** :
```javascript
db.users.find({ role: "ADMIN" })
```

**MySQL** :
```sql
SELECT * FROM users 
WHERE role = 'ADMIN';
```

---

## 🎯 Vos Données Actuelles

### Table `users` (4 utilisateurs)

| ID | Email | Nom | Rôle | Actif |
|----|-------|-----|------|-------|
| 1 | ismailelrhazoui21@gmail.com | Ismail Elrhazoui | ADMIN | ✅ |
| 2 | admin@khadamati.com | Admin Système | ADMIN | ✅ |
| 3 | rh@khadamati.com | Responsable RH | RH | ✅ |
| 4 | employee@khadamati.com | Employé Test | EMPLOYEE | ✅ |

### Table `employees` (4 employés)

| ID | ID Employé | Nom | Email | Département |
|----|------------|-----|-------|-------------|
| 1 | EMP???? | Ismail Elrhazoui | ismailelrhazoui21@gmail.com | ... |
| 2 | EMP6860 | Admin Système | admin@khadamati.com | Administration |
| 3 | EMP4867 | Responsable RH | rh@khadamati.com | RH |
| 4 | EMP9364 | Employé Test | employee@khadamati.com | Développement |

---

## 🔧 Requêtes Avancées

### Joindre Users et Employees

```sql
SELECT 
    u.email,
    u.role,
    e.employee_id,
    e.department,
    e.position
FROM users u
LEFT JOIN employees e ON u.email = e.email;
```

### Voir les Employés avec leur Solde de Congés

```sql
SELECT 
    employee_id,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    department,
    annual_leave_balance AS 'Congés annuels',
    sick_leave_balance AS 'Congés maladie',
    personal_leave_balance AS 'Congés personnels'
FROM employees;
```

### Voir les Demandes de Congés en Attente

```sql
SELECT 
    employee_name,
    leave_type,
    start_date,
    end_date,
    days_requested,
    reason
FROM leave_requests
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

---

## 💡 Astuces MySQL Workbench

### 1. Exécuter une Seule Requête
- Sélectionnez la requête avec la souris
- Cliquez sur l'éclair ⚡
- Ou Ctrl+Enter

### 2. Exécuter Tout le Script
- Ctrl+Shift+Enter
- Ou cliquez sur l'éclair avec les lignes ⚡⚡

### 3. Formater le Code SQL
- Edit → Format → Beautify Query
- Ou Ctrl+B

### 4. Voir la Structure d'une Table
```sql
DESCRIBE users;
-- ou
SHOW COLUMNS FROM users;
```

### 5. Exporter les Résultats
- Clic droit sur les résultats
- Export → CSV, JSON, etc.

---

## 📊 Visualisation des Données

### Graphique Simple

MySQL Workbench peut afficher des graphiques simples :

1. Exécutez une requête avec des agrégations
2. Cliquez sur l'onglet "Form Editor"
3. Sélectionnez le type de graphique

**Exemple** :
```sql
SELECT 
    role,
    COUNT(*) AS nombre
FROM users
GROUP BY role;
```

---

## 🎯 Exercices Pratiques

### Exercice 1 : Voir Votre Compte
```sql
SELECT * FROM users 
WHERE email = 'ismailelrhazoui21@gmail.com';
```

### Exercice 2 : Compter les Utilisateurs par Rôle
```sql
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;
```

### Exercice 3 : Voir les 5 Derniers Employés
```sql
SELECT * FROM employees 
ORDER BY hire_date DESC 
LIMIT 5;
```

### Exercice 4 : Chercher un Employé par Nom
```sql
SELECT * FROM employees 
WHERE first_name LIKE '%Ismail%' 
   OR last_name LIKE '%Ismail%';
```

---

## 🆘 Problèmes Courants

### "Table doesn't exist"
**Solution** : Vérifiez que vous avez sélectionné la bonne base de données :
```sql
USE khadamati_db;
```

### "Access denied"
**Solution** : Vérifiez votre connexion MySQL (mot de passe : 2003)

### Résultats vides
**Solution** : Vérifiez que le backend a bien inséré des données :
```sql
SELECT COUNT(*) FROM users;
```

---

## ✅ Checklist

- [ ] MySQL Workbench ouvert
- [ ] Connecté à la base de données
- [ ] Base `khadamati_db` sélectionnée
- [ ] Requête `SHOW TABLES;` exécutée
- [ ] Requête `SELECT * FROM users;` exécutée
- [ ] Requête `SELECT * FROM employees;` exécutée
- [ ] Script `voir_toutes_donnees.sql` exécuté
- [ ] Données vérifiées

---

## 🎉 Résumé

**Oui, c'est exactement le même concept que MongoDB !**

| MongoDB | MySQL |
|---------|-------|
| Collections | Tables |
| Documents | Lignes (Rows) |
| `find()` | `SELECT` |
| `findOne()` | `SELECT ... LIMIT 1` |
| `count()` | `COUNT(*)` |
| `insertOne()` | `INSERT INTO` |

**La seule différence** : La syntaxe des requêtes !

**Vos données sont là**, dans MySQL, prêtes à être utilisées ! 🚀

---

**Utilisez le script `voir_toutes_donnees.sql` pour voir toutes vos données !** 📊
