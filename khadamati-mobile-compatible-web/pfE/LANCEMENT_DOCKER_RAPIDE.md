# 🐳 LANCEMENT DOCKER - GUIDE RAPIDE

## Démarrer le Projet en 1 Minute avec Docker

---

## ⚡ COMMANDE UNIQUE

```bash
docker-compose up -d
```

**C'est tout !** 🎉

---

## ✅ CE QUI EST DÉMARRÉ

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES DOCKER                          │
└─────────────────────────────────────────────────────────────┘

🗄️  MySQL
   • Port : 3307
   • User : root
   • Password : 2003
   • Database : khadamati_db

🔧 Backend Spring Boot
   • Port : 8081
   • API : http://localhost:8081/api

🎨 Frontend Next.js
   • Port : 3000
   • URL : http://localhost:3000
```

---

## 🔍 VÉRIFIER L'ÉTAT

```bash
# Voir les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## 🌐 ACCÉDER AU PROJET

### Frontend (Interface Web)
```
http://localhost:3000
```

### Backend (API REST)
```
http://localhost:8081/api
```

### Exemples d'Endpoints
```
http://localhost:8081/api/grades
http://localhost:8081/api/structures
http://localhost:8081/api/salaires
http://localhost:8081/api/annonces
```

---

## 🛑 ARRÊTER LE PROJET

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (ATTENTION : perte de données)
docker-compose down -v
```

---

## 🔄 REDÉMARRER

```bash
# Redémarrer tout
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
docker-compose restart frontend
```

---

## 🔧 COMMANDES UTILES

### Reconstruire les Images
```bash
# Reconstruire et redémarrer
docker-compose up -d --build

# Reconstruire un service spécifique
docker-compose build backend
docker-compose up -d backend
```

### Voir les Logs en Temps Réel
```bash
# Tous les services
docker-compose logs -f

# Backend seulement
docker-compose logs -f backend

# Frontend seulement
docker-compose logs -f frontend
```

### Accéder à un Conteneur
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql bash
```

---

## 🗄️ ACCÉDER À LA BASE DE DONNÉES

### Depuis la Ligne de Commande
```bash
docker-compose exec mysql mysql -uroot -p2003 khadamati_db
```

### Depuis MySQL Workbench
```
Host: localhost
Port: 3307
User: root
Password: 2003
Database: khadamati_db
```

### Requêtes Utiles
```sql
-- Voir les tables
SHOW TABLES;

-- Vérifier les grades
SELECT * FROM grade LIMIT 5;

-- Vérifier les structures
SELECT * FROM structure LIMIT 5;

-- Vérifier les employés
SELECT * FROM employees LIMIT 5;
```

---

## 🐛 DÉPANNAGE

### Les Services ne Démarrent Pas

```bash
# Voir les logs d'erreur
docker-compose logs

# Redémarrer tout
docker-compose down
docker-compose up -d

# Reconstruire tout
docker-compose down
docker-compose build
docker-compose up -d
```

### Port Déjà Utilisé

```bash
# Vérifier les ports
netstat -ano | findstr :3000
netstat -ano | findstr :8081
netstat -ano | findstr :3307

# Arrêter les processus ou changer les ports dans docker-compose.yml
```

### Erreur de Connexion à la Base de Données

```bash
# Vérifier que MySQL est démarré
docker-compose ps mysql

# Voir les logs MySQL
docker-compose logs mysql

# Redémarrer MySQL
docker-compose restart mysql
```

### Le Frontend ne se Connecte pas au Backend

```bash
# Vérifier que le backend est démarré
docker-compose ps backend

# Voir les logs backend
docker-compose logs backend

# Vérifier l'URL dans frontend/lib/api.ts
# Doit être : http://localhost:8081/api
```

---

## 📊 MONITORING

### Voir l'Utilisation des Ressources
```bash
docker stats
```

### Voir les Volumes
```bash
docker volume ls
```

### Nettoyer les Ressources Inutilisées
```bash
# Nettoyer les images
docker image prune -a

# Nettoyer les volumes
docker volume prune

# Nettoyer tout
docker system prune -a
```

---

## 🔄 MISE À JOUR DU CODE

### Après Modification du Code

```bash
# Backend
docker-compose build backend
docker-compose up -d backend

# Frontend
docker-compose build frontend
docker-compose up -d frontend

# Tout
docker-compose build
docker-compose up -d
```

---

## 📋 CHECKLIST

### Première Utilisation
- [ ] Docker Desktop installé et démarré
- [ ] Ports 3000, 8081, 3307 disponibles
- [ ] Exécuter `docker-compose up -d`
- [ ] Attendre 2-3 minutes
- [ ] Vérifier avec `docker-compose ps`
- [ ] Ouvrir http://localhost:3000
- [ ] Se connecter et tester

### Utilisation Quotidienne
- [ ] Docker Desktop démarré
- [ ] Exécuter `docker-compose up -d`
- [ ] Ouvrir http://localhost:3000

### Arrêt
- [ ] Exécuter `docker-compose down`

---

## 💡 CONSEILS

### Performance
- ✅ Allouer au moins 4 GB de RAM à Docker Desktop
- ✅ Activer WSL 2 sur Windows pour de meilleures performances
- ✅ Utiliser des volumes pour les données persistantes

### Développement
- ✅ Utiliser `docker-compose logs -f` pour voir les logs en temps réel
- ✅ Utiliser `docker-compose restart` pour redémarrer rapidement
- ✅ Reconstruire après modification du code

### Production
- ✅ Changer les mots de passe par défaut
- ✅ Utiliser des variables d'environnement
- ✅ Configurer les backups automatiques
- ✅ Utiliser un reverse proxy (Nginx)

---

## 🎯 RÉSUMÉ DES COMMANDES

```bash
# Démarrer
docker-compose up -d

# Voir l'état
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Reconstruire
docker-compose build
docker-compose up -d --build

# Nettoyer
docker-compose down -v
```

---

## 🌐 URLS IMPORTANTES

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8081/api |
| **MySQL** | localhost:3307 |

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :
- **DEMARRAGE_DOCKER.md** - Guide Docker complet
- **COMMENCEZ_PAR_LIRE_CECI.md** - Guide général
- **GUIDE_TEST_RAPIDE.md** - Guide de test

---

## 🎉 C'EST TOUT !

Le projet est maintenant accessible sur **http://localhost:3000**

**Bon développement !** 🚀

---

*Pour arrêter : `docker-compose down`*
