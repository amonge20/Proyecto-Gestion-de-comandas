-- Eliminar base de datos existente
DROP DATABASE IF EXISTS comandas;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS comandas 
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE comandas;

CREATE TABLE estados_mesa (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre_estado VARCHAR(50) NOT NULL
);

INSERT INTO estados_mesa (nombre_estado) VALUES
('Disponible'),
('Ocupada');

CREATE TABLE mesas (
    id_mesa INT PRIMARY KEY AUTO_INCREMENT,
    id_estado INT,
    FOREIGN KEY (id_estado) REFERENCES estados_mesa(id_estado)
);
INSERT INTO mesas (id_estado) VALUES
(1),(1),(1),(1),(1),(1),(1),(1);

CREATE TABLE tipos_platos (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(100) NOT NULL,
    nombre_tipo_cat VARCHAR(100) NOT NULL,
    imagen_tipo VARCHAR(255) DEFAULT NULL
);

INSERT INTO tipos_platos (nombre_tipo, nombre_tipo_cat, imagen_tipo) VALUES 
('Bebidas', 'Begudes', NULL),
('Sandwiches', 'Entrepans', NULL),
('Torradas', 'Torrades', NULL),
('Bocadillos Fríos', 'Entrepans freds', NULL),
('Bocadillos Calientes', 'Entrepans calents', NULL),
('Tapas frías', 'Tapes fredes', NULL),
('Tapas calientes', 'Tapes calentes', NULL),
('Bocadillos especiales', 'Entrepans especials', NULL),
('Frankfurt y hamburguesas Leo Boeck-Pan de Viena', 'Frankfurt i hamburgueses Leo Boeck-Pa de Viena', NULL),
('Ensaladas', 'Amanides', NULL),
('Platos combinados', 'Plats combinats', NULL);

CREATE TABLE alergenos (
    id_alergeno INT PRIMARY KEY AUTO_INCREMENT,
    nombre_alergeno VARCHAR(100) NOT NULL,
    nombre_alergeno_cat VARCHAR(100) NOT NULL,
    imagen_alergeno VARCHAR(255) DEFAULT NULL
);

INSERT INTO alergenos (nombre_alergeno, nombre_alergeno_cat, imagen_alergeno) VALUES
('Gluten', 'Gluten', NULL),
('Lácteos', 'Làctics', NULL),
('Frutos secos', 'Fruits secs', NULL),
('Huevos', 'Ous', NULL),
('Pescado', 'Peix', NULL),
('Marisco', 'Marisc', NULL);

CREATE TABLE extras (
    id_extra INT PRIMARY KEY AUTO_INCREMENT,
    nombre_extra VARCHAR(100) NOT NULL,
    nombre_extra_cat VARCHAR(100) NOT NULL,
    alergenos JSON DEFAULT NULL,
    imagen_extra VARCHAR(255) DEFAULT NULL,
    precio DECIMAL(6,2) DEFAULT 0.00
);

INSERT INTO extras (nombre_extra, nombre_extra_cat, alergenos, imagen_extra, precio) VALUES
('Queso', 'Formatge', '[2]', NULL, 0.50),
('Cebolla', 'Ceba', NULL, NULL, 0.50),
('Pimiento verde', 'Pebrot verd', NULL, NULL, 0.50),
('Bacon', 'Bacon', NULL, NULL, 1.00),
('Huevo frito', 'Ou fregit', '[4]', NULL, 1.00),
('Patatas fritas', 'Patates fregides', NULL, NULL, 1.50);


