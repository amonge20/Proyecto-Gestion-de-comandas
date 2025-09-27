<?php
require_once 'conexion.php';
require_once 'funciones.php';

$query = $conn->query("SELECT * FROM tipos_platos");
$tipos = $query->fetch_all(MYSQLI_ASSOC);
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
    <h1>Tipos de Platos</h1>
    <?php echo renderItemList($tipos, 'tipos'); ?>
    <button id="btnLista" onclick="openLista()" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    z-index: 1001;
">Ver lista de platos</button>


</body>

</html>