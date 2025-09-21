<?php
// Conexión a la base de datos
include("conexion.php");

// Consultar tipos de platos
$sql = "SELECT * FROM tipos_platos";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Tipos de Platos</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/mostrar_platos.css">
</head>

<body>
    <h1>Tipos de Platos</h1>
    <div class="container">
        <?php while ($row = $result->fetch_assoc()):
            $imagen = !empty($row['imagen_tipo']) ? $row['imagen_tipo'] : 'images/placeholder.jpg'; // Imagen por defecto si no hay
        ?>
            <div class="tipo-plato" style="background-image: url('<?= $imagen ?>');">
                <span><?= htmlspecialchars($row['nombre_tipo']) ?></span>
                <button onclick="openPopup('elegir_plato', '<?= $row['id_tipo'] ?>')">Ver más</button>
            </div>
        <?php endwhile; ?>
    </div>

    <!-- Botón de confirmación -->
    <div class="boton-central">
        <button id="btn-principal" onclick="openPopup('enviar_comanda', '')">Confirmar selección</button>
    </div>
    <!-- Fin botón de confirmación -->

    <!-- Popup -->
    <div class="popup" id="popup">
        <div class="popup-content" id="popup-content">
            <button class="popup-close" onclick="closePopup()">Cerrar</button>
            <div id="popup-text"></div> <!-- Aquí se cargará mostrar_platos.php -->
        </div>
    </div>
    <!-- Fin popup -->

    <script src="./scripts/index.js"></script>
    <script src="./scripts/mostrar_platos.js"></script>
    <script src="./scripts/enviar_comanda.js"></script>

</body>

</html>