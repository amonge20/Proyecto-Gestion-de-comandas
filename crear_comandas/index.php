<?php
require_once '../conexion.php';
require_once 'funciones.php';

$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);

// Si viene id_mesa por POST, actualizamos la sesión
if (isset($_POST['id_mesa'])) {
    $_SESSION['id_mesa'] = (int)$_POST['id_mesa'];
    echo 'Mesa ' . $_SESSION['id_mesa'];
    exit;
} else {
    $_SESSION["id_mesa"] = intval($_GET['id_mesa'] ?? 1);
}
?>
<!DOCTYPE html>
<html lang="es">

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
        Mesa 
        <input type="number" name="id_mesa" id="id_mesa" 
               min="1" max="30" 
               value="<?php echo $_SESSION["id_mesa"] ?>" 
               oninput="cambiarNumMesa(this)">
        <br>
        <h1>Tipos de Platos</h1>
    </header>

    <!-- LISTA DE PLATOS -->
    <?php echo renderItemList($tipos, 'tipos'); ?>

    <!-- BOTONES -->
    <button id="btnLista" class="btn-success" onclick="openLista()">Ver platos elegidos</button>
    <button class="btn-primary" onclick="openBuscadorPlatos()">🔍 Buscar platos</button>
</body>
</html>
