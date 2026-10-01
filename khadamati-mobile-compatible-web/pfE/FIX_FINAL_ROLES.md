# 🔧 FIX FINAL - Problème des Rôles et 401

## 📋 Problème Identifié

1. **Menu Frontend** : Ordres Mission, Demandes, Documents apparaissent pour ADMIN/RH alors qu'ils sont pour EMPLOYEE ✅ **DÉJÀ CORRIGÉ**
2. **Backend 401** : Les appels API retournent 401 car `SecurityConfig.java` bloquait ces routes pour EMPLOYEE ✅ **CORRIGÉ MAIS PAS APPLIQUÉ**

## 🎯 Ce qui a été corrigé dans le code

### 1. Frontend `layout.tsx`
Les rôles sont maintenant corrects :
- `Ordres Mission` → `['EMPLOYEE']` uniquement
- `Demandes` → `['EMPLOYEE']` uniquement  
- `Documents` → `['EMPLOYEE']` uniquement
- `Annonces` → `['ADMIN','RH','EMPLOYEE']` (tous)

### 2. Backend `SecurityConfig.java`
Toutes les routes sont maintenant autorisées pour EMPLOYEE :
```java
.requestMatchers("/demandes/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
.requestMatchers("/ordres-mission/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
.requestMatchers("/documents/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
.requestMatchers("/annonces/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
```

## 🚀 COMMANDES À EXÉCUTER MAINTENANT

### Étape 1 : Arrêter Docker
```powershell
docker-compose down
```

### Étape 2 : Reconstruire et redémarrer
```powershell
docker-compose up --build
```

### Étape 3 : Attendre que tout démarre
- Attendez que vous voyiez "Started EmployeeManagementApplication" dans les logs
- Attendez environ 30-60 secondes

### Étape 4 : Tester
1. Ouvrez http://localhost:3001
2. Connectez-vous avec un compte EMPLOYEE
3. Vérifiez que vous voyez : Ordres Mission, Demandes, Documents
4. Cliquez sur "Demandes" - vous ne devriez PLUS avoir de 401

## 🔍 Si ça ne marche toujours pas

### Vérifier les logs backend
```powershell
docker logs khadamati-backend
```

Cherchez des lignes comme :
- `Access is denied` → Problème de rôle
- `401` → Problème d'authentification

### Vérifier le token JWT
Ouvrez la console du navigateur (F12) et tapez :
```javascript
localStorage.getItem('token')
```

Si c'est `null`, reconnectez-vous.

### Vérifier le rôle de l'utilisateur
Dans la console du navigateur :
```javascript
JSON.parse(localStorage.getItem('user'))
```

Vérifiez que `role` est bien `"EMPLOYEE"`.

## 📊 Résultat Attendu

### Pour ADMIN
Menu visible :
- Tableau de bord ✅
- Employés ✅
- Structures ✅
- Salaires ✅
- Annonces ✅
- Gestion RH ✅
- Statistiques ✅
- Mon Profil ✅
- Administration ✅

Menu CACHÉ :
- Ordres Mission ❌
- Demandes ❌
- Documents ❌
- Mes congés ❌
- Mes attestations ❌

### Pour RH
Menu visible :
- Tableau de bord ✅
- Employés ✅
- Structures ✅
- Salaires ✅
- Annonces ✅
- Gestion RH ✅
- Statistiques ✅
- Mon Profil ✅

Menu CACHÉ :
- Ordres Mission ❌
- Demandes ❌
- Documents ❌
- Mes congés ❌
- Mes attestations ❌
- Administration ❌

### Pour EMPLOYEE
Menu visible :
- Tableau de bord ✅
- Ordres Mission ✅
- Demandes ✅
- Documents ✅
- Annonces ✅
- Mes congés ✅
- Mes attestations ✅
- Mon Profil ✅

Menu CACHÉ :
- Employés ❌
- Structures ❌
- Salaires ❌
- Gestion RH ❌
- Statistiques ❌
- Administration ❌

## ⚠️ IMPORTANT

Le backend DOIT être reconstruit avec `docker-compose up --build` pour que les changements de `SecurityConfig.java` soient appliqués.

Sans reconstruction, le backend utilise l'ancienne version compilée qui bloque les routes pour EMPLOYEE.

---

**Date** : 14 Mai 2026  
**Statut** : Code corrigé, en attente de reconstruction Docker
