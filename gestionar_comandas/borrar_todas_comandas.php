<?php
include '../conexion.php';

// Borrar todos los platos de todas las comandas
$conn->query("DELETE FROM comanda_platos");

// Borrar todas las comandas
$conn->query("DELETE FROM comandas");
?>
