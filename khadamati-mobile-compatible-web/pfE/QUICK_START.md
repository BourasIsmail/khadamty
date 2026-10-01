# ⚡ Quick Start - Khadamati

## 🚀 Démarrage en 5 Minutes

### 1️⃣ MySQL (2 min)
```bash
# Démarrer MySQL
net start MySQL80

# Créer la base
mysql -u root -p
CREATE DATABASE khadamati_db;
exit;

# Configurer le mot de passe dans :
# spring-backend/src/main/resources/application.yml
```

### 2️⃣ Backend (1 min)
```bash
cd spring-backend
./mvnw spring-boot:run
```
✅ Backend sur http://localhost:8080/api

### 3️⃣ Frontend (1 min)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend sur http://localhost:3000

### 4️⃣ Créer un Compte (1 min)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "System",
    "phone": "0612345678",
    "department": "Administration",
    "position": "Administrateur",
    "hireDate": "2024-01-01",
    "role": "ADMIN"
  }'
```

### 5️⃣ Se Connecter
1. Ouvrir http://localhost:3000
2. Email : `admin@demo.com`
3. Mot de passe : `password123`
4. Saisir le code OTP (voir logs backend)
5. ✅ Connecté !

---

## 📚 Documentation Complète

- **[README_NOUVEAU.md](README_NOUVEAU.md)** - Documentation complète
- **[COMMANDES_DEMARRAGE.md](COMMANDES_DEMARRAGE.md)** - Toutes les commandes
- **[CHECKLIST_FINALISATION.md](CHECKLIST_FINALISATION.md)** - Checklist complète

---

## 🆘 Problèmes ?

### MySQL ne démarre pas
```bash
net stop MySQL80
net start MySQL80
```

### Port 8080 occupé
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Code OTP ?
Vérifier les logs du backend :
```
>>> CODE OTP pour admin@demo.com : 123456 <<<
```

---

## ✅ Checklist Rapide

- [ ] MySQL installé et démarré
- [ ] Base de données `khadamati_db` créée
- [ ] Mot de passe configuré dans `application.yml`
- [ ] Backend démarré (port 8080)
- [ ] Frontend démarré (port 3000)
- [ ] Compte admin créé
- [ ] Connexion réussie

---

**C'est tout ! Vous êtes prêt ! 🎉**
