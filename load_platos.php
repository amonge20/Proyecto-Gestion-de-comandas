<?php
require_once 'conexion.php';
require_once 'funciones.php';

$idTipo = intval($_GET['id_tipo'] ?? 0);
$query = $conn->query("SELECT * FROM platos WHERE id_tipo = $idTipo");
$platos = $query->fetch_all(MYSQLI_ASSOC);

$content = "<div class='filtro-container'>";
$resultAlergenos = $conn->query("SELECT * FROM alergenos");

if ($resultAlergenos && $resultAlergenos->num_rows > 0) {
    $content .= "<strong>Excluir alérgenos:</strong>";
    $content .= "<div class='checkbox-list'>";
    while ($row = $resultAlergenos->fetch_assoc()) {
        $content .= "<label><input type='checkbox' class='filtro-alergeno' value='{$row['id_alergeno']}' onchange='filtrarPlatos()'> {$row['nombre_alergeno']}</label><br>";
    }
    $content .= "</div>";
    $content .= "<button onclick='limpiarFiltro()' class='btn-clear'>Limpiar filtro</button>";
}

$content .= "</div>";
$content .= "<div id='listaPlatos'>" . renderItemList($platos, 'platos', $conn) . "</div>";

echo createPopup($_GET["nombre_tipo"], $content);
?>
