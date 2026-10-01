# 🧪 Guide de Test - Corrections Authentification

## 🚀 Démarrage Rapide

### 1. Démarrer le Backend
```bash
cd backend
npm run dev
```

### 2. Démarrer le Frontend
```bash
cd frontend
npm run dev
```

---

## ✅ Scénarios de Test

### Test 1 : Création d'un Employé Standard

**Objectif :** Vérifier que la création d'un employé fonctionne sans erreur

**Étapes :**
1. Ouvrir http://localhost:3000/login
2. Se connecter en tant qu'admin :
   - Sélectionner "Administrateur"
   - Email : `admin@entraide.ma`
   - Mot de passe : `admin123`
3. Aller dans "Employés" → "Nouvel employé"
4. Remplir le formulaire :
   - ID Employé : `EMP0010`
   - Prénom : `Ahmed`
   - Nom : `Bennani`
   - Email : `ahmed.bennani@entraide.ma`
   - Téléphone : `+212 6XX XXX XXX`
   - Poste : `Développeur`
   - Département : `Informatique`
   - Salaire : `8000`
   - Date d'embauche : (date actuelle)
   - **Type de compte : Employé**
   - Mot de passe : `test123`
5. Cliquer sur "Créer l'employé"

**Résultat Attendu :**
- ✅ Message de succès affiché
- ✅ Redirection vers la liste des employés
- ✅ Dans les logs du backend, voir :
```
═══════════════════════════════════════════════
📧 NOUVEAU COMPTE CRÉÉ
═══════════════════════════════════════════════
Nom: Ahmed Bennani
Email: ahmed.bennani@entraide.ma
Mot de passe: test123
Rôle: Employé
═══════════════════════════════════════════════
```

---

### Test 2 : Connexion Employé avec le Bon Formulaire

**Objectif :** Vérifier qu'un employé peut se connecter via le formulaire Employé

**Étapes :**
1. Se déconnecter (si connecté)
2. Sur la page de connexion, sélectionner **"Employé"**
3. Entrer les identifiants :
   - Email : `ahmed.bennani@entraide.ma`
   - Mot de passe : `test123`
4. Cliquer sur "Se connecter"

**Résultat Attendu :**
- ✅ Connexion réussie
- ✅ Redirection vers le dashboard employé
- ✅ Accès limité aux fonctionnalités employé

---

### Test 3 : Connexion Employé avec le Mauvais Formulaire (ADMIN)

**Objectif :** Vérifier que le système bloque un employé qui essaie de se connecter via le formulaire Admin

**Étapes :**
1. Se déconnecter (si connecté)
2. Sur la page de connexion, sélectionner **"Administrateur"**
3. Entrer les identifiants de l'employé :
   - Email : `ahmed.bennani@entraide.ma`
   - Mot de passe : `test123`
4. Cliquer sur "Se connecter"

**Résultat Attendu :**
- ❌ Connexion refusée
- ✅ Message d'erreur : "Ce compte n'est pas un compte administrateur. Veuillez utiliser le bon formulaire de connexion."

---

### Test 4 : Connexion Admin avec le Mauvais Formulaire (EMPLOYÉ)

**Objectif :** Vérifier que le système bloque un admin qui essaie de se connecter via le formulaire Employé

**Étapes :**
1. Se déconnecter (si connecté)
2. Sur la page de connexion, sélectionner **"Employé"**
3. Entrer les identifiants admin :
   - Email : `admin@entraide.ma`
   - Mot de passe : `admin123`
4. Cliquer sur "Se connecter"

**Résultat Attendu :**
- ❌ Connexion refusée
- ✅ Message d'erreur : "Ce compte n'est pas un compte employé. Veuillez utiliser le bon formulaire de connexion."

---

### Test 5 : Création d'un Compte RH

**Objectif :** Vérifier la création d'un compte avec le rôle RH

