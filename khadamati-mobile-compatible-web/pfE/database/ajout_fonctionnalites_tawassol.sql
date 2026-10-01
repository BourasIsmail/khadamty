-- ============================================================================
-- SCRIPT D'AJOUT DES FONCTIONNALITÉS TAWASSOL À KHADAMATI
-- ============================================================================
-- Ce script AJOUTE les nouvelles tables sans modifier les tables existantes
-- Tables existantes conservées : users, employees, attendances, leave_requests, document_requests
-- ============================================================================

USE khadamati_db;

-- ============================================================================
-- 1. STRUCTURE ORGANISATIONNELLE
-- ============================================================================

-- Table des coordinations régionales (12 régions du Maroc)
CREATE TABLE IF NOT EXISTS coordination_region (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    code_region VARCHAR(10) NOT NULL,
    nom_region_ar VARCHAR(200) NOT NULL,
    nom_region_fr VARCHAR(200) NOT NULL,
    nom_coord_ar VARCHAR(200) NOT NULL,
    nom_coord_fr VARCHAR(200) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    est_active TINYINT(1) NOT NULL DEFAULT 1,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (code_region),
    INDEX idx_coord_code (code_region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des délégations provinciales
CREATE TABLE IF NOT EXISTS delegation_province (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    coordination_id CHAR(36) NOT NULL,
    code_province VARCHAR(10) NOT NULL,
    nom_province_ar VARCHAR(200) NOT NULL,
    nom_province_fr VARCHAR(200) NOT NULL,
    nom_deleg_ar VARCHAR(200) NOT NULL,
    nom_deleg_fr VARCHAR(200) NOT NULL,
    telephone VARCHAR(20),
    telephone_inwi VARCHAR(20),
    telephone_flotte VARCHAR(20),
    adresse TEXT,
    est_active TINYINT(1) NOT NULL DEFAULT 1,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (code_province),
    INDEX idx_deleg_coord (coordination_id),
    CONSTRAINT fk_deleg_coord FOREIGN KEY (coordination_id) 
        REFERENCES coordination_region(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des structures (associations, établissements, centres, complexes)
CREATE TABLE IF NOT EXISTS structure (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    delegation_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    type ENUM('association', 'etablissement', 'centre', 'complexe') NOT NULL,
    code VARCHAR(30) NOT NULL,
    nom_ar VARCHAR(250) NOT NULL,
    nom_fr VARCHAR(250) NOT NULL,
    adresse TEXT,
    est_active TINYINT(1) NOT NULL DEFAULT 1,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (code),
    INDEX idx_struct_delegation (delegation_id),
    INDEX idx_struct_parent (parent_id),
    CONSTRAINT fk_struct_delegation FOREIGN KEY (delegation_id) 
        REFERENCES delegation_province(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_struct_parent FOREIGN KEY (parent_id) 
        REFERENCES structure(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. GESTION DES GRADES ET ÉCHELONS
-- ============================================================================

-- Table des grades
CREATE TABLE IF NOT EXISTS grade (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    code INT NOT NULL,
    libelle_fr VARCHAR(100) NOT NULL,
    libelle_ar VARCHAR(150) NOT NULL,
    echelle INT,
    nb_echelons INT NOT NULL DEFAULT 10 COMMENT 'Nombre total d''échelons dans cette échelle',
    taux DECIMAL(10,4),
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (code),
    INDEX idx_grade_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des examens de grade (concours internes)
CREATE TABLE IF NOT EXISTS examen_grade (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    grade_cible_id CHAR(36),
    annee YEAR NOT NULL,
    date_examen DATE NOT NULL,
    date_depot DATE,
    nb_postes INT NOT NULL DEFAULT 0,
    lieu VARCHAR(250),
    details TEXT,
    resultats_ecrit VARCHAR(255),
    resultats_final VARCHAR(255),
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_examen_annee (annee),
    INDEX idx_examen_grade_cible (grade_cible_id),
    CONSTRAINT fk_examen_grade FOREIGN KEY (grade_cible_id) 
        REFERENCES grade(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. EXTENSION DE LA TABLE EMPLOYEES (Optionnel - Ajouter des colonnes)
-- ============================================================================

-- Vérifier et ajouter les colonnes une par une (compatible MySQL 8.0)
SET @dbname = DATABASE();
SET @tablename = 'employees';

-- Ajouter grade_id si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'grade_id');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN grade_id CHAR(36) AFTER id', 
    'SELECT "Column grade_id already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter structure_id si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'structure_id');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN structure_id CHAR(36) AFTER grade_id', 
    'SELECT "Column structure_id already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter matricule si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'matricule');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN matricule VARCHAR(10) AFTER structure_id', 
    'SELECT "Column matricule already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter nom_ar si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'nom_ar');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN nom_ar VARCHAR(100) AFTER last_name', 
    'SELECT "Column nom_ar already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter prenom_ar si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'prenom_ar');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN prenom_ar VARCHAR(100) AFTER nom_ar', 
    'SELECT "Column prenom_ar already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter echelon si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'echelon');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN echelon VARCHAR(10) AFTER salary', 
    'SELECT "Column echelon already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter echelle si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'echelle');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN echelle INT AFTER echelon', 
    'SELECT "Column echelle already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter date_echelon si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'date_echelon');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN date_echelon DATE AFTER echelle', 
    'SELECT "Column date_echelon already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter photo si elle n'existe pas
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'photo');
SET @query = IF(@col_exists = 0, 
    'ALTER TABLE employees ADD COLUMN photo VARCHAR(255) AFTER email', 
    'SELECT "Column photo already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter les contraintes de clés étrangères si elles n'existent pas
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_employee_grade');
SET @query = IF(@fk_exists = 0, 
    'ALTER TABLE employees ADD CONSTRAINT fk_employee_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL ON UPDATE CASCADE', 
    'SELECT "Foreign key fk_employee_grade already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_employee_structure');
SET @query = IF(@fk_exists = 0, 
    'ALTER TABLE employees ADD CONSTRAINT fk_employee_structure FOREIGN KEY (structure_id) REFERENCES structure(id) ON DELETE SET NULL ON UPDATE CASCADE', 
    'SELECT "Foreign key fk_employee_structure already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 4. GESTION FINANCIÈRE
-- ============================================================================

-- Table des salaires mensuels
CREATE TABLE IF NOT EXISTS salaire (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    grade_id CHAR(36),
    annee SMALLINT NOT NULL,
    mois TINYINT NOT NULL COMMENT '1=Janvier ... 12=Décembre',
    echelon VARCHAR(10),
    salaire_net DECIMAL(10,2) NOT NULL,
    alloc_familiale DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    retenue_mutuelle DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    rappel DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_salaire_employee_mois (employee_id, annee, mois),
    INDEX idx_salaire_employee (employee_id),
    INDEX idx_salaire_grade (grade_id),
    INDEX idx_salaire_periode (annee, mois),
    CONSTRAINT fk_salaire_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_salaire_grade FOREIGN KEY (grade_id) 
        REFERENCES grade(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des primes
CREATE TABLE IF NOT EXISTS prime (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    type_prime ENUM('gratification', 'indemnite', 'autre') NOT NULL DEFAULT 'gratification',
    montant_brut DECIMAL(10,2) NOT NULL,
    ir DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    montant_net DECIMAL(10,2) NOT NULL,
    date_prime DATE NOT NULL,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_prime_employee (employee_id),
    INDEX idx_prime_date (date_prime),
    INDEX idx_prime_type (type_prime),
    CONSTRAINT fk_prime_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des crédits
CREATE TABLE IF NOT EXISTS credit (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    banque VARCHAR(150) NOT NULL,
    num_dossier VARCHAR(100),
    type_credit ENUM('bancaire', 'interne_AOS') NOT NULL DEFAULT 'bancaire',
    mensualite DECIMAL(10,2) NOT NULL,
    montant_global DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    montant_restant DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    nb_mois_restants INT NOT NULL DEFAULT 0,
    date_debut DATE,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_credit_employee (employee_id),
    INDEX idx_credit_type (type_credit),
    CONSTRAINT fk_credit_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. ORDRES DE MISSION
-- ============================================================================

-- Table des programmes de mission
CREATE TABLE IF NOT EXISTS programme_mission (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    code VARCHAR(20) NOT NULL,
    nom_fr VARCHAR(250) NOT NULL,
    nom_ar VARCHAR(250) NOT NULL,
    montant_max DECIMAL(10,2) COMMENT 'Montant max indemnité par déplacement',
    est_actif TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY (code),
    INDEX idx_prog_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Catégories de personnel pour les ordres de mission';

-- Table des moyens de transport
CREATE TABLE IF NOT EXISTS moyen_transport (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    code VARCHAR(50) NOT NULL,
    libelle_fr VARCHAR(100) NOT NULL,
    libelle_ar VARCHAR(100) NOT NULL,
    est_actif TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY (code),
    INDEX idx_transport_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Moyens de transport pour les ordres de mission';

-- Table des ordres de mission
CREATE TABLE IF NOT EXISTS ordre_mission (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL COMMENT 'FK → employees',
    programme_id CHAR(36) COMMENT 'FK → programme_mission',
    depart_delegation_id CHAR(36) COMMENT 'FK → delegation_province (départ)',
    arrival_delegation_id CHAR(36) COMMENT 'FK → delegation_province (destination)',
    moyen_transport_id CHAR(36) COMMENT 'FK → moyen_transport',
    objet TEXT NOT NULL,
    numero_ordm VARCHAR(50) COMMENT 'ex: KB / 7 / 2025',
    numero_etat VARCHAR(50) COMMENT 'ex: EN-PG / KB - 20 / 2025',
    date_ordm DATE COMMENT 'Date de l''ordre de mission',
    date_depart DATETIME NOT NULL,
    date_retour DATETIME NOT NULL,
    annee YEAR NOT NULL,
    cycle TINYINT COMMENT 'Trimestre : 1, 2, 3 ou 4',
    nombre_repas_taux_1 INT NOT NULL DEFAULT 0,
    indemnite_taux_1 DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    nombre_repas_taux_2 INT NOT NULL DEFAULT 0,
    indemnite_taux_2 DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    montant_total DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Montant total de l''indemnité de déplacement',
    statut ENUM('en_attente', 'approuve', 'rejete', 'annule') NOT NULL DEFAULT 'en_attente',
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_om_employee (employee_id),
    INDEX idx_om_programme (programme_id),
    INDEX idx_om_annee (annee),
    INDEX idx_om_statut (statut),
    INDEX idx_om_depart (depart_delegation_id),
    INDEX idx_om_arrival (arrival_delegation_id),
    CONSTRAINT fk_om_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_om_programme FOREIGN KEY (programme_id) 
        REFERENCES programme_mission(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_om_depart FOREIGN KEY (depart_delegation_id) 
        REFERENCES delegation_province(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_om_arrival FOREIGN KEY (arrival_delegation_id) 
        REFERENCES delegation_province(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_om_transport FOREIGN KEY (moyen_transport_id) 
        REFERENCES moyen_transport(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Ordres de mission avec indemnités de déplacement';

-- ============================================================================
-- 6. GESTION DES DEMANDES (Extension)
-- ============================================================================

-- Table des types de demandes
CREATE TABLE IF NOT EXISTS type_demande (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    code VARCHAR(30) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    est_actif TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY (code),
    INDEX idx_type_dem_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des demandes (unifie leave_requests et document_requests)
CREATE TABLE IF NOT EXISTS demande (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    type_demande_id CHAR(36) NOT NULL,
    traite_par BIGINT,
    objet VARCHAR(250) NOT NULL,
    description TEXT,
    statut ENUM('brouillon', 'soumise', 'approuvee', 'rejetee') NOT NULL DEFAULT 'brouillon',
    date_traitement DATETIME,
    commentaire_rh TEXT,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_demande_employee (employee_id),
    INDEX idx_demande_type (type_demande_id),
    INDEX idx_demande_statut (statut),
    INDEX idx_demande_traiteur (traite_par),
    CONSTRAINT fk_demande_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_demande_traiteur FOREIGN KEY (traite_par) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_demande_type FOREIGN KEY (type_demande_id) 
        REFERENCES type_demande(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des pièces jointes
CREATE TABLE IF NOT EXISTS piece_jointe (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    demande_id CHAR(36) NOT NULL,
    nom_fichier VARCHAR(200) NOT NULL,
    url_fichier VARCHAR(255) NOT NULL,
    type_mime VARCHAR(80),
    taille_kb INT,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_pj_demande (demande_id),
    CONSTRAINT fk_pj_demande FOREIGN KEY (demande_id) 
        REFERENCES demande(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. GESTION DOCUMENTAIRE
-- ============================================================================

-- Table des types de documents
CREATE TABLE IF NOT EXISTS type_document (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    libelle VARCHAR(150) NOT NULL,
    dossier VARCHAR(200),
    PRIMARY KEY (id),
    UNIQUE KEY (libelle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des documents
CREATE TABLE IF NOT EXISTS document (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    type_doc_id CHAR(36) NOT NULL,
    cree_par BIGINT,
    titre VARCHAR(250) NOT NULL,
    url_fichier VARCHAR(255),
    contenu TEXT,
    est_publie TINYINT(1) NOT NULL DEFAULT 0,
    publie_le DATETIME,
    expire_le DATETIME,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_doc_type (type_doc_id),
    INDEX idx_doc_publie (est_publie),
    INDEX idx_doc_expire (expire_le),
    INDEX idx_doc_createur (cree_par),
    CONSTRAINT fk_doc_createur FOREIGN KEY (cree_par) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_doc_type FOREIGN KEY (type_doc_id) 
        REFERENCES type_document(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. COMMUNICATION INTERNE
-- ============================================================================

-- Table des annonces
CREATE TABLE IF NOT EXISTS annonce (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    cree_par BIGINT,
    titre VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    est_active TINYINT(1) NOT NULL DEFAULT 1,
    publie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_le DATETIME,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_annonce_active (est_active),
    INDEX idx_annonce_expire (expire_le),
    INDEX idx_annonce_createur (cree_par),
    CONSTRAINT fk_annonce_createur FOREIGN KEY (cree_par) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réclamations
CREATE TABLE IF NOT EXISTS reclamation (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    traite_par BIGINT,
    objet VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('nouvelle', 'en_cours', 'resolue', 'rejetee') NOT NULL DEFAULT 'nouvelle',
    reponse TEXT,
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_recl_employee (employee_id),
    INDEX idx_recl_statut (statut),
    INDEX idx_recl_traiteur (traite_par),
    CONSTRAINT fk_recl_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_recl_traiteur FOREIGN KEY (traite_par) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. ÉVALUATIONS
-- ============================================================================

-- Table des notes annuelles
CREATE TABLE IF NOT EXISTS note_annuelle (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    employee_id BIGINT NOT NULL,
    saisie_par BIGINT,
    annee YEAR NOT NULL,
    note DECIMAL(5,2),
    appreciation VARCHAR(100),
    cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_note_employee_annee (employee_id, annee),
    INDEX idx_note_employee (employee_id),
    INDEX idx_note_saisie (saisie_par),
    CONSTRAINT fk_note_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_note_saisie FOREIGN KEY (saisie_par) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. DONNÉES INITIALES
-- ============================================================================

-- Insérer les 12 coordinations régionales du Maroc
INSERT INTO coordination_region (id, code_region, nom_region_ar, nom_region_fr, nom_coord_ar, nom_coord_fr) VALUES
(UUID(), 'R01', 'جهة طنجة تطوان الحسيمة', 'Tanger-Tétouan-Al Hoceïma', 'تنسيقية جهة طنجة', 'Coordination Tanger-Tétouan'),
(UUID(), 'R02', 'جهة الشرق', 'Oriental', 'تنسيقية جهة الشرق', 'Coordination Oriental'),
(UUID(), 'R03', 'جهة فاس مكناس', 'Fès-Meknès', 'تنسيقية جهة فاس', 'Coordination Fès-Meknès'),
(UUID(), 'R04', 'جهة الرباط سلا القنيطرة', 'Rabat-Salé-Kénitra', 'تنسيقية جهة الرباط', 'Coordination Rabat-Salé'),
(UUID(), 'R05', 'جهة بني ملال خنيفرة', 'Béni Mellal-Khénifra', 'تنسيقية جهة بني ملال', 'Coordination Béni Mellal'),
(UUID(), 'R06', 'جهة الدار البيضاء سطات', 'Casablanca-Settat', 'تنسيقية جهة الدار البيضاء', 'Coordination Casablanca-Settat'),
(UUID(), 'R07', 'جهة مراكش آسفي', 'Marrakech-Safi', 'تنسيقية جهة مراكش', 'Coordination Marrakech-Safi'),
(UUID(), 'R08', 'جهة درعة تافيلالت', 'Drâa-Tafilalet', 'تنسيقية جهة درعة', 'Coordination Drâa-Tafilalet'),
(UUID(), 'R09', 'جهة سوس ماسة', 'Souss-Massa', 'تنسيقية جهة سوس', 'Coordination Souss-Massa'),
(UUID(), 'R10', 'جهة كلميم واد نون', 'Guelmim-Oued Noun', 'تنسيقية جهة كلميم', 'Coordination Guelmim'),
(UUID(), 'R11', 'جهة العيون الساقية الحمراء', 'Laâyoune-Sakia El Hamra', 'تنسيقية جهة العيون', 'Coordination Laâyoune'),
(UUID(), 'R12', 'جهة الداخلة وادي الذهب', 'Dakhla-Oued Ed-Dahab', 'تنسيقية جهة الداخلة', 'Coordination Dakhla');

-- Insérer les types de demandes
INSERT INTO type_demande (id, code, libelle, description) VALUES
(UUID(), 'ORDRE_MISSION', 'Ordre de mission', 'Déplacement professionnel avec ordre de mission'),
(UUID(), 'CONGE_ANNUEL', 'Congé annuel', 'Demande de congé annuel payé'),
(UUID(), 'CONGE_MALADIE', 'Congé maladie', 'Congé pour raison médicale'),
(UUID(), 'CONGE_EXCEPTION', 'Congé exceptionnel', 'Congé pour événement familial'),
(UUID(), 'ATTESTATION', 'Attestation de travail', 'Demande d\'attestation de travail ou de salaire'),
(UUID(), 'AVANCE_SALAIRE', 'Avance sur salaire', 'Demande d\'avance sur le salaire mensuel'),
(UUID(), 'FORMATION', 'Inscription formation', 'Demande de participation à une formation'),
(UUID(), 'AUTRE', 'Autre document administratif', 'Toute autre demande administrative');

-- Insérer les types de documents
INSERT INTO type_document (id, libelle, dossier) VALUES
(UUID(), 'Circulaire', '/docs/circulaires'),
(UUID(), 'Note de service', '/docs/notes'),
(UUID(), 'Formulaire', '/docs/formulaires'),
(UUID(), 'Guide pratique', '/docs/guides'),
(UUID(), 'Décision', '/docs/decisions'),
(UUID(), 'Résultats examen', '/docs/examens');

-- Insérer les moyens de transport
INSERT INTO moyen_transport (id, code, libelle_fr, libelle_ar, est_actif) VALUES
(UUID(), 'transports_en_commun', 'Transports en commun', 'نقل عمومي', 1),
(UUID(), 'voiture_de_service', 'Voiture de service', 'سيارة المصلحة', 1),
(UUID(), 'voiture_privee', 'Voiture privée', 'سيارة خاصة', 0);

-- Insérer un grade temporaire pour la migration
INSERT INTO grade (id, code, libelle_fr, libelle_ar, echelle, nb_echelons) VALUES
(UUID(), 0, 'Grade temporaire - à définir', 'درجة مؤقتة', 0, 10);

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

SELECT 'Migration terminée avec succès !' AS message;
SELECT COUNT(*) AS nb_coordinations FROM coordination_region;
SELECT COUNT(*) AS nb_types_demandes FROM type_demande;
SELECT COUNT(*) AS nb_types_documents FROM type_document;
SELECT COUNT(*) AS nb_moyens_transport FROM moyen_transport;
SELECT COUNT(*) AS nb_grades FROM grade;
