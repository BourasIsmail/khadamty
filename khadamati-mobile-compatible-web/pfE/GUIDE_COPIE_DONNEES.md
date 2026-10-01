# 📋 Guide : Copier les données vers Docker

## 🎯 Objectif

Copier toutes vos données de MySQL local (port 3306) vers MySQL Docker (port 3307).

---

## ✅ Prérequis

1. ✅ Docker Desktop est ouvert et en cours d'exécution
2. ✅ Les conteneurs Docker sont démarrés (`docker-compose up -d`)
3. ✅ MySQL local est démarré sur le port 3306
4. ✅ Vous avez des données dans votre base locale

---

## 🚀 Méthode 1 : Script automatique (Recommandé)

### Étape 1 : Démarrer Docker

```powershell
docker-compose up -d
```

Attendez que tous les services soient démarrés (~30 secondes).

### Étape 2 : Exécuter le script

```powershell
.\copier_donnees_vers_docker.ps1
```

Le script va :
1. ✅ Exporter votre base locale → `backup_local.sql`
2. ✅ Nettoyer la base Docker
3. ✅ Importer les données dans Docker

### Étape 3 : Tester

Ouvrir **http://localhost:3001** et se connecter avec vos identifiants habituels.

---

## 🔧 Méthode 2 : Commandes manuelles

### Étape 1 : Exporter la base locale

```powershell
mysqldump -u root -p2003 -h localhost -P 3306 khadamati_db > backup_local.sql
```

### Étape 2 : Vérifier le fichier

```powershell
Get-Content backup_local.sql -Head 20
```

Vous devriez voir du SQL.

### Étape 3 : Importer dans Docker

```powershell
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup_local.sql
```

### Étape 4 : Vérifier

```powershell
docker exec -it khadamati-mysql mysql -uroot -p2003 khadamati_db -e "SELECT COUNT(*) FROM users;"
```

---

## 🔍 Vérification

### Vérifier les utilisateurs

```powershell
docker exec -it khadamati-mysql mysql -uroot -p2003 khadamati_db -e "SELECT email, role FROM users;"
```

### Vérifier les employés

```powershell
docker exec -it khadamati-mysql mysql -uroot -p2003 khadamati_db -e "SELECT COUNT(*) FROM employees;"
```

---

## ❓ Problèmes courants

### "mysqldump: command not found"

**Solution** : MySQL n'est pas installé localement ou n'est pas dans le PATH.

**Alternative** : Utiliser MySQL Workbench pour exporter :
1. Ouvrir MySQL Workbench
2. Se connecter à localhost:3306
3. Server → Data Export
4. Sélectionner `khadamati_db`
5. Export to Self-Contained File : `backup_local.sql`
6. Start Export

Puis importer dans Docker :
```powershell
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup_local.sql
```

### "Access denied for user 'root'"

**Solution** : Vérifier le mot de passe MySQL local.

Si votre mot de passe local n'est pas `2003`, modifiez la commande :
```powershell
mysqldump -u root -pVOTRE_MOT_DE_PASSE -h localhost -P 3306 khadamati_db > backup_local.sql
```

### "Can't connect to MySQL server on 'localhost:3306'"

**Solution** : MySQL local n'est pas démarré.

Démarrer MySQL local :
```powershell
net start MySQL80
```

### "ERROR 2002 (HY000): Can't connect to local MySQL server"

**Solution** : Le conteneur Docker MySQL n'est pas démarré.

```powershell
docker-compose up -d mysql
```

Attendre 10-20 secondes puis réessayer.

---

## 📊 Résultat attendu

Après la copie, vous devriez avoir :

### Dans MySQL Local (port 3306)
- ✅ Toutes vos données (inchangées)

### Dans MySQL Docker (port 3307)
- ✅ Copie exacte de vos données
- ✅ Tous vos comptes utilisateurs
- ✅ Tous vos employés
- ✅ Toutes vos demandes de congés
- ✅ Toutes vos demandes d'attestations

---

## 🌐 Connexion après la copie

### Frontend Docker
**URL** : http://localhost:3001

### Comptes (vos comptes habituels)
```
Email       : ismailelrhazoui21@gmail.com
Mot de passe: smail1234
```

---

## 🔄 Synchronisation future

Si vous modifiez des données dans MySQL local et voulez les copier à nouveau dans Docker :

```powershell
# 1. Exporter
mysqldump -u root -p2003 -h localhost -P 3306 khadamati_db > backup_local.sql

# 2. Importer
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup_local.sql
```

Ou simplement réexécuter le script :
```powershell
.\copier_donnees_vers_docker.ps1
```

---

## 📝 Notes importantes

1. **Backup** : Le fichier `backup_local.sql` est créé dans le dossier du projet
2. **Sécurité** : Ne partagez pas ce fichier (contient vos données)
3. **Taille** : Le fichier peut être volumineux selon vos données
4. **Temps** : L'import peut prendre quelques secondes à quelques minutes

---

## ✅ Checklist

- [ ] Docker Desktop ouvert et en cours d'exécution
- [ ] `docker-compose up -d` exécuté
- [ ] MySQL local démarré (port 3306)
- [ ] Script `copier_donnees_vers_docker.ps1` exécuté
- [ ] Message "✅ Import réussi !" affiché
- [ ] http://localhost:3001 ouvert
- [ ] Connexion réussie avec vos identifiants

---

**Date de création** : 11 Mai 2026  
**Auteur** : Assistant Kiro  
**Version** : 1.0
