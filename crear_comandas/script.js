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
      extras: "Extras",
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
      extras: "Extres",
      eliminar: "Eliminar"
    }
  }
};

let platosElegidos = [];
let currentExtraTarget = null; // uniqueId del plato al que se están añadiendo extras

// estado monitor/export
let _offlineMonitor = null;
let _exportDone = false;

// Sincroniza backup y actualiza UI/offline button
function syncBackupAndUI() {
  try {
    localStorage.setItem('platosElegidosBackup', JSON.stringify(platosElegidos));
  } catch (e) {
    console.warn('No se pudo guardar backup en localStorage:', e);
  }

  if (Array.isArray(platosElegidos) && platosElegidos.length) {
    _exportDone = false;
  }

  actualizarPopup();
  configureDownloadButton();
}

// Devolver copia profunda de platosElegidos (exacto como muestra openLista)
function getAllPlatosForExport() {
  return Array.isArray(platosElegidos) ? JSON.parse(JSON.stringify(platosElegidos)) : [];
}

// Cierra únicamente la última popup añadida (no toca popups anteriores)
function closeTopPopup() {
  const overlays = document.querySelectorAll('.popup-overlay');
  if (!overlays || !overlays.length) return;
  const last = overlays[overlays.length - 1];
  last.remove();
}

// Intenta reasignar el comportamiento del botón "cerrar" de la última popup
function setCloseButtonOfLastPopupToTop() {
  const overlays = document.querySelectorAll('.popup-overlay');
  if (!overlays || !overlays.length) return;
  const last = overlays[overlays.length - 1];

  // selectores comunes para botones de cerrar dentro de la popup
  const closeSelectors = [
    '.popup-close',
    '.popup-header .close',
    'button[data-close]',
    '.close-btn',
    '.btn-cerrar',
    'button.cerrar',
    '.btn[data-action="close"]'
  ];

  // handler en fase de captura: intercepta clicks sobre botones de cerrar o sobre el fondo
  const handler = function (e) {
    // si el click es exactamente sobre el overlay (fondo), cerrar solo este overlay
    if (e.target === last) {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (last && last.parentNode) last.parentNode.removeChild(last);
      last.removeEventListener('click', handler, true);
      return;
    }

    // si el click ocurre dentro de un botón que coincide con los selectores de cerrar y pertenece a este overlay
    const selector = closeSelectors.join(',');
    const btn = e.target.closest(selector);
    if (btn && last.contains(btn)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (last && last.parentNode) last.parentNode.removeChild(last);
      last.removeEventListener('click', handler, true);
      return;
    }
    // no hacemos nada: dejar que otros elementos dentro del overlay sigan funcionando
  };

  // evitar múltiples listeners en la misma overlay
  if (!last._closeHandlerAttached) {
    last.addEventListener('click', handler, true); // use capture to intercept antes que otros handlers
    last._closeHandlerAttached = true;
  }
}

// Añadir plato o ingrediente extra según contexto
function addToList(btn) {
  const card = btn.closest(".card");
  const idPlato = card.getAttribute("data-id");
  const nombre = card.getAttribute("data-nombre");
  const precio = parseFloat(card.getAttribute("data-precio")) || 0;

  // Si estamos en modo "añadir extra" (currentExtraTarget definido), añadimos como extra
  if (currentExtraTarget) {
    const target = platosElegidos.find(p => p.uniqueId === currentExtraTarget);
    if (target) {
      if (!Array.isArray(target.extras)) target.extras = [];
      // extra único por selección (cantidad 1 por defecto, independiente del plato)
      target.extras.push({
        id: idPlato,
        nombre,
        precio: precio,
        cantidad: 1  // cantidad independiente del plato principal
      });
      // cerrar solo la popup de extras (no la de platos elegidos)
      closeTopPopup();
      currentExtraTarget = null;
      syncBackupAndUI();
      return;
    } else {
      // si no existe target, limpiar modo extra
      currentExtraTarget = null;
    }
  }

  // comportamiento normal: añadir plato principal
  const uniqueId = idPlato + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  platosElegidos.push({
    uniqueId: uniqueId,
    id: idPlato,
    nombre: nombre,
    precio: precio,
    cantidad: 1,
    incluido: true,
    extras: [] // array de extras asociados a este plato
  });

  syncBackupAndUI();
}


