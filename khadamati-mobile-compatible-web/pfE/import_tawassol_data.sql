-- Script d'import des données Tawassol dans khadamati_db
-- À exécuter : mysql -u root -p2003 khadamati_db < import_tawassol_data.sql

USE khadamati_db;

-- Désactiver les contraintes temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- ═══════════════════════════════════════════════════════════════
-- 1. COORDINATIONS RÉGIONALES (12 régions du Maroc)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO coordination_region (id, code_region, nom_region_ar, nom_region_fr, nom_coord_ar, nom_coord_fr, est_active, cree_le, modifie_le) VALUES
('b1c2285a-3e43-11f1-a1a1-30e3a40e05cd','R01','جهة طنجة تطوان الحسيمة','Tanger-Tétouan-Al Hoceïma','تنسيقية جهة طنجة','Coordination Tanger-Tétouan',1,NOW(),NOW()),
('b1c23b7f-3e43-11f1-a1a1-30e3a40e05cd','R02','جهة الشرق','Oriental','تنسيقية جهة الشرق','Coordination Oriental',1,NOW(),NOW()),
('b1c23d5b-3e43-11f1-a1a1-30e3a40e05cd','R03','جهة فاس مكناس','Fès-Meknès','تنسيقية جهة فاس','Coordination Fès-Meknès',1,NOW(),NOW()),
('b1c23e3b-3e43-11f1-a1a1-30e3a40e05cd','R04','جهة الرباط سلا القنيطرة','Rabat-Salé-Kénitra','تنسيقية جهة الرباط','Coordination Rabat-Salé',1,NOW(),NOW()),
('b1c23f17-3e43-11f1-a1a1-30e3a40e05cd','R05','جهة بني ملال خنيفرة','Béni Mellal-Khénifra','تنسيقية جهة بني ملال','Coordination Béni Mellal',1,NOW(),NOW()),
('b1c23fea-3e43-11f1-a1a1-30e3a40e05cd','R06','جهة الدار البيضاء سطات','Casablanca-Settat','تنسيقية جهة الدار البيضاء','Coordination Casablanca-Settat',1,NOW(),NOW()),
('b1c240bf-3e43-11f1-a1a1-30e3a40e05cd','R07','جهة مراكش آسفي','Marrakech-Safi','تنسيقية جهة مراكش','Coordination Marrakech-Safi',1,NOW(),NOW()),
('b1c24182-3e43-11f1-a1a1-30e3a40e05cd','R08','جهة درعة تافيلالت','Drâa-Tafilalet','تنسيقية جهة درعة','Coordination Drâa-Tafilalet',1,NOW(),NOW()),
('b1c2428f-3e43-11f1-a1a1-30e3a40e05cd','R09','جهة سوس ماسة','Souss-Massa','تنسيقية جهة سوس','Coordination Souss-Massa',1,NOW(),NOW()),
('b1c2434f-3e43-11f1-a1a1-30e3a40e05cd','R10','جهة كلميم واد نون','Guelmim-Oued Noun','تنسيقية جهة كلميم','Coordination Guelmim',1,NOW(),NOW()),
('b1c24413-3e43-11f1-a1a1-30e3a40e05cd','R11','جهة العيون الساقية الحمراء','Laâyoune-Sakia El Hamra','تنسيقية جهة العيون','Coordination Laâyoune',1,NOW(),NOW()),
('b1c244dc-3e43-11f1-a1a1-30e3a40e05cd','R12','جهة الداخلة وادي الذهب','Dakhla-Oued Ed-Dahab','تنسيقية جهة الداخلة','Coordination Dakhla',1,NOW(),NOW())
ON DUPLICATE KEY UPDATE nom_region_fr=VALUES(nom_region_fr);

