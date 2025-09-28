<?php
include '../conexion.php';

$sql = "SELECT * FROM comandas ORDER BY fecha ASC";
$result = $conn->query($sql);

while ($comanda = $result->fetch_assoc()) {
    echo "<h3>Comanda ID {$comanda['id_comanda']} - Precio total: {$comanda['precio_total']} € - Mesa: {$comanda['id_mesa']} - Fecha: {$comanda['fecha']}</h3>";

    $sql2 = "SELECT cp.cantidad, cp.precio, p.nombre_plato 
             FROM comanda_platos cp
             JOIN platos p ON cp.id_plato = p.id_plato
             WHERE cp.id_comanda = {$comanda['id_comanda']}";
    $res2 = $conn->query($sql2);

    echo "<ul>";
    while ($plato = $res2->fetch_assoc()) {
        echo "<li>{$plato['nombre_plato']} - Cantidad: {$plato['cantidad']} - Precio por unidad: {$plato['precio']} €</li>";
    }
    echo "</ul><hr>";
}
?>