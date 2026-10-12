USE khadamati_db;
SET SQL_SAFE_UPDATES = 0;
UPDATE users SET email_verified = FALSE WHERE email_verified IS NULL;
SET SQL_SAFE_UPDATES = 1;
SELECT id, email, email_verified FROM users;
