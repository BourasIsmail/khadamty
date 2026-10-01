# 🔌 Guide de Connexion à MySQL

## ✅ État Actuel
- MySQL est **en cours d'exécution** et en bonne santé
- Port : **3307** (au lieu de 3306)
- Mot de passe root : **2003**
- Base de données : **khadamati_db**

---

## 📋 Méthode 1 : Connexion via Docker (Recommandé)

```powershell
docker exec -it khadamati-mysql mysql -u root -p
```

Quand il demande le mot de passe, tapez : **2003**

---

## 📋 Méthode 2 : MySQL Workbench ou autre client GUI

Si vous utilisez **MySQL Workbench**, **DBeaver**, **HeidiSQL**, ou un autre client :

### Paramètres de connexion :
- **Host** : `localhost` ou `127.0.0.1`
- **Port** : `3307` ⚠️ (PAS 3306 !)
- **Username** : `root`
- **Password** : `2003`
- **Database** : `khadamati_db` (optionnel)

### Étapes dans MySQL Workbench :
1. Ouvrir MySQL Workbench
2. Cliquer sur "+" pour nouvelle connexion
3. Remplir les paramètres ci-dessus
4. **IMPORTANT** : Changer le port de 3306 à **3307**
5. Tester la connexion
6. Se connecter

---

## 📋 Méthode 3 : Ligne de commande MySQL (si installé localement)

```powershell
mysql -h 127.0.0.1 -P 3307 -u root -p
```

Mot de passe : **2003**

---

## 🔍 Vérifier que MySQL fonctionne

```powershell
# Vérifier l'état du conteneur
docker ps | findstr mysql

# Voir les logs MySQL
docker logs khadamati-mysql

# Tester la connexion
docker exec -it khadamati-mysql mysqladmin -u root -p2003 ping
```

---

## ❌ Problèmes Courants

### "Can't connect to MySQL server"
- ✅ Vérifiez que vous utilisez le port **3307** (pas 3306)
- ✅ Vérifiez que Docker Desktop est en cours d'exécution
- ✅ Vérifiez que le conteneur est actif : `docker ps`

### "Access denied"
- ✅ Vérifiez le mot de passe : **2003**
- ✅ Vérifiez le nom d'utilisateur : **root**

### MySQL Workbench ne trouve pas le serveur
- ✅ Changez le port à **3307** dans les paramètres de connexion
- ✅ Utilisez `127.0.0.1` au lieu de `localhost` si nécessaire

---

## 🎯 Commande Rapide pour Accéder à MySQL

```powershell
docker exec -it khadamati-mysql mysql -u root -p2003 khadamati_db
```

Cette commande vous connecte directement à la base de données khadamati_db.
