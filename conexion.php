<?php
// Conexión a la base de datos
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'comandas';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("Conexión fallida: " . $conn->connect_error);
?>