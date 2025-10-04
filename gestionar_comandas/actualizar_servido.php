<?php
include '../conexion.php';

if (isset($_POST['id_comanda_plato']) && isset($_POST['servido'])) {
    $id = intval($_POST['id_comanda_plato']);
    $servido = intval($_POST['servido']);

    $stmt = $conn->prepare("UPDATE comanda_platos SET servido = ? WHERE id_comanda_plato = ?");
    $stmt->bind_param("ii", $servido, $id);
    $stmt->execute();
}
?>
