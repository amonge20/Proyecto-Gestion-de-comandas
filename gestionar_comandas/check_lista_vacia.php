<?php
include '../conexion.php';

$sql = "SELECT COUNT(*) AS total FROM comandas";
$res = $conn->query($sql);
$row = $res->fetch_assoc();

$vacia = ($row['total'] == 0);

echo json_encode(['vacia' => $vacia]);
?>