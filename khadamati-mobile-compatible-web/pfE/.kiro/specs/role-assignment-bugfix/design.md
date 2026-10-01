# Role Assignment Bugfix Design

## Overview

The Khadamati application has a critical role-based access control bug where three employee-specific sections ("Ordres Mission", "Demandes", "Documents") are incorrectly assigned to ADMIN and RH roles in the dashboard navigation menu. This causes administrators and HR staff to see sections intended exclusively for employees, creating confusion and potential security concerns. The fix ensures proper role-based menu filtering so each user role only sees relevant sections in the dashboard navigation.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a user with ADMIN or RH role accesses the dashboard and the navigation menu incorrectly displays employee-only sections
- **Property (P)**: The desired behavior when the bug condition is fixed - the navigation menu displays only sections appropriate for each role
- **Preservation**: Existing menu display behavior for all other sections and roles that must remain unchanged by the fix
- **navItems**: The array in `frontend/app/dashboard/layout.tsx` (lines 27-40) that defines all dashboard navigation items with their roles
- **filteredNav**: The computed array that filters navItems based on the current user's role (line 195)
- **roles array**: The property on each navItem that specifies which user roles can access that section

## Bug Details

### Bug Condition

The bug manifests when a user with ADMIN or RH role accesses the dashboard. The `navItems` array in `frontend/app/dashboard/layout.tsx` incorrectly assigns the three employee-specific sections ("Ordres Mission", "Demandes", "Documents") to roles `['ADMIN','RH']` instead of `['EMPLOYEE']`. This causes the `filteredNav` computation to include these sections in the navigation menu for ADMIN and RH users, violating the principle of least privilege.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { userRole: string, currentPath: string }
  OUTPUT: boolean
  
  RETURN (input.userRole IN ['ADMIN', 'RH'])
         AND (currentPath STARTS_WITH '/dashboard')
         AND (navItems contains item WHERE item.name IN ['Ordres Mission', 'Demandes', 'Documents']
              AND item.roles CONTAINS input.userRole)
