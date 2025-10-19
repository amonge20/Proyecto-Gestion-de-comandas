<?php
require_once '../conexion.php';
require_once 'funciones.php';

$id_tipo = $_GET['id_tipo'] ?? 0;
if ($id_tipo != 0) {
    $query = $conn->query("SELECT * FROM platos WHERE id_tipo = " . $_GET['id_tipo']);
} else {
    $query = $conn->query("SELECT * FROM platos");
}

$platos = $query->fetch_all(MYSQLI_ASSOC);

$resultAlergenos = $conn->query("SELECT * FROM alergenos");
$content = "<div class='filtro-container'>";

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
   $content .= '<input type="text" id="buscadorInput" 
             placeholder="Escribe para buscar..." 
             onkeyup="filtrarBusqueda()" 
             style="width:60%;padding:10px;margin-bottom:15px;">';
$content .= "<div id='listaPlatos'>" . renderItemList($platos, 'platos', $conn) . "</div>";

echo $content;
?>
