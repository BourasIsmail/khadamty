-- Script de vérification des tables MySQL
USE khadamati_db;

-- Lister toutes les tables
SHOW TABLES;

-- Compter les enregistrements dans chaque table
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'leave_requests', COUNT(*) FROM leave_requests
UNION ALL
SELECT 'document_requests', COUNT(*) FROM document_requests;

-- Voir les utilisateurs
SELECT id, email, first_name, last_name, role, is_active FROM users;

-- Voir les employés
SELECT id, employee_id, first_name, last_name, email, department, position FROM employees LIMIT 5;
