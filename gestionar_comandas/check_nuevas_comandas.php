<?php
include '../conexion.php';

$ultima_id = isset($_GET['ultima_id']) ? intval($_GET['ultima_id']) : 0;

$sql = "SELECT c.id_comanda, c.id_mesa, c.precio_total
        FROM comandas c
        WHERE c.id_comanda > $ultima_id
        ORDER BY c.id_comanda ASC";
$result = $conn->query($sql);

$nuevas = [];
while ($row = $result->fetch_assoc()) {
    $nuevas[] = [
        'id_comanda' => $row['id_comanda'],
        'id_mesa' => $row['id_mesa'],
        'precio_total' => $row['precio_total']
    ];
}

header('Content-Type: application/json');
echo json_encode(['nuevas' => $nuevas]);