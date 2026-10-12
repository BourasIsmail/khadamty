-- Script SQL pour voir toutes les données de Khadamati
-- Exécutez ce script dans MySQL Workbench

USE khadamati_db;

-- ============================================
-- 1. STATISTIQUES GÉNÉRALES
-- ============================================
SELECT '=== STATISTIQUES GÉNÉRALES ===' AS '';

SELECT 
    'users' AS table_name, 
    COUNT(*) AS total,
    'Comptes utilisateurs' AS description
FROM users
UNION ALL
SELECT 
    'employees', 
    COUNT(*),
    'Profils employés'
FROM employees
UNION ALL
SELECT 
    'attendance', 
    COUNT(*),
    'Enregistrements de présence'
FROM attendance
UNION ALL
SELECT 
    'leave_requests', 
    COUNT(*),
    'Demandes de congés'
FROM leave_requests
UNION ALL
SELECT 
    'document_requests', 
    COUNT(*),
    'Demandes de documents'
FROM document_requests;

-- ============================================
-- 2. TOUS LES UTILISATEURS (USERS)
-- ============================================
SELECT '=== TOUS LES UTILISATEURS ===' AS '';

SELECT 
    id AS 'ID',
    email AS 'Email',
    CONCAT(first_name, ' ', last_name) AS 'Nom Complet',
    role AS 'Rôle',
    CASE 
        WHEN is_active = 1 THEN '✅ Actif'
        ELSE '❌ Inactif'
    END AS 'Statut',
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS 'Créé le'
FROM users
ORDER BY created_at DESC;

-- ============================================
-- 3. TOUS LES EMPLOYÉS (EMPLOYEES)
-- ============================================
SELECT '=== TOUS LES EMPLOYÉS ===' AS '';

SELECT 
    id AS 'ID',
    employee_id AS 'ID Employé',
    CONCAT(first_name, ' ', last_name) AS 'Nom Complet',
    email AS 'Email',
    department AS 'Département',
    position AS 'Poste',
    DATE_FORMAT(hire_date, '%d/%m/%Y') AS 'Date d\'embauche',
    annual_leave_balance AS 'Congés annuels',
    sick_leave_balance AS 'Congés maladie'
FROM employees
ORDER BY hire_date DESC;

-- ============================================
-- 4. UTILISATEURS PAR RÔLE
-- ============================================
SELECT '=== UTILISATEURS PAR RÔLE ===' AS '';

SELECT 
    role AS 'Rôle',
    COUNT(*) AS 'Nombre',
    GROUP_CONCAT(email SEPARATOR ', ') AS 'Emails'
FROM users
GROUP BY role
ORDER BY COUNT(*) DESC;

-- ============================================
-- 5. EMPLOYÉS PAR DÉPARTEMENT
-- ============================================
SELECT '=== EMPLOYÉS PAR DÉPARTEMENT ===' AS '';

SELECT 
    department AS 'Département',
    COUNT(*) AS 'Nombre d\'employés',
    GROUP_CONCAT(CONCAT(first_name, ' ', last_name) SEPARATOR ', ') AS 'Employés'
FROM employees
GROUP BY department
ORDER BY COUNT(*) DESC;

-- ============================================
-- 6. DEMANDES DE CONGÉS (si existantes)
-- ============================================
SELECT '=== DEMANDES DE CONGÉS ===' AS '';

SELECT 
    id AS 'ID',
    employee_name AS 'Employé',
    leave_type AS 'Type de congé',
    DATE_FORMAT(start_date, '%d/%m/%Y') AS 'Date début',
    DATE_FORMAT(end_date, '%d/%m/%Y') AS 'Date fin',
    days_requested AS 'Jours',
    status AS 'Statut',
    reason AS 'Raison'
FROM leave_requests
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 7. DEMANDES DE DOCUMENTS (si existantes)
-- ============================================
SELECT '=== DEMANDES DE DOCUMENTS ===' AS '';

SELECT 
    id AS 'ID',
    employee_name AS 'Employé',
    document_type AS 'Type de document',
    purpose AS 'Objectif',
    status AS 'Statut',
    DATE_FORMAT(created_at, '%d/%m/%Y') AS 'Demandé le'
FROM document_requests
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 8. PRÉSENCES (si existantes)
-- ============================================
SELECT '=== PRÉSENCES RÉCENTES ===' AS '';

SELECT 
    id AS 'ID',
    employee_name AS 'Employé',
    DATE_FORMAT(date, '%d/%m/%Y') AS 'Date',
    TIME_FORMAT(check_in, '%H:%i') AS 'Arrivée',
    TIME_FORMAT(check_out, '%H:%i') AS 'Départ',
    status AS 'Statut'
FROM attendance
ORDER BY date DESC, check_in DESC
LIMIT 10;

-- ============================================
-- 9. VOTRE COMPTE PERSONNEL
-- ============================================
SELECT '=== VOTRE COMPTE PERSONNEL ===' AS '';

SELECT 
    u.id AS 'User ID',
    u.email AS 'Email',
    CONCAT(u.first_name, ' ', u.last_name) AS 'Nom Complet',
    u.role AS 'Rôle',
    e.employee_id AS 'ID Employé',
    e.department AS 'Département',
    e.position AS 'Poste',
    DATE_FORMAT(e.hire_date, '%d/%m/%Y') AS 'Date d\'embauche'
FROM users u
LEFT JOIN employees e ON u.email = e.email
WHERE u.email = 'ismailelrhazoui21@gmail.com';

-- ============================================
-- 10. DERNIÈRES ACTIVITÉS
-- ============================================
SELECT '=== DERNIERS UTILISATEURS CRÉÉS ===' AS '';

SELECT 
    email AS 'Email',
    CONCAT(first_name, ' ', last_name) AS 'Nom',
    role AS 'Rôle',
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i:%s') AS 'Créé le'
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
SELECT '=== FIN DU RAPPORT ===' AS '';
SELECT CONCAT('Rapport généré le ', DATE_FORMAT(NOW(), '%d/%m/%Y à %H:%i:%s')) AS '';
