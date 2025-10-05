<?php
include '../conexion.php';

$id_mesa = intval($_POST['id_mesa']);

// Obtener todas las comandas de la mesa seleccionada
$sqlComandas = "SELECT id_comanda FROM comandas WHERE id_mesa = ?";
$stmt = $conn->prepare($sqlComandas);
$stmt->bind_param("i", $id_mesa);
$stmt->execute();
$result = $stmt->get_result();

$comandas = [];
while ($row = $result->fetch_assoc()) {
    $comandas[] = $row['id_comanda'];
}

if (!empty($comandas)) {
    // Borrar los platos asociados
    $placeholders = implode(',', array_fill(0, count($comandas), '?'));
    $tipos = str_repeat('i', count($comandas));
    
    $sqlPlatos = "DELETE FROM comanda_platos WHERE id_comanda IN ($placeholders)";
    $stmtPlatos = $conn->prepare($sqlPlatos);
    $stmtPlatos->bind_param($tipos, ...$comandas);
    $stmtPlatos->execute();

    // Borrar las comandas
    $sqlBorrarComandas = "DELETE FROM comandas WHERE id_comanda IN ($placeholders)";
    $stmtBorrar = $conn->prepare($sqlBorrarComandas);
    $stmtBorrar->bind_param($tipos, ...$comandas);
    $stmtBorrar->execute();

    // Comprobar si era la única mesa con comandas
    $sqlMesas = "SELECT COUNT(DISTINCT id_mesa) AS total_mesas FROM comandas";
    $resMesas = $conn->query($sqlMesas);
    $rowMesas = $resMesas->fetch_assoc();

    if ($rowMesas['total_mesas'] == 0) {
        // Ya no queda ninguna mesa con comandas → reiniciar IDs
        $conn->query("ALTER TABLE comandas AUTO_INCREMENT = 1");
        $conn->query("ALTER TABLE comanda_platos AUTO_INCREMENT = 1");
    }
}

echo "Comandas de la mesa $id_mesa eliminadas con éxito.";
?>
