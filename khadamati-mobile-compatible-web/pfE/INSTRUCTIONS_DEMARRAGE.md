# 🎯 INSTRUCTIONS DE DÉMARRAGE - KHADAMATI

## ⚠️ IMPORTANT : Changements effectués

J'ai corrigé 2 problèmes critiques :

### 1. Configuration Next.js
- ✅ Ajouté `output: 'standalone'` dans `next.config.js`
- ✅ Changé l'URL par défaut de 8080 à 8081

### 2. Configuration CORS Backend
- ✅ Ajouté `http://localhost:3001` aux origines autorisées
- ✅ Le backend accepte maintenant les requêtes depuis le port 3001

---

## 🚀 ÉTAPES DE DÉMARRAGE

### Étape 1 : Ouvrir Docker Desktop
1. Cliquer sur l'icône Docker Desktop
2. Attendre que l'icône devienne verte (Docker est prêt)

### Étape 2 : Ouvrir PowerShell
1. Appuyer sur `Windows + X`
2. Choisir "Windows PowerShell" ou "Terminal"
3. Naviguer vers le dossier du projet :
   ```powershell
   cd C:\Users\smail\Desktop\pfE
   ```

### Étape 3 : Arrêter les anciens conteneurs
```powershell
docker-compose down
```

### Étape 4 : Reconstruire et démarrer
```powershell
docker-compose up --build
```

⏳ **Attendez environ 30-60 secondes** que tous les services démarrent.

### Étape 5 : Vérifier les logs

Vous devriez voir ces messages :

```
✅ khadamati-mysql     | ready for connections
✅ khadamati-backend   | Started EmployeeManagementApplication
✅ khadamati-frontend  | Ready in XXXms
```

### Étape 6 : Ouvrir l'application

Ouvrir votre navigateur et aller sur :
```
http://localhost:3001
```

⚠️ **ATTENTION** : Utilisez le port **3001**, pas 3000 !

---

## 🔐 Connexion

### Première connexion
1. Email : `ismailelrhazoui954@gmail.com`
2. Mot de passe : `888888`
3. Vous recevrez un OTP par email
4. Entrer le code OTP

### Connexions suivantes
- Pas besoin d'OTP, connexion directe !

---

## 📱 Compte créé dans l'app

Si vous avez créé un compte via l'interface d'inscription :
- ✅ Le compte est valide
- ✅ À la première connexion, vous recevrez un OTP
- ✅ Après vérification OTP, les connexions suivantes seront directes

**Pas de problème !** Le système gère automatiquement le champ `email_verified`.

---

## 🛑 Arrêter Docker

### Option 1 : Dans le terminal
Appuyer sur `Ctrl+C`

### Option 2 : Commande
```powershell
docker-compose down
```

---

## ❓ Problèmes ?

### "Docker ne veut pas s'ouvrir"
1. Redémarrer Docker Desktop
2. Si ça ne marche pas, redémarrer Windows
3. Vérifier que la virtualisation est activée dans le BIOS

### "Port already in use"
```powershell
# Arrêter Docker
docker-compose down

# Vérifier les ports
netstat -ano | findstr :3001
netstat -ano | findstr :8081

# Tuer le processus si nécessaire
taskkill /PID <PID> /F
```

### "Frontend ne charge pas"
1. Vérifier l'URL : http://localhost:**3001**
2. Vider le cache : `Ctrl+Shift+Delete`
3. Ouvrir la console (F12) pour voir les erreurs

### "Cannot connect to backend"
1. Vérifier les logs : `docker-compose logs backend`
2. Attendre que MySQL soit prêt
3. Vérifier le message "Started EmployeeManagementApplication"

---

## 📊 Vérifier l'état

```powershell
# Voir les conteneurs en cours
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

---

## ✅ Checklist

- [ ] Docker Desktop est ouvert et vert
- [ ] PowerShell est ouvert dans `C:\Users\smail\Desktop\pfE`
- [ ] `docker-compose down` exécuté
- [ ] `docker-compose up --build` exécuté
- [ ] Attendu 30-60 secondes
- [ ] Ouvert http://localhost:3001
- [ ] Connexion réussie

---

**Tout est prêt ! Vous pouvez maintenant démarrer Docker. 🚀**
