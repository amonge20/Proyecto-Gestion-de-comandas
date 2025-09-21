<?php
session_start();

// Recibir datos enviados por fetch
$datosJson = file_get_contents('php://input');
$platos = json_decode($datosJson, true);

if ($platos !== null) {
    $_SESSION['platosElegidos'] = $platos;
    echo "Selección actualizada en sesión.";
} else {
    echo "Error al guardar los datos.";
}
?>
