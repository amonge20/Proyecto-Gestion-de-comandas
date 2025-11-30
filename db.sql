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
('Bebidas', 'Begudes', '../images/bebidas/cocacola.png'),
('Para añadir', 'Per afegir', NULL),
('Sandwiches', 'Entrepans', '../images/sandwiches/bikini.jpg'),
('Torradas', 'Torrades', '../images/torradas/escalibada-anchoas.webp'),
('Bocadillos Fríos', 'Entrepans freds', '../images/bocadillos-frios/jamon.jpg'),
('Bocadillos Calientes', 'Entrepans calents', '../images/bocadillos-calientes/lomo.jpg'),
('Tapas frías', 'Tapes fredes', '../images/tapas-frias/boquerones-vinagre.jpeg'),
('Tapas calientes', 'Tapes calentes', '../images/tapas-calientes/patatas-bravas.jpg'),
('Bocadillos especiales', 'Entrepans especials', '../images/bocadillos-especiales/mediterraneo.jpg'),
('Frankfurt y hamburguesas Leo Boeck-Pan de Viena', 'Frankfurt i hamburgueses Leo Boeck-Pa de Viena', '../images/hamburguesas/hamburguesa.jpg'),
('Ensaladas', 'Amanides', '../images/ensaladas/ensalada-casa.webp'),
('Platos combinados', 'Plats combinats', '../images/platos-combinados/huevos-rotos.jpg');

CREATE TABLE alergenos (
    id_alergeno INT PRIMARY KEY AUTO_INCREMENT,
    nombre_alergeno VARCHAR(100) NOT NULL,
    nombre_alergeno_cat VARCHAR(100) NOT NULL,
    imagen_alergeno VARCHAR(255) DEFAULT NULL
);

INSERT INTO alergenos (nombre_alergeno, nombre_alergeno_cat, imagen_alergeno) VALUES
('Altramuces', 'Altramuces', '../images/alergias/altramuces.png'), /*1*/
('Apio', 'Api', '../images/alergias/apio.png'), /*2*/
('Cacahuetes', 'Cacauets', '../images/alergias/cacahuetes.png'), /*3*/
('Crustaceos', 'Crustacis', '../images/alergias/crustaceos.png'), /*4*/
('Frutos secos', 'Fruits secs', '../images/alergias/frutos_secos.png'), /*5*/
('Gluten', 'Gluten', '../images/alergias/gluten.png'), /*6*/
('Huevos', 'Ous', '../images/alergias/huevo.png'), /*7*/
('Lácteos', 'Làctics', '../images/alergias/lacteos.png'), /*8*/
('Marisco', 'Marisc', '../images/alergias/moluscos.png'), /*9*/
('Mostaza', 'Mostassa', '../images/alergias/mostaza.png'), /*10*/
('Pescado', 'Peix', '../images/alergias/pescado.png'), /*11*/
('Sésamo', 'Sèsam', '../images/alergias/sesamo.png'), /*12*/
('Soja', 'Soja', '../images/alergias/soja.png'), /*13*/
('Sulfito', 'Sulfit', '../images/alergias/sulfito.png'), /*14*/
('Legumbres', 'Llegums', '../images/alergias/legumbres.png'), /*15*/
('Cerdo', 'Porc', '../images/alergias/cerdo.png'); /*16*/

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

