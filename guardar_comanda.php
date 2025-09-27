<?php
include 'conexion.php'; // tu conexión a la base de datos

// Recibir JSON
$data = json_decode(file_get_contents('php://input'), true);
$platos = $data['platos'] ?? [];

if (!$platos || count($platos) == 0) {
    echo "No hay platos para guardar.";
    exit;
}

// Calcular total
$total = 0;
foreach ($platos as $p) {
    if ($p['incluido']) {
        $total += $p['precio'] * $p['cantidad'];
    }
}

// Insertar comanda
$stmt = $conn->prepare("INSERT INTO comandas (total) VALUES (?)");
$stmt->bind_param("d", $total);
$stmt->execute();
$id_comanda = $stmt->insert_id;

// Insertar platos
$stmt2 = $conn->prepare("INSERT INTO comanda_platos (id_comanda, id_plato, cantidad, incluido, precio) VALUES (?,?,?,?,?)");
foreach ($platos as $p) {
    $stmt2->bind_param("iiidi", $id_comanda, $p['id'], $p['cantidad'], $p['incluido'], $p['precio']);
    $stmt2->execute();
}

echo "Comanda guardada correctamente con ID: $id_comanda";
?>