CREATE TABLE platos (
    id_plato INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plato VARCHAR(100) NOT NULL,
    nombre_plato_cat VARCHAR(100) NOT NULL,
    id_tipo INT,
    alergenos JSON DEFAULT NULL,
    imagen_plato VARCHAR(255) DEFAULT NULL,
    precio DECIMAL(6,2) DEFAULT 0.00,
    FOREIGN KEY (id_tipo) REFERENCES tipos_platos(id_tipo)
);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Coca-Cola', 'Coca-Cola', 1, NULL, NULL, 1.50),
('Café con leche', 'Cafè amb llet', 1, '[2]', NULL, 2.00);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Bikini (jamón york con queso)', 'Bikini (pernil dolç amb formatge)', 2, '[1,2]', NULL, 3.00),
('Sant Jordi (atún, huevo frito, queso, mayonesa) 3 pisos', 'Sant Jordi (tonyina, ou ferrat, formatge, maionesa) 3 pisos', 2, '[1,2,4]', NULL, 5.00),
('Sant Joan (bacon, huevo frito, queso) 3 pisos', 'Sant Joan (bacon, ou ferrat, formatge) 3 pisos', 2, '[1,2,4]', NULL, 5.00);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Escalivada con anchoas', 'Escalivada amb anxoves', 3, NULL, NULL, 10.50),
('Jamón ibérico', 'Pernil ibèric', 3, NULL, NULL, 10.50),
('Tabla mixta (jamón ibérico y queso)', 'Taula mixta (pernil ibèric i formatge)', 3, NULL, NULL, 10.50),
('Lomo con queso', 'Llom amb formatge', 3, NULL, NULL, 8.50);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Jamón ibérico', 'Pernil ibèric', 4, '[1]', NULL, 7.50),
('Jamón serrano', 'Pernil serrà', 4, '[1]', NULL, 4.00),
('Chorizo o salchichón ibérico', 'Xoriço o salsitxa ibèrica', 4, '[1]', NULL, 4.00),
('Atún', 'Tonyina', 4, '[1]', NULL, 4.00),
('Queso manchego', 'Formatxe manxec', 4, '[1]', NULL, 4.50),
('Anchoas (5 filetes)', 'Anxoves (5 filets)', 4, '[1]', NULL, 5.00),
('Fuet', 'Fuet', 4, '[1]', NULL, 4.00);


INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Lomo', 'Llom', 5, '[1]', NULL, 4.00),
('Panceta de cerdo', 'Panceta de porc', 5, '[1]', NULL, 4.00),
('Bacon', 'Baco', 5, '[1]', NULL, 4.00),
('Salchichas de país', 'Salsitxes de pais', 5, '[1]', NULL, 4.00),
('Butifarra', 'Botifarra', 5, '[1]', NULL, 4.50),
('Tortilla de patatas', 'Truita de patates', 5, '[1,4]', NULL, 4.00),
('Tortilla francesa', 'Truita francesa', 5, '[1,4]', NULL, 3.50),
('Tortilla al gusto', 'Truita al gust', 5, '[1,4]', NULL, 4.50),
('Pinchitos', 'Pinxos', 5, '[1]', NULL, 5.00),
('Pechuga de pollo, plancha o rebozada', 'Pit de pollastre, planxa o rebozat', 5, '[1]', NULL, 4.00),
('Lacón', 'Lacó', 5, '[1]', NULL, 4.50);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Boquerones en vinagre', 'Boquerons en vinagre', 6, '[5]', NULL, 4.50),
('Anchoas del Cantábrico (6 filetes)', 'Anxoves del Cantàbric (6 filets)', 6, '[5]', NULL, 6.00),
('Gambas saladas', 'Gamba salada', 6, '[5]', NULL, 6.00),
('Salpicón de marisco', 'Salpicó de marisc', 6, '[5,6]', NULL, 6.00),
('Aceitunas rellenas', 'Olives farcides', 6, '[5,6]', NULL, 2.50),
('Berberechos de lata', 'Berberechos de llauna', 6, '[5]', NULL, 7.00),
('Queso manchego', 'Formatge manxec', 6, '[2]', NULL, 6.00),
('Jamón ibérico', 'Pernil ibèric', 6, NULL, NULL, 13.50),
('Tabla mixta', 'Taula mixta', 6, NULL, NULL, 13.50),
('Tabla de embutidos ibéricos', "Taula d'embotits ibèrics", 6, NULL, NULL, 4.50),
('Pan con tomate', 'Pa amb tomàquet', 6, '[1]', NULL, 1.80);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Patatas bravas', 'Patates braves', 7, NULL, NULL, 4.50),
('Patatas fritas', 'Patates frites', 7, NULL, NULL, 3.50),
('Morros', 'Morros', 7, NULL, NULL, 5.50),
('Croquetas de pollo o jamón (6 unidades)', 'Croquetes de pollastre o pernil (6 unitats)', 7, NULL, NULL, 4.50),
('Nuggets de pollo', 'Nuggets de pollastre', 7, NULL, NULL, 4.50),
('Alitas de pollo', 'Ales de pollastre', 7, NULL, NULL, 6.50),
('Tiras de pollo cojún', 'Tires de pollastre cojun', 7, NULL, NULL, 6.50),
('Cazón adobado', 'Cazón adobat', 7, NULL, NULL, 7.50),
('Pincho', 'Pinxo', 7, NULL, NULL, 6.50),
('Cochinillo', 'Porcelli', 7, NULL, NULL, 6.50),
('Callos caseros', 'Callos casolans', 7, NULL, NULL, 7.50),
('Lacón a la gallega', 'Laco a la gallega', 7, NULL, NULL, 6.50),
('Pimientos de padrón', 'Pebrots de padrón', 7, NULL, NULL, 4.50),
('Champiñones a la plancha', 'Xampinyons a la planxa', 7, NULL, NULL, 5.50),
('Boquerones fritos', 'Boquerons fregits', 7, NULL, NULL, 6.00),
('Chipirones a la andaluza', 'Xipirons a la andalusa', 7, NULL, NULL, 7.50),
('Chocos', 'Xocos', 7, '[5]', NULL, 7.50),
('Calamares a la romana', 'Calamars a la romana', 7, '[5]', NULL, 6.50),
('Patitas de calamar', 'Potetes de calamar', 7, '[5]', NULL, 7.50),
('Gambas rebozadas (tempura)', 'Gambes arrebossades (tempura)', 7, '[5]', NULL, 7.50),
('Pulpitos a la plancha', 'Popets a la planxa', 7, '[5]', NULL, 8.50),
('Chipirones a la plancha', 'Xipirons a la planxa', 7, '[5]', NULL, 8.50),
('Sepia a la plancha cortada', 'Sípia a la planxa tallada', 7, '[5]', NULL, 10.00),
('Pulpo a la gallega', 'Pop a la gallega', 7, '[5]', NULL, 15.00),
('Gambas a la plancha (8 unidades)', 'Gambes a la planxa (8 unitats)', 7, '[6]', NULL, 12.00),
('Gambas al ajillo', 'Gambes al oli', 7, '[6]', NULL, 12.00),
('Mejillones al vapor', 'Musclos al vapor', 7, '[6]', NULL, 6.50),
('Mejillones a la marinera', 'Musclos a la marinera', 7, '[6]', NULL, 7.50);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Mediterráneo (atún, lechuga, tomate, mayonesa, olivas)', 'Mediterrani (tonyina, enciam, tomàquet, maionesa, olives)', 8, '[1,2,4]', NULL, 5.00),
('Escalivada (escalivada, atún, anchoas)', 'Escalivada (escalivada, tonyina, anxoves)', 8, '[1,6]', NULL, 6.00),
('Vegetal de pollo (pollo, lechuga, tomate, mayonesa)', 'Vegetal de pollastre (pollastre, enciam, tomàquet, maionesa)', 8, '[1,2,4]', NULL, 5.00),
('Pollo de casa (mayonesa, pollo rebozado, ensalada)', 'Pollastre de casa (maionesa, pollastre arrebossat, amanida)', 8, '[1,2,4]', NULL, 5.00),
('Lomo de casa (lomo, huevo, bacon, queso)', 'Llom de casa (llom, ou, bacon, formatge)', 8, '[1,2,4]', NULL, 5.50),
('Chivito (lomo, bacon, lechuga, tomate, mayonesa)', 'Xivit (llom, bacon, enciam, tomàquet, maionesa)', 8, '[1,2,4]', NULL, 5.50),
('Serranito 1 (lomo, jamón, pimiento verde)', 'Serranit 1 (llom, pernil, pebrot verd)', 8, '[1]', NULL, 5.00),
('Serranito 2 (pepitas de ternera, jamón, pimiento verde)', 'Serranit 2 (fepetes de vedella, pernil, pebrot verd)', 8, '[1,2,4]', NULL, 5.50);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Hamburguesa', 'Hamburguesa', 9, '[1]', NULL, 4.00),
('Hamburguesa de pollo', 'Hamburguesa de pollastre', 9, '[1]', NULL, 4.00),
('Hamburguesa picante', 'Hamburguesa picant', 9, '[1]', NULL, 4.10),
('Hamburguesa moruna', 'Hamburguesa moruna', 9, '[1]', NULL, 4.10),
('Malagueña', 'Malaguenya', 9, '[1]', NULL, 4.50),
('Super Frankfurt', 'Super Frankfurt', 9, '[1]', NULL, 4.00),
('Cervela', 'Cervela', 9, '[1]', NULL, 4.50),
('Bratwurst', 'Bratwurst', 9, '[1]', NULL, 4.50),
('Pikanwurst', 'Pikanwurst', 9, '[1]', NULL, 4.10),
('Xistorra', 'Xistorra', 9, '[1]', NULL, 4.10),
('Frankfurt de casa (frankfurt, queso, bacon, cebolla)', 'Frankfurt de casa (frankfurt, formatge, bacon, ceba)', 9, '[1,2]', NULL, 5.50),
('Hamburguesa de casa (hamburguesa, cebolla, bacon, queso)', 'Hamburguesa de casa (hamburguesa, ceba, bacon, formatge)', 9, '[1,2]', NULL, 5.00),
('Hamburguesa completa (hamburguesa, cebolla, bacon, huevo, lechuga, tomate, queso)', 'Hamburguesa completa (hamburguesa, ceba, bacon, ou, enciam, tomàquet, formatge)', 9, '[1,2,4]', NULL, 6.00);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Ensalada de casa (lechuga, tomate, olivas, cebolla, maíz, atún, huevo duro, espárragos)', 'Amanida de casa (enciam, tomàquet, olives, blat de moro, tonyina, ou dur, espàrrecs)', 10, '[4]', NULL, 6.50),
('Ensalada especial de casa (lechuga, salmón ahumado, queso de cabra, tomate cherry, frutos secos, vinagre balsámico)', 'Amanida especial de casa (enciam, salmó fumat, formatge de cabra, tomàquet cherry, fruita seca, vinagre balsàmic)', 10, '[4]', NULL, 8.50),
('Melón con jamón ibérico', 'Meló amb pernil ibèric', 10, NULL, NULL, 8.50),
('Piña con jamón ibérico', 'Pinya amb pernil ibèric', 10, NULL, NULL, 8.50);

INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Huevos rotos con jamón ibérico', 'Ous trencats amb pernil ibèric', 11, '[4]', NULL, 7.50),
('Pinchitos (patatas, huevo)', 'Pinxets (patates, ou)', 11, '[4]', NULL, 9.00),
('Bistec con huevos y patatas', 'Bistec amb ous i patates', 11, '[4]', NULL, 9.00),
('Hamburguesa, huevo y patatas', 'Hamburguesa, ou i patates', 11, '[4]', NULL, 8.50),
('Frankfurt, huevo y patatas', 'Frankfurt, ou i patates', 11, '[4]', NULL, 8.50),
('Bacon, huevo y patatas', 'Bacon, huevo y patatas', 11, '[4]', NULL, 8.50),
('Croquetas, huevo y patatas', 'Croquetes huevo y patatas', 11, '[4]', NULL, 8.50),
('Pollo rebozado, huevo y patatas', 'Pollastre rebocat, ou i patates', 11, '[4]', NULL, 8.50),
('Pollo a la plancha, huevo y patatas', 'Pollastre a la planxa, ou i patates', 11, '[4]', NULL, 8.50),
('Butifarra con judías y pimiento verde', 'Butifarra amb mongetes i pebrot verd', 11, '[4]', NULL, 8.50),
('Lomo a la plancha, huevo y patatas', 'Llom a la planxa, ou i patates', 11, '[4]', NULL, 8.50),
('Lomo rebozado, huevo y patatas', 'Llom arrebossat, ou i patates', 11, '[4]', NULL, 8.50),
('Sepia a la plancha, ensalada y patatas', 'Sípia a la planxa, amanida i patates', 11, NULL, NULL, 11.50),
('Pulpitos a la plancha, ensalada y patatas', 'Popets a la planxa, amanida i patates', 11, NULL, NULL, 9.50),
('Chipirones a la plancha, ensalada y patatas', 'Xipirons a la planxa, amanida i patates', 11, NULL, NULL, 9.50),
('Chipirones a la andaluza, ensalada y patatas', 'Xipirons a la andalusa, amanida i patates', 11, NULL, NULL, 9.50),
('Entregot, huevo y patatas (300gr)', 'Entrecot, ou i patates (300gr)', 11, '[4]', NULL, 14.50),
('Cordero, huevo y patatas', 'Xai, ou i patates', 11, '[4]', NULL, 13.50),
('Plato infantil (carne, patatas)', 'Plat infantil (carn, patates)', 11, NULL, NULL, 5.50);

CREATE TABLE comandas (
    id_comanda INT PRIMARY KEY AUTO_INCREMENT,
    id_mesa INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_total DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa)
);

CREATE TABLE comanda_platos (
    id_comanda_plato INT PRIMARY KEY AUTO_INCREMENT,
    id_comanda INT,
    id_plato INT,
    cantidad INT,
    precio DECIMAL(10,2) DEFAULT 0.00,
    servido BOOLEAN DEFAULT false,
    complementos JSON DEFAULT NULL,
    FOREIGN KEY (id_comanda) REFERENCES comandas(id_comanda),
    FOREIGN KEY (id_plato) REFERENCES platos(id_plato)
);
