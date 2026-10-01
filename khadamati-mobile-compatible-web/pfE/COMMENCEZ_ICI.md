# 🚀 Commencez Ici - Khadamati

**Guide de démarrage ultra-rapide** ⚡

---

## 👋 Bienvenue !

Vous venez de recevoir le projet **Khadamati** ? Ce document vous guidera en **3 étapes simples** pour démarrer.

---

## ⏱️ Démarrage en 3 Minutes

### Étape 1 : Vérifier les Prérequis (30 secondes)

Vérifiez que vous avez :
- ✅ **MySQL** installé et démarré (port 3306, mot de passe : 2003)
- ✅ **Java 17+** installé
- ✅ **Node.js 18+** installé

**Commandes de vérification** :
```bash
# Vérifier Java
java -version

# Vérifier Node
node -v

# Vérifier MySQL
mysql -u root -p2003
```

### Étape 2 : Démarrer le Backend (1 minute)

```bash
# Ouvrir un terminal
cd spring-backend
./mvnw spring-boot:run
```

**Attendez** : "Started EmployeeManagementApplication"  
✅ **Backend prêt** sur http://localhost:8080/api

### Étape 3 : Démarrer le Frontend (1 minute)

```bash
# Ouvrir un NOUVEAU terminal
cd frontend
npm run dev
```

**Attendez** : "Ready in Xms"  
✅ **Frontend prêt** sur http://localhost:3000

---

## 🎉 C'est Prêt !

### Tester la Connexion

1. **Ouvrir** : http://localhost:3000
2. **Se connecter avec** :
   - Email : `ismailelrhazoui21@gmail.com`
   - Mot de passe : `smail1234`
3. **Première connexion** : Vous recevrez un code OTP par email
4. **Entrer le code** et vous êtes connecté !

---

## 📚 Que Lire Ensuite ?

### Pour les Développeurs

1. **[ETAT_ACTUEL_COMPLET.md](ETAT_ACTUEL_COMPLET.md)** ⭐⭐⭐
   - État complet du projet
   - Architecture et configuration
   - Endpoints API

2. **[VERIFICATION_RAPIDE.md](VERIFICATION_RAPIDE.md)** ⭐⭐⭐
   - Tests en 5 minutes
   - Vérification que tout fonctionne

3. **[COMMANDES_UTILES.md](COMMANDES_UTILES.md)** ⭐⭐⭐
   - Toutes les commandes utiles
   - MySQL, Git, NPM, Maven

### Pour les Utilisateurs

1. **[GUIDE_UTILISATEUR_FINAL.md](GUIDE_UTILISATEUR_FINAL.md)** ⭐⭐⭐
   - Guide complet pour les employés
   - Comment utiliser toutes les fonctionnalités

### Pour les Chefs de Projet

1. **[README.md](README.md)** ⭐⭐⭐
   - Vue d'ensemble du projet
   - Fonctionnalités et roadmap

2. **[INDEX_DOCUMENTATION_FINAL.md](INDEX_DOCUMENTATION_FINAL.md)** ⭐⭐⭐
   - Index de toute la documentation (33 documents)

---

## 🔍 Vérification Rapide

### Backend Fonctionne ?

```bash
curl http://localhost:8080/api/auth/debug/check/ismailelrhazoui21@gmail.com
```

**Résultat attendu** : JSON avec les infos du compte

### Frontend Fonctionne ?

Ouvrir http://localhost:3000 dans le navigateur.

**Résultat attendu** : Page de connexion s'affiche

### MySQL Fonctionne ?

```bash
mysql -u root -p2003 -e "USE khadamati_db; SHOW TABLES;"
```

**Résultat attendu** : Liste de 5 tables

---

## 🆘 Problèmes ?

### Backend ne démarre pas

**Erreur** : "Could not connect to MySQL"

**Solution** :
```bash
# Vérifier que MySQL est démarré
net start MySQL80

# Vérifier le mot de passe dans application.yml
# Doit être : 2003
```

### Frontend ne démarre pas

**Erreur** : "Module not found"

**Solution** :
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Pas de code OTP reçu

**Solution** :
1. Vérifier le dossier **spam**
2. Attendre 1-2 minutes
3. Cliquer sur "Renvoyer le code"

---

## 📊 Structure du Projet

