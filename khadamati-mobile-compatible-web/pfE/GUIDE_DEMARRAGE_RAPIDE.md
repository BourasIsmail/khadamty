# 🚀 Guide de Démarrage Rapide - Khadamati

## ✅ Services Démarrés

Tous les services Docker sont maintenant opérationnels :

| Service | URL | Port |
|---------|-----|------|
| **Frontend (Next.js)** | http://localhost:3001 | 3001 |
| **Backend (Spring Boot)** | http://localhost:8081/api | 8081 |
| **Base de données (MySQL)** | localhost:3307 | 3307 |

## 🔐 Accès à l'Application

### 1. Ouvrir l'application
Accédez à : **http://localhost:3001/login**

### 2. Comptes de test disponibles

#### Administrateur
- **Email** : `ismailelrhazoui21@gmail.com`
- **Mot de passe** : `smail1234`
- **Rôle** : ADMIN (accès complet)

#### RH (Ressources Humaines)
- **Email** : `ismailelrhazoui2003@gmail.com`
- **Mot de passe** : `password123`
- **Rôle** : RH (gestion des employés et demandes)

#### Employés
- **Email** : `employee@demo.com`
- **Mot de passe** : `password123`
- **Rôle** : EMPLOYEE (accès employé standard)

Autres comptes employés disponibles :
- `sophie.bernard@demo.com` / `password123`
- `pierre.durand@demo.com` / `password123`
- `marie.leroy@demo.com` / `password123`
- `paul.moreau@demo.com` / `password123`

## 🛠️ Commandes Docker Utiles

### Démarrer les services
```bash
docker-compose up -d
```

### Arrêter les services
```bash
docker-compose down
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Backend uniquement
docker-compose logs -f backend

# Frontend uniquement
docker-compose logs -f frontend
```

### Redémarrer un service
```bash
# Redémarrer le backend
docker-compose restart backend

# Redémarrer le frontend
docker-compose restart frontend
```

### Reconstruire et redémarrer
```bash
docker-compose up --build -d
```

## 📊 Vérifier l'état des services

### Vérifier les conteneurs en cours
```bash
docker ps
```

### Vérifier les logs du backend
```bash
docker logs khadamati-backend
```

### Vérifier les logs du frontend
```bash
docker logs khadamati-frontend
```

## 🔍 Résolution de Problèmes

### Erreur "Failed to fetch"
- ✅ Vérifiez que vous accédez à **http://localhost:3001** (pas 3000)
- ✅ Vérifiez que le backend est démarré : `docker logs khadamati-backend`
- ✅ Vérifiez que MySQL est prêt : `docker logs khadamati-mysql`

### Port déjà utilisé
Si un port est déjà utilisé, arrêtez le processus :
```bash
# Trouver le processus sur le port 3001
netstat -ano | findstr ":3001"

# Arrêter le processus (remplacez PID par le numéro trouvé)
Stop-Process -Id PID -Force
```

### Réinitialiser complètement
```bash
# Arrêter et supprimer tous les conteneurs et volumes
docker-compose down -v

# Reconstruire et redémarrer
docker-compose up --build -d
```

## 🌐 URLs de l'API

### Documentation API (Swagger)
http://localhost:8081/api/swagger-ui.html

### Endpoints principaux
- **Authentification** : http://localhost:8081/api/auth/login
- **Employés** : http://localhost:8081/api/employees
- **Présences** : http://localhost:8081/api/attendance
- **Admin** : http://localhost:8081/api/admin

## 📝 Notes Importantes

1. **Port Frontend** : Le frontend Docker tourne sur le port **3001** (pas 3000)
2. **Port Backend** : Le backend tourne sur le port **8081** (pas 8080)
3. **Port MySQL** : MySQL tourne sur le port **3307** (pas 3306)

Ces ports ont été modifiés pour éviter les conflits avec d'autres services locaux.

## 🎯 Prochaines Étapes

1. ✅ Accédez à http://localhost:3001/login
2. ✅ Connectez-vous avec un compte de test
3. ✅ Explorez le tableau de bord
4. ✅ Testez les différentes fonctionnalités

## 💡 Conseils

- Utilisez **Chrome** ou **Firefox** pour une meilleure expérience
- Ouvrez la console développeur (F12) pour voir les logs
- Les données sont persistées dans un volume Docker (mysql_data)

---

**Besoin d'aide ?** Consultez les logs avec `docker-compose logs -f`
