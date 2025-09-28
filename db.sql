DROP DATABASE IF EXISTS comandas;

CREATE DATABASE IF NOT EXISTS comandas 
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE comandas;

CREATE TABLE mesas (
    id_mesa INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(50) NOT NULL
);

-- Insertar varias mesas con su estado
INSERT INTO mesas (estado) VALUES 
('Disponible'),
('Disponible'),
('Disponible'),
('Disponible'),
('Disponible'),
('Disponible'),
('Disponible'),
('Disponible');

CREATE TABLE tipos_platos (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(100) NOT NULL,
    imagen_tipo VARCHAR(255) DEFAULT NULL
);

INSERT INTO tipos_platos (nombre_tipo, imagen_tipo) VALUES 
('Bebidas', "images/imagen.jpg"),
('Bocadillos Calientes', NULL),
('Bocadillos Fríos', NULL),
('Platos Combinados', NULL),
('Postres', NULL);

CREATE TABLE alergenos (
    id_alergeno INT PRIMARY KEY AUTO_INCREMENT,
    nombre_alergeno VARCHAR(100) NOT NULL,
    imagen_alergeno VARCHAR(255) DEFAULT NULL
);

INSERT INTO alergenos (nombre_alergeno, imagen_alergeno) VALUES
('Gluten', NULL),
('Lácteos', NULL),
('Frutos secos', NULL),
('Huevos', NULL),
('Marisco', NULL);

CREATE TABLE platos (
    id_plato INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plato VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL, -- 🔥 Nueva columna para la descripción
    id_tipo INT,
    alergenos JSON DEFAULT NULL,
    imagen_plato VARCHAR(255) DEFAULT NULL,
    precio DECIMAL(6,2) DEFAULT 0.00,
    FOREIGN KEY (id_tipo) REFERENCES tipos_platos(id_tipo)
);

INSERT INTO platos (nombre_plato, descripcion, id_tipo, alergenos, imagen_plato, precio) VALUES
('Coca-Cola', 'Refresco con gas de 33cl bien frío.', 1, NULL, "images/imagen.jpg", 1.50),
('Café con leche', 'Café espresso con leche caliente espumada.', 1, '[2]', NULL, 2.00),
('Bocadillo de lomo', 'Baguette con lomo a la plancha recién hecho.', 2, '[1]', NULL, 3.50),
('Bocadillo de jamón serrano', 'Baguette con jamón serrano de primera calidad.', 3, '[1]', NULL, 4.00),
('Plato combinado nº1', 'Carne a la plancha, patatas fritas y huevo.', 4, '[1,2]', NULL, 7.50),
('Tarta de queso', 'Deliciosa tarta de queso casera.', 5, '[1,2,4]', NULL, 3.00);

-- Tabla de comandas
CREATE TABLE comandas (
    id_comanda INT PRIMARY KEY AUTO_INCREMENT,
    id_mesa INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa)
);

-- Tabla de platos en cada comanda
CREATE TABLE comanda_platos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_comanda INT,
    id_plato INT,
    cantidad INT DEFAULT 1,
    precio DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (id_comanda) REFERENCES comandas(id_comanda),
    FOREIGN KEY (id_plato) REFERENCES platos(id_plato)
);