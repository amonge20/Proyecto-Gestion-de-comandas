<?php
require_once '../cargar_traducciones.php';
require_once '../conexion.php';
require_once 'render_item_list.php';

// Cargar traducciones
$traducciones = cargarTraducciones();
$_SESSION["idioma"] = $_SESSION["idioma"] ?? "es";

// Obtener lista de tipos de platos
$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);

// Si viene id_mesa por POST, actualizamos la sesión (AJAX)
if (isset($_POST['id_mesa'])) {
    $_SESSION['id_mesa'] = (int)$_POST['id_mesa'];
    echo $traducciones['mesa'] . ' ' . $_SESSION['id_mesa'];
    exit;
}

// Si no hay mesa definida, usar la 1 por defecto
$_SESSION["id_mesa"] = intval($_SESSION["id_mesa"] ?? ($_GET['id_mesa'] ?? 1));
?>

<!DOCTYPE html>
<html lang="<?php echo $_SESSION["idioma"]; ?>">

<head>
    <meta charset="UTF-8">
    <title>Comandas</title>
    <link rel="stylesheet" href="../style.css">
    <script src="script.js" defer></script>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
</head>

<body>
    <!-- HEADER con el número de mesa -->
    <header>
        <div class="botones_idiomas">
            <img class='bandera' src='../images/es.png' alt='es' onclick="cambiarIdioma('es')">
            <img class='bandera' src='../images/cat.png' alt='cat' onclick="cambiarIdioma('cat')">
        </div>
        <span>
            <?php echo $traducciones['mesa']; ?>
            <input type="number" name="id_mesa" id="id_mesa"
                   min="1" max="30"
                   value="<?php echo $_SESSION["id_mesa"]; ?>"
                   oninput="cambiarNumMesa(this)">
        </span>
        <br>
        <h1><?php echo $traducciones['tituloTipos']; ?></h1>
    </header>

    <!-- LISTA DE PLATOS -->
    <div id="lista-platos">
        <?php echo renderItemList($tipos, 'tipos', $conn, $traducciones); ?>
    </div>

    <!-- BOTONES -->
    <div class="lista-botones">
         <button class='btn-primary' onclick='openBuscadorPlatos()'><?php echo $traducciones['botones']['buscarPlatos']; ?></button>
         <button id='btnLista' class='btn-success' onclick='openLista()'><?php echo $traducciones['botones']['verPlatosElegidos']; ?></button>
    </div>
</body>
</html>