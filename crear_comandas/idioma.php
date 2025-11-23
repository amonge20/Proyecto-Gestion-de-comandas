<?php
require_once '../conexion.php';
require_once 'render_item_list.php';
require_once '../cargar_traducciones.php';

// Capturar cualquier salida accidental
ob_start();

// detectar idiomas dinámicos
$idiomasDisponibles = array_map(fn($archivo) => pathinfo($archivo, PATHINFO_FILENAME), glob("../idiomas/*.json"));

// cambiar idioma si POST es válido
if (!empty($_POST['idioma']) && in_array($_POST['idioma'], $idiomasDisponibles)) {
    $_SESSION['idioma'] = $_POST['idioma'];
}

$traducciones = cargarTraducciones();

// obtener datos de tipos de platos
$tipos = $conn->query("SELECT * FROM tipos_platos");
$tipos = $tipos ? $tipos->fetch_all(MYSQLI_ASSOC) : [];

// renderizar lista de platos
$listaPlatos = renderItemList($tipos, 'tipos');

// renderizar botones
$listaBotones =
    "<button class='btn-primary' onclick='openBuscadorPlatos()'>{$traducciones['botones']['buscarPlatos']}</button>
     <button id='btnLista' class='btn-success' onclick='openLista()'>{$traducciones['botones']['verPlatosElegidos']}</button>";

// renderizar header
$idMesa = $_SESSION["id_mesa"] ?? 1;
$headerHtml =
    "{$traducciones['mesa']} <input type='number' name='id_mesa' id='id_mesa' min='1' max='30' value='{$idMesa}' oninput='cambiarNumMesa(this)'><br>
     <h1>{$traducciones['tituloTipos']}</h1>";

// limpiar cualquier salida accidental antes de enviar JSON
ob_end_clean();

header('Content-Type: application/json');
echo json_encode([
    'header'  => $headerHtml,
    'platos'  => $listaPlatos,
    'botones' => $listaBotones
]);
?>