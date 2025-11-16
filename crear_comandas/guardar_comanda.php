<?php
include '../conexion.php'; // $conn (mysqli)

// Leer payload (soporta application/x-www-form-urlencoded payload=JSON y raw JSON)
$raw = null;
if (isset($_POST['payload'])) {
    $raw = $_POST['payload'];
} else {
    $raw = file_get_contents('php://input');
}
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Payload JSON inválido']);
    exit;
}

// obtener id_mesa: preferir dato en payload, luego sesión, por defecto NULL
$id_mesa = isset($data['id_mesa']) ? intval($data['id_mesa']) : (isset($_SESSION['id_mesa']) ? intval($_SESSION['id_mesa']) : null);
if (!$id_mesa) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'id_mesa no especificada']);
    exit;
}

// Determinar formato: lineas (flat) o platos (nested)
$lineas = [];
if (isset($data['lineas']) && is_array($data['lineas'])) {
    $lineas = $data['lineas'];
} elseif (isset($data['platos']) && is_array($data['platos'])) {
    // convertir estructura nested a líneas: padre tipo 'plato' y sus extras tipo 'extra'
    foreach ($data['platos'] as $p) {
        // skip si no incluido (compatibilidad con estructura antigua)
        if (isset($p['incluido']) && !$p['incluido']) continue;
        $lineas[] = [
            'id_plato' => intval($p['id']),
            'cantidad' => intval($p['cantidad'] ?? 1),
            'precio_unitario' => floatval($p['precio'] ?? ($p['precio_unitario'] ?? 0)),
            'tipo' => 'plato',
            'uniqueId' => $p['uniqueId'] ?? null
        ];
        if (!empty($p['extras']) && is_array($p['extras'])) {
            foreach ($p['extras'] as $ex) {
                $lineas[] = [
                    'id_plato' => intval($ex['id']),
                    'cantidad' => intval($ex['cantidad'] ?? 1),
                    'precio_unitario' => floatval($ex['precio'] ?? 0),
                    'tipo' => 'extra',
                    'parent_uniqueId' => $p['uniqueId'] ?? null
                ];
            }
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No se encontraron lineas o platos en el payload']);
    exit;
}

// calcular total si no viene
$total = null;
if (isset($data['total'])) {
    $total = floatval($data['total']);
} else {
    $s = 0.0;
    foreach ($lineas as $ln) {
        $pu = floatval($ln['precio_unitario'] ?? 0);
        $cant = intval($ln['cantidad'] ?? 1);
        $s += $pu * $cant;
    }
    $total = $s;
}

// Insertar comanda
$stmt = $conn->prepare("INSERT INTO comandas (precio_total, id_mesa) VALUES (?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error preparando inserción comanda', 'sql_error' => $conn->error]);
    exit;
}
$stmt->bind_param("di", $total, $id_mesa);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error ejecutando inserción comanda', 'sql_error' => $stmt->error]);
    exit;
}
$id_comanda = $stmt->insert_id;
$stmt->close();

// Insertar líneas: primero padres (tipo 'plato'), guardar mapping uniqueId -> id_comanda_plato
$mapUniqueToRowId = [];
$insertErrors = [];

// preparar inserción dinámica (padre puede ser NULL)
$ins_sql = "INSERT INTO comanda_platos (id_comanda, id_plato, cantidad, precio, parent_id_comanda_plato) VALUES (?, ?, ?, ?, %s)";

$mysqli_err = false;

// Insertar primero tipos 'plato'
foreach ($lineas as $ln) {
    if (isset($ln['tipo']) && strtolower($ln['tipo']) === 'plato') {
        $id_plato = intval($ln['id_plato']);
        $cantidad = intval($ln['cantidad'] ?? 1);
        $precio = floatval($ln['precio_unitario'] ?? 0);

        $parent_sql = 'NULL';
        $query = sprintf($ins_sql, $parent_sql);
        $stmt2 = $conn->prepare($query);
        if (!$stmt2) {
            $mysqli_err = true;
            $insertErrors[] = $conn->error;
            continue;
        }
        $stmt2->bind_param("iiid", $id_comanda, $id_plato, $cantidad, $precio);
        if (!$stmt2->execute()) {
            $insertErrors[] = $stmt2->error;
            $stmt2->close();
            continue;
        }
        $newId = $stmt2->insert_id;
        $stmt2->close();
        if (!empty($ln['uniqueId'])) $mapUniqueToRowId[$ln['uniqueId']] = $newId;
    }
}

// Insertar después los extras (tipo 'extra')
foreach ($lineas as $ln) {
    if (isset($ln['tipo']) && strtolower($ln['tipo']) === 'extra') {
        $id_plato = intval($ln['id_plato']);
        $cantidad = intval($ln['cantidad'] ?? 1);
        $precio = floatval($ln['precio_unitario'] ?? 0);
        $parent_id = null;
        if (!empty($ln['parent_uniqueId']) && isset($mapUniqueToRowId[$ln['parent_uniqueId']])) {
            $parent_id = intval($mapUniqueToRowId[$ln['parent_uniqueId']]);
        }
        $parent_sql = is_null($parent_id) ? 'NULL' : intval($parent_id);
        $query = sprintf($ins_sql, $parent_sql);
        $stmt3 = $conn->prepare($query);
        if (!$stmt3) {
            $insertErrors[] = $conn->error;
            continue;
        }
        $stmt3->bind_param("iiid", $id_comanda, $id_plato, $cantidad, $precio);
        if (!$stmt3->execute()) {
            $insertErrors[] = $stmt3->error;
            $stmt3->close();
            continue;
        }
        $stmt3->close();
    }
}

// Si hubo errores, devolver warning pero la comanda puede haberse insertado parcialmente
if (!empty($insertErrors)) {
    http_response_code(200);
    echo json_encode(['ok' => false, 'warning' => 'Algunos inserts fallaron', 'errors' => $insertErrors, 'id_comanda' => $id_comanda]);
    exit;
}

// Respuesta OK
echo json_encode(['ok' => true, 'id_comanda' => $id_comanda, 'total' => $total]);
exit;
?>
