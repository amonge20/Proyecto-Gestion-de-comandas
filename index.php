<?php
$fase = $_GET["fase"] ?? "";
if (!empty($fase)) {
    header("Location: {$fase}/index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Bar Restaurante Iberika - Menú Principal</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* ===== Estilo Iberika aplicado al menú principal ===== */

        body {
            font-family: "Poppins", sans-serif;
            background-color: #f5e6d3;
            background-image: linear-gradient(to bottom, #f8efe0, #f2e0c7);
            color: #3b2b1a;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .header {
            background: #4b2e12;
            color: white;
            text-align: center;
            padding: 30px 10px;
            border-bottom: 4px solid #d4a15d;
        }

        .header h1 {
            color: #f5e6d3;
            font-family: "Merriweather", serif;
            font-size: 2.2rem;
            margin: 0;
        }

        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        h2 {
            font-family: "Merriweather", serif;
            color: #4b2e12;
            margin-bottom: 25px;
            font-size: 1.6rem;
            border-bottom: 2px solid #d4a15d;
            padding-bottom: 5px;
        }

        form {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        button {
            background-color: #8b5e3c;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.1s ease;
            text-transform: uppercase;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }

        button:hover {
            background-color: #4b2e12;
            transform: scale(1.03);
        }

        footer {
            text-align: center;
            background-color: #4b2e12;
            color: #f5e6d3;
            padding: 15px 10px;
            font-size: 0.9rem;
            border-top: 3px solid #d4a15d;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Bar Restaurante IBERIKA</h1>
    </div>

    <div class="container">
        <h2>Elige una opción:</h2>
        <form method="get" action="index.php">
            <button type="submit" name="fase" value="crear_comandas">🧾 Crear Comanda</button>
            <button type="submit" name="fase" value="gestionar_comandas">🍽️ Gestionar Comandas</button>
        </form>
    </div>

    <footer>
        © 2025 Bar Restaurante Iberika · Carrer Puig del Ravell N°4, Martorell (Barcelona)
    </footer>
</body>
</html>
