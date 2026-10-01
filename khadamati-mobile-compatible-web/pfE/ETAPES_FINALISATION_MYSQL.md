# 🔧 Étapes de Finalisation - Migration MySQL

## ✅ Ce qui a été fait

### 1. **Migration du Code** ✅
- ✅ Toutes les entités converties de MongoDB vers JPA
- ✅ Tous les repositories convertis vers JpaRepository
- ✅ Tous les contrôleurs mis à jour pour utiliser Long au lieu de String
- ✅ Compilation Maven réussie

### 2. **Configuration MySQL** ⚠️ EN COURS
- ✅ Port MySQL détecté : **3306**
- ✅ MySQL en cours d'exécution
- ✅ Base de données `khadamati_db` créée
- ❌ **PROBLÈME** : Mot de passe MySQL incorrect

## 🚨 Problème Actuel

**Erreur** : `Access denied for user 'root'@'localhost'`

Le backend ne peut pas se connecter à MySQL car le mot de passe dans `application.yml` n'est pas correct.

## 🔑 Solution : Trouver le Mot de Passe MySQL

### Option 1 : Vérifier dans MySQL Workbench
1. Ouvrez **MySQL Workbench**
2. Regardez votre connexion active
3. Le mot de passe utilisé pour cette connexion est celui qu'il faut mettre dans `application.yml`

### Option 2 : Réinitialiser le Mot de Passe MySQL
Si vous ne connaissez pas le mot de passe, vous pouvez le réinitialiser :

```sql
-- Dans MySQL Workbench, exécutez :
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau_mot_de_passe';
FLUSH PRIVILEGES;
```

### Option 3 : Créer un Nouvel Utilisateur
Créez un utilisateur spécifique pour l'application :

```sql
-- Dans MySQL Workbench :
CREATE USER 'khadamati'@'localhost' IDENTIFIED BY 'khadamati123';
GRANT ALL PRIVILEGES ON khadamati_db.* TO 'khadamati'@'localhost';
FLUSH PRIVILEGES;
```

Puis modifiez `spring-backend/src/main/resources/application.yml` :
```yaml
spring:
  datasource:
    username: khadamati
    password: khadamati123
```

## 📝 Fichier à Modifier

**Fichier** : `spring-backend/src/main/resources/application.yml`

**Ligne à modifier** (ligne 9) :
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/khadamati_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password:  # ← METTRE LE MOT DE PASSE ICI
```

## 🎯 Prochaines Étapes (après correction du mot de passe)

### 1. Redémarrer le Backend
```bash
cd spring-backend
mvn spring-boot:run
```

### 2. Vérifier les Tables Créées
Dans MySQL Workbench :
```sql
USE khadamati_db;
SHOW TABLES;
```

Vous devriez voir 5 tables :
- `users`
- `employees`
- `attendance`
- `leave_requests`
- `document_requests`

### 3. Créer un Compte de Test
```bash
# Utiliser l'endpoint /auth/register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "Test",
    "phone": "0612345678",
    "department": "IT",
    "position": "Administrateur",
    "hireDate": "2024-01-01",
    "role": "ADMIN"
  }'
```

### 4. Tester la Connexion Frontend
1. Démarrer le frontend : `cd frontend && npm run dev`
2. Ouvrir http://localhost:3000
3. Se connecter avec le compte créé

## 📊 État de la Base de Données

**Base de données** : `khadamati_db` ✅ EXISTE
**Tables** : ⏳ EN ATTENTE (seront créées automatiquement au démarrage du backend)
**Données** : ⏳ EN ATTENTE (à créer via /auth/register)

## 🔍 Vérification de la Configuration Actuelle

**Port MySQL** : 3306 ✅
**Nom de la base** : khadamati_db ✅
**Utilisateur** : root ✅
**Mot de passe** : ❌ À CORRIGER

## 💡 Commandes Utiles

### Vérifier MySQL
```bash
# Vérifier si MySQL est en cours d'exécution
Get-Process -Name mysqld

# Vérifier le port
netstat -ano | Select-String ":3306"
```

### Compiler le Backend
```bash
cd spring-backend
mvn clean compile
```

### Démarrer le Backend
```bash
cd spring-backend
mvn spring-boot:run
```

### Voir les Logs en Direct
Les logs s'affichent automatiquement dans le terminal où vous avez lancé `mvn spring-boot:run`

## ✅ Checklist Finale

- [x] Code migré vers JPA
- [x] Compilation Maven réussie
- [x] MySQL en cours d'exécution
- [x] Base de données créée
- [ ] **Mot de passe MySQL configuré** ← ÉTAPE ACTUELLE
- [ ] Backend démarré avec succès
- [ ] Tables créées automatiquement
- [ ] Compte de test créé
- [ ] Frontend connecté au backend
- [ ] Test de connexion réussi

---

## 🆘 Besoin d'Aide ?

**Question** : Quel est le mot de passe MySQL que vous utilisez dans MySQL Workbench ?

Une fois que vous me donnez le mot de passe, je pourrai :
1. Mettre à jour `application.yml`
2. Redémarrer le backend
3. Vérifier que les tables sont créées
4. Créer un compte de test
5. Tester la connexion complète

**Prêt à continuer dès que vous me donnez le mot de passe MySQL !** 🚀
