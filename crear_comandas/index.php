<?php
require_once '../conexion.php';
require_once 'funciones.php';

// Obtener lista de tipos de platos
$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);

// Si viene id_mesa por POST, actualizamos la sesión (AJAX)
if (isset($_POST['id_mesa'])) {
    $_SESSION['id_mesa'] = (int)$_POST['id_mesa'];
    echo 'Mesa ' . $_SESSION['id_mesa'];
    exit;
}

// Si no hay mesa definida, usar la 1 por defecto
$_SESSION["id_mesa"] = intval($_SESSION["id_mesa"] ?? ($_GET['id_mesa'] ?? 1));

// Idioma por defecto
$_SESSION["idioma"] = $_SESSION["idioma"] ?? "es";
$idioma = $_SESSION["idioma"];
?>
<!DOCTYPE html>
<html lang="<?php echo $idioma; ?>">

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
            <img class='bandera' src='../images/spain.png' alt='spain' onclick="cambiarIdioma('es')">
            <img class='bandera' src='../images/catalonia.png' alt='catalonia' onclick="cambiarIdioma('cat')">
        </div>
         <?php
            if ($idioma == "es") {
                echo "Mesa";
            } else if ($idioma == "cat") {
                echo "Taula";
            }
        ?>
        <input type="number" name="id_mesa" id="id_mesa"
               min="1" max="30"
               value="<?php echo $_SESSION["id_mesa"]; ?>"
               oninput="cambiarNumMesa(this)">
        <br>
        
        <?php
            if ($idioma == "es") {
                echo "<h1>Tipos de Platos</h1>";
            } else if ($idioma == "cat") {
                echo "<h1>Tipus de Plats</h1>";
            }
        ?>
    </header>

    <!-- LISTA DE PLATOS -->
    <div id="lista-platos">
        <?php echo renderItemList($tipos, 'tipos'); ?>
    </div>

    <!-- BOTONES -->
    
    <div class="lista-botones">
         <?php
            if ($idioma == "es") {
                echo "<button class='btn-primary' onclick='openBuscadorPlatos()'>🔍 Buscar platos</button>";
                echo "<button id='btnLista' class='btn-success' onclick='openLista()'>Ver platos elegidos</button>";
            } else if ($idioma == "cat") {
                echo "<button class='btn-primary' onclick='openBuscadorPlatos()'>🔍 Buscar plats</button>";
                echo "<button id='btnLista' class='btn-success' onclick='openLista()'>Veure plats escollits</button>";
            }
        ?>
    </div>
</body>
</html>
