<?php
/**
 * Genera HTML de alérgenos de un plato
 * @param mysqli $conn
 * @param array $alergenosIdsArray array de IDs de alergenos
 * @return string HTML con iconos o nombres de alérgenos
 */
function renderAlergenos($conn, $alergenosIdsArray) {
    if (empty($alergenosIdsArray) || !$conn) return '';

    $nombre_alergeno = ($_SESSION['idioma'] === 'es') ? 'nombre_alergeno' : 'nombre_alergeno_cat';

    $ids = implode(',', array_map('intval', $alergenosIdsArray));
    $result = $conn->query("SELECT {$nombre_alergeno}, imagen_alergeno FROM alergenos WHERE id_alergeno IN ($ids)");

    $html = "<div class='alergenos'>";
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            if (!empty($row['imagen_alergeno'])) {
                $html .= "<img src='{$row['imagen_alergeno']}' alt='{$row[$nombre_alergeno]}' title='{$row[$nombre_alergeno]}' class='alergeno-icon'>";
            } else {
                $html .= "<span>{$row[$nombre_alergeno]}</span> ";
            }
        }
    }
    $html .= "</div>";

    return $html;
}
?>