// cambiar cantidad de plato (incrementar/decrementar)
function changePlatoCantidad(uniqueId, delta) {
  const p = platosElegidos.find(pl => pl.uniqueId === uniqueId);
  if (!p) return;
  
  const nuevaCant = Math.max(1, (p.cantidad || 1) + delta);
  p.cantidad = nuevaCant;
  
  syncBackupAndUI();
}

// establecer cantidad de plato (desde input)
function setPlatoCantidad(uniqueId, value) {
  const p = platosElegidos.find(pl => pl.uniqueId === uniqueId);
  if (!p) return;
  
  const newVal = parseInt(value, 10);
  if (!isNaN(newVal) && newVal >= 1) {
    p.cantidad = newVal;
  }
  
  syncBackupAndUI();
}

// Devolver copia profunda de platosElegidos (exacto como muestra openLista)
function getAllPlatosForExport() {
  return Array.isArray(platosElegidos) ? JSON.parse(JSON.stringify(platosElegidos)) : [];
}

// Añadir plato o ingrediente extra según contexto
function addToList(btn) {
  const card = btn.closest(".card");
  const idPlato = card.getAttribute("data-id");
  const nombre = card.getAttribute("data-nombre");
  const precio = parseFloat(card.getAttribute("data-precio")) || 0;

  // Si estamos en modo "añadir extra" (currentExtraTarget definido), añadimos como extra
  if (currentExtraTarget) {
    const target = platosElegidos.find(p => p.uniqueId === currentExtraTarget);
    if (target) {
      if (!Array.isArray(target.extras)) target.extras = [];
      // extra único por selección (cantidad 1 por defecto, independiente del plato)
      target.extras.push({
        id: idPlato,
        nombre,
        precio: precio,
        cantidad: 1  // cantidad independiente del plato principal
      });
      // cerrar solo la popup de extras (no la de platos elegidos)
      closeTopPopup();
      currentExtraTarget = null;
      syncBackupAndUI();
      return;
    } else {
      // si no existe target, limpiar modo extra
      currentExtraTarget = null;
    }
  }

  // comportamiento normal: añadir plato principal
  const uniqueId = idPlato + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  platosElegidos.push({
    uniqueId: uniqueId,
    id: idPlato,
    nombre: nombre,
    precio: precio,
    cantidad: 1,
    incluido: true,
    extras: [] // array de extras asociados a este plato
  });

  syncBackupAndUI();
}

