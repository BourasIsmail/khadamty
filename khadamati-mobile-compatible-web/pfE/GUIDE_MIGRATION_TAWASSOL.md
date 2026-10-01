# 🚀 Guide de Migration Tawassol

## 📋 Vue d'Ensemble

Ce guide vous accompagne dans l'ajout des fonctionnalités Tawassol au projet Khadamati existant.

---

## ✅ Ce Qui Est Conservé

Toutes vos données et tables existantes sont **conservées** :

- ✅ **users** (8 utilisateurs) - Inchangée
- ✅ **employees** (9 employés) - Étendue avec nouvelles colonnes
- ✅ **attendances** (168 présences) - Inchangée
- ✅ **leave_requests** - Inchangée
- ✅ **document_requests** - Inchangée

---

## ✨ Ce Qui Est Ajouté

### 1. Structure Organisationnelle (3 tables)
- **coordination_region** - 12 régions du Maroc
- **delegation_province** - Délégations provinciales
- **structure** - Hiérarchie organisationnelle (associations, établissements, centres, complexes)

### 2. Gestion des Grades (2 tables)
- **grade** - Échelles et échelons
- **examen_grade** - Concours internes

### 3. Gestion Financière (3 tables)
- **salaire** - Salaires mensuels avec allocations et retenues
- **prime** - Primes et gratifications
- **credit** - Crédits bancaires et internes

### 4. Ordres de Mission (3 tables)
- **programme_mission** - Catégories de personnel
- **moyen_transport** - Moyens de transport
- **ordre_mission** - Ordres de mission avec indemnités

### 5. Gestion des Demandes (3 tables)
- **type_demande** - 8 types de demandes prédéfinis
- **demande** - Demandes unifiées
- **piece_jointe** - Pièces jointes multiples

### 6. Gestion Documentaire (2 tables)
- **type_document** - 6 types de documents
- **document** - Documents publiés avec expiration

### 7. Communication (2 tables)
- **annonce** - Annonces internes
- **reclamation** - Réclamations avec suivi

### 8. Évaluations (1 table)
- **note_annuelle** - Notes annuelles du personnel

---

## 🔧 Étape 1 : Exécuter la Migration SQL

### Option A : Via Script PowerShell (Recommandé)

```powershell
.\executer_migration_tawassol.ps1
```

Ce script va :
1. ✅ Vérifier que Docker MySQL est actif
2. ✅ Créer une sauvegarde automatique
3. ✅ Afficher un résumé des modifications
4. ✅ Demander confirmation
5. ✅ Exécuter la migration
6. ✅ Vérifier les données insérées

### Option B : Manuellement

```powershell
# 1. Sauvegarder la base actuelle
docker exec khadamati-mysql mysqldump -u root -p2003 khadamati_db > backup.sql

# 2. Exécuter la migration
docker exec -i khadamati-mysql mysql -u root -p2003 khadamati_db < database/ajout_fonctionnalites_tawassol.sql

# 3. Vérifier
docker exec khadamati-mysql mysql -u root -p2003 khadamati_db -e "SHOW TABLES;"
```

---

## 📊 Données Initiales Insérées

Après la migration, vous aurez automatiquement :

- ✅ **12 coordinations régionales** (toutes les régions du Maroc)
- ✅ **8 types de demandes** (congés, attestations, formations, etc.)
- ✅ **6 types de documents** (circulaires, notes, formulaires, etc.)
- ✅ **3 moyens de transport** (transports en commun, voiture de service, voiture privée)
- ✅ **1 grade temporaire** (pour la migration)

---

## 🔍 Vérification Post-Migration

### Vérifier les nouvelles tables

```sql
-- Voir toutes les tables
SHOW TABLES;

-- Compter les coordinations
SELECT COUNT(*) FROM coordination_region;

-- Voir les types de demandes
SELECT * FROM type_demande;

-- Voir les types de documents
SELECT * FROM type_document;

-- Voir les moyens de transport
SELECT * FROM moyen_transport;
```

### Vérifier les données existantes

