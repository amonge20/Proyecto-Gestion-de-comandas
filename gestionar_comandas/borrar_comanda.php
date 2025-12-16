<?php
include '../conexion.php';

$id_comanda = intval($_POST['id_comanda']);

// 1. Borrar los platos asociados a la comanda
$sqlPlatos = "DELETE FROM comanda_platos WHERE id_comanda = ?";
$stmtPlatos = $conn->prepare($sqlPlatos);
$stmtPlatos->bind_param("i", $id_comanda);
$stmtPlatos->execute();

// 2. Borrar la comanda
$sqlBorrarComanda = "DELETE FROM comandas WHERE id_comanda = ?";
$stmtComanda = $conn->prepare($sqlBorrarComanda);
$stmtComanda->bind_param("i", $id_comanda);
$stmtComanda->execute();

// 3. Comprobar si ya no queda ninguna comanda
$sqlComandas = "SELECT COUNT(*) AS total FROM comandas";
$resComandas = $conn->query($sqlComandas);
$rowComandas = $resComandas->fetch_assoc();

if ($rowComandas['total'] == 0) {
    // Reiniciar los AUTO_INCREMENT si no queda ninguna comanda
    $conn->query("ALTER TABLE comandas AUTO_INCREMENT = 1");
    $conn->query("ALTER TABLE comanda_platos AUTO_INCREMENT = 1");
}

echo "Comanda $id_comanda eliminada con éxito.";
?>