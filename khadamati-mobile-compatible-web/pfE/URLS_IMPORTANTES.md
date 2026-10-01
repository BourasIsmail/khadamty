# 🔗 URLs Importantes - Khadamati

**Référence rapide de toutes les URLs** 📍

---

## 🌐 URLs de l'Application

### Frontend (Next.js)

| URL | Description | Accès |
|-----|-------------|-------|
| http://localhost:3000 | Page d'accueil | Public |
| http://localhost:3000/login | Page de connexion | Public |
| http://localhost:3000/register | Page d'inscription | Public |
| http://localhost:3000/dashboard | Dashboard principal | Authentifié |
| http://localhost:3000/dashboard/employees | Liste des employés | ADMIN, RH |
| http://localhost:3000/dashboard/employees/new | Créer un employé | ADMIN, RH |
| http://localhost:3000/dashboard/leave-balance | Mes congés | EMPLOYEE |
| http://localhost:3000/dashboard/leave-request | Demandes de congés | ADMIN, RH |
| http://localhost:3000/dashboard/document-request | Mes attestations | EMPLOYEE |
| http://localhost:3000/dashboard/rh | Gestion RH | ADMIN, RH |
| http://localhost:3000/dashboard/analytics | Statistiques | ADMIN, RH |
| http://localhost:3000/dashboard/profile | Mon profil | Tous |
| http://localhost:3000/dashboard/admin | Administration | ADMIN |

### Backend (Spring Boot)

| URL | Description | Méthode |
|-----|-------------|---------|
| http://localhost:8080/api | Base URL API | - |

---

## 🔐 Endpoints Authentification

| Endpoint | Méthode | Description | Body |
|----------|---------|-------------|------|
| `/auth/login` | POST | Connexion (envoie OTP si première fois) | `{email, password}` |
| `/auth/verify-otp` | POST | Vérifier le code OTP | `{email, code}` |
| `/auth/resend-otp` | POST | Renvoyer un nouveau code | `{email}` |
| `/auth/register` | POST | Créer un nouveau compte | `{email, password, firstName, lastName, ...}` |
| `/auth/me` | GET | Profil utilisateur connecté | Header: `Authorization: Bearer TOKEN` |
| `/auth/profile` | PUT | Modifier le profil | Header: `Authorization: Bearer TOKEN` |
| `/auth/change-password` | POST | Changer le mot de passe | Header: `Authorization: Bearer TOKEN` |
| `/auth/debug/check/{email}` | GET | Vérifier si un compte existe | - |
| `/auth/debug/reset-verification/{email}` | POST | Réinitialiser la vérification email | - |

---

## 👥 Endpoints Employés

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/employees` | GET | Liste des employés | ADMIN, RH |
| `/employees/{id}` | GET | Détails d'un employé | ADMIN, RH |
| `/employees` | POST | Créer un employé | ADMIN, RH |
| `/employees/{id}` | PUT | Modifier un employé | ADMIN, RH |
| `/employees/{id}` | DELETE | Supprimer un employé | ADMIN |

---

## 🏖️ Endpoints Congés

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/leave-requests` | GET | Liste des demandes | Tous |
| `/leave-requests/{id}` | GET | Détails d'une demande | Tous |
| `/leave-requests` | POST | Créer une demande | EMPLOYEE |
| `/leave-requests/{id}/status` | PUT | Approuver/Rejeter | ADMIN, RH |
| `/leave-requests/{id}` | DELETE | Supprimer une demande | ADMIN |

---

## 📄 Endpoints Attestations

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/document-requests` | GET | Liste des demandes | Tous |
| `/document-requests/{id}` | GET | Détails d'une demande | Tous |
| `/document-requests` | POST | Créer une demande | EMPLOYEE |
| `/document-requests/{id}/status` | PUT | Approuver/Rejeter | ADMIN, RH |
| `/document-requests/{id}` | DELETE | Supprimer une demande | ADMIN |

---

## 🗄️ MySQL

| URL | Description | Accès |
|-----|-------------|-------|
| localhost:3306 | Serveur MySQL | root / 2003 |
| khadamati_db | Base de données | - |

### Tables

- `users` - Comptes utilisateurs
- `employees` - Profils employés
- `leave_requests` - Demandes de congés
- `document_requests` - Demandes d'attestations
- `attendance` - Présences (non utilisée)

---

## 📧 Email SMTP

| Paramètre | Valeur |
|-----------|--------|
| Serveur | smtp.gmail.com |
| Port | 587 |
| Email | ismailelrhazoui2003@gmail.com |
| Mot de passe | qlxiexgjbwibvnyd |
| TLS | Activé |

---

## 🧪 URLs de Test (curl)

### Test de Connexion

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ismailelrhazoui21@gmail.com",
    "password": "smail1234"
  }'
```

### Vérifier un Compte

```bash
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com
```

### Vérifier OTP

```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ismailelrhazoui21@gmail.com",
    "code": "123456"
  }'
```

### Liste des Employés

