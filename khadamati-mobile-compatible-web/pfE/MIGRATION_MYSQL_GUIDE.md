# 🔄 Guide de Migration MongoDB → MySQL

## ✅ Modifications Effectuées

### 1. **Frontend - Simplification de la connexion**
- ✅ Suppression du mode de sélection de rôle
- ✅ Un seul formulaire de connexion unifié
- ✅ Détection automatique du rôle basée sur l'email
- ✅ Mise à jour de `frontend/app/login/page.tsx`
- ✅ Mise à jour de `frontend/lib/api.ts`

### 2. **Backend - Authentification simplifiée**
- ✅ Suppression du paramètre `expectedRole` dans `LoginRequest.java`
- ✅ Retrait de la vérification du rôle dans `AuthController.java`
- ✅ Le rôle est maintenant détecté automatiquement depuis la base de données

### 3. **Migration MySQL - Configuration**
- ✅ Modification de `pom.xml` : 
  - Remplacement de `spring-boot-starter-data-mongodb` par `spring-boot-starter-data-jpa`
  - Ajout du driver MySQL `mysql-connector-j`
- ✅ Création de `application.yml` avec configuration MySQL
- ✅ Conversion de tous les modèles MongoDB en entités JPA :
  - `User.java` - ✅ Converti
  - `Employee.java` - ✅ Converti
  - `Attendance.java` - ✅ Converti
  - `LeaveRequest.java` - ✅ Converti
  - `DocumentRequest.java` - ✅ Converti
- ✅ Conversion de tous les repositories :
  - `MongoRepository` → `JpaRepository`
  - Type d'ID : `String` → `Long`

## ⚠️ Modifications Restantes à Faire

### Contrôleurs - Changement de type d'ID

Les contrôleurs utilisent encore `String id` au lieu de `Long id`. Voici les fichiers à modifier :

#### 1. **AdminController.java**
```java
// Remplacer tous les @PathVariable String id par @PathVariable Long id
@GetMapping("/users/{id}")
public ResponseEntity<?> getUser(@PathVariable Long id) { ... }

@PutMapping("/users/{id}")
public ResponseEntity<?> updateUser(@PathVariable Long id, ...) { ... }

@DeleteMapping("/users/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) { ... }

@PatchMapping("/users/{id}/toggle-status")
public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) { ... }
```

#### 2. **EmployeeController.java**
```java
@GetMapping("/{id}")
public ResponseEntity<?> getEmployee(@PathVariable Long id) { ... }

@PutMapping("/{id}")
public ResponseEntity<?> updateEmployee(@PathVariable Long id, ...) { ... }

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteEmployee(@PathVariable Long id) { ... }
```

#### 3. **AttendanceController.java**
```java
@PutMapping("/{id}")
public ResponseEntity<?> updateAttendance(@PathVariable Long id, ...) { ... }
```

#### 4. **RhController.java**
```java
@GetMapping("/leave-requests/{id}")
public ResponseEntity<?> getLeaveRequest(@PathVariable Long id) { ... }

@PutMapping("/leave-requests/{id}/approve")
public ResponseEntity<?> approveLeaveRequest(@PathVariable Long id, ...) { ... }

@PutMapping("/leave-requests/{id}/reject")
public ResponseEntity<?> rejectLeaveRequest(@PathVariable Long id, ...) { ... }

@GetMapping("/document-requests/{id}")
public ResponseEntity<?> getDocumentRequest(@PathVariable Long id) { ... }

@PutMapping("/document-requests/{id}/process")
public ResponseEntity<?> processDocumentRequest(@PathVariable Long id, ...) { ... }

@PutMapping("/document-requests/{id}/reject")
public ResponseEntity<?> rejectDocumentRequest(@PathVariable Long id, ...) { ... }
```

### DTOs - Mise à jour des types

Vérifier et mettre à jour les DTOs qui utilisent des IDs :
- `LoginResponse.java` - Changer `String id` → `Long id`
- Autres DTOs qui contiennent des IDs

## 📋 Configuration MySQL

### 1. **Installer MySQL**
```bash
# Windows (avec MySQL Workbench)
# Télécharger depuis: https://dev.mysql.com/downloads/mysql/

# Ou via Chocolatey
choco install mysql

# Démarrer le service
net start MySQL80
```

### 2. **Créer la base de données**
```sql
CREATE DATABASE khadamati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. **Configuration dans application.yml**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/khadamati_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: votre_mot_de_passe_mysql
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Crée/met à jour automatiquement les tables
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
```

## 🚀 Étapes de Démarrage

### 1. **Mettre à jour les contrôleurs**
Remplacer tous les `@PathVariable String id` par `@PathVariable Long id` dans les contrôleurs listés ci-dessus.

### 2. **Compiler le projet**
```bash
cd spring-backend
./mvnw clean install
```

### 3. **Démarrer MySQL**
Assurez-vous que MySQL est démarré et accessible sur le port 3306.

### 4. **Lancer l'application**
```bash
./mvnw spring-boot:run
```

Au premier démarrage, Hibernate créera automatiquement toutes les tables dans MySQL.

### 5. **Créer des données de test**
Vous devrez recréer les comptes de test car la base de données est vide. Utilisez l'endpoint `/auth/register` ou créez un seeder.

## 📊 Différences MongoDB vs MySQL

| Aspect | MongoDB | MySQL |
|--------|---------|-------|
| Type d'ID | String (ObjectId) | Long (auto-increment) |
| Annotations | `@Document`, `@Id` | `@Entity`, `@Table`, `@Id`, `@GeneratedValue` |
| Repository | `MongoRepository` | `JpaRepository` |
| Index | `@Indexed` | `@Column(unique=true)` |
| Relations | Embedded documents | Foreign keys (à implémenter si nécessaire) |

## ✨ Avantages de MySQL

1. **Transactions ACID** : Garanties de cohérence des données
2. **Relations** : Support natif des clés étrangères
3. **Requêtes complexes** : SQL puissant pour les jointures
4. **Outils** : MySQL Workbench, phpMyAdmin
5. **Performance** : Optimisé pour les données structurées

## 🔍 Vérification

Après migration, vérifiez que :
- ✅ Les tables sont créées dans MySQL
- ✅ L'authentification fonctionne
- ✅ Les CRUD fonctionnent correctement
- ✅ Les relations entre entités sont préservées

## 📝 Notes Importantes

1. **Mot de passe MySQL** : Mettez à jour le mot de passe dans `application.yml`
2. **Port MySQL** : Par défaut 3306, modifiez si nécessaire
3. **Données existantes** : Les données MongoDB ne seront pas migrées automatiquement
4. **Seeder** : Créez un nouveau seeder pour MySQL si nécessaire

---

*Migration effectuée le 6 mai 2026*
