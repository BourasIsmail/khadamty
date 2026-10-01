# 🔐 Modifications de la Connexion - Détection Automatique du Rôle

## 📋 Résumé des Changements

### Avant
- 3 formulaires de connexion séparés (Admin, RH, Employé)
- L'utilisateur devait choisir son rôle avant de se connecter
- Le frontend envoyait `expectedRole` au backend
- Le backend vérifiait que le rôle du compte correspondait au formulaire choisi

### Après
- ✅ **Un seul formulaire de connexion unifié**
- ✅ **Détection automatique du rôle** basée sur l'email
- ✅ **Pas de sélection de rôle** par l'utilisateur
- ✅ **Redirection automatique** vers le dashboard approprié

## 🎨 Modifications Frontend

### 1. **Page de Connexion** (`frontend/app/login/page.tsx`)

#### Changements :
- ❌ Suppression du mode `'select'` (sélection de rôle)
- ❌ Suppression de la constante `ROLES`
- ❌ Suppression de la fonction `handleSelectRole`
- ❌ Suppression de l'état `role`
- ✅ Mode direct `'login'` au chargement
- ✅ Formulaire simplifié sans sélection de rôle
- ✅ Message mis à jour : "Votre rôle est détecté automatiquement"

#### Code Avant :
```typescript
const [mode, setMode] = useState<Mode>('select')
const [role, setRole] = useState<Role>('EMPLOYEE')

// Sélection du rôle
{mode === 'select' && (
  <div>
    {ROLES.map(r => (
      <button onClick={() => handleSelectRole(r.role)}>
        {r.label}
      </button>
    ))}
  </div>
)}
```

#### Code Après :
```typescript
const [mode, setMode] = useState<Mode>('login')
// Plus de sélection de rôle

// Formulaire direct
{mode === 'login' && (
  <form onSubmit={handleLogin}>
    <input type="email" />
    <input type="password" />
    <button type="submit">Se connecter</button>
  </form>
)}
```

### 2. **API Client** (`frontend/lib/api.ts`)

#### Changements :
- ❌ Suppression du paramètre optionnel `expectedRole`
- ✅ Signature simplifiée de la fonction `login`

#### Code Avant :
```typescript
async login(credentials: { 
  email: string; 
  password: string; 
  expectedRole?: string 
}) {
  return this.request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
```

#### Code Après :
```typescript
async login(credentials: { 
  email: string; 
  password: string 
}) {
  return this.request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
```

## 🔧 Modifications Backend

### 1. **DTO LoginRequest** (`LoginRequest.java`)

#### Changements :
- ❌ Suppression du champ `expectedRole`
- ❌ Suppression du constructeur avec `expectedRole`
- ❌ Suppression des getters/setters pour `expectedRole`

#### Code Avant :
```java
public class LoginRequest {
    private String email;
    private String password;
    private String expectedRole; // ❌ Supprimé
    
    public String getExpectedRole() { return expectedRole; }
    public void setExpectedRole(String expectedRole) { 
        this.expectedRole = expectedRole; 
    }
}
```

#### Code Après :
```java
public class LoginRequest {
    private String email;
    private String password;
    // Plus de expectedRole
}
```

### 2. **AuthController** (`AuthController.java`)

#### Changements :
- ❌ Suppression de la logique de vérification du rôle
- ✅ Détection automatique du rôle depuis la base de données
- ✅ Envoi de l'OTP sans vérification de rôle

#### Code Avant :
```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
    // ... vérification email/password ...
    
    // ❌ Vérification du rôle attendu
    String expectedRole = req.getExpectedRole();
    if (expectedRole != null && !expectedRole.isBlank()) {
        String userRole = user.getRole().name();
        if (!userRole.equalsIgnoreCase(expectedRole)) {
            return ResponseEntity.status(403).body(Map.of(
                "message", "Ce compte n'est pas un compte " + roleLabel
            ));
        }
    }
    
    otpService.generateAndSendOtp(user.getEmail(), user.getFirstName());
    // ...
}
```

#### Code Après :
```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
    // ... vérification email/password ...
    
    // ✅ Détection automatique du rôle - pas de vérification
    otpService.generateAndSendOtp(user.getEmail(), user.getFirstName());
    
    return ResponseEntity.ok(Map.of(
        "message", "Code envoyé à " + maskEmail(user.getEmail()),
        "email", user.getEmail(),
        "requireOtp", true
    ));
}
```

## 🔄 Flux de Connexion

### Nouveau Flux :

1. **Utilisateur** : Saisit email + mot de passe
2. **Frontend** : Envoie `{ email, password }` au backend
3. **Backend** : 
   - Vérifie l'email et le mot de passe
   - Récupère le rôle depuis la base de données
   - Envoie un OTP par email
4. **Utilisateur** : Saisit le code OTP
5. **Backend** : 
   - Vérifie l'OTP
   - Génère un JWT avec le rôle détecté
   - Retourne `{ token, id, email, firstName, lastName, role }`
6. **Frontend** : 
   - Stocke le token et les infos utilisateur
   - Redirige vers `/dashboard`
   - Le layout du dashboard affiche le menu selon le rôle

## ✅ Avantages

1. **Expérience utilisateur simplifiée** : Un seul formulaire pour tous
2. **Moins d'erreurs** : L'utilisateur ne peut pas se tromper de formulaire
3. **Code plus simple** : Moins de logique conditionnelle
4. **Sécurité maintenue** : Le rôle est toujours vérifié côté backend
5. **Flexibilité** : Facile d'ajouter de nouveaux rôles

## 🔒 Sécurité

- ✅ Le rôle est toujours stocké dans la base de données
- ✅ Le JWT contient le rôle pour l'autorisation
- ✅ Les endpoints sont protégés par `@PreAuthorize`
- ✅ Pas de possibilité de "choisir" un rôle non autorisé

## 📱 Interface Utilisateur

### Panneau Gauche (Informations)
```
Accès à la plateforme
• Administrateur
• Ressources Humaines  
• Employé

Votre rôle est détecté automatiquement lors de la connexion.
```

### Formulaire de Connexion
```
Connexion
Connectez-vous à votre espace Khadamati

[Email]
[Mot de passe]
[Se connecter →]
```

## 🧪 Tests

### Comptes de Test
```
Admin : admin@demo.com / password123
RH    : rh@demo.com / password123
Employé : employee@demo.com / password123
```

### Scénarios à Tester
1. ✅ Connexion avec un compte Admin
2. ✅ Connexion avec un compte RH
3. ✅ Connexion avec un compte Employé
4. ✅ Email incorrect → Erreur
5. ✅ Mot de passe incorrect → Erreur
6. ✅ Compte désactivé → Erreur
7. ✅ OTP correct → Connexion réussie
8. ✅ OTP incorrect → Erreur

## 📝 Notes

- Les modifications sont **rétrocompatibles** avec les données existantes
- Aucune migration de données n'est nécessaire
- Le système d'OTP reste inchangé
- Les autorisations par rôle restent identiques

---

*Modifications effectuées le 6 mai 2026*
