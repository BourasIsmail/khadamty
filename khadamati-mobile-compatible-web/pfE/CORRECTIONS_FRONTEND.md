# 🔧 CORRECTIONS FRONTEND NÉCESSAIRES

## 🎯 **Problème principal : Rôles incompatibles**

### ❌ **Ancien système (minuscules)**
- `'admin'` → `'ADMIN'`
- `'user'` → `'RH'` 
- `'employee'` → `'EMPLOYEE'`

### ✅ **Nouveau système Spring Boot (majuscules)**
- `'ADMIN'` - Administrateur système
- `'RH'` - Ressources Humaines (ex-Manager/User)
- `'EMPLOYEE'` - Employé

## 📝 **Fichiers à corriger**

### 1. **`frontend/lib/store.ts`**
```typescript
// AVANT
role: 'admin' | 'user' | 'employee';

// APRÈS  
role: 'ADMIN' | 'RH' | 'EMPLOYEE';
```

### 2. **`frontend/app/dashboard/layout.tsx`**
```typescript
// AVANT
item.roles.includes(user?.role || '')
user?.role === 'admin'

// APRÈS
item.roles.includes(user?.role || '')
user?.role === 'ADMIN'
```

### 3. **`frontend/app/dashboard/page.tsx`**
```typescript
// AVANT
user?.role === 'admin'
user?.role === 'user'
user?.role === 'employee'

// APRÈS
user?.role === 'ADMIN'
user?.role === 'RH'  
user?.role === 'EMPLOYEE'
```

### 4. **`frontend/app/dashboard/employees/page.tsx`**
```typescript
// AVANT
user?.role === 'admin'

// APRÈS
user?.role === 'ADMIN'
```

### 5. **`frontend/app/dashboard/attendance/page.tsx`**
```typescript
// AVANT
user?.role === 'employee'
user?.role !== 'employee'

// APRÈS
user?.role === 'EMPLOYEE'
user?.role !== 'EMPLOYEE'
```

### 6. **`frontend/app/login/page.tsx`**
```typescript
// AVANT
{ email: 'admin@demo.com', role: 'admin', color: 'red' }
{ email: 'rh@demo.com', role: 'user', color: 'blue' }
{ email: 'employee@demo.com', role: 'employee', color: 'green' }

// APRÈS
{ email: 'admin@demo.com', role: 'ADMIN', color: 'red' }
{ email: 'rh@demo.com', role: 'RH', color: 'blue' }
{ email: 'employee@demo.com', role: 'EMPLOYEE', color: 'green' }
```

## 🔄 **Navigation à adapter**

### **`frontend/app/dashboard/layout.tsx`**
```typescript
const navItems = [
  { name: 'Tableau de bord', href: '/dashboard', roles: ['ADMIN', 'RH', 'EMPLOYEE'] },
  { name: 'Employés', href: '/dashboard/employees', roles: ['ADMIN', 'RH'] },
  { name: 'Présences', href: '/dashboard/attendance', roles: ['ADMIN', 'RH', 'EMPLOYEE'] },
  { name: 'Statistiques', href: '/dashboard/analytics', roles: ['ADMIN', 'RH'] },
  { name: 'Mon Profil', href: '/dashboard/profile', roles: ['ADMIN', 'RH', 'EMPLOYEE'] },
  { name: 'Administration', href: '/dashboard/admin', roles: ['ADMIN'] },
]
```

## 🆕 **Nouvelles pages à créer**

### 1. **Page solde de congés** - `/dashboard/leave-balance`
- Affichage des soldes (annuel, maladie, personnel)
- Historique des congés pris
- Bouton "Demander un congé"

### 2. **Page demande de congé** - `/dashboard/leave-request`
- Formulaire de demande
- Sélection du type de congé
- Dates de début/fin
- Motif

### 3. **Page demande d'attestation** - `/dashboard/document-request`
- Formulaire de demande
- Types de documents (travail, salaire, emploi, stage)
- Motif/utilisation

### 4. **Dashboard RH** - `/dashboard/rh`
- Liste des demandes en attente
- Validation/rejet des demandes
- Statistiques RH

## 🔧 **URLs API à corriger**

### **`frontend/lib/api.ts`**
```typescript
// Nouveaux endpoints à ajouter
async getLeaveBalance() {
  return this.request<any>('/employees/leave-balance');
}

async requestLeave(data: any) {
  return this.request<any>('/employees/leave-request', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getMyLeaveRequests() {
  return this.request<any>('/employees/leave-requests');
}

async requestDocument(data: any) {
  return this.request<any>('/employees/document-request', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getMyDocumentRequests() {
  return this.request<any>('/employees/document-requests');
}
```

## 🎨 **Couleurs par rôle à maintenir**

```css
/* ADMIN - Rouge */
.admin-color { color: #ef4444; background: #fef2f2; }

/* RH - Bleu */  
.rh-color { color: #3b82f6; background: #eff6ff; }

/* EMPLOYEE - Vert */
.employee-color { color: #10b981; background: #f0fdf4; }
```

## ⚡ **Ordre de correction**

1. ✅ **Corriger les rôles dans store.ts**
2. ✅ **Corriger les conditions dans layout.tsx**
3. ✅ **Corriger les conditions dans page.tsx**
4. ✅ **Corriger employees/page.tsx**
5. ✅ **Corriger attendance/page.tsx**
6. ✅ **Corriger login/page.tsx**
7. ✅ **Ajouter les nouveaux endpoints API**
8. ✅ **Créer les nouvelles pages Employee**

---

**RÉSULTAT ATTENDU** : Frontend compatible avec les nouveaux rôles Spring Boot et accès aux nouvelles fonctionnalités Employee.