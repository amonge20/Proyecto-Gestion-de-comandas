<?php
include '../conexion.php';

$id_comanda = intval($_GET['id_comanda']);

$sql = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, p.alergenos, cp.servido, cp.complementos
        FROM comanda_platos cp
        JOIN platos p ON cp.id_plato = p.id_plato
        WHERE cp.id_comanda = $id_comanda";

$res = $conn->query($sql);

while ($plato = $res->fetch_assoc()) {
    $checked = ($plato['servido'] ?? 0) ? "checked" : "";

    // Alérgenos del plato
    $alergenos_nombres = '';
    if (!empty($plato['alergenos'])) {
        $alergenos_raw = trim($plato['alergenos'], "[]\" ");
        $ids = strpos($alergenos_raw, ',') !== false ? array_map('intval', explode(',', $alergenos_raw)) : [intval($alergenos_raw)];
        if (count($ids) > 0) {
            $ids_str = implode(',', $ids);
            $sqlA = "SELECT nombre_alergeno FROM alergenos WHERE id_alergeno IN ($ids_str)";
            $resA = $conn->query($sqlA);
            $nombres = [];
            while ($rowA = $resA->fetch_assoc()) {
                $nombres[] = $rowA['nombre_alergeno'];
            }
            $alergenos_nombres = implode(', ', $nombres);
        }
    }

    echo "<li>
            <input type='checkbox' data-id='{$plato['id_comanda_plato']}' class='chk-en-mesa' $checked />
            {$plato['nombre_plato']} - Cantidad: {$plato['cantidad']} - Precio: {$plato['precio']} €";

    if ($alergenos_nombres) {
        echo " - Alérgenos: $alergenos_nombres";
    }

    // Complementos (IDs de extras)
    if (!empty($plato['complementos'])) {
        $ids_complementos = json_decode($plato['complementos'], true);
        if ($ids_complementos && count($ids_complementos) > 0) {
            $ids_str = implode(',', array_map('intval', $ids_complementos));
            $sqlE = "SELECT nombre_extra, precio, alergenos FROM extras WHERE id_extra IN ($ids_str)";
            $resE = $conn->query($sqlE);

            echo "<ul>";
            while ($extra = $resE->fetch_assoc()) {
                $nombre_extra = htmlspecialchars($extra['nombre_extra']);
                $precio_extra = number_format(floatval($extra['precio']), 2);

                // Alérgenos del extra
                $alergenos_extra_nombres = '';
                if (!empty($extra['alergenos'])) {
                    $ids_extra = json_decode($extra['alergenos'], true);
                    if ($ids_extra && count($ids_extra) > 0) {
                        $ids_str_e = implode(',', $ids_extra);
                        $sqlAE = "SELECT nombre_alergeno FROM alergenos WHERE id_alergeno IN ($ids_str_e)";
                        $resAE = $conn->query($sqlAE);
                        $nombresE = [];
                        while ($rowAE = $resAE->fetch_assoc()) {
                            $nombresE[] = $rowAE['nombre_alergeno'];
                        }
                        $alergenos_extra_nombres = implode(', ', $nombresE);
                    }
                }

                echo "<li>$nombre_extra (+$precio_extra €)";
                if ($alergenos_extra_nombres) {
                    echo " - Alérgenos: $alergenos_extra_nombres";
                }
                echo "</li>";
            }
            echo "</ul>";
        }
    }

    echo "</li>";
}
?>
