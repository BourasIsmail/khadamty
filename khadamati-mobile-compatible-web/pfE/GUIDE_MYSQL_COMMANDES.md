# 📚 Guide des Commandes MySQL - Khadamati

## 🔌 Se Connecter à MySQL

```powershell
# Méthode 1 : Avec le script
.\mysql-connect.ps1

# Méthode 2 : Commande directe
docker exec -it khadamati-mysql mysql -u root -p2003 khadamati_db
```

---

## 📊 Commandes de Base

### Voir toutes les tables
```sql
SHOW TABLES;
```

### Voir la structure d'une table
```sql
DESCRIBE users;
DESCRIBE employees;
DESCRIBE departments;
DESCRIBE attendance;
```

---

## 👥 Gestion des Utilisateurs

### Voir tous les utilisateurs
```sql
SELECT * FROM users;
```

### Voir les utilisateurs avec leurs rôles
```sql
SELECT id, username, email, role, created_at FROM users;
```

### Chercher un utilisateur spécifique
```sql
SELECT * FROM users WHERE username = 'admin';
SELECT * FROM users WHERE email = 'admin@khadamati.com';
```

### Compter les utilisateurs par rôle
```sql
SELECT role, COUNT(*) as total FROM users GROUP BY role;
```

### Voir les utilisateurs actifs
```sql
SELECT * FROM users WHERE enabled = true;
```

---

## 👨‍💼 Gestion des Employés

### Voir tous les employés
```sql
SELECT * FROM employees;
```

### Voir les employés avec informations de base
```sql
SELECT id, first_name, last_name, email, phone, position, department_id 
FROM employees;
```

### Chercher un employé
```sql
SELECT * FROM employees WHERE last_name LIKE '%nom%';
SELECT * FROM employees WHERE email = 'employe@example.com';
```

### Voir les employés d'un département
```sql
SELECT * FROM employees WHERE department_id = 1;
```

### Compter les employés
```sql
SELECT COUNT(*) as total_employees FROM employees;
```

### Voir les derniers employés ajoutés
```sql
SELECT * FROM employees ORDER BY created_at DESC LIMIT 10;
```

---

## 🏢 Gestion des Départements

### Voir tous les départements
```sql
SELECT * FROM departments;
```

### Voir les départements avec le nombre d'employés
```sql
SELECT d.id, d.name, COUNT(e.id) as nombre_employes
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name;
```

---

## ⏰ Gestion des Présences (Attendance)

### Voir toutes les présences
```sql
SELECT * FROM attendance;
```

### Voir les présences d'aujourd'hui
```sql
SELECT * FROM attendance WHERE DATE(check_in) = CURDATE();
```

### Voir les présences d'un employé
```sql
SELECT * FROM attendance WHERE employee_id = 1 ORDER BY check_in DESC;
```

### Voir qui est actuellement au travail (check-in sans check-out)
```sql
SELECT e.first_name, e.last_name, a.check_in
FROM attendance a
JOIN employees e ON a.employee_id = e.id
WHERE a.check_out IS NULL
ORDER BY a.check_in DESC;
```

---

## 🔍 Requêtes Avancées

### Voir les employés avec leur département
```sql
SELECT e.id, e.first_name, e.last_name, e.position, d.name as department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

### Statistiques de présence par employé
```sql
SELECT e.first_name, e.last_name, COUNT(a.id) as jours_travailles
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id
GROUP BY e.id, e.first_name, e.last_name
ORDER BY jours_travailles DESC;
```

### Voir les employés sans département
```sql
SELECT * FROM employees WHERE department_id IS NULL;
```

---

## 🛠️ Commandes d'Administration

### Voir toutes les bases de données
```sql
SHOW DATABASES;
```

### Voir la base de données actuelle
```sql
SELECT DATABASE();
```

### Voir les tables avec leur taille
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'khadamati_db'
ORDER BY (data_length + index_length) DESC;
```

### Voir les index d'une table
```sql
SHOW INDEX FROM users;
SHOW INDEX FROM employees;
```

---

## 📝 Modification de Données (Attention !)

### Créer un nouvel utilisateur admin
```sql
INSERT INTO users (username, email, password, role, enabled) 
VALUES ('admin2', 'admin2@khadamati.com', '$2a$10$...', 'ADMIN', true);
```

### Mettre à jour un utilisateur
```sql
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;
```

### Désactiver un utilisateur
```sql
UPDATE users SET enabled = false WHERE id = 1;
```

### Supprimer un employé (Attention !)
```sql
DELETE FROM employees WHERE id = 1;
```

---

## 🚪 Quitter MySQL

```sql
EXIT;
```

ou

```sql
QUIT;
```

ou appuyez sur `Ctrl+D`

---

## 💡 Astuces

### Voir l'historique des commandes
- Utilisez les flèches ↑ et ↓ pour naviguer dans l'historique

### Annuler une commande en cours
- Appuyez sur `Ctrl+C`

### Effacer l'écran
```sql
\! clear
```

### Exécuter un fichier SQL
```sql
SOURCE /chemin/vers/fichier.sql;
```

### Exporter les résultats dans un fichier
```sql
SELECT * FROM users INTO OUTFILE '/tmp/users.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

---

## 🔐 Sécurité

⚠️ **Attention** : Les commandes `UPDATE` et `DELETE` sont irréversibles !

Toujours utiliser `WHERE` avec ces commandes :
```sql
-- ❌ DANGEREUX (supprime TOUT)
DELETE FROM employees;

-- ✅ CORRECT (supprime un seul employé)
DELETE FROM employees WHERE id = 1;
```

---

## 📞 Besoin d'Aide ?

Dans MySQL, tapez :
```sql
HELP;
```

ou pour une commande spécifique :
```sql
HELP SELECT;
HELP INSERT;
```
