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

<h1>Lista de comandas</h1>
<div id="estado-comandas" style="margin-top:15px; font-weight:bold; color:red;"></div>
<!-- Contenedor solo para mesas y comandas -->
<div id="contenedor-mesas">
<?php
// Obtener mesas con comandas
$sql = "SELECT c.id_comanda, c.id_mesa, c.fecha, c.precio_total,
               m.id_estado, e.nombre_estado
        FROM mesas m
        JOIN comandas c ON m.id_mesa = c.id_mesa
        JOIN estados_mesa e ON m.id_estado = e.id_estado
        ORDER BY m.id_mesa ASC, c.fecha ASC";
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
    echo "<div class='mesa' id='mesa-$id_mesa' style='border:1px solid #ccc; padding:10px; margin-bottom:10px;'>";
    echo "<h2>Mesa $id_mesa</h2>";

    // Botón para borrar todas las comandas de la mesa
    echo "<button style='margin-bottom:10px; background:darkred; color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer;' 
             onclick='borrarComandasMesa($id_mesa)'>🗑️ Borrar TODAS las comandas de esta mesa</button>";

    if (!empty($mesa['comandas'])) {
        foreach ($mesa['comandas'] as $comanda) {
            echo "<div class='comanda' id='comanda-{$comanda['id_comanda']}' style='margin-left:20px; padding:5px; border-bottom:1px dashed #ccc;'>";
            echo "<strong>Comanda {$comanda['id_comanda']} - Precio total: {$comanda['precio_total']} € - Fecha: {$comanda['fecha']}</strong>";

            // Platos de la comanda
            $sql2 = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
                     FROM comanda_platos cp
                     JOIN platos p ON cp.id_plato = p.id_plato
                     WHERE cp.id_comanda = {$comanda['id_comanda']}";
            $res2 = $conn->query($sql2);

            echo "<ul>";
            while ($plato = $res2->fetch_assoc()) {
                $estado = ($plato['servido'] ?? 0) ? "Servido" : "Pendiente";
                $color = ($plato['servido'] ?? 0) ? "green" : "red";
                echo "<li>
                        {$plato['nombre_plato']} - Cantidad: {$plato['cantidad']} - Precio: {$plato['precio']} €
                        <span class='estado-plato' 
                              data-id='{$plato['id_comanda_plato']}' 
                              data-servido='{$plato['servido']}'
                              style='cursor:pointer; padding:4px 8px; margin-left:10px; border-radius:4px; background:$color; color:white;'>
                            $estado
                        </span>
                      </li>";
            }
            echo "</ul></div>";
        }
    }
    echo "</div>";
}
?>
</div>

<script>
    let ultimaComandaId = <?php echo $ultimaComandaId; ?>;
</script>
<script src="script.js"></script>