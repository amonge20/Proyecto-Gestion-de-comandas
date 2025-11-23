<?php
require_once '../conexion.php';
require_once '../cargar_traducciones.php';

function filtroAlergenos($conn) {
    $traducciones = cargarTraducciones();
    $resultAlergenos = $conn->query("SELECT * FROM alergenos");

    $html = "<div class='filtro-container'>";
    $html .= "<h3 id='tituloExclAlergenos'>{$traducciones['filtros']['excluirAlergenos']}</h3>";
    $html .= "<div class='checkbox-list'>";

    if ($resultAlergenos && $resultAlergenos->num_rows > 0) {
        while ($row = $resultAlergenos->fetch_assoc()) {
            $imagen = !empty($row['imagen_alergeno']) 
                        ? "<img src='{$row['imagen_alergeno']}' alt='{$row['nombre_alergeno']}' class='alergeno-filtro-icon'>" 
                        : '';
            $html .= "<label>
                <input type='checkbox' class='filtro-alergeno' value='{$row['id_alergeno']}' onchange='filtrarPlatos()'>
                $imagen
                <span class='nombre-alergeno' data-es='{$row['nombre_alergeno']}' data-cat='{$row['nombre_alergeno_cat']}'>
                    {$row['nombre_alergeno']}
                </span>
            </label>";
        }
    }

    $html .= "</div>";
    $html .= "<button id='btnLimpiarFiltro' class='btn-clear' onclick='limpiarFiltro()'>{$traducciones['filtros']['limpiarFiltro']}</button>";
    $html .= "</div>";

    return $html;
}
?>