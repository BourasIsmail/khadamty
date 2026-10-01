# 🐳 Commandes Docker pour Khadamati

## 📋 Commandes Essentielles

### 1️⃣ Démarrer tous les services
```bash
docker-compose up --build
```
> ⚠️ Utilisez `--build` la première fois ou après modification du code

### 2️⃣ Démarrer en arrière-plan (mode détaché)
```bash
docker-compose up -d
```

### 3️⃣ Arrêter tous les services
```bash
docker-compose down
```

### 4️⃣ Arrêter et supprimer les volumes (⚠️ SUPPRIME LES DONNÉES)
```bash
docker-compose down -v
```

### 5️⃣ Voir les logs en temps réel
```bash
docker-compose logs -f
```

### 6️⃣ Voir les logs d'un service spécifique
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

### 7️⃣ Redémarrer un service spécifique
```bash
docker-compose restart frontend
docker-compose restart backend
```

### 8️⃣ Reconstruire un service spécifique
```bash
docker-compose up --build frontend
docker-compose up --build backend
```

---

## 🌐 URLs d'accès

| Service | URL | Port Interne | Port Externe |
|---------|-----|--------------|--------------|
| **Frontend** | http://localhost:3001 | 3000 | 3001 |
| **Backend API** | http://localhost:8081/api | 8080 | 8081 |
| **MySQL** | localhost:3307 | 3306 | 3307 |

---

## 🔧 Dépannage

### Problème : "Port already in use"
```bash
# Arrêter tous les conteneurs
docker-compose down

# Vérifier les ports utilisés
netstat -ano | findstr :3001
netstat -ano | findstr :8081
netstat -ano | findstr :3307

# Tuer le processus si nécessaire (remplacer PID par le numéro)
taskkill /PID <PID> /F
```

### Problème : "Cannot connect to MySQL"
```bash
# Vérifier que MySQL est prêt
docker-compose logs mysql

# Attendre le message : "ready for connections"
```

### Problème : Frontend ne se connecte pas au Backend
1. Vérifier que le backend est démarré : `docker-compose logs backend`
2. Vérifier l'URL dans le navigateur : http://localhost:3001
3. Ouvrir la console du navigateur (F12) pour voir les erreurs

### Problème : "Docker Desktop ne démarre pas"
1. Redémarrer Docker Desktop
2. Si ça ne marche pas, redémarrer Windows
3. Vérifier que la virtualisation est activée dans le BIOS

---

## 🗄️ Gestion de la base de données

### Se connecter à MySQL depuis l'extérieur
```
Host: localhost
Port: 3307
User: root
Password: 2003
Database: khadamati_db
```

### Se connecter à MySQL depuis un conteneur
```bash
docker exec -it khadamati-mysql mysql -uroot -p2003 khadamati_db
```

### Sauvegarder la base de données
```bash
docker exec khadamati-mysql mysqldump -uroot -p2003 khadamati_db > backup.sql
```

### Restaurer la base de données
```bash
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup.sql
```

---

## 🚀 Workflow de développement

### Après modification du code Frontend
```bash
docker-compose up --build frontend
```

### Après modification du code Backend
```bash
docker-compose up --build backend
```

### Après modification de docker-compose.yml
```bash
docker-compose down
docker-compose up --build
```

---

## 📊 Commandes de monitoring

### Voir l'état des conteneurs
```bash
docker-compose ps
```

### Voir l'utilisation des ressources
```bash
docker stats
```

### Voir les images Docker
```bash
docker images
```

### Nettoyer les images inutilisées
```bash
docker image prune -a
```

---

## ⚠️ IMPORTANT

- **Ne jamais utiliser** `docker-compose down -v` sauf si vous voulez supprimer toutes les données
- **Toujours attendre** que MySQL soit prêt avant que le backend démarre
- **Le frontend** doit être accessible sur http://localhost:3001 (pas 3000)
- **Le backend** doit être accessible sur http://localhost:8081/api (pas 8080)
