<?php
require_once 'conexion.php';
require_once 'funciones.php';

$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);

// Si viene id_mesa por POST, actualizamos la sesión
if (isset($_POST['id_mesa'])) {
    $_SESSION['id_mesa'] = (int)$_POST['id_mesa'];
    echo 'Mesa ' . $_SESSION['id_mesa'];
    exit; // Para que no siga ejecutando el resto si solo es un fetch
} else {
    $_SESSION["id_mesa"] = intval($_GET['id_mesa'] ?? 1);
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Comandas</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>

<body>
    <header>Mesa <input type="number" name="id_mesa" id="id_mesa" min="1" max="30" value="<?php echo $_SESSION["id_mesa"] ?>" oninput="cambiarNumMesa(this)"></header>
    <h1>Tipos de Platos</h1>
    <?php echo renderItemList($tipos, 'tipos'); ?>
    <button id="btnLista" onclick="openLista()">Ver platos elegidos</button>
</body>

</html>