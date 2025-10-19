<?php
require_once '../conexion.php';
require_once 'funciones.php';

// Cambiar idioma en la sesión
if (isset($_POST['idioma'])) {
    $idioma = $_POST['idioma'];
    if (in_array($idioma, ['es', 'cat'])) {
        $_SESSION['idioma'] = $idioma;
    }
}

$idioma = $_SESSION['idioma'] ?? 'es';

// Volvemos a generar los datos necesarios
$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);

// Renderizar lista de platos
$listaPlatos = renderItemList($tipos, 'tipos');

// Renderizar botones
ob_start();
if ($idioma == "es") {
    echo "<button class='btn-primary' onclick='openBuscadorPlatos()'>🔍 Buscar platos</button>";
    echo "<button id='btnLista' class='btn-success' onclick='openLista()'>Ver platos elegidos</button>";
} else if ($idioma == "cat") {
    echo "<button class='btn-primary' onclick='openBuscadorPlatos()'>🔍 Buscar plats</button>";
    echo "<button id='btnLista' class='btn-success' onclick='openLista()'>Veure plats escollits</button>";
}
$listaBotones = ob_get_clean();

// Renderizar header
ob_start();
if ($idioma == "es") {
    echo "Mesa <input type='number' name='id_mesa' id='id_mesa' min='1' max='30' value='" . ($_SESSION["id_mesa"] ?? 1) . "' oninput='cambiarNumMesa(this)'><br>";
    echo "<h1>Tipos de Platos</h1>";
} else if ($idioma == "cat") {
    echo "Taula <input type='number' name='id_mesa' id='id_mesa' min='1' max='30' value='" . ($_SESSION["id_mesa"] ?? 1) . "' oninput='cambiarNumMesa(this)'><br>";
    echo "<h1>Tipus de Plats</h1>";
}
$headerHtml = ob_get_clean();

// Devolver todos los bloques como JSON
echo json_encode([
    'header' => $headerHtml,
    'platos' => $listaPlatos,
    'botones' => $listaBotones
]);