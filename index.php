<?php
$fase = $_GET["fase"] ?? "";
if (!empty($fase)) {
    header("Location: {$fase}/index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Selecciona opción</title>
</head>

<body>
    <h2>Elige una opción:</h2>
    <form method="get" action="index.php">
        <button type="submit" name="fase" value="crear_comanda">Crear Comanda</button>
        <button type="submit" name="fase" value="gestionar_comandas">Gestionar Comandas</button>
    </form>
</body>

</html>