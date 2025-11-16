<?php
// Conexión a la base de datos
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'comandas';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("Conexión fallida: " . $conn->connect_error);

// asegurar charset
$conn->set_charset('utf8mb4');

// iniciar sesión sólo si no está ya activa
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>