```sql
-- Vérifier que les données existantes sont intactes
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM employees;
SELECT COUNT(*) FROM attendances;
SELECT COUNT(*) FROM leave_requests;
SELECT COUNT(*) FROM document_requests;
```

---

## 🚀 Étape 2 : Backend Spring Boot

Maintenant que la base de données est prête, il faut créer le code backend.

### 2.1 Créer les Entités JPA

Créer les nouvelles entités dans `spring-backend/src/main/java/com/employeehub/model/` :

```
✨ CoordinationRegion.java
✨ DelegationProvince.java
✨ Structure.java
✨ Grade.java
✨ ExamenGrade.java
✨ Salaire.java
✨ Prime.java
✨ Credit.java
✨ ProgrammeMission.java
✨ MoyenTransport.java
✨ OrdreMission.java
✨ TypeDemande.java
✨ Demande.java
✨ PieceJointe.java
✨ TypeDocument.java
✨ Document.java
✨ Annonce.java
✨ Reclamation.java
✨ NoteAnnuelle.java
```

### 2.2 Créer les Repositories

Créer les repositories dans `spring-backend/src/main/java/com/employeehub/repository/`

### 2.3 Créer les Services

Créer les services dans `spring-backend/src/main/java/com/employeehub/service/`

### 2.4 Créer les Controllers

Créer les controllers REST dans `spring-backend/src/main/java/com/employeehub/controller/`

### 2.5 Créer les DTOs

Créer les DTOs dans `spring-backend/src/main/java/com/employeehub/dto/`

---

## 🎨 Étape 3 : Frontend Next.js

Créer les nouvelles pages et composants dans le frontend.

### Nouvelles Pages

```
✨ /dashboard/structures
✨ /dashboard/ordres-mission
✨ /dashboard/salaires
✨ /dashboard/primes
✨ /dashboard/credits
✨ /dashboard/demandes
✨ /dashboard/documents
✨ /dashboard/annonces
✨ /dashboard/reclamations
✨ /dashboard/notes-annuelles
✨ /dashboard/examens
```

---

## 📱 Étape 4 : Application Mobile Flutter

Adapter l'application mobile pour les nouvelles fonctionnalités.

---

## 🔄 Restauration en Cas de Problème

Si quelque chose ne va pas, vous pouvez restaurer la sauvegarde :

```powershell
# Restaurer la sauvegarde
docker exec -i khadamati-mysql mysql -u root -p2003 khadamati_db < backup_khadamati_YYYYMMDD_HHMMSS.sql
```

---

## 📝 Checklist de Migration

- [ ] Sauvegarder la base de données actuelle
- [ ] Exécuter le script de migration SQL
- [ ] Vérifier que toutes les tables sont créées
- [ ] Vérifier que les données initiales sont insérées
- [ ] Vérifier que les données existantes sont intactes
- [ ] Créer les entités JPA
- [ ] Créer les repositories
- [ ] Créer les services
- [ ] Créer les controllers REST
- [ ] Tester les endpoints avec Postman
- [ ] Créer les pages frontend
- [ ] Adapter l'application mobile
- [ ] Tests complets
- [ ] Documentation

---

## 🆘 Support

En cas de problème :

1. Vérifiez les logs Docker : `docker logs khadamati-mysql`
2. Vérifiez que MySQL est actif : `docker ps`
3. Restaurez la sauvegarde si nécessaire
4. Consultez le fichier `database/ajout_fonctionnalites_tawassol.sql`

---

## 📚 Ressources

- **Script SQL** : `database/ajout_fonctionnalites_tawassol.sql`
- **Script PowerShell** : `executer_migration_tawassol.ps1`
- **Plan complet** : `PLAN_MIGRATION_TAWASSOL.md`
- **Diagramme de classe** : Fourni par l'encadrant

---

## 🎯 Prochaines Étapes

Après avoir exécuté la migration SQL, la prochaine étape est de créer les entités JPA dans le backend Spring Boot.

**Voulez-vous que je commence à créer les entités JPA maintenant ?**
