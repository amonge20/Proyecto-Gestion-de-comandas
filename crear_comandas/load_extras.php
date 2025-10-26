<?php
require_once '../conexion.php';
$idioma = $_COOKIE['idioma'] ?? 'es';
$campo_nombre = ($idioma === 'cat') ? 'nombre_extra_cat' : 'nombre_extra';

$sql = "SELECT id_extra, $campo_nombre AS nombre, precio, imagen_extra 
        FROM extras ORDER BY id_extra ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<div class='lista-extras'>";
    while ($row = $result->fetch_assoc()) {
        $nombre = htmlspecialchars($row['nombre']);
        $precio = number_format($row['precio'], 2);
        $img = $row['imagen_extra'] 
            ? "<img src='{$row['imagen_extra']}' alt='$nombre' class='img-extra'/>"
            : "<div class='sin-imagen'>🍴</div>";
        
        echo "
        <div class='card extra' data-id='{$row['id_extra']}' data-nombre='$nombre' data-precio='{$row['precio']}'>
            $img
            <h3>$nombre</h3>
            <p><strong>$precio €</strong></p>
            <button class='btn' onclick='addExtraToList(this)'>Agregar</button>
        </div>";
    }
    echo "</div>";
} else {
    echo "<p>No hay extras disponibles</p>";
}
?>
