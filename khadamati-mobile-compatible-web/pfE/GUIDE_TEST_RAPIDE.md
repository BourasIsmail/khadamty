# 🧪 GUIDE DE TEST RAPIDE

## Comment Tester Toutes les Nouvelles Fonctionnalités

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Démarrer le Backend
```bash
cd spring-backend
./mvnw spring-boot:run
```
✅ Attendre le message : "Started EmployeeHubApplication"

### 2. Démarrer le Frontend
```bash
cd frontend
npm run dev
```
✅ Attendre le message : "Ready in X ms"

### 3. Ouvrir le Navigateur
```
http://localhost:3000
```

---

## ✅ CHECKLIST DE TEST

### Authentification
- [ ] Se connecter avec un compte ADMIN
- [ ] Se connecter avec un compte MANAGER
- [ ] Se connecter avec un compte EMPLOYEE
- [ ] Vérifier que les permissions sont respectées

---

## 📋 TESTS PAR PAGE

### 1. Grades (`/dashboard/grades`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] La liste des grades apparaît
- [ ] La barre de recherche fonctionne
- [ ] Le compteur affiche le bon nombre

#### Tests CRUD (ADMIN/MANAGER)
- [ ] Cliquer sur "Nouveau grade"
- [ ] Remplir le formulaire :
  - Code : `GR-TEST`
  - Libellé FR : `Grade Test`
  - Niveau : `5`
  - Salaire Base : `8000`
- [ ] Créer le grade
- [ ] Vérifier qu'il apparaît dans la liste
- [ ] Modifier le grade
- [ ] Supprimer le grade

#### Tests Permissions (EMPLOYEE)
- [ ] Se connecter en tant qu'EMPLOYEE
- [ ] Vérifier que le bouton "Nouveau grade" n'apparaît pas
- [ ] Vérifier que les boutons Modifier/Supprimer n'apparaissent pas

---

### 2. Structures (`/dashboard/structures`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] La liste des structures apparaît
- [ ] La hiérarchie est visible (indentation)
- [ ] Les types sont affichés avec les bonnes couleurs

#### Tests CRUD (ADMIN/MANAGER)
- [ ] Créer une nouvelle structure :
  - Code : `STR-TEST`
  - Libellé FR : `Structure Test`
  - Type : `SERVICE`
  - Niveau : `2`
- [ ] Vérifier la création
- [ ] Modifier la structure
- [ ] Supprimer la structure

---

### 3. Salaires (`/dashboard/salaires`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les 3 cartes statistiques s'affichent :
  - Total des salaires
  - Nombre d'employés
  - Salaire moyen
- [ ] La liste des salaires apparaît

#### Tests de Filtrage
- [ ] Filtrer par mois (ex: Janvier)
- [ ] Filtrer par année (ex: 2024)
- [ ] Rechercher un employé par nom
- [ ] Vérifier que les filtres fonctionnent ensemble

#### Tests d'Affichage
- [ ] Vérifier que le salaire brut s'affiche
- [ ] Vérifier que les déductions s'affichent
- [ ] Vérifier que le salaire net s'affiche
- [ ] Vérifier les badges de statut

---

### 4. Primes (`/dashboard/primes`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] La carte "Total des Primes" s'affiche
- [ ] La liste des primes apparaît

#### Tests de Filtrage
- [ ] Filtrer par type (PERFORMANCE, ANCIENNETE, etc.)
- [ ] Rechercher une prime
- [ ] Vérifier les badges de type

#### Tests CRUD (ADMIN/MANAGER)
- [ ] Cliquer sur "Nouvelle prime"
- [ ] Vérifier que le modal/page s'ouvre
- [ ] Supprimer une prime (avec confirmation)

---

### 5. Crédits (`/dashboard/credits`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les 2 cartes statistiques s'affichent :
  - Total des crédits
  - Montant restant
- [ ] La liste des crédits apparaît

#### Tests de Filtrage
- [ ] Filtrer par statut (EN_COURS, REMBOURSE, etc.)
- [ ] Rechercher un crédit
- [ ] Vérifier les badges de statut

#### Tests d'Affichage
- [ ] Vérifier le montant total
- [ ] Vérifier le montant restant
- [ ] Vérifier la mensualité

---

### 6. Ordres de Mission (`/dashboard/ordres-mission`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les ordres s'affichent en cartes
- [ ] Les badges de statut sont corrects

#### Tests de Filtrage
- [ ] Filtrer par statut
- [ ] Rechercher par destination
- [ ] Rechercher par employé