// Abrir lista: ahora muestra botón "Añadir extras" y lista de extras por plato
function openLista() {
  const t = traducciones[idiomaActual];
  let content;

  if (platosElegidos.length > 0) {
    content = "<table>";
    content += `<thead><tr>
        <th>${t.tabla.plato}</th>
        <th>${t.tabla.cantidad}</th>
        <th>${t.tabla.precioUnitario}</th>
        <th>${t.tabla.precioTotal}</th>
        <th>${t.tabla.extras}</th>
        <th>${t.tabla.eliminar}</th>
      </tr></thead><tbody>`;

    platosElegidos.forEach((p) => {
      // calcular suma de extras (sin multiplicar por cantidad del plato)
      const extrasSum = Array.isArray(p.extras) ? p.extras.reduce((s, ex) => s + (Number(ex.precio || 0) * (ex.cantidad || 1)), 0) : 0;
      const precioUnitFinal = Number(p.precio || 0) + extrasSum;
      const precioTotalFinal = precioUnitFinal * (p.cantidad || 1);

      content += `<tr data-uniqueid='${p.uniqueId}'>
            <td style="vertical-align:middle;">${p.nombre}</td>
            <td style="vertical-align:middle;">
                <div style="display:flex; gap:4px; align-items:center;">
                  <button class="btn-mini" onclick='changePlatoCantidad("${p.uniqueId}", -1)' style="width:28px; padding:2px;">−</button>
                  <input type='number' min='1' value='${p.cantidad}' 
                    style='width:45px; text-align:center;' 
                    onchange='setPlatoCantidad("${p.uniqueId}", this.value)' />
                  <button class="btn-mini" onclick='changePlatoCantidad("${p.uniqueId}", 1)' style="width:28px; padding:2px;">+</button>
                </div>
            </td>
            <td style="vertical-align:middle;">${precioUnitFinal.toFixed(2)} €</td>
            <td style="vertical-align:middle;">${precioTotalFinal.toFixed(2)} €</td>
            <td style="vertical-align:middle;">
              <button class="extra" onclick='openExtrasFor("${p.uniqueId}")' title="Añadir ingredientes extra">➕</button>
            </td>
             <td style="vertical-align:middle;">
              <button class="eliminar" onclick='removeFromListById("${p.uniqueId}")'>❌</button> 
            </td>
        </tr>`;

      // mostrar filas de extras debajo del plato (si existen)
      if (Array.isArray(p.extras) && p.extras.length) {
        p.extras.forEach((ex, idx) => {
          const exPrecioUnit = Number(ex.precio || 0);
          const exPrecioTotal = exPrecioUnit * (ex.cantidad || 1);
          // mostrar como subfila con indentación, controles +/- de cantidad
          content += `<tr class="extra-row" data-parent='${p.uniqueId}' data-extra-idx='${idx}'>
              <td style="padding-left:24px; font-size:0.95em; color:#333;">➤ ${ex.nombre}</td>
              <td style="vertical-align:middle;">
                <div style="display:flex; gap:4px; align-items:center;">
                  <button class="btn-mini" onclick='changeExtraCantidad("${p.uniqueId}", ${idx}, -1)' style="width:28px; padding:2px;">−</button>
                  <input type='number' min='1' value='${ex.cantidad || 1}' 
                    style='width:45px; text-align:center;' 
                    onchange='setExtraCantidad("${p.uniqueId}", ${idx}, this.value)' />
                  <button class="btn-mini" onclick='changeExtraCantidad("${p.uniqueId}", ${idx}, 1)' style="width:28px; padding:2px;">+</button>
                </div>
              </td>
              <td style="vertical-align:middle;">${exPrecioUnit.toFixed(2)} €</td>
              <td style="vertical-align:middle;">${exPrecioTotal.toFixed(2)} €</td>
              <td style="vertical-align:middle;"></td>
              <td style="vertical-align:middle;"><button class="eliminar" onclick='removeExtra("${p.uniqueId}", ${idx})'>❌</button></td>
          </tr>`;
        });
      }
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

// cambiar cantidad de extra (incrementar/decrementar)
function changeExtraCantidad(uniqueId, exIdx, delta) {
  const p = platosElegidos.find(pl => pl.uniqueId === uniqueId);
  if (!p || !Array.isArray(p.extras) || !p.extras[exIdx]) return;
  
  const nuevaCant = Math.max(1, (p.extras[exIdx].cantidad || 1) + delta);
  p.extras[exIdx].cantidad = nuevaCant;
  
  syncBackupAndUI();
}

// establecer cantidad de extra (desde input)
function setExtraCantidad(uniqueId, exIdx, value) {
  const p = platosElegidos.find(pl => pl.uniqueId === uniqueId);
  if (!p || !Array.isArray(p.extras) || !p.extras[exIdx]) return;
  
  const newVal = parseInt(value, 10);
  if (!isNaN(newVal) && newVal >= 1) {
    p.extras[exIdx].cantidad = newVal;
  }
  
  syncBackupAndUI();
}

// abrir selector de extras para un plato concreto
function openExtrasFor(uniqueId) {
  currentExtraTarget = uniqueId;
  // abrir popup con platos del tipo "Para añadir" (id_tipo = 2 en la BDD)
  loadPlatos(2, 'Para añadir');
}

// eliminar extra por índice
function removeExtra(uniqueId, index) {
  const p = platosElegidos.find(pl => pl.uniqueId === uniqueId);
  if (!p || !Array.isArray(p.extras)) return;
  p.extras.splice(index, 1);
  syncBackupAndUI();
}

// recalcular total teniendo en cuenta extras (cantidad de extra es independiente del plato)
function calcularTotal() {
  return platosElegidos.reduce((total, p) => {
    if (!p.incluido) return total;
    const base = Number(p.precio || 0);
    // extras: precio * cantidad_extra (NO se multiplica por cantidad del plato principal)
    const extrasSum = Array.isArray(p.extras) ? p.extras.reduce((s, ex) => s + (Number(ex.precio || 0) * (ex.cantidad || 1)), 0) : 0;
    const precioUnitFinal = base + extrasSum;
    const cantidad = Number(p.cantidad || 0);
    return total + precioUnitFinal * cantidad;
  }, 0);
}

function cambiarCantidadById(uniqueId, input) {
  const valor = parseInt(input.value);
  const plato = platosElegidos.find((p) => p.uniqueId === uniqueId);
  if (plato && valor >= 1) {
    plato.cantidad = valor;
    syncBackupAndUI();
  }
}

function removeFromListById(uniqueId) {
  platosElegidos = platosElegidos.filter((p) => p.uniqueId !== uniqueId);
  syncBackupAndUI();
}

function actualizarPopup() {
  const overlay = document.querySelector(".popup-overlay");
  if (overlay) overlay.remove();
  openLista();
}

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

function loadPlatos(idTipo, nombreTipo) {
  // construir querystring sólo con parámetros definidos
  const params = new URLSearchParams();
  if (idTipo !== null && idTipo !== undefined) params.append('id_tipo', idTipo);
  if (nombreTipo) params.append('nombre_tipo', nombreTipo);

  fetch(`load_platos.php?${params.toString()}`)
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createPopupHTML(`${nombreTipo || 'Platos'}`, html)
      );

      // reasignar aquí el botón cerrar de la popup recién añadida para que cierre solo esa popup
      setCloseButtonOfLastPopupToTop();
    })
    .catch(err => {
      console.error('Error cargando platos:', err);
      alert('No se pudieron cargar los ingredientes extra.');
    });
}

function filtrarBusqueda() {
  const filtro = document.getElementById("buscadorInput").value.toLowerCase();
  const cards = document.querySelectorAll(".popup-content .card");
  cards.forEach((card) => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(filtro) ? "flex" : "none";
  });
}

