-- Script pour créer le compte admin dans Docker
-- Email: ismailelrhazoui21@gmail.com
-- Mot de passe: smail1234

-- Insérer l'utilisateur admin
INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified, created_at, updated_at)
VALUES (
    'ismailelrhazoui21@gmail.com',
    '$2a$10$xQKJ9qZ5fZJ5fZJ5fZJ5fOxQKJ9qZ5fZJ5fZJ5fZJ5fZJ5fZJ5fZJ',  -- Mot de passe: smail1234 (crypté avec BCrypt)
    'Ismail',
    'Elrhazoui',
    'ADMIN',
    TRUE,
    TRUE,
    NOW(),
    NOW()
);

-- Créer le profil employé correspondant
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department, position, hire_date, created_at, updated_at)
VALUES (
    'EMP0001',
    'Ismail',
    'Elrhazoui',
    'ismailelrhazoui21@gmail.com',
    '+212600000000',
    'Administration',
    'Administrateur Système',
    NOW(),
    NOW(),
    NOW()
);
