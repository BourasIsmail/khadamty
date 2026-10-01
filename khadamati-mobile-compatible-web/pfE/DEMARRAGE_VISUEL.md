# 🎨 Guide Visuel de Démarrage Docker

## 📍 Vous êtes ici

```
C:\Users\smail\Desktop\pfE\
```

---

## 🎯 Objectif

Démarrer l'application Khadamati avec Docker en **3 étapes simples**.

---

## 📋 ÉTAPE 1 : Vérifier Docker Desktop

### ✅ Docker Desktop doit être ouvert

```
┌─────────────────────────────────────┐
│  🐳 Docker Desktop                  │
│                                     │
│  ● Running                          │  ← Doit être vert
│                                     │
│  Containers: 0                      │
│  Images: 5                          │
│                                     │
└─────────────────────────────────────┘
```

### ❌ Si Docker Desktop n'est pas ouvert

1. Cliquer sur l'icône Docker Desktop
2. Attendre que l'icône devienne **verte** ✅
3. Passer à l'étape 2

---

## 📋 ÉTAPE 2 : Ouvrir PowerShell

### 1. Appuyer sur `Windows + X`

```
┌─────────────────────────────────────┐
│  Windows PowerShell                 │  ← Cliquer ici
│  Windows PowerShell (Admin)         │
│  Terminal                           │
│  ...                                │
└─────────────────────────────────────┘
```

### 2. Naviguer vers le projet

```powershell
PS C:\Users\smail> cd Desktop\pfE
PS C:\Users\smail\Desktop\pfE>
```

### 3. Vérifier que vous êtes au bon endroit

```powershell
PS C:\Users\smail\Desktop\pfE> ls

    Répertoire : C:\Users\smail\Desktop\pfE

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        11/05/2026     19:00                frontend
d-----        11/05/2026     19:00                spring-backend
-a----        11/05/2026     19:00           1234 docker-compose.yml
-a----        11/05/2026     19:00           5678 README.md
...
```

✅ Si vous voyez `docker-compose.yml`, vous êtes au bon endroit !

---

## 📋 ÉTAPE 3 : Démarrer Docker

### Commande à exécuter

```powershell
PS C:\Users\smail\Desktop\pfE> docker-compose up --build
```

### Ce que vous allez voir

```
[+] Building 45.2s (15/15) FINISHED
 => [frontend internal] load build definition
 => [backend internal] load build definition
 => [mysql] pulling image

[+] Running 3/3
 ✔ Container khadamati-mysql     Started
 ✔ Container khadamati-backend   Started
 ✔ Container khadamati-frontend  Started

Attaching to khadamati-backend, khadamati-frontend, khadamati-mysql
```

### ⏳ Attendez ces messages

```
khadamati-mysql     | ready for connections          ← ✅ MySQL prêt
khadamati-backend   | Started EmployeeManagement...  ← ✅ Backend prêt
khadamati-frontend  | Ready in 888ms                 ← ✅ Frontend prêt
```

**Temps d'attente** : 30-60 secondes

---

## 📋 ÉTAPE 4 : Ouvrir l'application

### 1. Ouvrir votre navigateur

```
Chrome, Firefox, Edge, Safari...
```

### 2. Aller sur

```
http://localhost:3001
```

⚠️ **ATTENTION** : Port **3001**, pas 3000 !

### 3. Vous devriez voir

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

---

## 📋 ÉTAPE 5 : Se connecter

### 1. Entrer les identifiants

```
Email       : ismailelrhazoui954@gmail.com
Mot de passe: 888888
```

### 2. Première connexion → OTP

```
┌─────────────────────────────────────┐
│                                     │
│   📧 Code OTP envoyé par email      │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Entrer le code OTP          │  │
│   └─────────────────────────────┘  │
│                                     │
│   [ Vérifier ]                      │
│                                     │
└─────────────────────────────────────┘
```

### 3. Connexions suivantes → Direct

```
┌─────────────────────────────────────┐
│                                     │
│   ✅ Connexion réussie !            │
│                                     │
│   Redirection vers le dashboard...  │
│                                     │
└─────────────────────────────────────┘
```

---

## 📋 ÉTAPE 6 : Dashboard

### Vous devriez voir

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

## 🎉 Félicitations !

Vous avez réussi à démarrer l'application Khadamati avec Docker !

---

## 🛑 Arrêter Docker

### Quand vous avez fini

#### Option 1 : Dans le terminal PowerShell

```
Appuyer sur Ctrl+C
```

#### Option 2 : Commande

```powershell
PS C:\Users\smail\Desktop\pfE> docker-compose down
```

### Vous verrez

```
[+] Running 3/3
 ✔ Container khadamati-frontend  Stopped
 ✔ Container khadamati-backend   Stopped
 ✔ Container khadamati-mysql     Stopped
```

---

## ❓ Problèmes ?

### ❌ "Port 3001 is already in use"

```powershell
# Arrêter Docker
docker-compose down

# Redémarrer
docker-compose up --build
```

### ❌ "Cannot connect to Docker daemon"

1. Ouvrir Docker Desktop
2. Attendre l'icône verte
3. Réessayer

### ❌ "Page blanche sur localhost:3001"

1. Attendre encore 30 secondes
2. Vérifier les logs dans le terminal
3. Chercher les messages "ready for connections", "Started", "Ready"

### ❌ "Cannot connect to backend"

1. Attendre que MySQL soit prêt (~20 secondes)
2. Vérifier les logs : `docker-compose logs backend`

---

## 📚 Documentation complète

Pour plus d'informations, consultez :

- **[QUE_FAIRE_MAINTENANT.md](QUE_FAIRE_MAINTENANT.md)** - Guide rapide
- **[GUIDE_DEMARRAGE_DOCKER.md](GUIDE_DEMARRAGE_DOCKER.md)** - Guide complet
- **[DOCKER_COMMANDES.md](DOCKER_COMMANDES.md)** - Référence des commandes
- **[INDEX_DOCUMENTATION_DOCKER.md](INDEX_DOCUMENTATION_DOCKER.md)** - Index complet

---

## ✅ Checklist

- [ ] Docker Desktop ouvert et vert
- [ ] PowerShell ouvert dans `C:\Users\smail\Desktop\pfE`
- [ ] `docker-compose up --build` exécuté
- [ ] Attendu 30-60 secondes
- [ ] Messages "ready", "Started", "Ready" visibles
- [ ] http://localhost:3001 ouvert
- [ ] Page de connexion visible
- [ ] Connexion réussie
- [ ] Dashboard visible

---

## 🚀 Résumé en images

```
1. Docker Desktop ✅
        ↓
2. PowerShell → cd Desktop\pfE
        ↓
3. docker-compose up --build
        ↓
4. Attendre 30-60 secondes ⏳
        ↓
5. http://localhost:3001 🌐
        ↓
6. Se connecter 🔐
        ↓
7. Dashboard 📊
        ↓
8. Tester les fonctionnalités ✅
        ↓
9. Ctrl+C pour arrêter 🛑
```

---

**Date** : 11 Mai 2026  
**Auteur** : Assistant Kiro  
**Statut** : ✅ Prêt à démarrer

---

**Bon développement ! 🎉**
