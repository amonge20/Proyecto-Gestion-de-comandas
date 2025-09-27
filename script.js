let platosElegidos = [];

// Añadir plato (permite repetir platos)
function addToList(btn) {
    const card = btn.closest('.card');
    const idPlato = card.getAttribute('data-id');
    const nombre = card.getAttribute('data-nombre');
    const precio = parseFloat(card.getAttribute('data-precio'));

    // Generar uniqueId para cada instancia
    const uniqueId = idPlato + '-' + Date.now() + '-' + Math.floor(Math.random()*1000);

    platosElegidos.push({
        uniqueId: uniqueId,
        id: idPlato,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        incluido: true
    });

    actualizarPopup();
}

// Abrir popup de lista
function openLista() {
    if (platosElegidos.length === 0) {
        alert('No hay platos en la lista');
        return;
    }

    let content = "<table style='width:100%; border-collapse: collapse;'>";
    content += "<tr><th>Incluir</th><th>Plato</th><th>Cantidad</th><th>Precio</th><th>Eliminar</th></tr>";

    platosElegidos.forEach((p) => {
        const checkedAttr = p.incluido ? 'checked' : '';
        content += `<tr data-uniqueid='${p.uniqueId}'>
            <td style="text-align:center">
                <input type='checkbox' ${checkedAttr} onchange='toggleIncluidoById("${p.uniqueId}", this)' />
            </td>
            <td>${p.nombre}</td>
            <td style="text-align:center">
                <input type='number' min='1' value='${p.cantidad}' style='width:60px' onchange='cambiarCantidadById("${p.uniqueId}", this)' />
            </td>
            <td style="text-align:right">${(p.precio * p.cantidad).toFixed(2)} €</td>
            <td style="text-align:center">
                <button onclick='removeFromListById("${p.uniqueId}")'>Eliminar</button>
            </td>
        </tr>`;
    });

    content += "</table>";
    content += `<p id='totalPrecio' style='text-align:right; font-weight:bold; margin-top:10px;'>Total: ${calcularTotal().toFixed(2)} €</p>`;
    // Al final de openLista(), después del total
    content += `<button class='btn' onclick='guardarComanda()'>Guardar comanda</button>`;

    const overlayExistente = document.querySelector('.popup-overlay');
    if (overlayExistente) overlayExistente.remove();

    document.body.insertAdjacentHTML('beforeend', createPopupHTML("Lista de platos elegidos", content));
}

// Cambiar cantidad por uniqueId
function cambiarCantidadById(uniqueId, input) {
    const valor = parseInt(input.value);
    const plato = platosElegidos.find(p => p.uniqueId === uniqueId);
    if (plato && valor >= 1) {
        plato.cantidad = valor;
        actualizarPopup();
    }
}

// Toggle incluido por uniqueId
function toggleIncluidoById(uniqueId, checkbox) {
    const plato = platosElegidos.find(p => p.uniqueId === uniqueId);
    if (plato) {
        plato.incluido = checkbox.checked;
        actualizarPopup();
    }
}

// Eliminar plato por uniqueId
function removeFromListById(uniqueId) {
    platosElegidos = platosElegidos.filter(p => p.uniqueId !== uniqueId);
    actualizarPopup();
}

// Calcular total
function calcularTotal() {
    return platosElegidos.reduce((total, p) => p.incluido ? total + p.precio * p.cantidad : total, 0);
}

// Actualizar popup si está abierto
function actualizarPopup() {
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) overlay.remove();
    openLista();
}

// Crear HTML popup
function createPopupHTML(title, content) {
    return `
    <div class='popup-overlay' onclick='closePopup(event)'>
        <div class='popup' onclick='event.stopPropagation()'>
            <button class='btn-close' onclick='closePopup()'>&times;</button>
            <h2>${title}</h2>
            <div class='popup-content'>${content}</div>
        </div>
    </div>`;
}

// Abrir platos de un tipo
function loadPlatos(idTipo, nombre) {
    fetch(`load_platos.php?id_tipo=${idTipo}`)
        .then(r => r.text())
        .then(html => document.body.insertAdjacentHTML('beforeend', html));
}

// Cerrar popup
function closePopup(event) {
    if (!event || event.target.classList.contains('popup-overlay')) {
        const overlay = document.querySelector('.popup-overlay');
        if (overlay) overlay.remove();
    }
}

// Filtro de alérgenos
function filtrarPlatos() {
    const checkedBoxes = Array.from(document.querySelectorAll('.filtro-alergeno:checked')).map(cb => parseInt(cb.value));
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const alergenos = JSON.parse(card.getAttribute('data-alergenos') || "[]");
        card.style.display = (checkedBoxes.length > 0 && alergenos.some(a => checkedBoxes.includes(a))) ? "none" : "flex";
    });
}

function limpiarFiltro() {
    document.querySelectorAll('.filtro-alergeno').forEach(cb => cb.checked = false);
    filtrarPlatos();
}

function guardarComanda() {
    if (platosElegidos.length === 0) {
        alert('No hay platos en la lista');
        return;
    }

    fetch('guardar_comanda.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platos: platosElegidos })
    })
    .then(res => res.text())
    .then(res => {
        alert(res); // Mostrar mensaje de éxito
        platosElegidos = []; // Vaciar lista
        actualizarPopup();
    });
}