**Étapes :**
1. Se connecter en tant qu'admin
2. Aller dans "Employés" → "Nouvel employé"
3. Remplir le formulaire :
   - ID Employé : `RH0001`
   - Prénom : `Fatima`
   - Nom : `Alaoui`
   - Email : `fatima.alaoui@entraide.ma`
   - Téléphone : `+212 6XX XXX XXX`
   - Poste : `Responsable RH`
   - Département : `Ressources Humaines`
   - Salaire : `12000`
   - Date d'embauche : (date actuelle)
   - **Type de compte : RH (gestion des employés)**
   - Mot de passe : `rh123`
4. Cliquer sur "Créer l'employé"

**Résultat Attendu :**
- ✅ Message de succès
- ✅ Dans les logs du backend :
```
Nom: Fatima Alaoui
Email: fatima.alaoui@entraide.ma
Mot de passe: rh123
Rôle: RH
```

---

### Test 6 : Connexion RH

**Objectif :** Vérifier qu'un compte RH peut se connecter et accéder aux fonctionnalités RH

**Étapes :**
1. Se déconnecter
2. Sélectionner **"Ressources Humaines"**
3. Entrer les identifiants :
   - Email : `fatima.alaoui@entraide.ma`
   - Mot de passe : `rh123`
4. Cliquer sur "Se connecter"

**Résultat Attendu :**
- ✅ Connexion réussie
- ✅ Accès aux fonctionnalités RH (gestion employés, validation demandes)

---

### Test 7 : Création sans Adresse Complète

**Objectif :** Vérifier que la création fonctionne même sans adresse complète

**Étapes :**
1. Se connecter en tant qu'admin
2. Créer un nouvel employé
3. Remplir uniquement les champs obligatoires (*)
4. **Ne pas remplir** les champs d'adresse et contact d'urgence
5. Cliquer sur "Créer l'employé"

**Résultat Attendu :**
- ✅ Création réussie
- ✅ Pas d'erreur liée aux champs manquants
- ✅ Employé créé avec des valeurs par défaut pour l'adresse

---

## 🔍 Points de Vérification

### Backend (Logs)
Vérifier dans la console du backend :
- ✅ Affichage des identifiants après création
- ✅ Pas d'erreurs de validation
- ✅ Connexions réussies/refusées selon le rôle

### Frontend
Vérifier dans l'interface :
- ✅ Sélecteur de type de compte visible et fonctionnel
- ✅ Description des permissions affichée
- ✅ Messages d'erreur clairs et explicites
- ✅ Redirection appropriée après connexion

### Base de Données
Vérifier dans MongoDB :
```javascript
// Vérifier les utilisateurs créés
db.users.find({ email: "ahmed.bennani@entraide.ma" })

// Vérifier les employés créés
db.employees.find({ email: "ahmed.bennani@entraide.ma" })
```

---

## 🐛 Problèmes Connus et Solutions

### Problème : "Email déjà utilisé"
**Solution :** Supprimer l'utilisateur existant dans MongoDB ou utiliser un autre email

### Problème : Backend ne démarre pas
**Solution :** 
1. Vérifier que MongoDB est démarré
2. Vérifier les variables d'environnement dans `.env`
3. Réinstaller les dépendances : `npm install`

### Problème : Frontend ne se connecte pas au backend
**Solution :**
1. Vérifier que le backend tourne sur le port 8080
2. Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`

---

## 📊 Tableau Récapitulatif des Comptes de Test

| Nom | Email | Mot de passe | Rôle | Formulaire |
|-----|-------|--------------|------|------------|
| Admin | admin@entraide.ma | admin123 | admin | Administrateur |
| Ahmed Bennani | ahmed.bennani@entraide.ma | test123 | employee | Employé |
| Fatima Alaoui | fatima.alaoui@entraide.ma | rh123 | user (RH) | Ressources Humaines |

---

## ✅ Checklist Finale

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Création d'employé fonctionne
- [ ] Logs affichent les identifiants
- [ ] Connexion avec bon formulaire fonctionne
- [ ] Connexion avec mauvais formulaire est bloquée
- [ ] Sélecteur Employé/RH visible
- [ ] Messages d'erreur appropriés
- [ ] Tous les rôles testés

---

*Guide créé le : ${new Date().toLocaleDateString('fr-FR')}*
