let idiomaActual = "es"; // inicial por defecto
let traducciones = {
  es: {
    popupTitulo: "Platos elegidos",
    total: "Total",
    seguirMirando: "Seguir Mirando",
    enviarComanda: "Enviar comanda",
    sinPlatos: "No has elegido ningún plato",
    tabla: {
      plato: "Plato",
      cantidad: "Cantidad",
      precioUnitario: "Precio Unitario",
      precioTotal: "Precio Total",
      eliminar: "Eliminar"
    }
  },
  cat: {
    popupTitulo: "Plats escollits",
    total: "Total",
    seguirMirando: "Seguir Mirant",
    enviarComanda: "Enviar comanda",
    sinPlatos: "No has triat cap plat",
    tabla: {
      plato: "Plat",
      cantidad: "Quantitat",
      precioUnitario: "Preu Unitari",
      precioTotal: "Preu Total",
      eliminar: "Eliminar"
    }
  }
};

let platosElegidos = [];

// Añadir plato
function addToList(btn) {
  const card = btn.closest(".card");
  const idPlato = card.getAttribute("data-id");
  const nombre = card.getAttribute("data-nombre");
  const precio = parseFloat(card.getAttribute("data-precio"));

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

  actualizarPopup();
}

function openLista() {
  const t = traducciones[idiomaActual]; // traducir según idiomaActual
  let content;

  if (platosElegidos.length > 0) {
    content = "<table>";
    content += `<thead><tr>
        <th>${t.tabla.plato}</th>
        <th>${t.tabla.cantidad}</th>
        <th>${t.tabla.precioUnitario}</th>
        <th>${t.tabla.precioTotal}</th>
        <th>${t.tabla.eliminar}</th>
      </tr></thead><tbody>`;

    platosElegidos.forEach((p) => {
      content += `<tr data-uniqueid='${p.uniqueId}'>
            <td>${p.nombre}</td>
            <td>
                <input type='number' min='1' value='${p.cantidad}' 
                  style='width:60px' onchange='cambiarCantidadById("${p.uniqueId}", this)' />
            </td>
            <td>${p.precio.toFixed(2)} €</td>
            <td>${(p.precio * p.cantidad).toFixed(2)} €</td>
            <td>
                <button class="eliminar" onclick='removeFromListById("${p.uniqueId}")'>❌</button>
            </td>
        </tr>`;
    });

    content += "</tbody></table>";
    content += `<p id='totalPrecio' style='text-align:right; font-weight:bold; margin-top:10px;'>
      ${t.total}: ${calcularTotal().toFixed(2)} €</p>`;
    content += `<div class="botones">
      <button class="btn" onclick="closePopup()">${t.seguirMirando}</button>
      <button id="btnEnviarComanda" class='btn' onclick='enviarComanda()'>${t.enviarComanda}</button>
      </div>`;
  } else {
    content = t.sinPlatos;
    content += `<div class="botones"><button class="btn" onclick="closePopup()">${t.seguirMirando}</button></div>`;
  }

  const overlayExistente = document.querySelector(".popup-overlay");
  if (overlayExistente) overlayExistente.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    createPopupHTML(t.popupTitulo, content)
  );
}

// Cambiar cantidad
function cambiarCantidadById(uniqueId, input) {
  const valor = parseInt(input.value);
  const plato = platosElegidos.find((p) => p.uniqueId === uniqueId);
  if (plato && valor >= 1) {
    plato.cantidad = valor;
    actualizarPopup();
  }
}

// Eliminar plato
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

// Crear HTML popup reutilizable con buscador opcional
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

// Abrir platos de un tipo con buscador integrado
function loadPlatos(idTipo, nombreTipo) {
  fetch(`load_platos.php?id_tipo=${idTipo}&nombre_tipo=${nombreTipo}`)
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createPopupHTML(`${nombreTipo}`, html)
      );
    });
}

// Filtrar búsqueda dentro del popup de platos
function filtrarBusqueda() {
  const filtro = document.getElementById("buscadorInput").value.toLowerCase();
  const cards = document.querySelectorAll(".popup-content .card");
  cards.forEach((card) => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(filtro) ? "flex" : "none";
  });
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

// Enviar comanda
function enviarComanda() {
  fetch("guardar_comanda.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platos: platosElegidos }),
  })
    .then((res) => res.text())
    .then(() => {
      alert("Comanda enviada con éxito");
      platosElegidos = [];
      actualizarPopup();
    });
}

// Cambiar número de mesa
function cambiarNumMesa(input) {
  const nuevoValor = input.value;
  fetch("index.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "id_mesa=" + encodeURIComponent(nuevoValor),
  }).catch((err) => console.error(err));
}

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.search) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Abrir popup de buscador de platos
function openBuscadorPlatos() {
  fetch("load_platos.php") // sin filtro -> devuelve todos los platos
    .then(r => r.text())
    .then(html => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createPopupHTML("Buscar platos", html) // aquí activamos el buscador
      );
    });
}

function cambiarIdioma(idioma) {
  idiomaActual = idioma; // actualizar idioma global para JS
  fetch("idioma.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "idioma=" + encodeURIComponent(idioma),
  })
  .then(res => res.json())
  .then(data => {
    // Actualizar los bloques en la página
    document.querySelector("header").innerHTML = `
      <div class="botones_idiomas">
        <img class='bandera' src='../images/spain.png' alt='spain' onclick="cambiarIdioma('es')">
        <img class='bandera' src='../images/catalonia.png' alt='catalonia' onclick="cambiarIdioma('cat')">
      </div>
      ${data.header}
    `;
    document.getElementById("lista-platos").innerHTML = data.platos;
    document.querySelector(".lista-botones").innerHTML = data.botones;
  })
  .catch(err => console.error("Error al cambiar idioma:", err));
}