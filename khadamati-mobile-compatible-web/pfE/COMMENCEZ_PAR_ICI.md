# 🎯 COMMENCEZ PAR ICI - Khadamati Docker

## 👋 Bienvenue !

Vous êtes sur le point de démarrer votre application Khadamati avec Docker.

---

## ⚡ Démarrage Ultra-Rapide (3 étapes)

### 1️⃣ Ouvrir Docker Desktop
- Cliquer sur l'icône Docker Desktop
- Attendre que l'icône devienne **verte** ✅

### 2️⃣ Ouvrir PowerShell et naviguer vers le projet
```powershell
cd C:\Users\smail\Desktop\pfE
```

### 3️⃣ Démarrer Docker
```powershell
docker-compose up --build
```

⏳ **Attendez 30-60 secondes...**

### 4️⃣ Ouvrir l'application
Ouvrir votre navigateur : **http://localhost:3001**

---

## 🎉 C'est tout !

Si tout fonctionne, vous devriez voir la page de connexion.

**Identifiants admin** :
- Email : `ismailelrhazoui954@gmail.com`
- Mot de passe : `888888`

---

## ❓ Ça ne marche pas ?

### Problème : Docker Desktop ne s'ouvre pas
**Solution** : Redémarrer Windows

### Problème : "Port already in use"
**Solution** :
```powershell
docker-compose down
docker-compose up --build
```

### Problème : Page blanche sur http://localhost:3001
**Solution** :
1. Attendre encore 30 secondes
2. Vérifier les logs : `docker-compose logs -f`
3. Chercher ces messages :
   - ✅ "ready for connections" (MySQL)
   - ✅ "Started EmployeeManagementApplication" (Backend)
   - ✅ "Ready in XXXms" (Frontend)

### Problème : "Cannot connect to backend"
**Solution** : Attendre que MySQL soit prêt (peut prendre 20-30 secondes)

---

## 📚 Documentation complète

Si vous voulez en savoir plus :

1. **GUIDE_DEMARRAGE_DOCKER.md** - Guide complet pas à pas
2. **DOCKER_COMMANDES.md** - Toutes les commandes Docker utiles
3. **RESUME_CORRECTIONS_DOCKER.md** - Ce qui a été corrigé
4. **INSTRUCTIONS_DEMARRAGE.md** - Instructions détaillées

---

## 🛑 Arrêter Docker

Quand vous avez fini :
1. Dans le terminal, appuyer sur `Ctrl+C`
2. Ou exécuter : `docker-compose down`

---

## ✅ Checklist rapide

- [ ] Docker Desktop ouvert et vert
- [ ] PowerShell ouvert dans le bon dossier
- [ ] `docker-compose up --build` exécuté
- [ ] Attendu 30-60 secondes
- [ ] http://localhost:3001 ouvert
- [ ] Connexion réussie

---

## 🚀 Prêt ? Allez-y !

```powershell
cd C:\Users\smail\Desktop\pfE
docker-compose up --build
```

**Bon développement ! 🎉**
