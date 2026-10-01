# 📊 Analyse de la Base de Données Tawassol

## 🎯 Vue d'Ensemble

**Base de données** : `tawassol`  
**Type** : Système de gestion RH pour association (AOS - Association des Œuvres Sociales)  
**Encodage** : UTF-8 (support arabe et français)  
**Moteur** : InnoDB avec clés étrangères

---

## 📋 Tables Principales (21 tables)

### 1️⃣ **Gestion du Personnel**

#### `personnel` (Table centrale)
- **Clé primaire** : UUID
- **Champs principaux** :
  - `matricule` (unique)
  - Nom/Prénom (AR + FR)
  - `date_recrutement`
  - `email`, `photo`
  - `echelon`, `echelle`, `date_echelon`
  - `est_actif`
- **Relations** :
  - → `grade` (grade_id)
  - → `structure` (structure_id)

#### `grade`
- Système de grades avec échelles
- `code`, `libelle_fr`, `libelle_ar`
- `echelle`, `nb_echelons`, `taux`

---

### 2️⃣ **Structure Organisationnelle**

#### `coordination_region` (12 régions du Maroc)
- Coordinations régionales
- Noms en arabe et français
- Téléphone, adresse

#### `delegation_province`
- Délégations provinciales
- Rattachées aux coordinations
- 3 numéros de téléphone (fixe, Inwi, flotte)

#### `structure`
- Types : association, établissement, centre, complexe
- Hiérarchie (parent_id)
- Rattachée à une délégation

---

### 3️⃣ **Gestion des Demandes**

#### `demande`
- Demandes administratives du personnel
- Statuts : brouillon, soumise, approuvée, rejetée
- Traçabilité (créateur, traiteur)
- Commentaires RH

#### `type_demande` (8 types prédéfinis)
1. Ordre de mission
2. Congé annuel
3. Congé maladie
4. Congé exceptionnel
5. Attestation de travail
6. Avance sur salaire
7. Inscription formation
8. Autre

#### `piece_jointe`
- Pièces jointes des demandes
- Stockage : nom, URL, type MIME, taille

---

### 4️⃣ **Ordres de Mission**

#### `ordre_mission`
- Gestion complète des déplacements
- **Champs clés** :
  - `numero_ordm` (ex: KB / 7 / 2025)
  - `numero_etat` (ex: EN-PG / KB - 20 / 2025)
  - Dates départ/retour
  - Délégation départ/arrivée
  - Moyen de transport
  - Indemnités (taux 1 et 2)
  - Nombre de repas
  - Montant total
- **Statuts** : en_attente, approuvé, rejeté, annulé
- Cycle trimestriel (1-4)

#### `programme_mission`
- Catégories de personnel pour missions
- Montant max par déplacement

#### `moyen_transport`
- Transports en commun
- Voiture de service
- Voiture privée

---

### 5️⃣ **Gestion Financière**

#### `salaire`
- Historique mensuel des salaires
- Contrainte unique : (personnel_id, année, mois)
- Champs :
  - `salaire_net`
  - `alloc_familiale`
  - `retenue_mutuelle`
  - `rappel`
  - `echelon` (snapshot)

#### `prime`
- Types : gratification, indemnité, autre
- Montant brut, IR, montant net
- Date de la prime

#### `credit`
- Crédits bancaires ou internes AOS
- Mensualité, montant global/restant
- Nombre de mois restants
- Numéro de dossier

---

### 6️⃣ **Évaluation & Examens**

#### `note_annuelle`
- Notes annuelles du personnel
- Contrainte unique : (personnel_id, année)
- Note (sur 20), appréciation
- Traçabilité (saisie_par)

#### `examen_grade`
- Examens professionnels
- Grade cible, année, date
- Nombre de postes
- Résultats écrit et final (fichiers)

---

### 7️⃣ **Communication**

#### `annonce`
- Annonces internes
- Titre, message
- Publication et expiration
- Statut actif/inactif

#### `reclamation`
- Réclamations du personnel
- Statuts : nouvelle, en_cours, résolue, rejetée
- Objet, description, réponse

---

### 8️⃣ **Gestion Documentaire**

#### `document`
- Documents officiels
- Types de documents
- Publication et expiration
- URL fichier ou contenu texte

#### `type_document` (6 types)
1. Circulaire
2. Note de service
3. Formulaire
4. Guide pratique
5. Décision
6. Résultats examen

---

### 9️⃣ **Authentification**

#### `utilisateur`
- Lien avec personnel (optionnel)
- Login unique
- Mot de passe hashé (bcrypt)
- **Rôles** : agent, rh, responsable, admin
- Dernière connexion
- Statut actif/inactif

**Compte par défaut** :
- Login : `admin`
- Mot de passe : À CHANGER (hash bcrypt)

---

## 🔗 Relations Clés

