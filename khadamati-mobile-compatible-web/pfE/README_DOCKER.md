# 🐳 README Docker - Khadamati

## 🎯 Démarrage Ultra-Rapide

```powershell
# 1. Naviguer vers le projet
cd C:\Users\smail\Desktop\pfE

# 2. Démarrer tous les services
docker-compose up --build

# 3. Ouvrir l'application
# http://localhost:3001
```

---

## 📋 Prérequis

- ✅ Docker Desktop installé et en cours d'exécution
- ✅ Ports disponibles : 3001, 8081, 3307

---

## 🌐 URLs d'accès

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3001 | 3001 |
| **Backend API** | http://localhost:8081/api | 8081 |
| **MySQL** | localhost:3307 | 3307 |

---

## 🔐 Comptes de test

### Administrateur
```
Email       : ismailelrhazoui954@gmail.com
Mot de passe: 888888
```

### RH
```
Email       : rh@khadamati.com
Mot de passe: 123456
```

### Employé
```
Email       : employee@khadamati.com
Mot de passe: 123456
```

---

## 🚀 Commandes essentielles

### Démarrer
```powershell
docker-compose up --build
```

### Démarrer en arrière-plan
```powershell
docker-compose up -d
```

### Arrêter
```powershell
docker-compose down
```

### Voir les logs
```powershell
docker-compose logs -f
```

### Redémarrer un service
```powershell
docker-compose restart frontend
docker-compose restart backend
docker-compose restart mysql
```

---

## 🔧 Configuration

### Ports

| Service | Port Interne | Port Externe |
|---------|--------------|--------------|
| Frontend | 3000 | 3001 |
| Backend | 8080 | 8081 |
| MySQL | 3306 | 3307 |

### Variables d'environnement

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

#### Backend
```env
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/khadamati_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=2003
```

#### MySQL
```env
MYSQL_ROOT_PASSWORD=2003
MYSQL_DATABASE=khadamati_db
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         docker-compose.yml              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  MySQL   │  │ Backend  │  │Frontend││
│  │  :3307   │←─│  :8081   │←─│ :3001  ││
│  └──────────┘  └──────────┘  └────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### Services

1. **MySQL** (khadamati-mysql)
   - Image : `mysql:8.0`
   - Port : 3307:3306
   - Volume : `mysql_data`
   - Healthcheck : Vérifie la connexion

2. **Backend** (khadamati-backend)
   - Build : `./spring-backend`
   - Port : 8081:8080
   - Dépend de : MySQL
   - Profile : `docker`

3. **Frontend** (khadamati-frontend)
   - Build : `./frontend`
   - Port : 3001:3000
   - Dépend de : Backend
   - Mode : `standalone`

---

## 🔄 Workflow de développement

### Modifier le code Frontend

```powershell
# 1. Modifier les fichiers dans frontend/
# 2. Reconstruire
docker-compose up --build frontend
```

### Modifier le code Backend

```powershell
# 1. Modifier les fichiers dans spring-backend/
# 2. Reconstruire
docker-compose up --build backend
```

### Modifier docker-compose.yml

```powershell
# 1. Modifier docker-compose.yml
# 2. Arrêter et redémarrer
docker-compose down
docker-compose up --build
```

---

## 🗄️ Gestion de la base de données

### Se connecter à MySQL

#### Depuis l'extérieur
```
Host    : localhost
Port    : 3307
User    : root
Password: 2003
Database: khadamati_db
```

#### Depuis un conteneur
```powershell
docker exec -it khadamati-mysql mysql -uroot -p2003 khadamati_db
```

### Sauvegarder la base de données

```powershell
docker exec khadamati-mysql mysqldump -uroot -p2003 khadamati_db > backup.sql
```

### Restaurer la base de données

```powershell
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup.sql
```

---

## 🔍 Monitoring

### Voir l'état des conteneurs

```powershell
docker-compose ps
```

### Voir l'utilisation des ressources

```powershell
docker stats
```

### Voir les logs d'un service spécifique

```powershell
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

---

## 🛠️ Dépannage

### Port déjà utilisé

```powershell
# Arrêter Docker
docker-compose down

# Vérifier les ports
netstat -ano | findstr :3001
netstat -ano | findstr :8081
netstat -ano | findstr :3307

# Tuer le processus si nécessaire
taskkill /PID <PID> /F

# Redémarrer
docker-compose up --build
```