END FUNCTION
```

### Examples

**Example 1: ADMIN user sees employee sections**
- User logs in with role ADMIN
- User navigates to /dashboard
- Expected: Menu shows only ADMIN sections (Tableau de bord, Employés, Structures, Salaires, Annonces, Gestion RH, Statistiques, Mon Profil, Administration)
- Actual: Menu incorrectly shows "Ordres Mission", "Demandes", "Documents" alongside ADMIN sections
- Bug triggered: YES

**Example 2: RH user sees employee sections**
- User logs in with role RH
- User navigates to /dashboard
- Expected: Menu shows only RH sections (Tableau de bord, Employés, Structures, Salaires, Annonces, Gestion RH, Statistiques, Mon Profil)
- Actual: Menu incorrectly shows "Ordres Mission", "Demandes", "Documents" alongside RH sections
- Bug triggered: YES

**Example 3: EMPLOYEE user does NOT see admin sections (correct behavior)**
- User logs in with role EMPLOYEE
- User navigates to /dashboard
- Expected: Menu shows only EMPLOYEE sections (Tableau de bord, Annonces, Mes congés, Mes attestations, Mon Profil)
- Actual: Menu correctly shows only EMPLOYEE sections
- Bug triggered: NO

**Example 4: ADMIN user does NOT see RH-only sections (correct behavior)**
- User logs in with role ADMIN
- User navigates to /dashboard
- Expected: Menu shows ADMIN sections but NOT RH-only sections
- Actual: Menu correctly shows ADMIN sections
- Bug triggered: NO

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- ADMIN users must continue to see "Tableau de bord", "Employés", "Structures", "Salaires", "Annonces", "Gestion RH", "Statistiques", "Mon Profil", and "Administration"
- RH users must continue to see "Tableau de bord", "Employés", "Structures", "Salaires", "Annonces", "Gestion RH", "Statistiques", and "Mon Profil"
- EMPLOYEE users must continue to see "Tableau de bord", "Annonces", "Mes congés", "Mes attestations", and "Mon Profil"
- All users must continue to see "Tableau de bord", "Annonces", and "Mon Profil" (shared sections)
- Navigation links must continue to function correctly
- Active route highlighting must continue to work
- Sidebar collapse/expand functionality must continue to work

**Scope:**
All inputs that do NOT involve ADMIN or RH users accessing the dashboard should be completely unaffected by this fix. This includes:
- EMPLOYEE user navigation (already correct)
- All non-navigation functionality (user profile, notifications, logout)
- Backend API endpoints and permissions
- Other dashboard pages and components

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is straightforward:

1. **Incorrect Role Assignment in navItems Array**: Lines 28-30 in `frontend/app/dashboard/layout.tsx` explicitly assign the three employee-specific sections to `roles: ['ADMIN','RH']` instead of `roles: ['EMPLOYEE']`. This is a direct configuration error.

2. **No Backend Validation**: While the frontend incorrectly shows these sections, there is no mention of backend permission checks that would prevent ADMIN/RH users from accessing these endpoints if they somehow navigated to them directly.

3. **Copy-Paste Error**: The pattern suggests these three items were likely copied from other items and the roles array was not updated correctly during the copy operation.

## Correctness Properties

Property 1: Bug Condition - Employee Sections Hidden from ADMIN and RH

_For any_ user with role ADMIN or RH accessing the dashboard, the fixed navigation menu SHALL NOT display "Ordres Mission", "Demandes", or "Documents" sections, ensuring these employee-only features are not visible to administrative users.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Employee Sections Visible to EMPLOYEE

_For any_ user with role EMPLOYEE accessing the dashboard, the fixed navigation menu SHALL continue to display "Ordres Mission", "Demandes", and "Documents" sections exactly as before, preserving employee access to these features.

**Validates: Requirements 3.1, 3.2, 3.3**

Property 3: Preservation - ADMIN and RH Sections Unchanged

_For any_ user with role ADMIN or RH accessing the dashboard, the fixed navigation menu SHALL continue to display all appropriate administrative and HR sections (Employés, Structures, Salaires, Gestion RH, Statistiques, Administration for ADMIN; all except Administration for RH), preserving administrative functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct, the fix is straightforward:

**File**: `frontend/app/dashboard/layout.tsx`

**Function**: `DashboardLayout` (specifically the `navItems` array definition)

**Specific Changes**:

1. **Fix Ordres Mission Role Assignment** (Line 28):
   - Current: `roles: ['ADMIN','RH']`
   - Change to: `roles: ['EMPLOYEE']`
   - Rationale: "Ordres Mission" is an employee-specific section for viewing personal mission orders

2. **Fix Demandes Role Assignment** (Line 29):
   - Current: `roles: ['ADMIN','RH']`
   - Change to: `roles: ['EMPLOYEE']`
   - Rationale: "Demandes" is an employee-specific section for submitting and tracking personal requests

3. **Fix Documents Role Assignment** (Line 30):
   - Current: `roles: ['ADMIN','RH']`
   - Change to: `roles: ['EMPLOYEE']`
   - Rationale: "Documents" is an employee-specific section for accessing personal documents

**No Backend Changes Required**: The frontend filtering is the primary issue. Backend endpoints should already have proper permission checks, but if not, they should be verified during testing.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate dashboard navigation for ADMIN and RH users and assert that "Ordres Mission", "Demandes", and "Documents" sections are NOT present in the filtered navigation. Run these tests on the UNFIXED code to observe failures and confirm the bug.

**Test Cases**:
1. **ADMIN User Navigation Test**: Simulate ADMIN user accessing dashboard, verify that "Ordres Mission", "Demandes", "Documents" are incorrectly present in filteredNav (will fail on unfixed code, confirming bug)
2. **RH User Navigation Test**: Simulate RH user accessing dashboard, verify that "Ordres Mission", "Demandes", "Documents" are incorrectly present in filteredNav (will fail on unfixed code, confirming bug)
3. **EMPLOYEE User Navigation Test**: Simulate EMPLOYEE user accessing dashboard, verify that "Ordres Mission", "Demandes", "Documents" are correctly present in filteredNav (should pass on unfixed code)
4. **ADMIN Sections Visibility Test**: Verify ADMIN user can see "Employés", "Structures", "Salaires", "Gestion RH", "Statistiques", "Administration" (should pass on unfixed code)

**Expected Counterexamples**:
- ADMIN user's filteredNav includes "Ordres Mission", "Demandes", "Documents" (should not be present)
- RH user's filteredNav includes "Ordres Mission", "Demandes", "Documents" (should not be present)
- Possible causes: Incorrect role assignment in navItems array

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL user WHERE user.role IN ['ADMIN', 'RH'] DO
  filteredNav := filterNavItems(navItems, user.role)
  ASSERT 'Ordres Mission' NOT IN filteredNav
  ASSERT 'Demandes' NOT IN filteredNav
  ASSERT 'Documents' NOT IN filteredNav
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL user WHERE user.role = 'EMPLOYEE' DO
  filteredNav_original := filterNavItems_original(navItems, user.role)
  filteredNav_fixed := filterNavItems_fixed(navItems, user.role)
  ASSERT filteredNav_original = filteredNav_fixed
END FOR

FOR ALL user WHERE user.role IN ['ADMIN', 'RH'] DO
  FOR ALL section IN ['Tableau de bord', 'Employés', 'Structures', 'Salaires', 'Annonces', 'Gestion RH', 'Statistiques', 'Mon Profil'] DO
    ASSERT section IN filteredNav_fixed
  END FOR
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for EMPLOYEE users and verify all expected sections are present, then write property-based tests capturing that behavior to ensure the fix doesn't break EMPLOYEE navigation.

**Test Cases**:
1. **EMPLOYEE Navigation Preservation**: Verify EMPLOYEE users continue to see "Ordres Mission", "Demandes", "Documents" after fix
2. **ADMIN Sections Preservation**: Verify ADMIN users continue to see all administrative sections after fix
3. **RH Sections Preservation**: Verify RH users continue to see all HR sections after fix
4. **Shared Sections Preservation**: Verify all users continue to see "Tableau de bord", "Annonces", "Mon Profil" after fix
5. **Active Route Highlighting**: Verify active route highlighting continues to work correctly for all roles
6. **Navigation Links**: Verify all navigation links continue to function correctly

### Unit Tests

- Test that ADMIN user's filteredNav does NOT include "Ordres Mission", "Demandes", "Documents"
- Test that RH user's filteredNav does NOT include "Ordres Mission", "Demandes", "Documents"
- Test that EMPLOYEE user's filteredNav DOES include "Ordres Mission", "Demandes", "Documents"
- Test that ADMIN user's filteredNav includes all ADMIN sections
- Test that RH user's filteredNav includes all RH sections
- Test that EMPLOYEE user's filteredNav does NOT include administrative sections

### Property-Based Tests

- Generate random user roles and verify correct sections are displayed for each role
- Generate random navigation paths and verify active route highlighting works correctly
- Test that the sum of all role-specific sections equals the total navItems count (no duplicates or missing items)
- Verify that every navItem has at least one role assigned
- Verify that EMPLOYEE-only sections are never assigned to ADMIN or RH roles

### Integration Tests

- Test full dashboard navigation flow for ADMIN user (verify employee sections are not accessible)
- Test full dashboard navigation flow for RH user (verify employee sections are not accessible)
- Test full dashboard navigation flow for EMPLOYEE user (verify all employee sections are accessible)
- Test switching between different user roles and verify menu updates correctly
- Test that clicking on navigation items navigates to correct pages
- Test that sidebar collapse/expand works correctly for all roles