-- ═══════════════════════════════════════════════════════════════
-- 2. GRADES
-- ═══════════════════════════════════════════════════════════════
INSERT INTO grade (id, code, libelle_fr, libelle_ar, echelle, nb_echelons, cree_le, modifie_le) VALUES
('270c6a7b-43a3-11f1-a1a1-30e3a40e05cd', 0, 'Grade temporaire - à définir', 'درجة مؤقتة', 0, 10, NOW(), NOW())
ON DUPLICATE KEY UPDATE libelle_fr=VALUES(libelle_fr);

-- ═══════════════════════════════════════════════════════════════
-- 3. MOYENS DE TRANSPORT
-- ═══════════════════════════════════════════════════════════════
INSERT INTO moyen_transport (id, code, libelle_fr, libelle_ar, est_actif) VALUES
('e83fd08e-43ad-11f1-a1a1-30e3a40e05cd','transports_en_commun','Transports en commun','نقل عمومي',1),
('e841b456-43ad-11f1-a1a1-30e3a40e05cd','voiture_de_service','Voiture de service','سيارة المصلحة',1),
('e841ce97-43ad-11f1-a1a1-30e3a40e05cd','voiture_privee','Voiture privée','سيارة خاصة',0)
ON DUPLICATE KEY UPDATE libelle_fr=VALUES(libelle_fr);

-- ═══════════════════════════════════════════════════════════════
-- 4. TYPES DE DEMANDES
-- ═══════════════════════════════════════════════════════════════
INSERT INTO type_demande (id, code, libelle, description, est_actif) VALUES
('b1b7f6f6-3e43-11f1-a1a1-30e3a40e05cd','ORDRE_MISSION','Ordre de mission','Déplacement professionnel avec ordre de mission',1),
('b1b90dd8-3e43-11f1-a1a1-30e3a40e05cd','CONGE_ANNUEL','Congé annuel','Demande de congé annuel payé',1),
('b1b94857-3e43-11f1-a1a1-30e3a40e05cd','CONGE_MALADIE','Congé maladie','Congé pour raison médicale',1),
('b1b94bbd-3e43-11f1-a1a1-30e3a40e05cd','CONGE_EXCEPTION','Congé exceptionnel','Congé pour événement familial',1),
('b1b94d9e-3e43-11f1-a1a1-30e3a40e05cd','ATTESTATION','Attestation de travail','Demande d\'attestation de travail ou de salaire',1),
('b1b94f63-3e43-11f1-a1a1-30e3a40e05cd','AVANCE_SALAIRE','Avance sur salaire','Demande d\'avance sur le salaire mensuel',1),
('b1b95114-3e43-11f1-a1a1-30e3a40e05cd','FORMATION','Inscription formation','Demande de participation à une formation',1),
('b1b952cc-3e43-11f1-a1a1-30e3a40e05cd','AUTRE','Autre document administratif','Toute autre demande administrative',1)
ON DUPLICATE KEY UPDATE libelle=VALUES(libelle);

-- ═══════════════════════════════════════════════════════════════
-- 5. TYPES DE DOCUMENTS
-- ═══════════════════════════════════════════════════════════════
INSERT INTO type_document (id, libelle, dossier) VALUES
('b1bb92b1-3e43-11f1-a1a1-30e3a40e05cd','Circulaire','/docs/circulaires'),
('b1bb9bc3-3e43-11f1-a1a1-30e3a40e05cd','Note de service','/docs/notes'),
('b1bb9dbd-3e43-11f1-a1a1-30e3a40e05cd','Formulaire','/docs/formulaires'),
('b1bb9f4c-3e43-11f1-a1a1-30e3a40e05cd','Guide pratique','/docs/guides'),
('b1bba2c4-3e43-11f1-a1a1-30e3a40e05cd','Décision','/docs/decisions'),
('b1bba627-3e43-11f1-a1a1-30e3a40e05cd','Résultats examen','/docs/examens')
ON DUPLICATE KEY UPDATE libelle=VALUES(libelle);

-- Réactiver les contraintes
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Import terminé avec succès!' AS message;