/*BEBIDAS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Agua', 'Aigua', 1, NULL, '../images/bebidas/agua.jpg', 1.00),
('Cerveza', 'Cervesa', 1, NULL, '../images/bebidas/cerveza.jpg', 1.50),
('Cerveza sin alcohol', 'Cervesa sense alcohol', 1, NULL, '../images/bebidas/cerveza-sin-alcohol.jpg', 1.50),
('Fanta Naranja', 'Fanta Taronja', 1, NULL,  '../images/bebidas/fanta-naranja.png', 1.50),
('Fanta Limón', 'Fanta Llimona', 1, NULL,  '../images/bebidas/fanta-limon.png', 1.50),
('Coca-Cola', 'Coca-Cola', 1, NULL,  '../images/bebidas/cocacola.png', 1.50),
('Coca-Cola Zero', 'Coca-Cola Zero', 1, NULL,  '../images/bebidas/cocacola-zero-azucar.png', 1.50),
('Nestea de limón', 'Nestea de Llimona', 1, NULL, '../images/bebidas/nestea.jpg', 1.50),
('Zumo de naranja', 'Suc de taronja', 1, NULL, '../images/bebidas/zumo-naranja.webp', 2.00),
('Zumo de piña', 'Suc de pinya', 1, NULL, '../images/bebidas/zumo-pina.jpg', 2.00),
('Café cortado', 'Cafè tallat', 1, '[8]', '../images/bebidas/cafe-cortado.jpg', 1.20),
('Café solo', 'Cafè sol', 1, NULL, '../images/bebidas/cafe.jpg', 1.00),
('Café con leche', 'Cafè amb llet', 1, '[8]', '../images/bebidas/cafe-leche.jpg', 1.50);

/*PARA AÑADIR*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Queso', 'Formatge', 2, '[8]', NULL, 0.50),
('Cebolla', 'Ceba', 2, NULL, NULL, 0.50),
('Pimiento verde', 'Pebrot verd', 2, NULL, NULL, 0.50),
('Bacon', 'Bacon', 2, '[16]', NULL, 1.00),
('Huevo frito', 'Ou fregit', 2, '[7]', NULL, 1.00),
('Patatas fritas', 'Patates fregides', 2, NULL, NULL, 1.50);

/*SANDWICHES*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Bikini (jamón york con queso)', 'Bikini (pernil dolç amb formatge)', 3, '[6,8,16]', '../images/sandwiches/bikini.jpg', 3.00),
('Sant Jordi (atún, huevo frito, queso, mayonesa) 3 pisos', 'Sant Jordi (tonyina, ou ferrat, formatge, maionesa) 3 pisos', 3, '[6,7,8,11]', '../images/sandwiches/sant-jordi.avif', 5.00),
('Sant Joan (bacon, huevo frito, queso) 3 pisos', 'Sant Joan (bacon, ou ferrat, formatge) 3 pisos', 3, '[6,7,8,16]', NULL, 5.00);

/*TORRADAS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Escalivada con anchoas', 'Escalivada amb anxoves', 4, '[6,11]', '../images/torradas/escalibada-anchoas.webp', 10.50),
('Jamón ibérico', 'Pernil ibèric', 4, '[6,16]', '../images/torradas/jamon-iberico.jpg', 10.50),
('Tabla mixta (jamón ibérico y queso)', 'Taula mixta (pernil ibèric i formatge)', 4, '[6,8,16]', NULL, 10.50),
('Lomo con queso', 'Llom amb formatge', 4, '[6,8,16]', NULL, 8.50);

/*BOCADILLOS FRÍOS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Jamón ibérico', 'Pernil ibèric', 5, '[6,16]', '../images/bocadillos-frios/jamon.jpg', 7.50),
('Jamón serrano', 'Pernil serrà', 5, '[6,16]', '../images/bocadillos-frios/jamon-serrano.png', 4.00),
('Chorizo', 'Xoriço', 5, '[6,16]', '../images/bocadillos-frios/chorizo.jpg', 4.00),
('Salchichón ibérico', 'Salsitxa ibèrica', 5, '[6,16]', '../images/bocadillos-frios/salchichon.jpg', 4.00),
('Atún', 'Tonyina', 5, '[6,11]', '../images/bocadillos-frios/atun.jpg', 4.00),
('Queso manchego', 'Formatxe manxec', 5, '[6,8]', '../images/bocadillos-frios/queso.jpg', 4.50),
('Anchoas (5 filetes)', 'Anxoves (5 filets)', 5, '[6,11]', NULL, 5.00),
('Fuet', 'Fuet', 5, '[6,16]', '../images/bocadillos-frios/fuet.jpg', 4.00);

/*BOCADILLOS CALIENTES*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Lomo', 'Llom', 6, '[16]', '../images/bocadillos-calientes/lomo.jpg', 4.00),
('Panceta de cerdo', 'Panceta de porc', 6, '[16]', '../images/bocadillos-calientes/panceta-de-cerdo.jpg', 4.00),
('Bacon', 'Baco', 6, '[16]', '../images/bocadillos-calientes/bacon.webp', 4.00),
('Salchichas de país', 'Salsitxes de pais', 6, '[16]', '../images/bocadillos-calientes/frankfurt.png', 4.00),
('Butifarra', 'Botifarra', 6, '[16]', '../images/bocadillos-calientes/butifarra.jpg', 4.50),
('Tortilla de patatas', 'Truita de patates', 6, '[7]', '../images/bocadillos-calientes/tortilla.jpeg', 4.00),
('Tortilla francesa', 'Truita francesa', 6, '[7]', '../images/bocadillos-calientes/tortilla-francesa.jpg', 3.50),
('Tortilla al gusto', 'Truita al gust', 6, '[7]', NULL, 4.50),
('Pinchitos', 'Pinxos', 6, '[16]', '../images/bocadillos-calientes/pinchitos.png', 5.00),
('Pechuga de pollo, plancha', 'Pit de pollastre, planxa', 6, NULL, NULL, 4.00),
('Pechuga de pollo, rebozada', 'Pit de pollastre, rebozat', 6, '[6,7]', NULL, 4.00),
('Lacón', 'Lacó', 6, '[16]', NULL, 4.50);

/*TAPAS FRÍAS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Boquerones en vinagre', 'Boquerons en vinagre', 7, '[11]', '../images/tapas-frias/boquerones-vinagre.jpeg', 4.50),
('Anchoas del Cantábrico (6 filetes)', 'Anxoves del Cantàbric (6 filets)', 7, '[11]', NULL, 6.00),
('Gambas saladas', 'Gamba salada', 7, '[4]', '../images/tapas-frias/gambas-saladas.avif', 6.00),
('Salpicón de marisco', 'Salpicó de marisc', 7, '[9]', '../images/tapas-frias/salpicon-marisco.png', 6.00),
('Aceitunas rellenas', 'Olives farcides', 7, NULL, '../images/tapas-frias/aceitunas.avif', 2.50),
('Berberechos de lata', 'Berberechos de llauna', 7, '[9]', '../images/tapas-frias/berberechos.avif', 7.00),
('Queso manchego', 'Formatge manxec', 7, '[8]', '../images/tapas-frias/queso-manchego.avif', 6.00),
('Jamón ibérico', 'Pernil ibèric', 7, '[16]', '../images/tapas-frias/jamon-iberico.avif', 13.50),
('Tabla mixta', 'Taula mixta', 7, '[7,8,16]', NULL, 13.50),
('Tabla de embutidos ibéricos', "Taula d'embotits ibèrics", 7, '[16]', '../images/tapas-frias/tablaiberica.jpg', 4.50),
('Pan con tomate', 'Pa amb tomàquet', 7, '[6]', '../images/tapas-frias/pan-con-tomate.webp', 1.80);

/*TAPAS CALIENTES*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Patatas bravas', 'Patates braves', 8, '[2,3,4,6,7,8,9,10,11,12,13]', '../images/tapas-calientes/patatas-bravas.jpg', 4.50),
('Patatas fritas', 'Patates frites', 8, NULL, '../images/tapas-calientes/papas-fritas.avif', 3.50),
('Morros', 'Morros', 8, "[16]", '../images/tapas-calientes/morros.jpg', 5.50),
('Croquetas de pollo (6 unidades)', 'Croquetes de pollastre (6 unitats)', 8, '[6,7]', '../images/tapas-calientes/croquetas-pollo.jpg', 4.50),
('Croquetas de jamón (6 unidades)', 'Croquetes de pernil (6 unitats)', 8, '[6,7,16]', '../images/tapas-calientes/croquetas-jamon.webp', 4.50),
('Nuggets de pollo', 'Nuggets de pollastre', 8, '[6,7]', '../images/tapas-calientes/nuggets-pollo.avif', 4.50),
('Alitas de pollo', 'Ales de pollastre', 8, NULL, '../images/tapas-calientes/alitas-pollo.avif', 6.50),
('Tiras de pollo cojún', 'Tires de pollastre cojun', 8, '[6,7]', '../images/tapas-calientes/tiras-pollo.jpg', 6.50),
('Cazón adobado', 'Cazón adobat', 8, '[6,7]', '../images/tapas-calientes/cazon.jpg', 7.50),
('Pincho', 'Pinxo', 8, '[16]', NULL, 6.50),
('Cochinillo', 'Porcelli', 8, '[16]', '../images/tapas-calientes/cochinillo.png', 6.50),
('Callos caseros', 'Callos casolans', 8, '[6]', '../images/tapas-calientes/callos-caseros.webp', 7.50),
('Lacón a la gallega', 'Laco a la gallega', 8, '[16]', NULL, 6.50),
('Pimientos de padrón', 'Pebrots de padrón', 8, NULL, '../images/tapas-calientes/pimientos.jpg', 4.50),
('Champiñones a la plancha', 'Xampinyons a la planxa', 8, NULL, NULL, 5.50),
('Boquerones fritos', 'Boquerons fregits', 8, '[6,7,8,11,14]', '../images/tapas-calientes/boquerones-fritos.jpeg', 6.00),
('Chipirones a la andaluza', 'Xipirons a la andalusa', 8, '[2,3,4,6,7,8,10,11,12,13,14]', '../images/tapas-calientes/chipirones.jpg', 7.50),
('Chocos', 'Xocos', 8, NULL, '../images/tapas-calientes/chocos.jpg', 7.50),
('Calamares a la romana', 'Calamars a la romana', 8, '[6,7,9]', '../images/tapas-calientes/calamares-romana.webp', 6.50),
('Patitas de calamar', 'Potetes de calamar', 8, '[6,7,9]', '../images/tapas-calientes/patitas-calamar.jpg', 7.50),
('Gambas rebozadas (tempura)', 'Gambes arrebossades (tempura)', 8, '[4,6,7]', '../images/tapas-calientes/gambas-rebozadas-tempura.jpg', 7.50),
('Pulpitos a la plancha', 'Popets a la planxa', 8, '[9]', '../images/tapas-calientes/pulpitos-plancha.jpg', 8.50),
('Chipirones a la plancha', 'Xipirons a la planxa', 8, '[6,7,8,10,11,12,13]', '../images/tapas-calientes/chipirones.jpg', 8.50),
('Sepia a la plancha cortada', 'Sípia a la planxa tallada', 8, '[9]', NULL, 10.00),
('Pulpo a la gallega', 'Pop a la gallega', 8, '[9]', '../images/tapas-calientes/pulpo-gallega.jpg', 15.00),
('Gambas a la plancha (8 unidades)', 'Gambes a la planxa (8 unitats)', 8, '[4]', '../images/tapas-calientes/gambas-plancha.png', 12.00),
('Gambas al ajillo', 'Gambes al oli', 8, '[4]', '../images/tapas-calientes/gambas-ajillo.jpg', 12.00),
('Mejillones al vapor', 'Musclos al vapor', 8, '[9]', '../images/tapas-calientes/mejillones-vapor.avif', 6.50),
('Mejillones a la marinera', 'Musclos a la marinera', 8, '[9]', '../images/tapas-calientes/mejillones-marinera.jpg', 7.50);

/*BOCADILLOS ESPECIALES*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Mediterráneo (atún, lechuga, tomate, mayonesa, olivas)', 'Mediterrani (tonyina, enciam, tomàquet, maionesa, olives)', 9, '[6,7,8,9,11]', '../images/bocadillos-especiales/mediterraneo.jpg', 5.00),
('Escalivada (escalivada, atún, anchoas)', 'Escalivada (escalivada, tonyina, anxoves)', 9, '[11]', NULL, 6.00),
('Vegetal de pollo (pollo, lechuga, tomate, mayonesa)', 'Vegetal de pollastre (pollastre, enciam, tomàquet, maionesa)', 9, '[6,7,8]', '../images/bocadillos-especiales/vegetal-pollo.jpeg', 5.00),
('Pollo de casa (mayonesa, pollo rebozado, ensalada)', 'Pollastre de casa (maionesa, pollastre arrebossat, amanida)', 9, '[6,7,8]', '../images/bocadillos-especiales/bocadillo-pollo.webp', 5.00),
('Lomo de casa (lomo, huevo, bacon, queso)', 'Llom de casa (llom, ou, bacon, formatge)', 9, '[6,7,8,16]', '../images/bocadillos-especiales/bocadillo-lomo.jpg', 5.50),
('Chivito (lomo, bacon, lechuga, tomate, mayonesa)', 'Xivit (llom, bacon, enciam, tomàquet, maionesa)', 9, '[6,7,8,16]', '../images/bocadillos-especiales/bocadillo-chivito.jpg', 5.50),
('Serranito 1 (lomo, jamón, pimiento verde)', 'Serranit 1 (llom, pernil, pebrot verd)', 9, '[6,16]', '../images/bocadillos-especiales/bocadillo-serranito1.jpg', 5.00),
('Serranito 2 (pepitas de ternera, jamón, pimiento verde)', 'Serranit 2 (fepetes de vedella, pernil, pebrot verd)', 9, '[6,16]', NULL, 5.50);

/*FRANKFURT Y HAMBURGUESAS LEO BOECK - PAN DE VIENA*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Hamburguesa', 'Hamburguesa', 10, '[6,16]', '../images/hamburguesas/hamburguesa.jpg', 4.00),
('Hamburguesa de pollo', 'Hamburguesa de pollastre', 10, '[6]', '../images/hamburguesas/hamburguesa-pollo.jpg', 4.00),
('Hamburguesa picante', 'Hamburguesa picant', 10, '[6]', '../images/hamburguesas/hamburguesa-picante.jpg', 4.10),
('Hamburguesa moruna', 'Hamburguesa moruna', 10, '[6,16]', NULL, 4.10),
('Malagueña', 'Malaguenya', 10, '[6,16]', '../images/frankfurt/malaguena.jpg', 4.50),
('Super Frankfurt', 'Super Frankfurt', 10, '[6,16]', '../images/frankfurt/super-frankfurt.jpg', 4.00),
('Cervela', 'Cervela', 10, '[6,16]', '../images/frankfurt/cervela.png', 4.50),
('Bratwurst', 'Bratwurst', 10, '[6,16]', '../images/frankfurt/bratwurst.webp', 4.50),
('Pikanwurst', 'Pikanwurst', 10, '[6,16]', '../images/frankfurt/pikantwurst.png', 4.10),
('Xistorra', 'Xistorra', 10, '[6,16]', '../images/frankfurt/xistorra.png', 4.10),
('Frankfurt de casa (frankfurt, queso, bacon, cebolla)', 'Frankfurt de casa (frankfurt, formatge, bacon, ceba)', 10, '[6,8,16]', NULL, 5.50),
('Hamburguesa de casa (hamburguesa, cebolla, bacon, queso)', 'Hamburguesa de casa (hamburguesa, ceba, bacon, formatge)', 10, '[6,8,16]', '../images/hamburguesas/hamburguesa-casa.webp', 5.00),
('Hamburguesa completa (hamburguesa, cebolla, bacon, huevo, lechuga, tomate, queso)', 'Hamburguesa completa (hamburguesa, ceba, bacon, ou, enciam, tomàquet, formatge)', 10, '[6,7,8,16]', '../images/hamburguesas/hamburguesa-completa.jpg', 6.00);

/*ENSALADAS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Ensalada de casa (lechuga, tomate, olivas, cebolla, maíz, atún, huevo duro, espárragos)', 'Amanida de casa (enciam, tomàquet, olives, blat de moro, tonyina, ou dur, espàrrecs)', 11, '[7,11]', '../images/ensaladas/ensalada-casa.webp', 6.50),
('Ensalada especial de casa (lechuga, salmón ahumado, queso de cabra, tomate cherry, frutos secos, vinagre balsámico)', 'Amanida especial de casa (enciam, salmó fumat, formatge de cabra, tomàquet cherry, fruita seca, vinagre balsàmic)', 11, '[3,8,11,13,14]', NULL, 8.50),
('Melón con jamón ibérico', 'Meló amb pernil ibèric', 11, '[16]', '../images/ensaladas/ensalada-melon-jamon.jpeg', 8.50),
('Piña con jamón ibérico', 'Pinya amb pernil ibèric', 11, '[16]', NULL, 8.50);

/*PLATOS COMBINADOS*/
INSERT INTO platos (nombre_plato, nombre_plato_cat, id_tipo, alergenos, imagen_plato, precio) VALUES
('Huevos rotos con jamón ibérico', 'Ous trencats amb pernil ibèric', 12, '[7,16]', '../images/platos-combinados/huevos-rotos.jpg', 7.50),
('Pinchitos (patatas, huevo)', 'Pinxets (patates, ou)', 12, '[7]', NULL, 9.00),
('Bistec con huevos y patatas', 'Bistec amb ous i patates', 12, '[7,16]', '../images/platos-combinados/bistec-combinado.jpeg', 9.00),
('Hamburguesa, huevo y patatas', 'Hamburguesa, ou i patates', 12, '[7,16]', '../images/platos-combinados/hamburguesa-combinada.jpeg', 8.50),
('Frankfurt, huevo y patatas', 'Frankfurt, ou i patates', 12, '[7,16]', '../images/platos-combinados/plato_combinado_frankfurt_huevos_patatas.jpg', 8.50),
('Bacon, huevo y patatas', 'Bacon, huevo y patatas', 12, '[7,16]', '../images/platos-combinados/plato-combinado-bacon.webp', 8.50),
('Croquetas, huevo y patatas', 'Croquetes huevo y patates', 12, '[6,7]', NULL, 8.50),
('Pollo rebozado, huevo y patatas', 'Pollastre rebocat, ou i patates', 12, '[6,7]', NULL, 8.50),
('Pollo a la plancha, huevo y patatas', 'Pollastre a la planxa, ou i patates', 12, '[7]', NULL, 8.50),
('Butifarra con judías y pimiento verde', 'Butifarra amb mongetes i pebrot verd', 12, '[15,16]', NULL, 8.50),
('Lomo a la plancha, huevo y patatas', 'Llom a la planxa, ou i patates', 12, '[7,16]', NULL, 8.50),
('Lomo rebozado, huevo y patatas', 'Llom arrebossat, ou i patates', 12, '[6,7,16]', '../images/platos-combinados/plato-combinado-pollo-rebozado.jpeg', 8.50),
('Sepia a la plancha, ensalada y patatas', 'Sípia a la planxa, amanida i patates', 12, '[9]', '../images/platos-combinados/plato-combinado-sepia.jpg', 11.50),
('Pulpitos a la plancha, ensalada y patatas', 'Popets a la planxa, amanida i patates', 12, '[9]', NULL, 9.50),
('Chipirones a la plancha, ensalada y patatas', 'Xipirons a la planxa, amanida i patates', 12, '[9]', NULL, 9.50),
('Chipirones a la andaluza, ensalada y patatas', 'Xipirons a la andalusa, amanida i patates', 12, '[6,9]', NULL, 9.50),
('Entregot, huevo y patatas (300gr)', 'Entrecot, ou i patates (300gr)', 12, '[7,16]', NULL, 14.50),
('Cordero, huevo y patatas', 'Xai, ou i patates', 12, '[7]', NULL, 13.50),
('Plato infantil (carne, patatas)', 'Plat infantil (carn, patates)', 12, '[16]', NULL, 5.50);

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
    parent_id_comanda_plato INT DEFAULT NULL, -- referencia a la línea padre si es un extra
    FOREIGN KEY (id_comanda) REFERENCES comandas(id_comanda),
    FOREIGN KEY (id_plato) REFERENCES platos(id_plato),
    INDEX (parent_id_comanda_plato),
    CONSTRAINT fk_parent_comanda_plato FOREIGN KEY (parent_id_comanda_plato) REFERENCES comanda_platos(id_comanda_plato) ON DELETE SET NULL
);


