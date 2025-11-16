<?php
function cargarTraducciones()
{
    $idioma = $_SESSION["idioma"] ?? "es";
    $ruta = "../idiomas/{$idioma}.json";

    if (!file_exists($ruta)) {
        $ruta = "../idiomas/es.json"; // fallback
    }

    $json = file_get_contents($ruta);
    return json_decode($json, true);
}
?>