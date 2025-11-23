<?php
require_once '../conexion.php';
require_once 'render_item_list.php';
require_once 'filtro_alergenos.php';

$id_tipo = intval($_GET['id_tipo'] ?? 0);
if ($id_tipo !== 0) {
    $query = $conn->query("SELECT * FROM platos WHERE id_tipo = $id_tipo");
} else {
    $query = $conn->query("SELECT * FROM platos");
}

$platos = $query ? $query->fetch_all(MYSQLI_ASSOC) : [];

// Filtro de alérgenos
$filtroAlergenos = filtroAlergenos($conn);

// Buscador
$traducciones = cargarTraducciones();
$buscador = "<input type='text' id='buscadorInput' placeholder='{$traducciones['busqueda']['placeholder']}' onkeyup='filtrarBusqueda()'>";

// Lista de platos
$listaPlatos = "<div id='listaPlatos'>" . renderItemList($platos, 'platos', $conn) . "</div>";

// Combinar todo
echo $filtroAlergenos . $buscador . $listaPlatos;
?>