### MySQL ne démarre pas

```powershell
# Vérifier les logs
docker-compose logs mysql

# Attendre le message "ready for connections"
```

### Frontend ne se connecte pas au Backend

1. Vérifier que le backend est démarré
2. Vérifier l'URL : http://localhost:3001
3. Ouvrir la console du navigateur (F12)
4. Vérifier les erreurs CORS

### Docker Desktop ne démarre pas

1. Redémarrer Docker Desktop
2. Redémarrer Windows
3. Vérifier que la virtualisation est activée dans le BIOS

---

## 🧹 Nettoyage

### Arrêter et supprimer les conteneurs

```powershell
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ SUPPRIME LES DONNÉES)

```powershell
docker-compose down -v
```

### Nettoyer les images inutilisées

```powershell
docker image prune -a
```

### Nettoyer tout Docker

```powershell
docker system prune -a --volumes
```

---

## 📚 Documentation complète

### 🚀 Démarrage
- **[QUE_FAIRE_MAINTENANT.md](QUE_FAIRE_MAINTENANT.md)** - Guide en 5 étapes
- **[COMMENCEZ_PAR_ICI.md](COMMENCEZ_PAR_ICI.md)** - Guide en 3 étapes
- **[DEMARRAGE_VISUEL.md](DEMARRAGE_VISUEL.md)** - Guide avec schémas

### 📖 Guides
- **[GUIDE_DEMARRAGE_DOCKER.md](GUIDE_DEMARRAGE_DOCKER.md)** - Guide complet
- **[DOCKER_COMMANDES.md](DOCKER_COMMANDES.md)** - Référence des commandes
- **[INSTRUCTIONS_DEMARRAGE.md](INSTRUCTIONS_DEMARRAGE.md)** - Instructions détaillées

### 🔧 Technique
- **[RESUME_CORRECTIONS_DOCKER.md](RESUME_CORRECTIONS_DOCKER.md)** - Corrections
- **[SESSION_11_MAI_2026.md](SESSION_11_MAI_2026.md)** - Résumé de la session
- **[FICHIERS_CREES_AUJOURD_HUI.md](FICHIERS_CREES_AUJOURD_HUI.md)** - Liste des fichiers

### 📚 Index
- **[INDEX_DOCUMENTATION_DOCKER.md](INDEX_DOCUMENTATION_DOCKER.md)** - Index complet
- **[RESUME_FINAL.md](RESUME_FINAL.md)** - Résumé final

---

## ✅ Checklist de démarrage

- [ ] Docker Desktop ouvert et vert
- [ ] PowerShell ouvert dans le bon dossier
- [ ] `docker-compose up --build` exécuté
- [ ] Attendu 30-60 secondes
- [ ] Messages "ready", "Started", "Ready" visibles
- [ ] http://localhost:3001 accessible
- [ ] Connexion réussie

---

## 🎯 Résumé

### ✅ Ce qui fonctionne

- ✅ Docker Desktop configuré
- ✅ MySQL sur le port 3307
- ✅ Backend sur le port 8081
- ✅ Frontend sur le port 3001
- ✅ CORS configuré correctement
- ✅ OTP pour la première connexion
- ✅ Connexion directe ensuite
- ✅ Nouveaux comptes fonctionnent

### 📊 Statistiques

- **Services** : 3 (MySQL, Backend, Frontend)
- **Ports** : 3001, 8081, 3307
- **Volumes** : 1 (mysql_data)
- **Réseaux** : 1 (default)

---

## 📝 Notes importantes

1. **Toujours utiliser `--build`** la première fois ou après modification
2. **Attendre 30-60 secondes** au démarrage
3. **Port 3001** pour le frontend (pas 3000)
4. **Port 8081** pour le backend (pas 8080)
5. **Port 3307** pour MySQL (pas 3306)
6. **Ne jamais utiliser** `docker-compose down -v` sauf si vous voulez supprimer les données

---

## 🚀 Prochaines étapes

1. **Démarrer** : `docker-compose up --build`
2. **Tester** : http://localhost:3001
3. **Développer** : Modifier le code et reconstruire
4. **Déployer** : Préparer pour la production

---

**Date** : 11 Mai 2026  
**Version** : 1.0  
**Statut** : ✅ Opérationnel

---

**Bon développement ! 🎉**
