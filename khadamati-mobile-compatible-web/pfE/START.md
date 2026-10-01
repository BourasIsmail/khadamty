# 🚀 Démarrage Rapide — EmployeeHub

## ✅ Backend FastAPI (Déjà lancé !)

Le serveur FastAPI tourne sur **http://localhost:8000**

- 📚 Documentation interactive : http://localhost:8000/docs
- 📖 ReDoc : http://localhost:8000/redoc
- 🏥 Health check : http://localhost:8000/api/health

### Comptes de test
- **Admin** : `admin@demo.com` / `password123`
- **User** : `user@demo.com` / `password123`
- **Employee** : `employee@demo.com` / `password123`

---

## 🎨 Frontend Next.js

### Lancer le frontend
Ouvrez un **nouveau terminal PowerShell** et exécutez :

```powershell
cd frontend
npm install
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

---

## 📱 Utilisation

1. Ouvrez http://localhost:3000
2. Cliquez sur "Se connecter"
3. Utilisez un des comptes de test ci-dessus
4. Explorez l'application !

### Fonctionnalités disponibles

**Admin** :
- ✅ Gestion complète des employés (CRUD)
- ✅ Gestion des présences
- ✅ Statistiques avancées
- ✅ Administration des utilisateurs

**User** :
- ✅ Consultation des employés
- ✅ Gestion des présences
- ✅ Statistiques

**Employee** :
- ✅ Consultation de son profil
- ✅ Pointage entrée/sortie
- ✅ Historique de ses présences

---

## 🛠️ Commandes utiles

### Backend
```powershell
# Arrêter le serveur
# Ctrl+C dans le terminal du backend

# Relancer
cd api
python -m uvicorn main:app --reload --port 8000

# Reseed la base
python -m app.utils.seed
```

### Frontend
```powershell
# Dev
cd frontend
npm run dev

# Build production
npm run build
npm start
```

---

## 🎯 Prochaines étapes

1. **Tester l'authentification** — Connectez-vous avec les 3 rôles
2. **Créer un employé** — En tant qu'admin
3. **Pointer** — En tant qu'employé
4. **Voir les stats** — Dashboard et analytics

---

## 📚 Documentation complète

- `README.md` — Guide complet du projet
- `api/README.md` — Documentation API
- `api/INSTALL.md` — Guide d'installation détaillé

---

## 🐛 Problèmes courants

### Backend ne démarre pas
```powershell
# Vérifier MongoDB
mongosh

# Réinstaller les dépendances
cd api
pip install -r requirements.txt
```

### Frontend ne démarre pas
```powershell
cd frontend
rm -r node_modules
npm install
```

### Port déjà utilisé
```powershell
# Backend (changer le port)
python -m uvicorn main:app --reload --port 8001

# Frontend (changer le port)
# Modifier package.json : "dev": "next dev -p 3001"
```

---

Bon développement ! 🚀
