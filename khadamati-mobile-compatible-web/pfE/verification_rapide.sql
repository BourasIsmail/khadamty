-- ⚡ VÉRIFICATION RAPIDE - Khadamati
-- Exécutez ce script pour voir rapidement toutes vos données
-- Appuyez sur Ctrl+Shift+Enter pour tout exécuter

USE khadamati_db;

-- ============================================
-- 📊 RÉSUMÉ RAPIDE
-- ============================================
SELECT '📊 RÉSUMÉ RAPIDE' AS '';

SELECT 
    '👥 Utilisateurs' AS 'Type',
    COUNT(*) AS 'Total'
FROM users
UNION ALL
SELECT 
    '💼 Employés',
    COUNT(*)
FROM employees
UNION ALL
SELECT 
    '📅 Présences',
    COUNT(*)
FROM attendance
UNION ALL
SELECT 
    '🏖️ Demandes de congés',
    COUNT(*)
FROM leave_requests
UNION ALL
SELECT 
    '📄 Demandes de documents',
    COUNT(*)
FROM document_requests;

-- ============================================
-- 👥 DERNIERS UTILISATEURS AJOUTÉS
-- ============================================
SELECT '👥 DERNIERS UTILISATEURS AJOUTÉS (5 derniers)' AS '';

SELECT 
    id,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS ajouté_le
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 💼 DERNIERS EMPLOYÉS AJOUTÉS
-- ============================================
SELECT '💼 DERNIERS EMPLOYÉS AJOUTÉS (5 derniers)' AS '';

SELECT 
    id,
    employee_id,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    email,
    department,
    position,
    DATE_FORMAT(hire_date, '%d/%m/%Y') AS date_embauche
FROM employees
ORDER BY id DESC
LIMIT 5;

-- ============================================
-- 🏖️ DERNIÈRES DEMANDES DE CONGÉS
-- ============================================
SELECT '🏖️ DERNIÈRES DEMANDES DE CONGÉS (5 dernières)' AS '';

SELECT 
    id,
    employee_name,
    leave_type,
    DATE_FORMAT(start_date, '%d/%m/%Y') AS date_début,
    DATE_FORMAT(end_date, '%d/%m/%Y') AS date_fin,
    days_requested AS jours,
    status,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS demandé_le
FROM leave_requests
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 📄 DERNIÈRES DEMANDES DE DOCUMENTS
-- ============================================
SELECT '📄 DERNIÈRES DEMANDES DE DOCUMENTS (5 dernières)' AS '';

SELECT 
    id,
    employee_name,
    document_type,
    purpose,
    status,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS demandé_le
FROM document_requests
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 📅 DERNIÈRES PRÉSENCES
-- ============================================
SELECT '📅 DERNIÈRES PRÉSENCES (5 dernières)' AS '';

SELECT 
    id,
    employee_name,
    DATE_FORMAT(date, '%d/%m/%Y') AS date,
    TIME_FORMAT(check_in, '%H:%i') AS arrivée,
    TIME_FORMAT(check_out, '%H:%i') AS départ,
    status
FROM attendance
ORDER BY date DESC, check_in DESC
LIMIT 5;

-- ============================================
-- ✅ VÉRIFICATION TERMINÉE
-- ============================================
SELECT '✅ VÉRIFICATION TERMINÉE' AS '';
SELECT CONCAT('Rapport généré le ', DATE_FORMAT(NOW(), '%d/%m/%Y à %H:%i:%s')) AS '';