function closePopup() {
  const overlays = document.querySelectorAll('.popup-overlay');
  if (!overlays || !overlays.length) return;
  const top = overlays[overlays.length - 1];
  if (!top) return;
  // evitar que otros handlers se ejecuten en este overlay
  // y eliminar sólo este overlay
  top.remove();
}

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
  if (!Array.isArray(platosElegidos) || !platosElegidos.length) {
    alert('No hay platos para enviar.');
    return;
  }

  // Construir líneas: plato principal + sus extras como líneas separadas
  const lineas = [];
  platosElegidos.forEach(p => {
    lineas.push({
      id_plato: Number(p.id),
      cantidad: Number(p.cantidad || 1),
      precio_unitario: Number(p.precio || 0),
      tipo: 'plato',
      uniqueId: p.uniqueId
    });

    if (Array.isArray(p.extras)) {
      p.extras.forEach(ex => {
        lineas.push({
          id_plato: Number(ex.id),
          cantidad: Number(ex.cantidad || 1),
          precio_unitario: Number(ex.precio || 0),
          tipo: 'extra',
          parent_uniqueId: p.uniqueId
        });
      });
    }
  });

  const payload = {
    total: Number(calcularTotal() || 0),
    lineas: lineas,
    timestamp: new Date().toISOString()
  };

  // Enviar como application/x-www-form-urlencoded para compatibilidad con PHP
  const body = 'payload=' + encodeURIComponent(JSON.stringify(payload));

  fetch("guardar_comanda.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: body,
  })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json().catch(() => null);
    })
    .then((data) => {
      // asumir éxito si no hay error HTTP; adaptar según respuesta de guardar_comanda.php
      alert("Comanda enviada con éxito");
      // cerrar popup de platos elegidos si existe
      const overlay = document.querySelector('.popup-overlay[data-popup="platos-elegidos"]') || document.querySelector('.popup-overlay');
      if (overlay) overlay.remove();
      // limpiar selección
      platosElegidos = [];
      syncBackupAndUI();
    })
    .catch((err) => {
      console.error('Error enviando comanda:', err);
      alert('Error al enviar la comanda. Comprueba la conexión.');
    });
}

