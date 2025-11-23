<?php
function cargarTraducciones()
{
    $ruta = "../idiomas/{$_SESSION["idioma"]}.json";

    $json = file_get_contents($ruta);
    return json_decode($json, true);
}
?>