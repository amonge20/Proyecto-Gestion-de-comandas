<?php
require_once '../cargar_traducciones.php';

function renderItemList($items, $type = 'default', $conn = null)
{
    $t = cargarTraducciones();
    $idioma = $_SESSION["idioma"] ?? "es";

    $html = "<div class='card-grid'>";

    foreach ($items as $item) {
        // Datos dependiendo del tipo
        if ($type == "tipos") {
            $id = $item['id_tipo'];
            $nombre = $item['nombre_tipo'];
            $nombre_cat = $item['nombre_tipo_cat'];
            $imagen = $item['imagen_tipo'];
        } elseif ($type == "platos") {
            $id = $item['id_plato'];
            $nombre = $item['nombre_plato'];
            $nombre_cat = $item['nombre_plato_cat'];
            $imagen = $item['imagen_plato'];
        }

        // Nombre según idioma
        $nombre_plato = ($idioma == "es") ? $nombre : $nombre_cat;

        // Alérgenos según idioma
        $nombre_alergeno = ($idioma == "es") ? "nombre_alergeno" : "nombre_alergeno_cat";

        // Textos del JSON
        $txt_add = $t["añadirALaLista"] ?? "Añadir a la lista";
        $txt_ver = $t["verPlatos"] ?? "Ver platos";
        $placeholder_icon = $t["placeholderImagen"] ?? "📷";
        $omitibles = $t["omitirTipo"] ?? [];

        // Omitir tipos
        if ($type === 'tipos' && in_array(trim($nombre_plato), $omitibles, true)) {
            continue;
        }

        $alergenosAttr = !empty($item['alergenos']) ? htmlspecialchars($item['alergenos'], ENT_QUOTES) : '[]';
        $precio = $item['precio'] ?? 0.0;

        $html .= "<div class='card' data-id='{$id}' data-nombre='{$nombre_plato}' data-precio='{$precio}' data-alergenos='{$alergenosAttr}'>";

        if ($imagen) {
            $html .= "<img src='{$imagen}' class='card-img' alt=''>";
        } else {
            $html .= "<div class='card-placeholder'>{$placeholder_icon}</div>";
        }

        $html .= "<div class='card-body'>";
        $html .= "<h3>{$nombre_plato}</h3>";

        if ($type === 'platos') {
            $html .= "<p class='precio'><strong>{$precio} €</strong></p>";

            // Alérgenos
            if (!empty($item['alergenos']) && $conn) {
                $alergenosIds = json_decode($item['alergenos'], true);
                if (is_array($alergenosIds) && count($alergenosIds) > 0) {
                    $ids = implode(',', array_map('intval', $alergenosIds));
                    $result = $conn->query("SELECT {$nombre_alergeno}, imagen_alergeno FROM alergenos WHERE id_alergeno IN ($ids)");
                    if ($result) {
                        $html .= "<div class='alergenos'>";
                        while ($row = $result->fetch_assoc()) {
                            if (!empty($row['imagen_alergeno'])) {
                                $html .= "<img src='{$row['imagen_alergeno']}' alt='{$row[$nombre_alergeno]}' title='{$row[$nombre_alergeno]}' class='alergeno-icon'>";
                            } else {
                                $html .= "<span>{$row[$nombre_alergeno]}</span> ";
                            }
                        }
                        $html .= "</div>";
                    }
                }
            }

            $html .= "<button class='btn-add' onclick='addToList(this)'>{$txt_add}</button>";
        }

        if ($type === 'tipos') {
            $html .= "<button class='btn' onclick='loadPlatos({$id}, \"{$nombre_plato}\")'>{$txt_ver}</button>";
        }

        $html .= "</div></div>";
    }

    $html .= "</div>";
    return $html;
}
?>