#### Tests d'Actions (ADMIN/MANAGER)
- [ ] Trouver un ordre "EN_ATTENTE"
- [ ] Cliquer sur "Approuver"
- [ ] Vérifier que le statut change
- [ ] Trouver un autre ordre "EN_ATTENTE"
- [ ] Cliquer sur "Rejeter"
- [ ] Entrer un motif
- [ ] Vérifier que le statut change

---

### 7. Demandes (`/dashboard/demandes`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] La liste des demandes apparaît
- [ ] Les numéros de demande s'affichent

#### Tests de Filtrage
- [ ] Filtrer par statut
- [ ] Rechercher une demande
- [ ] Vérifier les badges de priorité

#### Tests d'Actions (ADMIN/MANAGER)
- [ ] Trouver une demande "EN_ATTENTE"
- [ ] Cliquer sur "Approuver"
- [ ] Vérifier le changement de statut
- [ ] Trouver une autre demande "EN_ATTENTE"
- [ ] Cliquer sur "Rejeter"
- [ ] Entrer un motif
- [ ] Vérifier le changement de statut

---

### 8. Documents (`/dashboard/documents`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les documents s'affichent en cartes
- [ ] Les icônes de fichiers sont correctes

#### Tests de Filtrage
- [ ] Filtrer par type de document
- [ ] Rechercher un document
- [ ] Vérifier les badges "Publié" / "Brouillon"

#### Tests d'Actions (ADMIN/MANAGER)
- [ ] Trouver un document non publié
- [ ] Cliquer sur "Publier"
- [ ] Vérifier que le badge change
- [ ] Cliquer sur "Télécharger" (toast "à venir")
- [ ] Supprimer un document (avec confirmation)

---

### 9. Réclamations (`/dashboard/reclamations`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les réclamations s'affichent en cartes
- [ ] Les badges de statut et priorité s'affichent

#### Tests de Filtrage
- [ ] Filtrer par statut
- [ ] Rechercher une réclamation
- [ ] Vérifier les badges

#### Tests d'Actions (ADMIN/MANAGER)
- [ ] Trouver une réclamation "OUVERTE"
- [ ] Cliquer sur "Résoudre"
- [ ] Entrer une réponse
- [ ] Vérifier que la réponse s'affiche
- [ ] Vérifier que le statut change

---

### 10. Notes Annuelles (`/dashboard/notes-annuelles`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] La carte "Note Moyenne" s'affiche
- [ ] La liste des notes apparaît

#### Tests de Filtrage
- [ ] Filtrer par année
- [ ] Rechercher un employé
- [ ] Vérifier les couleurs des notes

#### Tests d'Affichage
- [ ] Vérifier la note finale /20
- [ ] Vérifier l'appréciation
- [ ] Vérifier l'évaluateur
- [ ] Vérifier le badge "Validée" / "En attente"

#### Tests d'Actions (ADMIN/MANAGER)
- [ ] Trouver une note non validée
- [ ] Cliquer sur "Valider"
- [ ] Vérifier que le badge change

---

### 11. Examens (`/dashboard/examens`)

#### Tests de Base
- [ ] La page s'affiche correctement
- [ ] Les examens s'affichent en cartes
- [ ] Les badges "À venir" / "Passé" sont corrects

#### Tests de Filtrage
- [ ] Filtrer par type
- [ ] Rechercher un examen
- [ ] Vérifier les badges de type

#### Tests d'Affichage
- [ ] Vérifier le libellé FR
- [ ] Vérifier le libellé AR (si présent)
- [ ] Vérifier le grade cible
- [ ] Vérifier la date
- [ ] Vérifier le nombre de postes

---

## 🎨 TESTS DE DESIGN

### Responsive Design
- [ ] Tester sur mobile (< 640px)
- [ ] Tester sur tablet (640px - 1024px)
- [ ] Tester sur desktop (> 1024px)
- [ ] Vérifier que les grilles s'adaptent
- [ ] Vérifier que les tables sont scrollables

### Thème et Couleurs
- [ ] Vérifier la cohérence des couleurs
- [ ] Vérifier les badges de statut
- [ ] Vérifier les cartes statistiques
- [ ] Vérifier les boutons d'action

### Animations
- [ ] Vérifier les transitions au survol
- [ ] Vérifier le loading spinner
- [ ] Vérifier les toasts de notification

---

## 🔐 TESTS DE SÉCURITÉ

### Permissions EMPLOYEE
- [ ] Se connecter en tant qu'EMPLOYEE
- [ ] Vérifier que tous les boutons "Nouveau" sont cachés
- [ ] Vérifier que tous les boutons "Modifier" sont cachés
- [ ] Vérifier que tous les boutons "Supprimer" sont cachés
- [ ] Vérifier que tous les boutons "Approuver" sont cachés

