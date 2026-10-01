# ⚡ Commandes de Test Rapide

## 🚀 Démarrage

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

---

## 🧪 Tests MongoDB (optionnel)

### Vérifier les utilisateurs créés
```bash
mongosh
use employee_management
db.users.find().pretty()
```

### Vérifier les employés créés
```bash
db.employees.find().pretty()
```

### Supprimer un utilisateur de test
```bash
db.users.deleteOne({ email: "ahmed.bennani@entraide.ma" })
db.employees.deleteOne({ email: "ahmed.bennani@entraide.ma" })
```

### Réinitialiser complètement
```bash
db.users.deleteMany({ role: { $ne: "admin" } })
db.employees.deleteMany({})
```

---

## 🔍 Vérifications Rapides

### 1. Backend fonctionne ?
```bash
curl http://localhost:8080/api/health
```

### 2. Frontend fonctionne ?
Ouvrir : http://localhost:3000

### 3. Voir les logs du backend en temps réel
```bash
cd backend
npm run dev | grep "NOUVEAU COMPTE"
```

---

## 📝 Comptes de Test par Défaut

### Admin
```
URL: http://localhost:3000/login
Formulaire: Administrateur
Email: admin@entraide.ma
Mot de passe: admin123
```

### Créer un Employé de Test
```
1. Se connecter en admin
2. Aller à: http://localhost:3000/dashboard/employees/new
3. Remplir:
   - ID: EMP0010
   - Prénom: Ahmed
   - Nom: Bennani
   - Email: ahmed.bennani@entraide.ma
   - Téléphone: +212 600000000
   - Poste: Développeur
   - Département: Informatique
   - Salaire: 8000
   - Date: (aujourd'hui)
   - Type: Employé
   - Mot de passe: test123
4. Créer
5. Copier les identifiants des logs backend
```

### Créer un RH de Test
```
Même processus mais:
   - ID: RH0001
   - Prénom: Fatima
   - Nom: Alaoui
   - Email: fatima.alaoui@entraide.ma
   - Poste: Responsable RH
   - Département: Ressources Humaines
   - Type: RH (gestion des employés)
   - Mot de passe: rh123
```

---

## ✅ Checklist de Test Rapide

### Test 1 : Création Employé
```bash
# 1. Se connecter en admin
# 2. Créer un employé
# 3. Vérifier les logs backend
# 4. Chercher dans les logs:
grep "NOUVEAU COMPTE CRÉÉ" backend_logs.txt
```

### Test 2 : Connexion Correcte
```bash
# 1. Se déconnecter
# 2. Sélectionner "Employé"
# 3. Utiliser: ahmed.bennani@entraide.ma / test123
# 4. Vérifier l'accès au dashboard
```

### Test 3 : Connexion Incorrecte (Sécurité)
```bash
# 1. Se déconnecter
# 2. Sélectionner "Administrateur"
# 3. Utiliser: ahmed.bennani@entraide.ma / test123
# 4. Vérifier le message d'erreur
# Attendu: "Ce compte n'est pas un compte administrateur"
```

### Test 4 : Création RH
```bash
# 1. Se connecter en admin
# 2. Créer un compte RH
# 3. Vérifier les logs
# 4. Se connecter via "Ressources Humaines"
```

---

## 🐛 Dépannage Rapide

### Backend ne démarre pas
```bash
# Vérifier MongoDB
mongosh --eval "db.runCommand({ ping: 1 })"

# Réinstaller les dépendances
cd backend
rm -rf node_modules package-lock.json
npm install

# Vérifier le .env
cat backend/.env
```

### Frontend ne démarre pas
```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules .next package-lock.json
npm install

# Vérifier le .env.local
cat frontend/.env.local
```

### Erreur "Email déjà utilisé"
```bash
# Supprimer l'utilisateur existant
mongosh
use employee_management
db.users.deleteOne({ email: "ahmed.bennani@entraide.ma" })
db.employees.deleteOne({ email: "ahmed.bennani@entraide.ma" })
```

### Logs backend ne s'affichent pas
```bash
# Vérifier que vous êtes dans le bon terminal
# Redémarrer le backend
cd backend
npm run dev
```

---

## 📊 Vérification des Corrections

### ✅ Correction 1 : Création sans erreur
```bash
# Test: Créer un employé sans adresse
# Résultat attendu: Succès
# Vérification: Pas d'erreur dans les logs
```

### ✅ Correction 2 : Séparation des rôles
```bash
# Test: Admin essaie de se connecter via formulaire Employé
# Résultat attendu: Erreur 403
# Message: "Ce compte n'est pas un compte employé"
```

### ✅ Correction 3 : Choix Employé/RH
```bash
# Test: Créer un employé
# Vérification: Sélecteur "Type de compte" visible
# Options: "Employé" et "RH"
```

### ✅ Correction 4 : Notification identifiants
```bash
# Test: Créer un employé
# Vérification: Logs backend affichent:
# ═══════════════════════════════════════════════
# 📧 NOUVEAU COMPTE CRÉÉ
# ═══════════════════════════════════════════════
# Nom: ...
# Email: ...
# Mot de passe: ...
# Rôle: ...
```

---

## 🎯 Tests de Régression

### Test que tout fonctionne encore
```bash
# 1. Connexion admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@entraide.ma","password":"admin123","expectedRole":"admin"}'

# 2. Création employé (avec token)
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employeeId": "EMP0011",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@entraide.ma",
    "phone": "+212600000000",
    "position": "Test",
    "department": "Informatique",
    "salary": 5000,
    "hireDate": "2024-01-01",
    "createUserAccount": true,
    "userPassword": "test123",
    "userRole": "employee"
  }'
```

---

## 📈 Monitoring

### Voir les logs en temps réel
```bash
# Backend
cd backend
npm run dev 2>&1 | tee backend.log

# Frontend
cd frontend
npm run dev 2>&1 | tee frontend.log
```

### Filtrer les logs importants
```bash
# Voir uniquement les créations de compte
tail -f backend.log | grep "NOUVEAU COMPTE"

# Voir uniquement les erreurs
tail -f backend.log | grep -i "error"
```

---

## 🔄 Reset Complet

### Tout réinitialiser
```bash
# 1. Arrêter les serveurs (Ctrl+C)

# 2. Nettoyer MongoDB
mongosh
use employee_management
db.users.deleteMany({ role: { $ne: "admin" } })
db.employees.deleteMany({})
exit

# 3. Nettoyer les dépendances
cd backend && rm -rf node_modules .next && npm install
cd ../frontend && rm -rf node_modules .next && npm install

# 4. Redémarrer
cd backend && npm run dev &
cd frontend && npm run dev
```

---

## 📞 Support

### Problème persistant ?
1. Vérifier les logs : `backend.log` et `frontend.log`
2. Vérifier MongoDB : `mongosh`
3. Vérifier les ports : `lsof -i :8080` et `lsof -i :3000`
4. Redémarrer tout : Ctrl+C puis relancer

### Variables d'environnement
```bash
# Backend (.env)
PORT=8080
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your-secret-key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

*Commandes testées le : ${new Date().toLocaleDateString('fr-FR')}*
