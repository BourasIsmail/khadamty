# 🔧 Alternatives à MySQL Workbench

## ❌ Problème : MySQL Workbench ne s'ouvre pas

Voici plusieurs solutions alternatives pour accéder à votre base de données MySQL.

---

## ✅ Solution 1 : Utiliser Docker + Ligne de Commande (Le Plus Simple)

### Accéder à MySQL directement :
```powershell
docker exec -it khadamati-mysql mysql -u root -p2003 khadamati_db
```

### Commandes MySQL utiles une fois connecté :
```sql
-- Voir toutes les tables
SHOW TABLES;

-- Voir les utilisateurs
SELECT * FROM users;

-- Voir les employés
SELECT * FROM employees;

-- Voir la structure d'une table
DESCRIBE users;

-- Quitter
EXIT;
```

---

## ✅ Solution 2 : Installer DBeaver (Recommandé)

**DBeaver** est une alternative gratuite, légère et puissante à MySQL Workbench.

### Téléchargement :
🔗 https://dbeaver.io/download/

### Configuration dans DBeaver :
1. Télécharger et installer DBeaver
2. Ouvrir DBeaver
3. Cliquer sur "Nouvelle connexion" (icône prise électrique)
4. Sélectionner **MySQL**
5. Remplir les paramètres :
   - **Host** : `localhost`
   - **Port** : `3307` ⚠️
   - **Database** : `khadamati_db`
   - **Username** : `root`
   - **Password** : `2003`
6. Tester la connexion
7. Cliquer sur "Terminer"

---

## ✅ Solution 3 : Utiliser HeidiSQL (Léger et Rapide)

**HeidiSQL** est un client MySQL très léger pour Windows.

### Téléchargement :
🔗 https://www.heidisql.com/download.php

### Configuration :
- **Type** : MySQL (TCP/IP)
- **Hostname** : `127.0.0.1`
- **User** : `root`
- **Password** : `2003`
- **Port** : `3307` ⚠️

---

## ✅ Solution 4 : Utiliser phpMyAdmin via Docker

Vous pouvez ajouter phpMyAdmin à votre docker-compose.yml :

```yaml
phpmyadmin:
  image: phpmyadmin:latest
  container_name: khadamati-phpmyadmin
  restart: always
  ports:
    - "8082:80"
  environment:
    PMA_HOST: mysql
    PMA_PORT: 3306
    PMA_USER: root
    PMA_PASSWORD: 2003
  depends_on:
    - mysql
```

Ensuite :
```powershell
docker-compose up -d phpmyadmin
```

Accéder à : http://localhost:8082

---

## ✅ Solution 5 : Réparer MySQL Workbench

### Méthode 1 : Réinstaller
1. Panneau de configuration → Programmes → Désinstaller MySQL Workbench
2. Télécharger la dernière version : https://dev.mysql.com/downloads/workbench/
3. Réinstaller

### Méthode 2 : Lancer en mode administrateur
1. Clic droit sur l'icône MySQL Workbench
2. "Exécuter en tant qu'administrateur"

### Méthode 3 : Supprimer les fichiers de configuration
```powershell
# Supprimer les préférences corrompues
Remove-Item "$env:APPDATA\MySQL\Workbench" -Recurse -Force -ErrorAction SilentlyContinue
```

Puis relancer MySQL Workbench.

---

## 🎯 Recommandation

**Pour travailler rapidement maintenant** : Utilisez la ligne de commande Docker (Solution 1)

**Pour une interface graphique** : Installez DBeaver (Solution 2) - c'est gratuit, moderne et fonctionne très bien.

---

## 📝 Script PowerShell pour Accès Rapide

Créez un fichier `mysql-connect.ps1` :

```powershell
# Connexion rapide à MySQL
Write-Host "🔌 Connexion à MySQL..." -ForegroundColor Cyan
docker exec -it khadamati-mysql mysql -u root -p2003 khadamati_db
```

Puis lancez-le avec :
```powershell
.\mysql-connect.ps1
```
