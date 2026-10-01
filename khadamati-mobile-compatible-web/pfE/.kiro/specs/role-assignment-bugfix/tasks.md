# Implementation Plan

## Phase 1: Exploration & Preservation Testing

- [-] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - ADMIN and RH Users See Employee Sections
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test implementation details from Bug Condition in design (lines 28-30 of layout.tsx have incorrect role assignments)
  - The test assertions should match the Expected Behavior Properties from design
  - Test cases:
    - ADMIN user's filteredNav should NOT include "Ordres Mission", "Demandes", "Documents"
    - RH user's filteredNav should NOT include "Ordres Mission", "Demandes", "Documents"
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Employee Roles Retain Their Sections
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test cases:
    - EMPLOYEE users continue to see "Ordres Mission", "Demandes", "Documents"
    - ADMIN users continue to see "Tableau de bord", "Employés", "Structures", "Salaires", "Annonces", "Gestion RH", "Statistiques", "Mon Profil", "Administration"
    - RH users continue to see "Tableau de bord", "Employés", "Structures", "Salaires", "Annonces", "Gestion RH", "Statistiques", "Mon Profil"
    - All users continue to see "Tableau de bord", "Annonces", "Mon Profil" (shared sections)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

## Phase 2: Implementation

- [ ] 3. Fix role assignment for employee-only sections

  - [x] 3.1 Implement the fix
    - Change "Ordres Mission" role assignment from `['ADMIN','RH']` to `['EMPLOYEE']` (line 28)
    - Change "Demandes" role assignment from `['ADMIN','RH']` to `['EMPLOYEE']` (line 29)
    - Change "Documents" role assignment from `['ADMIN','RH']` to `['EMPLOYEE']` (line 30)
    - File: `frontend/app/dashboard/layout.tsx`
    - _Bug_Condition: isBugCondition(input) where input.userRole IN ['ADMIN', 'RH'] AND currentPath STARTS_WITH '/dashboard' AND navItems contains item WHERE item.name IN ['Ordres Mission', 'Demandes', 'Documents'] AND item.roles CONTAINS input.userRole_
    - _Expected_Behavior: expectedBehavior(result) - ADMIN and RH users SHALL NOT see "Ordres Mission", "Demandes", "Documents" in filteredNav_
    - _Preservation: EMPLOYEE users continue to see "Ordres Mission", "Demandes", "Documents"; ADMIN/RH users continue to see their respective sections_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - ADMIN and RH Users Do NOT See Employee Sections
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - All Roles Retain Their Correct Sections
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

## Phase 3: Verification

- [ ] 4. Checkpoint - Ensure all tests pass
  - Verify all exploration tests pass (Property 1)
  - Verify all preservation tests pass (Property 2)
  - Verify no regressions in other dashboard functionality
  - Confirm the fix is complete and correct
  - Ask the user if questions arise
