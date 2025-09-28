let platosElegidos = [];

// Añadir plato
function addToList(btn) {
  const card = btn.closest(".card");
  const idPlato = card.getAttribute("data-id");  // ahora único por producto
  const nombre = card.getAttribute("data-nombre");
  const precio = parseFloat(card.getAttribute("data-precio"));

  const platoExistente = platosElegidos.find(p => p.nombre === nombre);

  if (platoExistente) {
    platoExistente.cantidad += 1;
  } else {
    const uniqueId =
      idPlato + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    platosElegidos.push({
      uniqueId: uniqueId,
      id: idPlato,
      nombre: nombre,
      precio: precio,
      cantidad: 1,
      incluido: true,
    });
  }

  actualizarPopup();
}


// Abrir popup de lista
function openLista() {
  let content;
  if (platosElegidos.length > 0) {
    content = "<table>";
    content +=
      "<thead><tr><th>Sumar precio al total</th><th>Plato</th><th>Cantidad</th><th>Precio</th><th>Eliminar</th></tr></thead><tbody>";

    platosElegidos.forEach((p) => {
      const checkedAttr = p.incluido ? "checked" : "";
      content += `<tr data-uniqueid='${p.uniqueId}'>
            <td>
                <input type='checkbox' ${checkedAttr} onchange='toggleIncluidoById("${
        p.uniqueId
      }", this)' />
            </td>
            <td>${p.nombre}</td>
            <td>
                <input type='number' min='1' value='${
                  p.cantidad
                }' style='width:60px' onchange='cambiarCantidadById("${
        p.uniqueId
      }", this)' />
            </td>
            <td>${(p.precio * p.cantidad).toFixed(2)} €</td>
            <td>
                <button onclick='removeFromListById("${
                  p.uniqueId
                }")'>Eliminar</button>
            </td>
        </tr>`;
    });

    content += "</tbody></table>";
    content += `<p id='totalPrecio' style='text-align:right; font-weight:bold; margin-top:10px;'>Total: ${calcularTotal().toFixed(
      2
    )} €</p>`;
    // Al final de openLista(), después del total
    content += `<button id="btnEnviarComanda" class='btn' onclick='enviarComanda()'>Enviar comanda</button>`;
  } else {
    content = "No has elegido ningún plato.";
  }
  const overlayExistente = document.querySelector(".popup-overlay");
  if (overlayExistente) overlayExistente.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    createPopupHTML("Platos elegidos", content)
  );
}

// Cambiar cantidad por uniqueId
function cambiarCantidadById(uniqueId, input) {
  const valor = parseInt(input.value);
  const plato = platosElegidos.find((p) => p.uniqueId === uniqueId);
  if (plato && valor >= 1) {
    plato.cantidad = valor;
    actualizarPopup();
  }
}

// Toggle incluido por uniqueId
function toggleIncluidoById(uniqueId, checkbox) {
  const plato = platosElegidos.find((p) => p.uniqueId === uniqueId);
  if (plato) {
    plato.incluido = checkbox.checked;
    actualizarPopup();
  }
}

// Eliminar plato por uniqueId
function removeFromListById(uniqueId) {
  platosElegidos = platosElegidos.filter((p) => p.uniqueId !== uniqueId);
  actualizarPopup();
}

// Calcular total
function calcularTotal() {
  return platosElegidos.reduce(
    (total, p) => (p.incluido ? total + p.precio * p.cantidad : total),
    0
  );
}

// Actualizar popup si está abierto
function actualizarPopup() {
  const overlay = document.querySelector(".popup-overlay");
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
function loadPlatos(idTipo, nombreTipo) {
  fetch(`load_platos.php?id_tipo=${idTipo}&nombre_tipo=${nombreTipo}`)
    .then((r) => r.text())
    .then((html) => document.body.insertAdjacentHTML("beforeend", html));
}

// Cerrar popup
function closePopup(event) {
  if (!event || event.target.classList.contains("popup-overlay")) {
    const overlay = document.querySelector(".popup-overlay");
    if (overlay) overlay.remove();
  }
}

// Filtro de alérgenos
function filtrarPlatos() {
  const checkedBoxes = Array.from(
    document.querySelectorAll(".filtro-alergeno:checked")
  ).map((cb) => parseInt(cb.value));
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const alergenos = JSON.parse(card.getAttribute("data-alergenos") || "[]");
    card.style.display =
      checkedBoxes.length > 0 && alergenos.some((a) => checkedBoxes.includes(a))
        ? "none"
        : "flex";
  });
}

function limpiarFiltro() {
  document
    .querySelectorAll(".filtro-alergeno")
    .forEach((cb) => (cb.checked = false));
  filtrarPlatos();
}

function enviarComanda() {
  fetch("guardar_comanda.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platos: platosElegidos }),
  })
    .then((res) => res.text())
    .then((res) => {
      alert("Comanda enviada con éxito");
      platosElegidos = []; // Vaciar lista
      actualizarPopup();
    });
}

function cambiarNumMesa(input) {
  const nuevoValor = input.value;

  // Enviamos el valor a PHP por POST sin recargar la página
  fetch("index.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "id_mesa=" + encodeURIComponent(nuevoValor),
  })
    .then((res) => res.text())
    .then((data) => {
      // console.log('Servidor respondió:', data);
    })
    .catch((err) => console.error(err));
}

// Al cargar la página:
window.addEventListener("DOMContentLoaded", () => {
  // Quita los parámetros de la URL sin recargar
  if (window.location.search) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