```
coordination_region (1) ──→ (N) delegation_province
delegation_province (1) ──→ (N) structure
structure (1) ──→ (N) personnel
personnel (1) ──→ (1) utilisateur
personnel (1) ──→ (N) demande
personnel (1) ──→ (N) ordre_mission
personnel (1) ──→ (N) salaire
personnel (1) ──→ (N) prime
personnel (1) ──→ (N) credit
personnel (1) ──→ (N) note_annuelle
personnel (1) ──→ (N) reclamation
demande (1) ──→ (N) piece_jointe
grade (1) ──→ (N) personnel
grade (1) ──→ (N) examen_grade
```

---

## 🎨 Caractéristiques Techniques

### ✅ Points Forts

1. **Multilingue** : Support arabe/français natif
2. **UUID** : Clés primaires UUID (36 caractères)
3. **Audit Trail** : `cree_le`, `modifie_le` sur toutes les tables
4. **Soft Delete** : Champs `est_actif` au lieu de suppression
5. **Contraintes** : Clés étrangères avec CASCADE/RESTRICT
6. **Index** : Index sur les champs fréquemment recherchés
7. **Enums** : Types énumérés pour les statuts
8. **Snapshots** : Conservation de l'échelon dans salaire
9. **Hiérarchie** : Structure organisationnelle à 3 niveaux
10. **Traçabilité** : Champs `cree_par`, `traite_par`, `saisie_par`

### 🔧 Fonctionnalités Avancées

- **Ordres de mission** avec calcul d'indemnités
- **Gestion des crédits** avec suivi mensuel
- **Examens professionnels** avec résultats
- **Notes annuelles** avec contrainte unicité
- **Réclamations** avec workflow
- **Documents** avec expiration automatique
- **Annonces** avec période de validité

---

## 📊 Données Initiales

### Coordinations Régionales (12)
- Toutes les régions du Maroc
- De Tanger à Dakhla

### Types de Demandes (8)
- Couvrent tous les besoins administratifs

### Types de Documents (6)
- Organisation documentaire complète

### Moyens de Transport (3)
- Pour les ordres de mission

### Grade Temporaire (1)
- Grade par défaut "à définir"

### Utilisateur Admin (1)
- Login : `admin`
- ⚠️ Mot de passe à changer immédiatement

---

## 🆚 Comparaison avec Khadamati

| Fonctionnalité | Tawassol | Khadamati |
|----------------|----------|-----------|
| **Personnel** | ✅ Complet (matricule, grades, échelons) | ✅ Basique (employees) |
| **Structure Org** | ✅ 3 niveaux (région/province/structure) | ❌ Absente |
| **Ordres de Mission** | ✅ Complet avec indemnités | ❌ Absent |
| **Demandes Admin** | ✅ 8 types + workflow | ✅ Basique (leave_requests, document_requests) |
| **Salaires** | ✅ Historique mensuel | ❌ Absent |
| **Primes** | ✅ Avec IR | ❌ Absent |
| **Crédits** | ✅ Suivi complet | ❌ Absent |
| **Notes Annuelles** | ✅ Évaluation | ❌ Absent |
| **Examens** | ✅ Gestion complète | ❌ Absent |
| **Réclamations** | ✅ Workflow | ❌ Absent |
| **Documents** | ✅ Gestion documentaire | ❌ Absent |
| **Annonces** | ✅ Avec expiration | ❌ Absent |
| **Présences** | ❌ Absent | ✅ Pointage (attendances) |
| **Multilingue** | ✅ AR/FR natif | ❌ FR uniquement |
| **Authentification** | ✅ 4 rôles | ✅ 3 rôles |

---

## 💡 Recommandations

### Pour Khadamati

Si vous voulez intégrer des fonctionnalités de Tawassol dans Khadamati :

1. **Ajouter la structure organisationnelle** (régions/provinces/structures)
2. **Implémenter les ordres de mission** avec calcul d'indemnités
3. **Ajouter la gestion des salaires** (historique mensuel)
4. **Créer le module primes** avec calcul IR
5. **Ajouter les réclamations** avec workflow
6. **Implémenter la gestion documentaire**
7. **Support multilingue** (arabe/français)
8. **Système de grades et échelons**

### Pour Tawassol

Si vous voulez ajouter des fonctionnalités de Khadamati :

1. **Ajouter le pointage** (check-in/check-out)
2. **Dashboard temps réel** avec statistiques
3. **Interface moderne** (Next.js + Tailwind)
4. **API REST** bien structurée

---

## 🎯 Conclusion

**Tawassol** est un système RH **très complet** orienté **administration publique marocaine** avec :
- Gestion hiérarchique complexe
- Workflow de demandes administratives
- Gestion financière (salaires, primes, crédits)
- Ordres de mission avec indemnités
- Évaluation et examens professionnels
- Support bilingue (AR/FR)

**Khadamati** est plus **simple et moderne** avec :
- Focus sur le pointage et les présences
- Interface utilisateur moderne
- API REST bien structurée
- Dashboard temps réel

Les deux systèmes sont **complémentaires** et pourraient être fusionnés pour créer un système RH complet.
