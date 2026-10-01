# 🐳 DÉMARRAGE AVEC DOCKER

## Guide Complet pour Démarrer le Projet avec Docker

---

## 🎯 PRÉREQUIS

- ✅ Docker Desktop installé
- ✅ Docker Compose installé
- ✅ Ports disponibles : 3000, 8081, 3307

---

## 🚀 DÉMARRAGE RAPIDE

### Option 1 : Tout Démarrer en Une Commande

```bash
docker-compose up -d
```

✅ Cette commande démarre :
- MySQL (port 3307)
- Backend Spring Boot (port 8081)
- Frontend Next.js (port 3000)

### Option 2 : Démarrer Séparément

```bash
# 1. Base de données
docker-compose up -d mysql

# 2. Backend
docker-compose up -d backend

# 3. Frontend
docker-compose up -d frontend
```

---

## 📊 VÉRIFIER L'ÉTAT

### Voir les Conteneurs en Cours d'Exécution
```bash
docker-compose ps
```

### Voir les Logs

```bash
# Tous les services
docker-compose logs -f

# Backend seulement
docker-compose logs -f backend

# Frontend seulement
docker-compose logs -f frontend

# MySQL seulement
docker-compose logs -f mysql
```

---

## 🌐 ACCÈS AUX SERVICES

### Frontend
```
http://localhost:3000
```

### Backend API
```
http://localhost:8081/api
```

### Base de Données MySQL
```
Host: localhost
Port: 3307
User: root
Password: 2003
Database: khadamati_db
```

---

## 🛑 ARRÊTER LES SERVICES

### Arrêter Tous les Services
```bash
docker-compose down
```

### Arrêter et Supprimer les Volumes
```bash
docker-compose down -v
```

### Arrêter un Service Spécifique
```bash
docker-compose stop backend
docker-compose stop frontend
docker-compose stop mysql
```

---

## 🔄 REDÉMARRER LES SERVICES

### Redémarrer Tous les Services
```bash
docker-compose restart
```

### Redémarrer un Service Spécifique
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

---

## 🔧 COMMANDES UTILES

### Reconstruire les Images
```bash
# Reconstruire tout
docker-compose build

# Reconstruire un service spécifique
docker-compose build backend
docker-compose build frontend
```

### Reconstruire et Redémarrer
```bash
docker-compose up -d --build
```

### Voir les Images
```bash
docker images
```

### Nettoyer les Images Inutilisées
```bash
docker image prune -a
```

---

## 🐛 DÉPANNAGE

### Le Backend ne Démarre Pas

```bash
# Voir les logs
docker-compose logs backend

# Redémarrer le backend
docker-compose restart backend

# Reconstruire le backend
docker-compose build backend
docker-compose up -d backend
```

### Le Frontend ne Démarre Pas

```bash
# Voir les logs
docker-compose logs frontend

# Redémarrer le frontend
docker-compose restart frontend

# Reconstruire le frontend
docker-compose build frontend
docker-compose up -d frontend
```

### MySQL ne Démarre Pas

```bash
# Voir les logs
docker-compose logs mysql

# Redémarrer MySQL
docker-compose restart mysql

# Supprimer et recréer
docker-compose down -v
docker-compose up -d mysql
```

### Erreur de Port Déjà Utilisé

```bash
# Vérifier les ports utilisés
netstat -ano | findstr :3000
netstat -ano | findstr :8081
netstat -ano | findstr :3307

# Arrêter le processus qui utilise le port
# Ou changer le port dans docker-compose.yml
```

---

## 📝 ACCÉDER AUX CONTENEURS

### Accéder au Conteneur Backend
```bash
docker-compose exec backend bash
```

### Accéder au Conteneur Frontend
```bash
docker-compose exec frontend sh
```

### Accéder au Conteneur MySQL
```bash
docker-compose exec mysql bash

# Se connecter à MySQL
docker-compose exec mysql mysql -uroot -p2003 khadamati_db
```

---

## 🔍 VÉRIFIER LES DONNÉES

### Vérifier la Base de Données

```bash
# Se connecter à MySQL
docker-compose exec mysql mysql -uroot -p2003 khadamati_db

# Lister les tables
SHOW TABLES;

# Vérifier une table
SELECT * FROM grade LIMIT 5;
SELECT * FROM structure LIMIT 5;
SELECT * FROM employees LIMIT 5;

# Quitter
exit
```

---

## 🔄 MISE À JOUR DU CODE

### Après Modification du Backend

```bash
# Reconstruire et redémarrer
docker-compose build backend
docker-compose up -d backend

# Voir les logs
docker-compose logs -f backend
```

