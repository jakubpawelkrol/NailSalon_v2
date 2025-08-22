-- Password 'qwerty'
INSERT INTO users (email, password, first_name, last_name, role, enabled, created_at) 
VALUES ('admin@nailsalon.com', '$2a$10$AoESI5Snj61yezkeXPCSzOXZDszx6xWQDAZG8mBjDH5LThNlsNcd6', 'Ewa', 'Adminka', 'ADMIN', true, CURRENT_TIMESTAMP);

-- Password 'qwerty'
INSERT INTO users (email, password, first_name, last_name, role, enabled, created_at)
VALUES ('user@nailsalon.com', '$2a$10$AoESI5Snj61yezkeXPCSzOXZDszx6xWQDAZG8mBjDH5LThNlsNcd6', 'Anna', 'Uzytkowniczka', 'USER', true, CURRENT_TIMESTAMP);