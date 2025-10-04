<?php
include '../conexion.php';

if (isset($_POST['id_comanda'])) {
    $id = intval($_POST['id_comanda']);

    // Primero borrar platos de la comanda
    $stmt = $conn->prepare("DELETE FROM comanda_platos WHERE id_comanda = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // Luego borrar la comanda
    $stmt = $conn->prepare("DELETE FROM comandas WHERE id_comanda = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
}
?>
