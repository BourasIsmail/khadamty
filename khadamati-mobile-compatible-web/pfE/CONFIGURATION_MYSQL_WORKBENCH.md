# 🔧 Configuration MySQL Workbench pour Khadamati

## ❌ Problème Actuel
Vous êtes connecté à MySQL local (port 3306) au lieu de Docker (port 3307).

---

## ✅ Solution : Créer une Nouvelle Connexion

### Étape 1 : Ouvrir la Fenêtre de Connexion
Dans MySQL Workbench, cliquez sur le **"+"** à côté de "MySQL Connections"

### Étape 2 : Remplir les Paramètres

```
Connection Name:    Khadamati Docker
Connection Method:  Standard (TCP/IP)
Hostname:           127.0.0.1
Port:               3307          ⚠️ IMPORTANT : 3307 (pas 3306 !)
Username:           root
Password:           2003          (cliquez "Store in Vault...")
Default Schema:     khadamati_db
```

### Étape 3 : Tester la Connexion
Cliquez sur **"Test Connection"** en bas à gauche.

Vous devriez voir : ✅ "Successfully made the MySQL connection"

### Étape 4 : Sauvegarder
Cliquez sur **"OK"**

### Étape 5 : Se Connecter
Double-cliquez sur la nouvelle connexion "Khadamati Docker"

---

## 📊 Vos Données

Une fois connecté, vous verrez :

### Tables disponibles :
- ✅ **users** (8 utilisateurs)
- ✅ **employees** (9 employés)
- ✅ **attendances** (168 présences)
- ✅ **leave_requests** (demandes de congé)
- ✅ **document_requests** (demandes de documents)

---

## 🎯 Capture d'Écran des Paramètres

```
┌─────────────────────────────────────────────┐
│ Setup New Connection                        │
├─────────────────────────────────────────────┤
│ Connection Name: Khadamati Docker           │
│                                             │
│ Connection Method: Standard (TCP/IP)        │
│                                             │
│ Parameters:                                 │
│   Hostname:       127.0.0.1                 │
│   Port:           3307          ⚠️          │
│   Username:       root                      │
│   Password:       [Store in Vault...] 2003  │
│   Default Schema: khadamati_db              │
│                                             │
│ [Test Connection]              [OK] [Cancel]│
└─────────────────────────────────────────────┘
```

---

## 🔍 Vérification Rapide

Une fois connecté, exécutez ces requêtes pour vérifier :

```sql
-- Voir toutes les tables
SHOW TABLES;

-- Voir les utilisateurs
SELECT * FROM users;

-- Voir les employés
SELECT * FROM employees;

-- Compter les données
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION
SELECT 'employees', COUNT(*) FROM employees
UNION
SELECT 'attendances', COUNT(*) FROM attendances;
```

---

## ⚠️ Différence entre les Deux Connexions

| Connexion | Port | Base de Données | Utilisation |
|-----------|------|-----------------|-------------|
| MySQL Local | 3306 | Vide ou autre | MySQL installé sur Windows |
| **Khadamati Docker** | **3307** | **khadamati_db** | **Votre projet (à utiliser)** |

---

## 💡 Astuce

Pour éviter la confusion, vous pouvez :
1. Supprimer l'ancienne connexion (127.0.0.1:3306)
2. Garder uniquement "Khadamati Docker" (127.0.0.1:3307)

---

## 🆘 Besoin d'Aide ?

Si la connexion échoue :
1. Vérifiez que Docker Desktop est en cours d'exécution
2. Vérifiez que le conteneur MySQL est actif :
   ```powershell
   docker ps | findstr mysql
   ```
3. Vérifiez que le port 3307 est bien utilisé :
   ```powershell
   netstat -an | findstr 3307
   ```
