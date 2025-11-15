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

  syncBackupAndUI();
}

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

function calcularTotal() {
  return platosElegidos.reduce(
    (total, p) => (p.incluido ? total + p.precio * p.cantidad : total),
    0
  );
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
  fetch(`load_platos.php?id_tipo=${idTipo}&nombre_tipo=${nombreTipo}`)
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createPopupHTML(`${nombreTipo}`, html)
      );
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

function closePopup(event) {
  if (!event || event.target.classList.contains("popup-overlay")) {
    const overlay = document.querySelector(".popup-overlay");
    if (overlay) overlay.remove();
  }
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
  fetch("guardar_comanda.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platos: platosElegidos }),
  })
    .then((res) => res.text())
    .then(() => {
      alert("Comanda enviada con éxito");
      platosElegidos = [];
      syncBackupAndUI();
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

  const rows = platos.map(p => {
    const nombre = p.nombre || '';
    const cantidad = (typeof p.cantidad !== 'undefined' && p.cantidad !== null) ? Number(p.cantidad) : '';
    const precioUnit = (typeof p.precio !== 'undefined' && p.precio !== null) ? Number(p.precio) : '';
    const precioTotal = (cantidad !== '' && precioUnit !== '') ? Number(precioUnit) * Number(cantidad) : '';
    return { nombre, cantidad, precioUnit, precioTotal };
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
          <td>${r.precioUnit !== '' ? r.precioUnit.toFixed(2) : ''}</td>
          <td>${r.precioTotal !== '' ? r.precioTotal.toFixed(2) : ''}</td>
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