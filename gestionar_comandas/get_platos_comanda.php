<?php
include '../conexion.php';
header('Content-Type: text/html; charset=utf-8');

$id_comanda = intval($_GET['id_comanda'] ?? 0);
if ($id_comanda <= 0) {
    echo '<p class="sin-comandas">Comanda no válida.</p>';
    exit;
}

$sqlPadres = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
              FROM comanda_platos cp
              JOIN platos p ON cp.id_plato = p.id_plato
              WHERE cp.id_comanda = ? AND (cp.parent_id_comanda_plato IS NULL OR cp.parent_id_comanda_plato = 0)
              ORDER BY cp.id_comanda_plato";
$stmtPadres = $conn->prepare($sqlPadres);
$stmtPadres->bind_param("i", $id_comanda);
$stmtPadres->execute();
$resPadres = $stmtPadres->get_result();

$sqlExtras = "SELECT cp.id_comanda_plato, cp.cantidad, cp.precio, p.nombre_plato, cp.servido
              FROM comanda_platos cp
              JOIN platos p ON cp.id_plato = p.id_plato
              WHERE cp.parent_id_comanda_plato = ?
              ORDER BY cp.id_comanda_plato";
$stmtExtras = $conn->prepare($sqlExtras);

echo '<ul class="platos-lista">';

while ($plato = $resPadres->fetch_assoc()) {
    $checked = ($plato['servido'] ?? 0) ? "checked" : "";
    $id_linea = intval($plato['id_comanda_plato']);

    echo "<li class='plato-item plato-principal' data-id='{$id_linea}'>";
    echo "  <div class='plato-main'>";
    echo "    <label style='display:flex;align-items:center;gap:8px;'>";
    echo "      <input type='checkbox' data-id='{$id_linea}' class='chk-en-mesa' {$checked} />";
    echo "      <span class='nombre'>" . htmlspecialchars($plato['nombre_plato']) . "</span>";
    echo "    </label>";
    echo "    <span class='cantidad'>x" . intval($plato['cantidad']) . "</span>";
    echo "    <span class='precio'>" . number_format($plato['precio'], 2, '.', '') . " €</span>";
    echo "  </div>";

    // extras anidados dentro del plato principal
    $stmtExtras->bind_param("i", $id_linea);
    $stmtExtras->execute();
    $resExtras = $stmtExtras->get_result();

    if ($resExtras && $resExtras->num_rows) {
        echo "<div class='plato-extras'>";
        while ($extra = $resExtras->fetch_assoc()) {
            $checkedEx = ($extra['servido'] ?? 0) ? "checked" : "";
            $id_extra = intval($extra['id_comanda_plato']);
            $nombreExtra = htmlspecialchars($extra['nombre_plato']);
            echo "<div class='plato-extra-line' data-id='{$id_extra}'>";
            echo "  <label style='display:flex;align-items:center;gap:8px;'>";
            echo "    <input type='checkbox' data-id='{$id_extra}' class='chk-en-mesa' {$checkedEx} />";
            echo "    <span class='extra-name'>{$nombreExtra}</span>";
            echo "  </label>";
            echo "  <span class='extra-cant'>x" . intval($extra['cantidad']) . "</span>";
            echo "  <span class='extra-precio'>" . number_format($extra['precio'], 2, '.', '') . " €</span>";
            echo "</div>";
        }
        echo "</div>";
    }

    echo "</li>";
}

echo '</ul>';

$stmtExtras->close();
$stmtPadres->close();
?>
