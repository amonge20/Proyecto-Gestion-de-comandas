<?php
// Función para crear popup
function createPopup($title, $content) {
    return "
    <div class='popup-overlay' onclick='closePopup(event)'>
        <div class='popup' onclick='event.stopPropagation()'>
            <button class='btn-close' onclick='closePopup()'>&times;</button>
            <h2>{$title}</h2>
            <div class='popup-content'>{$content}</div>
        </div>
    </div>";
}

// Función para renderizar cards de tipos de platos o platos
function renderItemList($items, $type = 'default', $conn = null) {
    $html = "<div class='card-grid'>";

    foreach ($items as $item) {
        $id = $item['id_tipo'] ?? $item['id_plato'] ?? null;
        $nombre = $item['nombre_tipo'] ?? $item['nombre_plato'] ?? 'Sin nombre';
        $imagen = $item['imagen_tipo'] ?? $item['imagen_plato'] ?? null;
        $alergenosAttr = !empty($item['alergenos']) ? htmlspecialchars($item['alergenos'], ENT_QUOTES) : '[]';
        $precio = $item['precio'] ?? 0.0;

        $html .= "<div class='card' data-id='{$id}' data-nombre='{$nombre}' data-precio='{$precio}' data-alergenos='{$alergenosAttr}'>";

        if ($imagen) {
            $html .= "<img src='{$imagen}' class='card-img' alt=''>";
        } else {
            $html .= "<div class='card-placeholder'>📷</div>";
        }

        $html .= "<div class='card-body'>";
        $html .= "<h3>{$nombre}</h3>";

        if ($type === 'platos') {
            if (!empty($item['descripcion'])) $html .= "<p class='descripcion'>{$item['descripcion']}</p>";
            $html .= "<p class='precio'><strong>{$precio} €</strong></p>";

            // Alérgenos
            if (!empty($item['alergenos']) && $conn) {
                $alergenosIds = json_decode($item['alergenos'], true);
                if (is_array($alergenosIds) && count($alergenosIds) > 0) {
                    $ids = implode(',', array_map('intval', $alergenosIds));
                    $result = $conn->query("SELECT nombre_alergeno, imagen_alergeno FROM alergenos WHERE id_alergeno IN ($ids)");
                    if ($result) {
                        $html .= "<div class='alergenos'><strong>Alergenos:</strong><br>";
                        while ($row = $result->fetch_assoc()) {
                            if (!empty($row['imagen_alergeno'])) {
                                $html .= "<img src='{$row['imagen_alergeno']}' alt='{$row['nombre_alergeno']}' title='{$row['nombre_alergeno']}' class='alergeno-icon'>";
                            } else {
                                $html .= "<span>{$row['nombre_alergeno']}</span> ";
                            }
                        }
                        $html .= "</div>";
                    }
                }
            }

            // Botón añadir a la lista
            $html .= "<button class='btn-add' onclick='addToList(this)'>Añadir a la lista</button>";
        }

        if ($type === 'tipos') {
            $html .= "<button class='btn' onclick='loadPlatos({$id}, \"{$nombre}\")'>Ver platos</button>";
        }

        $html .= "</div></div>";
    }

    $html .= "</div>";
    return $html;
}
?>
