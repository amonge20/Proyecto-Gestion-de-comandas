<?php
require_once '../conexion.php';

// Recoger datos JSON enviados desde JS
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['platos'])) {
    http_response_code(400);
    echo "❌ Datos inválidos.";
    exit;
}

// ID de mesa por defecto (puedes personalizar según tu lógica)
$id_mesa = 1;

// Insertar comanda
$conn->query("INSERT INTO comandas (id_mesa) VALUES ($id_mesa)");
$id_comanda = $conn->insert_id;

$total_comanda = 0;

foreach ($data['platos'] as $plato) {
    $id_plato = intval($plato['id']);
    $cantidad = intval($plato['cantidad']);
    $precio_plato = floatval($plato['precio']); // precio base del plato

    $extras = isset($plato['extras']) ? $plato['extras'] : [];

    // Calcular precio total del plato incluyendo extras
    $precioExtras = 0;
    $ids_extras = []; // almacenar solo las IDs de extras
    foreach ($extras as $e) {
        $precioExtras += floatval($e['precio']);
        $ids_extras[] = intval($e['id']);
    }
    $precio_total = ($precio_plato + $precioExtras) * $cantidad;

    // Guardar las IDs de los extras en JSON
    $extras_json = !empty($ids_extras) ? json_encode($ids_extras) : null;

    // Insertar plato en la tabla de comanda_platos
    $stmt = $conn->prepare("INSERT INTO comanda_platos (id_comanda, id_plato, cantidad, precio, complementos)
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiids", $id_comanda, $id_plato, $cantidad, $precio_total, $extras_json);
    $stmt->execute();

    $total_comanda += $precio_total;
}

// Actualizar precio total de la comanda
$stmt_total = $conn->prepare("UPDATE comandas SET precio_total = ? WHERE id_comanda = ?");
$stmt_total->bind_param("di", $total_comanda, $id_comanda);
$stmt_total->execute();

echo "✅ Comanda guardada con ID $id_comanda";

$conn->close();
?>