```
khadamati/
├── spring-backend/          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Code Java
│   │   │   └── resources/   # Configuration
│   └── pom.xml              # Dépendances Maven
│
├── frontend/                # Frontend Next.js
│   ├── app/                 # Pages et routes
│   ├── lib/                 # Utilitaires
│   └── package.json         # Dépendances NPM
│
└── Documentation/           # 33 documents
    ├── README.md            # Vue d'ensemble
    ├── ETAT_ACTUEL_COMPLET.md
    ├── VERIFICATION_RAPIDE.md
    └── ...
```

---

## 🎯 Fonctionnalités Principales

### ✅ Implémenté

- 🔐 **Authentification** : Login avec OTP première connexion
- 👥 **Employés** : Créer, modifier, supprimer
- 🏖️ **Congés** : Demander, approuver, suivre
- 📄 **Attestations** : Demander, générer
- 📊 **Statistiques** : Dashboard avec métriques
- 🔔 **Notifications** : Dropdown avec badge
- 📸 **Photo de profil** : Upload et affichage

### ❌ Supprimé

- ⏰ **Présences** : Fonctionnalité retirée (demande encadrant)

---

## 👤 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **ADMIN** | ismailelrhazoui21@gmail.com | smail1234 |
| **ADMIN** | admin@khadamati.ma | Admin123! |
| **RH** | rh@khadamati.ma | RH123! |
| **EMPLOYEE** | employee@khadamati.ma | Employee123! |

**Note** : Première connexion = OTP requis. Connexions suivantes = direct.

---

## 🔧 Commandes Essentielles

### Démarrage

```bash
# Backend
cd spring-backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm run dev

# MySQL
mysql -u root -p2003
```

### Tests

```bash
# Test backend
curl http://localhost:8080/api/auth/debug/check/test@example.com

# Test frontend
# Ouvrir http://localhost:3000
```

### Arrêt

```bash
# Ctrl + C dans chaque terminal
```

---

## 📞 Support

### Questions ?

- 📧 **Email** : support@khadamati.ma
- 📚 **Documentation** : [INDEX_DOCUMENTATION_FINAL.md](INDEX_DOCUMENTATION_FINAL.md)
- 🐛 **Bugs** : Créer une issue GitHub

---

## ✅ Checklist de Démarrage

- [ ] Prérequis installés (Java, Node, MySQL)
- [ ] MySQL démarré (port 3306, password 2003)
- [ ] Backend démarré (http://localhost:8080/api)
- [ ] Frontend démarré (http://localhost:3000)
- [ ] Connexion testée avec compte admin
- [ ] OTP reçu et vérifié
- [ ] Dashboard affiché correctement
- [ ] Documentation lue (au moins README.md)

---

## 🎓 Prochaines Étapes

### Jour 1 : Découverte
1. ✅ Démarrer le projet (fait !)
2. 📖 Lire [README.md](README.md)
3. 🧪 Tester avec [VERIFICATION_RAPIDE.md](VERIFICATION_RAPIDE.md)

### Jour 2 : Compréhension
1. 📚 Lire [ETAT_ACTUEL_COMPLET.md](ETAT_ACTUEL_COMPLET.md)
2. 🗄️ Explorer la base de données MySQL
3. 🔍 Comprendre l'architecture

### Jour 3 : Développement
1. 💻 Créer une branche de développement
2. 🔧 Faire des modifications
3. 🧪 Tester les changements

---

## 🌟 Conseils

### Pour Bien Démarrer

✅ **À faire** :
- Lire la documentation essentielle
- Tester toutes les fonctionnalités
- Comprendre l'architecture
- Poser des questions si besoin

❌ **À éviter** :
- Modifier le code sans comprendre
- Ignorer la documentation
- Ne pas tester après modifications
- Travailler directement sur `main`

---

## 🎉 Félicitations !

Vous avez démarré **Khadamati** avec succès ! 🚀

**Prochaine étape** : Explorez l'application et consultez la documentation pour en savoir plus.

---

<div align="center">

**Bienvenue dans l'équipe Khadamati !** 🏢

**Entraide Nationale - Royaume du Maroc** 🇲🇦

[Documentation Complète](INDEX_DOCUMENTATION_FINAL.md) • [Support](mailto:support@khadamati.ma)

</div>

---

**Dernière mise à jour** : 6 Mai 2026  
**Version** : 1.0.0  
**Temps de lecture** : 3 minutes ⏱️
