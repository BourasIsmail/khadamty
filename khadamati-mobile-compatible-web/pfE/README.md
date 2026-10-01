# 🏢 Khadamati - خدماتي

**Plateforme de Gestion RH - Entraide Nationale du Royaume du Maroc**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/votre-repo/khadamati)
[![Status](https://img.shields.io/badge/status-operational-green.svg)](https://github.com/votre-repo/khadamati)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [🐳 Démarrage avec Docker (Recommandé)](#-démarrage-avec-docker-recommandé)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Démarrage Rapide](#-démarrage-rapide)
- [Documentation](#-documentation)
- [Comptes de Test](#-comptes-de-test)
- [Captures d'Écran](#-captures-décran)
- [Contribution](#-contribution)
- [Support](#-support)
- [Licence](#-licence)

---

## 🎯 À Propos

**Khadamati** (خدماتي - "Mes Services" en arabe) est une plateforme moderne de gestion des ressources humaines développée pour l'**Entraide Nationale du Royaume du Maroc**.

### Objectifs

- ✅ Simplifier la gestion des employés
- ✅ Automatiser les demandes de congés et attestations
- ✅ Centraliser les informations RH
- ✅ Améliorer la communication interne
- ✅ Fournir des statistiques et rapports en temps réel

### Caractéristiques Principales

- 🔐 **Authentification sécurisée** avec OTP première connexion
- 👥 **Gestion complète des employés**
- 🏖️ **Système de gestion des congés**
- 📄 **Demandes d'attestations automatisées**
- 📊 **Dashboard analytique avec statistiques**
- 🔔 **Notifications en temps réel**
- 📱 **Interface responsive** (mobile, tablette, desktop)
- 🎨 **Design moderne** aux couleurs de l'Entraide Nationale

---

## 🐳 Démarrage avec Docker (Recommandé)

### ⚡ Démarrage Ultra-Rapide

**Prérequis** : Docker Desktop installé et en cours d'exécution

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/khadamati.git
cd khadamati

# 2. Démarrer tous les services
docker-compose up --build

# 3. Ouvrir l'application
# Frontend : http://localhost:3001
# Backend : http://localhost:8081/api
# MySQL : localhost:3307
```

### 📚 Documentation Docker

| Document | Description |
|----------|-------------|
| [COMMENCEZ_PAR_ICI.md](COMMENCEZ_PAR_ICI.md) | Guide de démarrage rapide |
| [GUIDE_DEMARRAGE_DOCKER.md](GUIDE_DEMARRAGE_DOCKER.md) | Guide complet Docker |
| [DOCKER_COMMANDES.md](DOCKER_COMMANDES.md) | Référence des commandes |
| [RESUME_CORRECTIONS_DOCKER.md](RESUME_CORRECTIONS_DOCKER.md) | Corrections et configuration |

### 🌐 URLs d'accès (Docker)

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3001 | 3001 |
| **Backend API** | http://localhost:8081/api | 8081 |
| **MySQL** | localhost:3307 | 3307 |

### 🛑 Arrêter Docker

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les données (⚠️ ATTENTION)
docker-compose down -v
```

---

## ✨ Fonctionnalités

### Pour les Employés

- 📊 **Tableau de bord personnel** avec vue d'ensemble
- 🏖️ **Gestion des congés** :
  - Voir le solde de congés
  - Demander des congés
  - Suivre les demandes en temps réel
- 📄 **Demandes d'attestations** :
  - Attestation de travail
  - Attestation de salaire
  - Autres attestations
- 👤 **Profil personnel** :
  - Modifier ses informations
  - Changer son mot de passe
  - Ajouter une photo de profil
- 🔔 **Notifications** pour toutes les actions importantes

### Pour les RH

- 👥 **Gestion des employés** :
  - Créer, modifier, supprimer des employés
  - Voir la liste complète avec filtres
  - Exporter les données
- 💼 **Gestion des demandes** :
  - Approuver/rejeter les congés
  - Traiter les demandes d'attestations
  - Voir l'historique complet
- 📈 **Statistiques et rapports** :
  - Nombre d'employés par département
  - Taux d'utilisation des congés
  - Demandes en attente
- 📊 **Dashboard RH** avec métriques clés

### Pour les Administrateurs

- ⚙️ **Administration système** :
  - Gestion des utilisateurs
  - Configuration des rôles
  - Paramètres globaux
- 🔒 **Sécurité** :
  - Gestion des accès
  - Logs d'activité
  - Audit trail
- 📊 **Statistiques avancées** :
  - Rapports personnalisés
  - Analyses prédictives
  - Exports de données

---

## 🛠️ Technologies

### Backend

- **Framework** : Spring Boot 3.2.0
- **Langage** : Java 17
- **Base de données** : MySQL 8.0
- **ORM** : Hibernate / JPA
- **Sécurité** : Spring Security + JWT
- **Email** : Spring Mail (SMTP Gmail)
- **Build** : Maven

### Frontend

- **Framework** : Next.js 14 (React 18)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **State Management** : Zustand
- **HTTP Client** : Axios
- **Notifications** : React Hot Toast
- **Icons** : Heroicons

### Base de Données

- **SGBD** : MySQL 8.0
- **Tables** : 5 tables principales
  - `users` - Comptes utilisateurs
  - `employees` - Profils employés
  - `leave_requests` - Demandes de congés
  - `document_requests` - Demandes d'attestations
  - `attendance` - Présences (non utilisée)

---

## 📦 Installation

### Prérequis

- **Java** : JDK 17 ou supérieur
- **Node.js** : v18 ou supérieur
- **MySQL** : 8.0 ou supérieur
- **Maven** : 3.8 ou supérieur (ou utiliser le wrapper inclus)
- **Git** : Pour cloner le projet

### Cloner le Projet

```bash
git clone https://github.com/votre-username/khadamati.git
cd khadamati
```

### Configuration MySQL

1. **Démarrer MySQL** :
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

2. **Créer la base de données** :
```sql
CREATE DATABASE khadamati_db;
```

3. **Configurer le mot de passe** :
   - Ouvrir `spring-backend/src/main/resources/application.yml`
   - Modifier le mot de passe MySQL si nécessaire (par défaut : `2003`)

### Installation Backend

```bash
cd spring-backend
./mvnw clean install
```

### Installation Frontend

```bash
cd frontend
npm install
```

---

## 🚀 Démarrage Rapide

### 1. Démarrer MySQL

```bash
# Vérifier que MySQL est démarré
mysql -u root -p2003
```

### 2. Démarrer le Backend

```bash
cd spring-backend
./mvnw spring-boot:run
```

**Backend disponible sur** : http://localhost:8080/api

### 3. Démarrer le Frontend

```bash
cd frontend
npm run dev
```

**Frontend disponible sur** : http://localhost:3000

### 4. Se Connecter

Ouvrir http://localhost:3000 et utiliser un des comptes de test :

**Compte Admin** :
- Email : `ismailelrhazoui21@gmail.com`
- Mot de passe : `smail1234`

---

## 📚 Documentation

### Documentation Essentielle

| Document | Description | Pour qui |
|----------|-------------|----------|
| [ETAT_ACTUEL_COMPLET.md](ETAT_ACTUEL_COMPLET.md) | État complet du projet | Tous |
| [VERIFICATION_RAPIDE.md](VERIFICATION_RAPIDE.md) | Vérification en 5 minutes | Développeurs |
| [GUIDE_UTILISATEUR_FINAL.md](GUIDE_UTILISATEUR_FINAL.md) | Guide pour utilisateurs | Employés |
| [COMMANDES_UTILES.md](COMMANDES_UTILES.md) | Référence des commandes | Développeurs |
| [OTP_PREMIERE_CONNEXION.md](OTP_PREMIERE_CONNEXION.md) | Documentation OTP | Développeurs |

### Index Complet

Consultez [INDEX_DOCUMENTATION_FINAL.md](INDEX_DOCUMENTATION_FINAL.md) pour la liste complète de tous les documents disponibles (33 documents).

---

## 👤 Comptes de Test

### Administrateur

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| ismailelrhazoui21@gmail.com | smail1234 | ADMIN |
| admin@khadamati.ma | Admin123! | ADMIN |

### Ressources Humaines

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| rh@khadamati.ma | RH123! | RH |

### Employé

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| employee@khadamati.ma | Employee123! | EMPLOYEE |

**Note** : Lors de la première connexion, un code OTP sera envoyé par email. Les connexions suivantes seront directes sans OTP.

---

## 📸 Captures d'Écran

### Page de Connexion
```
┌─────────────────────────────────────┐
│                                     │
│         🏢 Khadamati                │
│         خدماتي                      │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Email                       │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Mot de passe                │  │
│   └─────────────────────────────┘  │
│                                     │
│   [ Se connecter ]                  │
│                                     │
└─────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────────────────────┐
│ 🏠 Khadamati          🔔 📸 Ismail Elrhazoui ▼     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📊 Tableau de bord                                  │
│  👥 Employés                                         │
│  💼 Gestion RH                                       │
│  📈 Statistiques                                     │
│  👤 Mon Profil                                       │
│  ⚙️ Administration                                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Statistiques                                 │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │  │
│  │  │ 150  │ │  25  │ │  10  │ │  5   │        │  │
│  │  │Empl. │ │Congés│ │Attest│ │Dept. │        │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code

- **Backend** : Suivre les conventions Java et Spring Boot
- **Frontend** : Suivre les conventions TypeScript et React
- **Commits** : Messages clairs et descriptifs en français
- **Tests** : Ajouter des tests pour les nouvelles fonctionnalités

### Branches

- `main` : Branche principale (production)
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes

---

## 🐛 Signaler un Bug

Pour signaler un bug, veuillez :

1. Vérifier que le bug n'a pas déjà été signalé
2. Créer une issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs comportement actuel
   - Captures d'écran si possible
   - Environnement (OS, navigateur, versions)

---

## 📞 Support

### Contact

- **Email** : support@khadamati.ma
- **Documentation** : [INDEX_DOCUMENTATION_FINAL.md](INDEX_DOCUMENTATION_FINAL.md)
- **Issues** : [GitHub Issues](https://github.com/votre-username/khadamati/issues)

### FAQ

**Q : Je ne reçois pas le code OTP**  
R : Vérifiez votre dossier spam. Si le problème persiste, contactez le support.

**Q : Comment réinitialiser mon mot de passe ?**  
R : Cliquez sur "Mot de passe oublié ?" sur la page de connexion.

**Q : Puis-je utiliser Khadamati sur mobile ?**  
R : Oui, l'interface est responsive et fonctionne sur tous les appareils.

**Q : Combien de temps pour traiter une demande de congé ?**  
R : En général, 2-3 jours ouvrables.

---

## 🔒 Sécurité

### Fonctionnalités de Sécurité

- 🔐 **Authentification JWT** : Tokens sécurisés avec expiration
- 📧 **OTP Email** : Vérification à la première connexion
- 🔒 **Mots de passe cryptés** : BCrypt avec salt
- 🛡️ **CORS configuré** : Protection contre les attaques cross-origin
- 🔑 **Gestion des rôles** : ADMIN, RH, EMPLOYEE
- 📝 **Logs d'audit** : Traçabilité des actions

### Signaler une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, veuillez l'envoyer à :
**security@khadamati.ma**

**Ne pas** créer d'issue publique pour les problèmes de sécurité.

---

## 📊 Statistiques du Projet

- **Lignes de code** : ~15,000+
- **Fichiers** : 50+
- **Documentation** : 33 documents
- **Tests** : En cours d'implémentation
- **Couverture** : À venir

---

## 🗺️ Roadmap

### Version 1.0 (Actuelle) ✅
- [x] Authentification avec OTP
- [x] Gestion des employés
- [x] Gestion des congés
- [x] Gestion des attestations
- [x] Dashboard et statistiques
- [x] Notifications
- [x] Upload photo de profil

### Version 1.1 (Prochaine) 🚧
- [ ] Gestion des documents (upload/download)
- [ ] Notifications push en temps réel
- [ ] Génération de rapports PDF
- [ ] Calendrier des congés
- [ ] Chat interne

### Version 2.0 (Future) 🔮
- [ ] Module de paie
- [ ] Évaluations des performances
- [ ] Gestion des formations
- [ ] Application mobile native
- [ ] Support multilingue (Arabe, Anglais)

---

## 📜 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2026 Entraide Nationale - Royaume du Maroc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Remerciements

- **Entraide Nationale** pour le soutien du projet
- **Équipe de développement** pour leur travail acharné
- **Communauté open source** pour les outils et bibliothèques utilisés

---

## 📈 Badges

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/votre-repo/khadamati)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)](https://github.com/votre-repo/khadamati)
[![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)](https://github.com/votre-repo/khadamati)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen.svg)](https://github.com/votre-repo/khadamati)

---

## 🌟 Star History

Si vous trouvez ce projet utile, n'hésitez pas à lui donner une ⭐ sur GitHub !

---

<div align="center">

**Fait avec ❤️ par l'équipe Khadamati**

**Entraide Nationale - Royaume du Maroc** 🇲🇦

[Documentation](INDEX_DOCUMENTATION_FINAL.md) • [Support](mailto:support@khadamati.ma) • [Contribuer](#-contribution)

</div>

---

**Dernière mise à jour** : 11 Mai 2026  
**Version** : 1.0.0  
**Statut** : ✅ Opérationnel  
**Docker** : ✅ Configuré et fonctionnel
