<?php
require_once '../cargar_traducciones.php';
require_once 'render_alergenos.php'; // función para generar HTML de alérgenos

function renderItemList($items, $type = 'default', $conn = null)
{
    $traducciones = cargarTraducciones();
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

        // Omitir tipos
        if ($type === 'tipos' && in_array(trim($nombre_plato), $traducciones['omitirTipo'], true)) {
            continue;
        }

        $alergenosAttr = !empty($item['alergenos']) ? htmlspecialchars($item['alergenos'], ENT_QUOTES) : '[]';
        $precio = $item['precio'] ?? 0.0;

        $html .= "<div class='card' data-id='{$id}' data-nombre='{$nombre_plato}' data-precio='{$precio}' data-alergenos='{$alergenosAttr}'>";

        if ($imagen) {
            $html .= "<img src='{$imagen}' class='card-img' alt=''>";
        } else {
            $html .= "<div class='card-placeholder'>📷</div>";
        }

        $html .= "<div class='card-body'>";
        $html .= "<h3>{$nombre_plato}</h3>";

        if ($type === 'platos') {
            $html .= "<p class='precio'><strong>{$precio}€</strong></p>";

            // Mostrar alérgenos usando la función externa
            if (!empty($item['alergenos']) && $conn) {
                $alergenosIds = json_decode($item['alergenos'], true);
                if (is_array($alergenosIds) && count($alergenosIds) > 0) {
                    $html .= renderAlergenos($conn, $alergenosIds);
                }
            }

            $html .= "<button class='btn-add' onclick='addToList(this)'>{$traducciones['botones']['anadirALaLista']}</button>";
        }

        if ($type === 'tipos') {
            $html .= "<button class='btn' onclick='loadPlatos({$id}, \"{$nombre_plato}\")'>{$traducciones['botones']['verPlatos']}</button>";
        }

        $html .= "</div></div>";
    }

    $html .= "</div>";
    return $html;
}
?>