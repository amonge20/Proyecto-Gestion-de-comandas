<?php
include '../conexion.php';

$id_comanda = intval($_GET['id_comanda']);

$sql = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
        FROM comanda_platos cp
        JOIN platos p ON cp.id_plato = p.id_plato
        WHERE cp.id_comanda = $id_comanda";
$res = $conn->query($sql);

while ($plato = $res->fetch_assoc()) {
    $checked = ($plato['servido'] ?? 0) ? "checked" : "";
    echo "<li>
            <input type='checkbox' data-id='{$plato['id_comanda_plato']}' class='chk-en-mesa' $checked />
            {$plato['nombre_plato']} - Cantidad: {$plato['cantidad']} - Precio: {$plato['precio']} €
          </li>";
}
