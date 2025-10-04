<?php
include '../conexion.php';

$ultima_id = isset($_GET['ultima_id']) ? intval($_GET['ultima_id']) : 0;

// Obtener nuevas comandas con ID mayor que el último conocido
$sql = "SELECT id_comanda, id_mesa, precio_total, fecha 
        FROM comandas 
        WHERE id_comanda > $ultima_id
        ORDER BY id_comanda ASC";
$result = $conn->query($sql);

$nuevas = [];
while ($row = $result->fetch_assoc()) {
    $nuevas[] = $row;
}

// Devolver JSON
header('Content-Type: application/json');
echo json_encode(['nuevas' => $nuevas]);
?>
