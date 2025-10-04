<?php
include '../conexion.php';

// Contar registros en la tabla comandas
$sql = "SELECT COUNT(*) as total FROM comandas";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

if ($row['total'] == 0) {
    echo "La tabla comandas está vacía.";
}  else if ($row['total'] > 0) {
    echo '<button style="background:red; color:white; padding:10px; margin:10px; border:none; border-radius:5px; cursor:pointer;"
            onclick="borrarTodasComandas()">
        🗑️ Borrar todas las comandas
    </button>';
}

// Obtener mesas con comandas, ordenadas por mesa y antigüedad de la comanda
$sql = "SELECT c.id_comanda, c.id_mesa, c.fecha, c.precio_total,
               m.id_estado, e.nombre_estado
        FROM mesas m
        JOIN comandas c ON m.id_mesa = c.id_mesa
        JOIN estados_mesa e ON m.id_estado = e.id_estado
        ORDER BY m.id_mesa ASC, c.fecha ASC"; // ASC = de más antiguo a más reciente
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

// Cambiar estado de mesa automáticamente si se recibe GET
if (isset($_GET['cambiar_estado']) && isset($_GET['id_mesa'])) {
    $id_mesa = intval($_GET['id_mesa']);
    $nuevo_estado = intval($_GET['cambiar_estado']);
    $stmt = $conn->prepare("UPDATE mesas SET id_estado = ? WHERE id_mesa = ?");
    $stmt->bind_param("ii", $nuevo_estado, $id_mesa);
    $stmt->execute();
    header("Location: ver_comandas.php");
    exit;
}


// Mostrar mesas y comandas
foreach ($mesas as $id_mesa => $mesa) {
    echo "<div style='border:1px solid #ccc; padding:10px; margin-bottom:10px;'>";
    echo "<h2>Mesa $id_mesa</h2>";

    if (!empty($mesa['comandas'])) {
        foreach ($mesa['comandas'] as $comanda) {
            echo "<div style='margin-left:20px; padding:5px; border-bottom:1px dashed #ccc;'>";
            echo "<strong>Comanda ID {$comanda['id_comanda']} - Precio total: {$comanda['precio_total']} € - Fecha: {$comanda['fecha']}</strong>";

            // Platos de la comanda
            $sql2 = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
                     FROM comanda_platos cp
                     JOIN platos p ON cp.id_plato = p.id_plato
                     WHERE cp.id_comanda = {$comanda['id_comanda']}";
            $res2 = $conn->query($sql2);

            echo "<ul>";
            while ($plato = $res2->fetch_assoc()) {
                $checked = ($plato['servido'] ?? 0) ? "checked" : "";
                echo "<li>
                        <input type='checkbox' data-id='{$plato['id_comanda_plato']}' class='chk-en-mesa' $checked />
                        {$plato['nombre_plato']} - Cantidad: {$plato['cantidad']} - Precio: {$plato['precio']} €
                        <button onclick='borrarComanda({$comanda['id_comanda']})'>🗑️ Borrar</button>
                      </li>";
            }
            echo "</ul></div>";
        }
    } else {
        echo "<p style='margin-left:20px;'>No hay comandas en esta mesa.</p>";
    }
    echo "</div>";
}
?>

<script>
    // Cambiar estado automáticamente al seleccionar
    function cambiarEstado(idMesa, nuevoEstado) {
        window.location.href = `ver_comandas.php?id_mesa=${idMesa}&cambiar_estado=${nuevoEstado}`;
    }

    // Enviar cambios de checkbox en tiempo real
    document.querySelectorAll('.chk-en-mesa').forEach(chk => {
        chk.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const servido = this.checked ? 1 : 0;

            fetch('actualizar_servido.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id_comanda_plato=${id}&servido=${servido}`
            });
        });
    });

    function borrarComanda(idComanda) {
    if (!confirm('¿Seguro que quieres borrar esta comanda?')) return;

    fetch('borrar_comanda.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id_comanda=${idComanda}`
    }).then(() => location.reload());
}

function borrarTodasComandas() {
    if (!confirm('¿Seguro que quieres borrar TODAS las comandas?')) return;

    fetch('borrar_todas_comandas.php', {
        method: 'POST'
    }).then(() => location.reload());
}

let ultimaComandaId = 0;

// Función que revisa si hay nuevas comandas
function checkNuevasComandas() {
    fetch('check_nuevas_comandas.php?ultima_id=' + ultimaComandaId)
        .then(res => res.json())
        .then(data => {
            if (data.nuevas && data.nuevas.length > 0) {
                data.nuevas.forEach(comanda => {
                    // Mostrar notificación
                    if (Notification.permission === "granted") {
                        new Notification(`Nueva comanda en mesa ${comanda.id_mesa}`, {
                            body: `Comanda ID: ${comanda.id_comanda} - Precio total: ${comanda.precio_total} €`,
                        });
                    } else {
                        alert(`Nueva comanda en mesa ${comanda.id_mesa}\nID: ${comanda.id_comanda}`);
                    }

                    // Actualizar última comanda conocida
                    if (comanda.id_comanda > ultimaComandaId) {
                        ultimaComandaId = comanda.id_comanda;
                    }
                });
            }
        })
        .catch(err => console.error(err));
}

// Solicitar permisos de notificación al cargar la página
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Revisar cada 5 segundos
setInterval(checkNuevasComandas, 5000);


</script>