```bash
curl http://localhost:8080/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔑 Comptes de Test

### Administrateur

| Email | Mot de passe | URL de connexion |
|-------|--------------|------------------|
| ismailelrhazoui21@gmail.com | smail1234 | http://localhost:3000/login |
| admin@khadamati.ma | Admin123! | http://localhost:3000/login |

### RH

| Email | Mot de passe | URL de connexion |
|-------|--------------|------------------|
| rh@khadamati.ma | RH123! | http://localhost:3000/login |

### Employé

| Email | Mot de passe | URL de connexion |
|-------|--------------|------------------|
| employee@khadamati.ma | Employee123! | http://localhost:3000/login |

---

## 📚 Documentation

| Document | URL (si hébergé) | Fichier Local |
|----------|------------------|---------------|
| README | - | README.md |
| État Complet | - | ETAT_ACTUEL_COMPLET.md |
| Vérification Rapide | - | VERIFICATION_RAPIDE.md |
| Commandes Utiles | - | COMMANDES_UTILES.md |
| Guide Utilisateur | - | GUIDE_UTILISATEUR_FINAL.md |
| Index Documentation | - | INDEX_DOCUMENTATION_FINAL.md |

---

## 🛠️ Outils de Développement

| Outil | URL | Description |
|-------|-----|-------------|
| MySQL Workbench | - | Client MySQL graphique |
| Postman | https://www.postman.com | Test des API REST |
| VS Code | https://code.visualstudio.com | Éditeur de code |
| IntelliJ IDEA | https://www.jetbrains.com/idea | IDE Java |

---

## 📊 Monitoring et Logs

| Type | Emplacement | Description |
|------|-------------|-------------|
| Logs Backend | Terminal | Logs en temps réel |
| Logs Frontend | Terminal + Console navigateur | Logs en temps réel |
| Logs MySQL | MySQL Workbench | Requêtes SQL |

---

## 🔒 Sécurité

### JWT Configuration

| Paramètre | Valeur |
|-----------|--------|
| Secret | mySecretKey123456789012345678901234567890 |
| Expiration | 24 heures (86400000 ms) |
| Algorithme | HS256 |

### CORS

| Paramètre | Valeur |
|-----------|--------|
| Origins autorisées | localhost:3000, localhost:3001, localhost:3002 |
| Méthodes | GET, POST, PUT, DELETE, OPTIONS |
| Headers | Tous autorisés |
| Credentials | Activés |

---

## 🌐 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8080 | http://localhost:8080/api |
| MySQL | 3306 | localhost:3306 |

---

## 📞 Support

| Type | Contact |
|------|---------|
| Email Support | support@khadamati.ma |
| Email Technique | it@khadamati.ma |
| Email RH | rh@khadamati.ma |
| Email Développeur | ismailelrhazoui21@gmail.com |

---

## 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| Spring Boot Docs | https://spring.io/projects/spring-boot |
| Next.js Docs | https://nextjs.org/docs |
| MySQL Docs | https://dev.mysql.com/doc/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| Heroicons | https://heroicons.com |

---

## 📝 Notes Importantes

### Première Connexion

1. Aller sur http://localhost:3000/login
2. Entrer email + mot de passe
3. **OTP sera envoyé** (première fois uniquement)
4. Vérifier l'email et entrer le code
5. Connexion réussie !

### Connexions Suivantes

1. Aller sur http://localhost:3000/login
2. Entrer email + mot de passe
3. **Connexion directe** (pas d'OTP)

---

## ✅ Checklist de Vérification

### URLs Fonctionnelles

- [ ] http://localhost:3000 (Frontend)
- [ ] http://localhost:8080/api (Backend)
- [ ] http://localhost:3000/login (Page de connexion)
- [ ] http://localhost:3000/dashboard (Dashboard)
- [ ] localhost:3306 (MySQL)

### Endpoints API

- [ ] POST /api/auth/login
- [ ] POST /api/auth/verify-otp
- [ ] GET /api/auth/me
- [ ] GET /api/employees
- [ ] GET /api/leave-requests
- [ ] GET /api/document-requests

### Comptes de Test

- [ ] ismailelrhazoui21@gmail.com (ADMIN)
- [ ] admin@khadamati.ma (ADMIN)
- [ ] rh@khadamati.ma (RH)
- [ ] employee@khadamati.ma (EMPLOYEE)

---

## 🎯 Raccourcis Rapides

### Démarrage Complet

```bash
# Terminal 1 : Backend
cd spring-backend && ./mvnw spring-boot:run

# Terminal 2 : Frontend
cd frontend && npm run dev

# Navigateur
start http://localhost:3000
```

### Tests Rapides

```bash
# Test Backend
curl http://localhost:8080/api/auth/debug/check/test@example.com

# Test MySQL
mysql -u root -p2003 -e "USE khadamati_db; SHOW TABLES;"
```

---

<div align="center">

**URLs Importantes - Référence Rapide** 🔗

**Khadamati - خدماتي**

**Entraide Nationale - Royaume du Maroc** 🇲🇦

</div>

---

**Dernière mise à jour** : 6 Mai 2026  
**Version** : 1.0.0
