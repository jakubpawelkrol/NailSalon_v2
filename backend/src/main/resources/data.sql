-- STARTING USERS
-- Password 'qwerty'
INSERT INTO users (email, password, first_name, last_name, role, enabled, created_at) 
VALUES ('admin@nailsalon.com', '$2a$10$AoESI5Snj61yezkeXPCSzOXZDszx6xWQDAZG8mBjDH5LThNlsNcd6', 'Ewa', 'Adminka', 'ADMIN', true, CURRENT_TIMESTAMP);

-- Password 'qwerty'
INSERT INTO users (email, password, first_name, last_name, role, enabled, created_at)
VALUES ('user@nailsalon.com', '$2a$10$AoESI5Snj61yezkeXPCSzOXZDszx6xWQDAZG8mBjDH5LThNlsNcd6', 'Anna', 'Uzytkowniczka', 'USER', true, CURRENT_TIMESTAMP);

-- STARTING SERVICES
--  Manicure
INSERT INTO services (category, name, description, price, duration, popular, created_at) VALUES
('MANI', 'Manicure żelowy (przedłużanie)', 'Metoda na formie', 'od 150', 150, true, CURRENT_TIMESTAMP),
('MANI', 'Manicure hybrydowy', 'Zdobienia, ombre, baby boomer', 'od 100', 90, true, CURRENT_TIMESTAMP),
('MANI', 'Manicure klasyczny', 'Bez malowania lub z odżywką', '70', 60, false, CURRENT_TIMESTAMP),
('MANI', 'Manicure japoński', 'Naturalne nabłyszczenie paznokci', '90', 60, false, CURRENT_TIMESTAMP),
('MANI', 'Manicure french', 'Delikatny, elegancki efekt', '110', 75, false, CURRENT_TIMESTAMP),
('MANI', 'Uzupełnienie żelu', 'Korekta kształtu i długości', '120', 120, false, CURRENT_TIMESTAMP),
('MANI', 'Manicure biologiczny', 'Delikatna pielęgnacja płytki', '80', 60, false, CURRENT_TIMESTAMP),
('MANI', 'Zdjęcie hybrydy', 'Z opracowaniem płytki', '30', 20, false, CURRENT_TIMESTAMP),
('MANI', 'Zdjęcie żelu', 'Bezpieczne usunięcie masy', '40', 30, false, CURRENT_TIMESTAMP),
('MANI', 'Naprawa pojedynczego paznokcia', 'Szybka rekonstrukcja', '15', 15, false, CURRENT_TIMESTAMP),

--  Pedicure
('PEDI', 'Pedicure hybrydowy', 'Pełna pielęgnacja + hybryda', 'od 130', 90, true, CURRENT_TIMESTAMP),
('PEDI', 'Pedicure klasyczny', 'Opracowanie paznokci i stóp', '100', 60, false, CURRENT_TIMESTAMP),
('PEDI', 'Pedicure french', 'Eleganckie wykończenie', '140', 80, false, CURRENT_TIMESTAMP),
('PEDI', 'Pedicure SPA', 'Peeling + maska', '150', 90, false, CURRENT_TIMESTAMP),
('PEDI', 'Pedicure leczniczy', 'Zabieg przy dolegliwościach', '160', 90, false, CURRENT_TIMESTAMP),
('PEDI', 'Zdjęcie hybrydy ze stóp', 'Delikatne usunięcie', '40', 25, false, CURRENT_TIMESTAMP),
('PEDI', 'Opracowanie pięt', 'Usunięcie zrogowaceń', '50', 30, false, CURRENT_TIMESTAMP),
('PEDI', 'Naprawa paznokcia u stopy', 'Rekonstrukcja punktowa', '20', 15, false, CURRENT_TIMESTAMP),

--  Podologia
('PODO', 'Konsultacja podologiczna', 'Diagnoza problemów stóp', '80', 30, false, CURRENT_TIMESTAMP),
('PODO', 'Usunięcie odcisku', 'Zabezpieczenie opatrunkiem', '80', 30, false, CURRENT_TIMESTAMP),
('PODO', 'Usunięcie modzela', 'Opracowanie mechaniczne', '90', 30, false, CURRENT_TIMESTAMP),
('PODO', 'Opracowanie paznokci problematycznych', 'Zgrubienia, onycholiza', '100', 45, false, CURRENT_TIMESTAMP),
('PODO', 'Rekonstrukcja paznokcia', 'Specjalistyczna masa', '70', 45, false, CURRENT_TIMESTAMP),
('PODO', 'Leczenie wrastającego paznokcia (klamra)', 'Dobór i założenie klamry', '150', 60, true, CURRENT_TIMESTAMP),
('PODO', 'Tamponada paznokcia', 'Odciążenie i ochrona', '30', 10, false, CURRENT_TIMESTAMP),
('PODO', 'Dezynfekcja + opatrunek', 'Pielęgnacja pozabiegowa', '20', 10, false, CURRENT_TIMESTAMP);