### Permissions MANAGER
- [ ] Se connecter en tant qu'MANAGER
- [ ] Vérifier que les boutons "Nouveau" sont visibles
- [ ] Vérifier que les boutons "Approuver" sont visibles
- [ ] Vérifier que les boutons "Supprimer" sont cachés (sauf ADMIN)

### Permissions ADMIN
- [ ] Se connecter en tant qu'ADMIN
- [ ] Vérifier que tous les boutons sont visibles
- [ ] Vérifier que toutes les actions fonctionnent

---

## 🐛 TESTS D'ERREURS

### Gestion des Erreurs
- [ ] Arrêter le backend
- [ ] Essayer de charger une page
- [ ] Vérifier qu'un toast d'erreur apparaît
- [ ] Redémarrer le backend
- [ ] Vérifier que la page se charge

### Validation des Formulaires
- [ ] Essayer de créer un grade sans code
- [ ] Vérifier que le formulaire ne se soumet pas
- [ ] Essayer de créer avec des données invalides
- [ ] Vérifier les messages d'erreur

### Confirmations
- [ ] Essayer de supprimer un élément
- [ ] Vérifier que la confirmation apparaît
- [ ] Cliquer sur "Annuler"
- [ ] Vérifier que l'élément n'est pas supprimé
- [ ] Essayer à nouveau et confirmer
- [ ] Vérifier que l'élément est supprimé

---

## 📊 TESTS DE PERFORMANCE

### Temps de Chargement
- [ ] Mesurer le temps de chargement de chaque page
- [ ] Vérifier que c'est < 2 secondes
- [ ] Vérifier le loading spinner

### Recherche et Filtres
- [ ] Tester la recherche avec beaucoup de données
- [ ] Vérifier que c'est instantané (< 200ms)
- [ ] Tester les filtres
- [ ] Vérifier que c'est instantané

---

## 📝 RAPPORT DE TEST

### Template de Rapport

```markdown
# Rapport de Test - [Date]

## Environnement
- Backend : ✅ / ❌
- Frontend : ✅ / ❌
- Database : ✅ / ❌

## Pages Testées
- [ ] Grades : ✅ / ❌
- [ ] Structures : ✅ / ❌
- [ ] Salaires : ✅ / ❌
- [ ] Primes : ✅ / ❌
- [ ] Crédits : ✅ / ❌
- [ ] Ordres Mission : ✅ / ❌
- [ ] Demandes : ✅ / ❌
- [ ] Documents : ✅ / ❌
- [ ] Réclamations : ✅ / ❌
- [ ] Notes Annuelles : ✅ / ❌
- [ ] Examens : ✅ / ❌

## Bugs Trouvés
1. [Description du bug]
   - Page : [Nom de la page]
   - Étapes : [Comment reproduire]
   - Gravité : Critique / Majeur / Mineur

## Améliorations Suggérées
1. [Description de l'amélioration]
   - Page : [Nom de la page]
   - Priorité : Haute / Moyenne / Basse

## Conclusion
- Tests réussis : X/11
- Bugs critiques : X
- Bugs majeurs : X
- Bugs mineurs : X
```

---

## 🎯 TESTS PRIORITAIRES

### Tests Critiques (À faire en premier)
1. ✅ Authentification
2. ✅ Navigation entre pages
3. ✅ Affichage des listes
4. ✅ Recherche et filtres
5. ✅ Permissions par rôle

### Tests Importants
1. ✅ CRUD complet
2. ✅ Actions métier (approbation, validation)
3. ✅ Statistiques
4. ✅ Responsive design

### Tests Secondaires
1. ✅ Animations
2. ✅ Toasts
3. ✅ Confirmations
4. ✅ Messages d'erreur

---

## 🚀 APRÈS LES TESTS

### Si Tout Fonctionne
1. ✅ Marquer le frontend comme "Testé"
2. ✅ Passer aux tests d'intégration
3. ✅ Préparer le déploiement

### Si Des Bugs Sont Trouvés
1. 📝 Documenter chaque bug
2. 🔧 Corriger les bugs critiques
3. 🔧 Corriger les bugs majeurs
4. ⏳ Planifier les bugs mineurs
5. 🔄 Re-tester après corrections

---

## 💡 CONSEILS

### Pour Tester Efficacement
- ✅ Tester une page à la fois
- ✅ Suivre la checklist
- ✅ Noter tous les bugs
- ✅ Prendre des captures d'écran
- ✅ Tester avec différents rôles

### Pour Gagner du Temps
- ✅ Utiliser les raccourcis clavier
- ✅ Garder DevTools ouvert (F12)
- ✅ Utiliser plusieurs onglets
- ✅ Tester les cas d'usage réels

---

**Bon courage pour les tests !** 🧪

**N'oubliez pas de documenter tous les bugs trouvés.** 📝