### Après Modification du Frontend

```bash
# Reconstruire et redémarrer
docker-compose build frontend
docker-compose up -d frontend

# Voir les logs
docker-compose logs -f frontend
```

### Après Modification de la Base de Données

```bash
# Arrêter MySQL
docker-compose stop mysql

# Supprimer le volume (ATTENTION : perte de données)
docker-compose down -v

# Redémarrer
docker-compose up -d mysql

# Exécuter les migrations
docker-compose exec mysql mysql -uroot -p2003 khadamati_db < database/ajout_fonctionnalites_tawassol.sql
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

### Voir les Réseaux

```bash
docker network ls
```

---

## 🧪 TESTS

### Tester le Backend

```bash
# Vérifier que le backend répond
curl http://localhost:8081/api/grades

# Ou avec PowerShell
Invoke-WebRequest -Uri http://localhost:8081/api/grades
```

### Tester le Frontend

```bash
# Ouvrir dans le navigateur
start http://localhost:3000

# Ou
explorer http://localhost:3000
```

### Tester MySQL

```bash
# Se connecter
docker-compose exec mysql mysql -uroot -p2003 -e "SELECT COUNT(*) FROM khadamati_db.grade;"
```

---

## 🔐 SÉCURITÉ

### Changer les Mots de Passe

Modifier dans `docker-compose.yml` :

```yaml
environment:
  MYSQL_ROOT_PASSWORD: nouveau_mot_de_passe
  MYSQL_PASSWORD: nouveau_mot_de_passe
```

Puis reconstruire :

```bash
docker-compose down -v
docker-compose up -d
```

---

## 📦 BACKUP ET RESTORE

### Backup de la Base de Données

```bash
# Créer un backup
docker-compose exec mysql mysqldump -uroot -p2003 khadamati_db > backup_$(date +%Y%m%d).sql

# Ou avec PowerShell
docker-compose exec mysql mysqldump -uroot -p2003 khadamati_db > backup.sql
```

### Restore de la Base de Données

```bash
# Restaurer un backup
docker-compose exec -T mysql mysql -uroot -p2003 khadamati_db < backup.sql
```

---

## 🚀 DÉPLOIEMENT EN PRODUCTION

### Préparer pour la Production

1. **Modifier docker-compose.yml** :
   - Changer les mots de passe
   - Configurer les variables d'environnement
   - Ajouter les volumes persistants

2. **Builder les images** :
```bash
docker-compose build
```

3. **Démarrer en mode production** :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 💡 CONSEILS

### Performance

- ✅ Allouer plus de mémoire à Docker Desktop
- ✅ Utiliser des volumes pour les données persistantes
- ✅ Nettoyer régulièrement les images inutilisées

### Développement

- ✅ Utiliser `docker-compose logs -f` pour voir les logs en temps réel
- ✅ Utiliser `docker-compose restart` pour redémarrer rapidement
- ✅ Utiliser des volumes pour le hot-reload

### Production

- ✅ Utiliser des secrets pour les mots de passe
- ✅ Configurer les health checks
- ✅ Utiliser un reverse proxy (Nginx)
- ✅ Configurer les backups automatiques

---

## 📋 CHECKLIST DE DÉMARRAGE

### Première Fois

- [ ] Docker Desktop installé et démarré
- [ ] Ports 3000, 8081, 3307 disponibles
- [ ] Fichier `docker-compose.yml` présent
- [ ] Exécuter `docker-compose up -d`
- [ ] Attendre que tous les services démarrent (~2-3 minutes)
- [ ] Vérifier avec `docker-compose ps`
- [ ] Ouvrir http://localhost:3000
- [ ] Se connecter et tester

### Démarrage Quotidien

- [ ] Docker Desktop démarré
- [ ] Exécuter `docker-compose up -d`
- [ ] Vérifier les logs si nécessaire
- [ ] Ouvrir http://localhost:3000

### Arrêt

- [ ] Sauvegarder les données importantes
- [ ] Exécuter `docker-compose down`
- [ ] Vérifier avec `docker-compose ps`

---

## 🎉 RÉSUMÉ

### Commandes Essentielles

```bash
# Démarrer tout
docker-compose up -d

# Voir l'état
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter tout
docker-compose down

# Redémarrer
docker-compose restart

# Reconstruire
docker-compose build
docker-compose up -d --build
```

### URLs

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:8081/api
- **MySQL** : localhost:3307

---

**Le projet est maintenant prêt à être utilisé avec Docker !** 🐳

**Bon développement !** 🚀
