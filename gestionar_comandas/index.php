<?php  
include '../conexion.php';

// Contar registros en la tabla comandas
$sql = "SELECT COUNT(*) as total FROM comandas";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$totalComandas = $row['total'] ?? 0;

// Inicializar ultimaComandaId en PHP
$res = $conn->query("SELECT MAX(id_comanda) AS max_id FROM comandas");
$max = $res->fetch_assoc();
$ultimaComandaId = $max['max_id'] ?? 0;
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Gestión de Comandas</title>
  <link rel="stylesheet" href="../style.css">
  <script src="script.js" defer></script>
</head>

<body>
  <header>
    <h1>🍽️ Gestión de Comandas</h1>
    <p>Total de comandas: <strong><?php echo $totalComandas; ?></strong></p>
  </header>

  <div id="estado-comandas"></div>

  <div id="contenedor-mesas">
  <?php
  // Obtener mesas con comandas
  $sql = "SELECT c.id_comanda, c.id_mesa, c.fecha, c.precio_total,
                m.id_estado, e.nombre_estado
          FROM mesas m
          JOIN comandas c ON m.id_mesa = c.id_mesa
          JOIN estados_mesa e ON m.id_estado = e.id_estado
          ORDER BY c.fecha ASC";
  $result = $conn->query($sql);

  // Agrupar comandas por mesa
  $mesas = [];
  while ($row = $result->fetch_assoc()) {
      $id_mesa = $row['id_mesa'];
      if (!isset($mesas[$id_mesa])) {
          $mesas[$id_mesa] = [
              'id_estado' => $row['id_estado'],
              'comandas' => []
          ];
      }
      if ($row['id_comanda'] !== null) {
          $mesas[$id_mesa]['comandas'][] = [
              'id_comanda' => $row['id_comanda'],
              'fecha' => $row['fecha'],
              'precio_total' => $row['precio_total']
          ];
      }
  }

  // Mostrar mesas y comandas
  foreach ($mesas as $id_mesa => $mesa) {
      echo "<div class='mesa-card' id='mesa-$id_mesa'>";
      echo "<div class='mesa-header'>";
      echo "<h2>Mesa $id_mesa</h2>";
      echo "<button class='btn-borrar-todas' onclick='borrarComandasMesa($id_mesa)'>🗑️ Borrar todas</button>";
      echo "</div>";

      if (!empty($mesa['comandas'])) {
          foreach ($mesa['comandas'] as $comanda) {
              echo "<div class='comanda-card' id='comanda-{$comanda['id_comanda']}'>";
              echo "<div class='comanda-info'>";
              echo "<strong>Comanda #{$comanda['id_comanda']}</strong>";
              echo "<span class='precio-total'>{$comanda['precio_total']} €</span>";
              echo "<span class='fecha-comanda'>📅 {$comanda['fecha']}</span>";
              echo "<button class='btn-borrar' onclick='borrarComanda({$comanda['id_comanda']})'>❌</button>";
              echo "</div>";

              // Platos de la comanda
              $sql2 = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
                      FROM comanda_platos cp
                      JOIN platos p ON cp.id_plato = p.id_plato
                      WHERE cp.id_comanda = {$comanda['id_comanda']}";
              $res2 = $conn->query($sql2);

              echo "<ul class='platos-lista'>";
              while ($plato = $res2->fetch_assoc()) {
                  $servido = (int)($plato['servido'] ?? 0);
                  $estado = $servido ? "Servido" : "Pendiente";
                  $clase = $servido ? "servido" : "pendiente";
                  echo "<li class='plato-item'>
                          <span class='nombre'>{$plato['nombre_plato']}</span>
                          <span class='cantidad'>x{$plato['cantidad']}</span>
                          <span class='precio'>{$plato['precio']} €</span>
                          <span class='estado $clase' 
                                data-id='{$plato['id_comanda_plato']}' 
                                data-servido='{$servido}'>
                                $estado
                          </span>
                        </li>";
              }
              echo "</ul></div>";
          }
      } else {
          echo "<p class='sin-comandas'>No hay comandas para esta mesa.</p>";
      }
      echo "</div>";
  }
  ?>
  </div>

  <script>
    let ultimaComandaId = <?php echo $ultimaComandaId; ?>;
  </script>
</body>
</html>
