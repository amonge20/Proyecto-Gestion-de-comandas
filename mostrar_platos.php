<?php
include("conexion.php");

session_start();
// Verificar que lleguen datos vía POST
if (isset($_POST['item'])) {
    $item = $_POST['item'];

    // Crear lista en sesión si no existe
    if (!isset($_SESSION['platos_elegidos'])) {
        $_SESSION['platos_elegidos'] = [];
    }

    // Agregar el item a la lista
    $_SESSION['platos_elegidos'][] = $item;

    // Devolver respuesta
    echo json_encode(['success' => true, 'lista' => $_SESSION['platos_elegidos']]);
}

$id_tipo = isset($_GET['id_tipo']) ? intval($_GET['id_tipo']) : 0;
$alergenos_filtrar = isset($_GET['alergenos']) ? $_GET['alergenos'] : [];
$alergenos_filtrar = array_map('intval', $alergenos_filtrar);

$isAjax = isset($_GET['ajax']) && $_GET['ajax'] == 1;

// Traer alérgenos
$alergenosArr = [];
$resA = $conn->query("SELECT * FROM alergenos");
while ($a = $resA->fetch_assoc()) $alergenosArr[$a['id_alergeno']] = $a;

// Traer platos del tipo
$platosRes = $conn->query("SELECT * FROM platos WHERE id_tipo=$id_tipo");

// Función para mostrar platos filtrados
function mostrarPlatos($platosRes, $alergenosArr, $alergenos_filtrar)
{
    while ($plato = $platosRes->fetch_assoc()):
        $alList = [];
        if ($plato['alergenos']) {
            $ids_alergenos = json_decode($plato['alergenos']);
            if (is_array($ids_alergenos)) {
                foreach ($ids_alergenos as $id_alergeno)
                    if (isset($alergenosArr[$id_alergeno])) $alList[] = $alergenosArr[$id_alergeno];
            }
        }

        // Filtrar platos que contengan al menos un alérgeno seleccionado
        $filtrar = false;
        foreach ($alList as $al) {
            if (in_array($al['id_alergeno'], $alergenos_filtrar)) {
                $filtrar = true;
                break;
            }
        }
        if ($filtrar) continue;

        $imagenPlato = $plato['imagen_plato'];
?>
        <div class="plato"
            data-id="<?= $plato['id_plato'] ?>"
            data-alergenos='<?= $plato['alergenos'] ?>'
            style="background-image:url('<?= $imagenPlato ?>')">
            <div class="plato-info">
                <strong><?= htmlspecialchars($plato['nombre_plato']) ?></strong>
                <?= $plato['precio'] ?>€
                <?php if (count($alList) > 0): ?>
                    <div class="alergenos">
                        <?php foreach ($alList as $al): ?>
                            <img src="<?= $al['imagen_alergeno'] ?>" title="<?= $al['nombre_alergeno'] ?>">
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                <button class="seleccionar-btn" onclick="toggleSeleccion(this, <?= $plato['id_plato'] ?>, '<?= $plato['nombre_plato'] ?>', '<?= $plato['precio'] ?>', '<?= $imagenPlato ?>', '<?= $plato['alergenos'] ?>')">Elegir plato</button>
            </div>
        </div>

<?php
    endwhile;
}
?>

<?php if (!$isAjax): ?>
    <form id="filtroAlergenos">
        <input type="hidden" name="id_tipo" value="<?= $id_tipo ?>">
        <label>Filtrar por alérgenos:</label><br>
        <?php foreach ($alergenosArr as $id_alergeno => $al): ?>
            <label>
                <input type="checkbox" name="alergenos[]" value="<?= $id_alergeno ?>" <?= in_array($id_alergeno, $alergenos_filtrar) ? 'checked' : '' ?>>
                <?= htmlspecialchars($al['nombre_alergeno']) ?>
            </label>
        <?php endforeach; ?>
        <button type="button" id="btn-filtrar" onclick="filtrarPlatos()">Filtrar</button>
    </form>
<?php endif; ?>

<div class="platos-container">
    <?php mostrarPlatos($platosRes, $alergenosArr, $alergenos_filtrar); ?>
</div>