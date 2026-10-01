# 🚀 Guide de Démarrage Docker - Khadamati

## ✅ Prérequis

1. **Docker Desktop** doit être installé et en cours d'exécution
2. **Ports disponibles** : 3001, 8081, 3307

---

## 🎯 Démarrage Rapide

### Méthode 1 : Script PowerShell (Recommandé)

1. **Ouvrir PowerShell** dans le dossier du projet
2. **Exécuter le script** :
   ```powershell
   .\demarrer_docker.ps1
   ```

### Méthode 2 : Commande manuelle

```bash
docker-compose up --build
```

---

## 🌐 Accéder à l'application

Une fois que tous les services sont démarrés (attendez ~30 secondes), ouvrez votre navigateur :

### 🖥️ Frontend (Interface utilisateur)
```
http://localhost:3001
```

### 🔌 Backend API
```
http://localhost:8081/api
```

### 🗄️ MySQL (via MySQL Workbench)
```
Host: localhost
Port: 3307
User: root
Password: 2003
Database: khadamati_db
```

---

## 👤 Comptes de test

### Administrateur
- **Email** : `ismailelrhazoui954@gmail.com`
- **Mot de passe** : `888888`

### Employé RH
- **Email** : `rh@khadamati.com`
- **Mot de passe** : `123456`

### Employé Standard
- **Email** : `employee@khadamati.com`
- **Mot de passe** : `123456`

---

## 📊 Vérifier que tout fonctionne

### 1. Vérifier les logs

Dans le terminal où vous avez lancé `docker-compose up`, vous devriez voir :

```
✅ khadamati-mysql     | ready for connections
✅ khadamati-backend   | Started EmployeeManagementApplication
✅ khadamati-frontend  | Ready in XXXms
```

### 2. Vérifier les conteneurs

Ouvrir un nouveau terminal PowerShell :

```bash
docker-compose ps
```

Vous devriez voir 3 conteneurs avec le statut "Up" :
- `khadamati-mysql`
- `khadamati-backend`
- `khadamati-frontend`

### 3. Tester la connexion

1. Ouvrir http://localhost:3001
2. Cliquer sur "Se connecter"
3. Entrer les identifiants admin
4. Vous devriez recevoir un OTP par email (première connexion)

---

## 🛑 Arrêter l'application

### Méthode 1 : Dans le terminal
Appuyez sur `Ctrl+C` dans le terminal où Docker tourne

### Méthode 2 : Script PowerShell
```powershell
.\arreter_docker.ps1
```

### Méthode 3 : Commande manuelle
```bash
docker-compose down
```

---

## 🔧 Problèmes courants

### ❌ "Port 3001 is already in use"

**Solution** :
```bash
# Arrêter Docker
docker-compose down

# Vérifier quel processus utilise le port
netstat -ano | findstr :3001

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F

# Redémarrer
docker-compose up --build
```

### ❌ "Cannot connect to Docker daemon"

**Solution** :
1. Ouvrir Docker Desktop
2. Attendre qu'il soit complètement démarré (icône verte)
3. Réessayer

### ❌ "Frontend ne charge pas"

**Solution** :
1. Vérifier que vous utilisez http://localhost:**3001** (pas 3000)
2. Vider le cache du navigateur (Ctrl+Shift+Delete)
3. Ouvrir la console du navigateur (F12) pour voir les erreurs

### ❌ "Backend ne répond pas"

**Solution** :
1. Vérifier les logs : `docker-compose logs backend`
2. Attendre que MySQL soit prêt (peut prendre 10-20 secondes)
3. Vérifier que le backend a bien démarré : chercher "Started EmployeeManagementApplication"

### ❌ "MySQL connection refused"

**Solution** :
1. Vérifier les logs : `docker-compose logs mysql`
2. Attendre le message "ready for connections"
3. Si le problème persiste, redémarrer : `docker-compose restart mysql`

---

## 🔄 Après modification du code

### Frontend modifié
```bash
docker-compose up --build frontend
```

### Backend modifié
```bash
docker-compose up --build backend
```

### Les deux modifiés
```bash
docker-compose up --build
```

---

## 📝 Notes importantes

1. **Première connexion** : Un OTP sera envoyé par email
2. **Connexions suivantes** : Connexion directe sans OTP
3. **Données persistantes** : Les données MySQL sont sauvegardées dans un volume Docker
4. **Suppression des données** : `docker-compose down -v` (⚠️ ATTENTION : supprime tout)

---

## 🆘 Besoin d'aide ?

1. Consulter `DOCKER_COMMANDES.md` pour plus de commandes
2. Vérifier les logs : `docker-compose logs -f`
3. Redémarrer Docker Desktop
4. Redémarrer Windows en dernier recours

---

## ✅ Checklist de démarrage

- [ ] Docker Desktop est ouvert et en cours d'exécution
- [ ] Les ports 3001, 8081, 3307 sont disponibles
- [ ] Vous êtes dans le dossier du projet (`C:\Users\smail\Desktop\pfE`)
- [ ] Vous avez exécuté `docker-compose up --build`
- [ ] Vous avez attendu ~30 secondes
- [ ] Vous pouvez accéder à http://localhost:3001
- [ ] Vous pouvez vous connecter avec les identifiants admin

---

**Bon développement ! 🚀**