function cambiarNumMesa(input) {
  const nuevoValor = input.value;
  fetch("index.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "id_mesa=" + encodeURIComponent(nuevoValor),
  }).catch((err) => console.error(err));
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.search) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

function openBuscadorPlatos() {
  fetch("load_platos.php")
    .then(r => r.text())
    .then(html => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createPopupHTML("Buscar platos", html)
      );
    });
}

function cambiarIdioma(idioma) {
  idiomaActual = idioma;
  fetch("idioma.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "idioma=" + encodeURIComponent(idioma),
  })
  .then(res => res.json())
  .then(data => {
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

/* ---------------- Export / XLSX / XLS fallback ---------------- */
function exportPlatosFile(platos, filename) {
  if (!platos || !platos.length) return false;
  const t = traducciones[idiomaActual] || traducciones.es;
  const headers = [
    t.tabla.plato || 'Plato',
    t.tabla.cantidad || 'Cantidad',
    t.tabla.precioUnitario || 'Precio Unitario',
    t.tabla.precioTotal || 'Precio Total'
  ];

  // Generar filas: por cada plato principal, una fila resumen (precio unitario incluye extras asignados)
  // y debajo filas con cada extra (indentadas). Extras usan assignedUnits.length si existe, sino ex.cantidad.
  const rows = [];
  platos.forEach(p => {
    const extrasSum = Array.isArray(p.extras) ? p.extras.reduce((s, ex) => {
      const assigned = Array.isArray(ex.assignedUnits) ? ex.assignedUnits.length : (Number(ex.cantidad || 1));
      return s + (Number(ex.precio || 0) * assigned);
    }, 0) : 0;

    const precioUnitFinal = Number(p.precio || 0) + extrasSum;
    const cantidad = Number(p.cantidad || 0);
    const precioTotal = precioUnitFinal * cantidad;

    // fila del plato principal
    rows.push({
      nombre: p.nombre || '',
      cantidad: cantidad || '',
      precioUnit: precioUnitFinal === '' ? '' : Number(precioUnitFinal),
      precioTotal: precioTotal === '' ? '' : Number(precioTotal)
    });

    // filas de extras (mostrar nombre y precio unitario; cantidad = número de unidades asignadas)
    if (Array.isArray(p.extras) && p.extras.length) {
      p.extras.forEach(ex => {
        const assignedCount = Array.isArray(ex.assignedUnits) ? ex.assignedUnits.length : (Number(ex.cantidad || 1));
        const exPrecioUnit = Number(ex.precio || 0);
        const exPrecioTotal = exPrecioUnit * assignedCount; // NO multiplicar por p.cantidad
        rows.push({
          nombre: '  - ' + (ex.nombre || ''),
          cantidad: assignedCount || '',
          precioUnit: exPrecioUnit,
          precioTotal: exPrecioTotal
        });
      });
    }
  });

  const finalFilename = filename || `comanda_offline_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;

  function generarXlsHtml() {
    let html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"></head><body><table border="1"><thead><tr>`;
    headers.forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;
    rows.forEach(r => {
      html += `<tr>
          <td>${escapeHtml(r.nombre)}</td>
          <td>${r.cantidad !== '' ? r.cantidad : ''}</td>
          <td>${r.precioUnit !== '' ? Number(r.precioUnit).toFixed(2) : ''}</td>
          <td>${r.precioTotal !== '' ? Number(r.precioTotal).toFixed(2) : ''}</td>
      </tr>`;
    });
    html += `</tbody></table></body></html>`;

    const blob = new Blob([ '\uFEFF' + html ], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadBlob(blob, finalFilename.replace(/\.xlsx?$/i, '.xls'));
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function generarXlsxConSheetJS() {
    try {
      const aoa = [headers, ...rows.map(r => [
        r.nombre,
        r.cantidad,
        r.precioUnit === '' ? '' : Number(r.precioUnit),
        r.precioTotal === '' ? '' : Number(r.precioTotal)
      ])];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      Object.keys(ws).forEach(k => {
        if (k[0] === '!') return;
        const cell = ws[k];
        if (typeof cell.v === 'number') cell.t = 'n';
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Comanda');
      XLSX.writeFile(wb, finalFilename);
      return true;
    } catch (e) {
      console.warn('Error generando XLSX con SheetJS:', e);
      return false;
    }
  }

  if (window.XLSX) {
    if (generarXlsxConSheetJS()) return true;
    generarXlsHtml();
    return true;
  }

  const localScript = './xlsx.full.min.js';
  const scriptLocal = document.createElement('script');
  scriptLocal.src = localScript;
  scriptLocal.async = true;
  let attempted = false;
  scriptLocal.onload = () => {
    attempted = true;
    if (window.XLSX) {
      if (generarXlsxConSheetJS()) return;
    }
    generarXlsHtml();
  };
  scriptLocal.onerror = () => {
    attempted = true;
    if (navigator.onLine) {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';
      cdnScript.async = true;
      cdnScript.onload = () => {
        if (window.XLSX) {
          if (generarXlsxConSheetJS()) return;
        }
        generarXlsHtml();
      };
      cdnScript.onerror = () => {
        generarXlsHtml();
      };
      document.head.appendChild(cdnScript);
    } else {
      generarXlsHtml();
    }
  };

  if (!navigator.onLine) {
    document.head.appendChild(scriptLocal);
    setTimeout(() => { if (!attempted) generarXlsHtml(); }, 300);
    return true;
  }

  document.head.appendChild(scriptLocal);
  setTimeout(() => { if (!attempted) {
    const cdnScript = document.createElement('script');
    cdnScript.src = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';
    cdnScript.async = true;
    cdnScript.onload = () => { if (window.XLSX) generarXlsxConSheetJS(); else generarXlsHtml(); };
    cdnScript.onerror = () => { generarXlsHtml(); };
    document.head.appendChild(cdnScript);
  } }, 1500);

  return true;
}

/* ---------------- UI alerta / monitor ---------------- */

function showOfflineAlert() {
  if (document.querySelector('.offline-alert')) return;

  const t = traducciones[idiomaActual] || traducciones.es;
  const html = `
    <div class="offline-alert" style="
        position: fixed;
        right: 12px;
        top: 12px;
        z-index: 9999;
        background: #fff3cd;
        border: 1px solid #ffeeba;
        color: #856404;
        padding: 10px 12px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.10);
        min-width: 220px;
        max-width: 300px;
        font-family: sans-serif;
        display:flex;
        align-items:center;
        justify-content:space-between;
    ">
      <div style="flex:1; margin-right:10px;">
        <div style="font-weight:700;margin-bottom:6px;font-size:14px;">Sin conexión</div>
        <div style="font-size:12px;">Se ha perdido la conexión a internet. Descarga la comanda para conservarla.</div>
      </div>
      <div style="flex:0 0 auto; margin-left:8px;">
        <button id="btnDescargarExcelOffline" class="btn" style="padding:6px 10px;" disabled>Descargar Excel</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  const btn = document.getElementById('btnDescargarExcelOffline');
  if (!btn) return;
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);
}

// estilos cuando está deshabilitado (tonos oscuros)
function aplicarEstiloDeshabilitado(el) {
  el.disabled = true;
  el.style.pointerEvents = 'none';
  el.style.background = '#343a40';
  el.style.color = '#ffffff';
  el.style.border = '1px solid #23272b';
  el.style.cursor = 'not-allowed';
  el.style.opacity = '0.95';
}

// restaurar estilo normal
function aplicarEstiloHabilitado(el) {
  el.disabled = false;
  el.style.pointerEvents = 'auto';
  el.style.background = '';
  el.style.color = '';
  el.style.border = '';
  el.style.cursor = 'pointer';
  el.style.opacity = '';
}

// Configura botón según lista exacta y evita múltiples listeners
function configureDownloadButton() {
  const btn = document.getElementById('btnDescargarExcelOffline');
  if (!btn) return;
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  const all = getAllPlatosForExport();

  if (all && all.length) {
    aplicarEstiloHabilitado(newBtn);
    newBtn.textContent = 'Descargar Excel';
    newBtn.addEventListener('click', () => {
      if (_exportDone) return;
      _exportDone = true;
      newBtn.disabled = true;
      newBtn.style.pointerEvents = 'none';
      newBtn.textContent = 'Descargando...';
      exportPlatosFile(all);
      setTimeout(() => { newBtn.textContent = 'Descargado'; }, 800);
    }, { once: true });
  } else {
    aplicarEstiloDeshabilitado(newBtn);
    newBtn.textContent = 'Descargar Excel';
  }
}

function startOfflineMonitor(intervalMs = 1000) {
  if (_offlineMonitor) return;
  _exportDone = false;
  showOfflineAlert();
  configureDownloadButton();

  _offlineMonitor = setInterval(() => {
    if (navigator.onLine) {
      stopOfflineMonitor();
      closeOfflineAlert();
      return;
    }
    if (!document.querySelector('.offline-alert')) showOfflineAlert();
    configureDownloadButton();
  }, intervalMs);
}

function stopOfflineMonitor() {
  if (_offlineMonitor) {
    clearInterval(_offlineMonitor);
    _offlineMonitor = null;
  }
}

function closeOfflineAlert() {
  const el = document.querySelector('.offline-alert');
  if (el) el.remove();
}

function showOnlinePopup() {
  const existing = document.querySelector('.online-toast');
  if (existing) existing.remove();

  const html = `
    <div class="online-toast" style="
        position: fixed;
        right: 12px;
        top: 12px;
        z-index: 10000;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 10px 14px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        font-family: sans-serif;
    ">
      Conexión restablecida
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  setTimeout(() => {
    const el = document.querySelector('.online-toast');
    if (el) el.remove();
  }, 3000);
}

// Listeners
window.addEventListener('offline', () => {
    console.warn('Se detectó pérdida de conexión. Mostrando alerta superior y esperando a que el usuario elija platos...');
    startOfflineMonitor(1000);
});

window.addEventListener('online', () => {
    if (_offlineMonitor) {
        stopOfflineMonitor();
    }
    closeOfflineAlert();
    showOnlinePopup();
});

window.addEventListener('beforeunload', (e) => {
  // no forzar descarga automática
});