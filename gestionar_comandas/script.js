function checkListaVacia() {
  fetch("check_lista_vacia.php")
    .then((res) => res.json())
    .then((data) => {
      const estadoDiv = document.getElementById("estado-comandas");
      if (data.vacia) {
        estadoDiv.textContent = "No quedan comandas";
      } else {
        estadoDiv.textContent = "";
      }
    })
    .catch((err) => console.error(err));
}
setInterval(checkListaVacia, 5000); 
checkListaVacia();

// Borrar todas las comandas de una mesa
function borrarComandasMesa(idMesa) {
  if (
    !confirm(
      "¿Seguro que quieres borrar TODAS las comandas de la mesa " + idMesa + "?"
    )
  )
    return;
  fetch("borrar_comandas_mesa.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id_mesa=${idMesa}`,
  }).then(() => location.reload());
}

// Toggle servido/pendiente
function activarInterruptores() {
  document.querySelectorAll(".estado-plato").forEach((span) => {
    span.onclick = function () {
      const id = this.getAttribute("data-id");
      const servidoActual = parseInt(this.getAttribute("data-servido"));
      const nuevoEstado = servidoActual ? 0 : 1;

      fetch("actualizar_servido.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_comanda_plato=${id}&servido=${nuevoEstado}`,
      });

      this.setAttribute("data-servido", nuevoEstado);
      this.textContent = nuevoEstado ? "Servido" : "Pendiente";
      this.style.background = nuevoEstado ? "green" : "red";
    };
  });
}
activarInterruptores();

// Revisar nuevas comandas
function checkNuevasComandas() {
  fetch("check_nuevas_comandas.php?ultima_id=" + ultimaComandaId)
    .then((res) => res.json())
    .then((data) => {
      if (data.nuevas && data.nuevas.length > 0) {
        data.nuevas.forEach((comanda) => {
          if (Notification.permission === "granted") {
            new Notification(`Nueva comanda en la mesa ${comanda.id_mesa}`, {
              body: `Comanda: ${comanda.id_comanda} - Precio total: ${comanda.precio_total} €`,
            });
          } else {
            alert(
              `Nueva comanda en la mesa ${comanda.id_mesa}\nID: ${comanda.id_comanda}`
            );
          }

          let mesaDiv = document.querySelector(`#mesa-${comanda.id_mesa}`);
          if (!mesaDiv) {
            mesaDiv = document.createElement("div");
            mesaDiv.id = `mesa-${comanda.id_mesa}`;
            mesaDiv.classList.add("mesa");
            mesaDiv.style.border = "1px solid #ccc";
            mesaDiv.style.padding = "10px";
            mesaDiv.style.marginBottom = "10px";
            mesaDiv.innerHTML = `<h2>Mesa ${comanda.id_mesa}</h2>
                            <button style='margin-bottom:10px; background:darkred; color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer;' 
                                onclick='borrarComandasMesa(${comanda.id_mesa})'>🗑️ Borrar TODAS las comandas de esta mesa</button>`;
            document.getElementById("contenedor-mesas").appendChild(mesaDiv);
          }

          const divComanda = document.createElement("div");
          divComanda.classList.add("comanda");
          divComanda.id = `comanda-${comanda.id_comanda}`;
          divComanda.style.marginLeft = "20px";
          divComanda.style.padding = "5px";
          divComanda.style.borderBottom = "1px dashed #ccc";
          divComanda.innerHTML = `<strong>Comanda ${comanda.id_comanda} - Precio total: ${comanda.precio_total} €</strong>
                                            <ul><li>(Cargando platos...)</li></ul>`;
          mesaDiv.appendChild(divComanda);

          fetch("get_platos_comanda.php?id_comanda=" + comanda.id_comanda)
            .then((r) => r.text())
            .then((html) => {
              divComanda.querySelector("ul").innerHTML = html;
              activarInterruptores();
            });

          if (comanda.id_comanda > ultimaComandaId) {
            ultimaComandaId = comanda.id_comanda;
          }
        });
      }
    })
    .catch((err) => console.error(err));
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(checkNuevasComandas, 5000);

// Función añadida: exportar el contenido de #contenedor-mesas a XLSX/XLS
function exportMesasToExcel(filename) {
  const cont = document.getElementById('contenedor-mesas');
  if (!cont) {
    console.warn('No se encontró #contenedor-mesas');
    return false;
  }

  const headers = ['Mesa', 'ID Comanda', 'Plato', 'Cantidad', 'Precio Unitario', 'Precio Línea', 'Precio Comanda'];
  const rows = [];

  const mesaSelector = '.mesa, .mesa-card';
  const comandaSelector = '.comanda, .comanda-card, .card-comanda, [data-comanda-id]';

  const parseCurrency = (s) => {
    if (!s) return null;
    const m = String(s).match(/([0-9]+[.,][0-9]{1,2})/g);
    if (!m) return null;
    const last = m[m.length - 1].replace(',', '.');
    const n = parseFloat(last);
    return isNaN(n) ? null : n;
  };

  const parseCantidad = (s) => {
    if (!s) return 1;
    const text = String(s).trim();
    let m = text.match(/^\s*(\d+)\s*(?:[x×]|ud\b|unidad\b|\bU\b)/i)
      || text.match(/(\d+)\s*[x×]/)
      || text.match(/^\s*(\d+)\s+/);
    return m ? parseInt(m[1], 10) : 1;
  };

  cont.querySelectorAll(mesaSelector).forEach((mesaDiv) => {
    let mesaId = '';
    if (mesaDiv.dataset && mesaDiv.dataset.mesa) mesaId = mesaDiv.dataset.mesa;
    if (!mesaId && mesaDiv.id) mesaId = mesaDiv.id.replace(/^mesa-/, '');
    if (!mesaId) {
      const h = mesaDiv.querySelector('h2, h3, .mesa-titulo');
      if (h) mesaId = (h.innerText || '').replace(/^[^\d]*(\d+).*/,'$1').trim();
    }
    mesaId = mesaId || '';

    // fila separadora/encabezado por mesa
    rows.push([`Mesa ${mesaId}`, '', '', '', '', '', '']);

    let comandas = Array.from(mesaDiv.querySelectorAll(comandaSelector));
    if (!comandas.length) {
      comandas = Array.from(mesaDiv.children).filter(ch => /comanda|pedido|order/i.test(ch.className || '') || ch.getAttribute('data-comanda-id'));
    }

    comandas.forEach((comandaDiv) => {
      let comandaId = '';
      if (comandaDiv.dataset && (comandaDiv.dataset.comandaId || comandaDiv.dataset.id)) comandaId = comandaDiv.dataset.comandaId || comandaDiv.dataset.id;
      if (!comandaId && comandaDiv.id) comandaId = comandaDiv.id.replace(/^comanda-/, '');
      if (!comandaId) {
        const strong = comandaDiv.querySelector('strong, b, .comanda-id');
        if (strong) {
          const mm = (strong.innerText || '').match(/\d+/);
          comandaId = mm ? mm[0] : (strong.innerText || '').trim();
        }
      }
      comandaId = comandaId || '';

      // precio total comanda (si aparece explícito)
      let precioTotal = '';
      let precioEl = comandaDiv.querySelector('.precio-total, .comanda-total, .total, .importe, .precio-valor, .precio');
      if (precioEl) {
        const m = (precioEl.innerText || '').match(/([0-9]+[.,][0-9]{1,2})/g);
        if (m && m.length) precioTotal = m[m.length - 1].replace(',', '.');
        else precioTotal = '';
      }

      if (!precioTotal) {
        const strong = comandaDiv.querySelector('strong, b, .comanda-id');
        if (strong) {
          const mm = (strong.innerText || '').match(/([0-9]+[.,][0-9]{1,2})/g);
          if (mm && mm.length) precioTotal = mm[mm.length - 1].replace(',', '.');
        }
      }

      if (!precioTotal) {
        const m = (comandaDiv.innerText || '').match(/precio\s*(?:total|:)?\s*[:\s]*([0-9]+[.,][0-9]{1,2})/i);
        if (m) precioTotal = m[1].replace(',', '.');
      }

      // Buscar platos estructurados
      let platos = Array.from(comandaDiv.querySelectorAll('.plato-item.plato-principal, .plato-principal'));
      let filasComanda = [];
      let sumaLineas = 0;

      if (platos.length) {
        platos.forEach((platoNode) => {
          // nombre plato
          const nombreEl = platoNode.querySelector('.plato-main .nombre, .plato-main strong, .plato-main label, .nombre') || platoNode.querySelector('strong') || platoNode;
          const nombrePlato = (nombreEl && (nombreEl.innerText || nombreEl.textContent)) ? (nombreEl.innerText || nombreEl.textContent).trim() : String(platoNode.innerText || '').trim();

          // cantidad y precio del plato principal
          let cantidad = 1;
          const cantEl = platoNode.querySelector('.plato-main .cantidad, .cantidad, .qty, .cantidad-plato');
          if (cantEl) {
            const m = (cantEl.innerText || cantEl.textContent || '').match(/(\d+)/);
            if (m) cantidad = parseInt(m[1], 10);
          } else {
            cantidad = parseCantidad(nombrePlato);
          }

          let precioUnit = null;
          const precioElLocal = platoNode.querySelector('.plato-main .precio, .plato-main .precio-unitario, .precio, .plato-precio');
          if (precioElLocal) precioUnit = parseCurrency(precioElLocal.innerText || precioElLocal.textContent);
          if (precioUnit === null) precioUnit = parseCurrency(nombrePlato);

          let precioLinea = '';
          if (precioUnit !== null) {
            precioUnit = +Number(precioUnit).toFixed(2);
            precioLinea = +(precioUnit * cantidad).toFixed(2);
          } else {
            precioUnit = '';
            precioLinea = '';
          }

          if (typeof precioLinea === 'number' && !isNaN(precioLinea)) sumaLineas += Number(precioLinea);

          // fila principal
          filasComanda.push([
            '',
            `Comanda ${comandaId}`,
            nombrePlato,
            cantidad || '',
            precioUnit === '' ? '' : Number(precioUnit).toFixed(2),
            precioLinea === '' ? '' : Number(precioLinea).toFixed(2),
            '' // precio comanda rellenado después
          ]);

          // Extras anidados: obtener nodos dentro de .plato-extras o .extras-list
          const extras = Array.from(platoNode.querySelectorAll('.plato-extras .plato-extra-line, .plato-extra-line, .plato-extras li, .extras-list li'));
          if (extras.length) {
            extras.forEach((extraNode) => {
              const nombreExtraEl = extraNode.querySelector('.extra-name') || extraNode.querySelector('span') || extraNode;
              let nombreExtra = (nombreExtraEl && (nombreExtraEl.innerText || nombreExtraEl.textContent)) ? (nombreExtraEl.innerText || nombreExtraEl.textContent).trim() : String(extraNode.innerText || '').trim();

              // intentar extraer "(n / total)" y limpiar nombre
              let extraCant = 1;
              const cantExEl = extraNode.querySelector('.extra-cant, .cantidad, .cant, .qty');
              if (cantExEl) {
                const m = (cantExEl.innerText || cantExEl.textContent || '').match(/(\d+)/);
                if (m) extraCant = parseInt(m[1], 10);
              } else {
                const mm = nombreExtra.match(/\((\d+)\s*\/\s*\d+\)/);
                if (mm) {
                  extraCant = parseInt(mm[1], 10);
                  nombreExtra = nombreExtra.replace(/\(\d+\s*\/\s*\d+\)/, '').trim();
                }
              }

              // precio unitario del extra
              let precioUnitExtra = null;
              const precioExEl = extraNode.querySelector('.extra-precio, .precio, .plato-precio');
              if (precioExEl) precioUnitExtra = parseCurrency(precioExEl.innerText || precioExEl.textContent);
              if (precioUnitExtra === null) {
                const txt = extraNode.innerText || extraNode.textContent || '';
                precioUnitExtra = parseCurrency(txt);
              }
              let precioLineaExtra = '';
              if (precioUnitExtra !== null) {
                precioUnitExtra = +Number(precioUnitExtra).toFixed(2);
                precioLineaExtra = +(precioUnitExtra * extraCant).toFixed(2);
              } else {
                precioUnitExtra = '';
                precioLineaExtra = '';
              }

              if (typeof precioLineaExtra === 'number' && !isNaN(precioLineaExtra)) sumaLineas += Number(precioLineaExtra);

              filasComanda.push([
                '',
                `Comanda ${comandaId}`,
                '  - ' + nombreExtra,
                extraCant || '',
                precioUnitExtra === '' ? '' : Number(precioUnitExtra).toFixed(2),
                precioLineaExtra === '' ? '' : Number(precioLineaExtra).toFixed(2),
                ''
              ]);
            });
          }
        });
      } else {
        // fallback anterior: procesar como texto plano si no existen nodos estructurados
        let platosFallback = Array.from(comandaDiv.querySelectorAll('ul li, li, .plato, .item-plato, td.plato'));
        if (!platosFallback.length) {
          const text = comandaDiv.innerText || '';
          const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !/comanda\s*\d+/i.test(l) && !/precio/i.test(l));
          lines.forEach(line => platosFallback.push({ innerText: line }));
        }
        platosFallback.forEach((platoNode) => {
          const text = (platoNode.innerText || String(platoNode)).trim();
          let cantidad = parseCantidad(text);
          let precioUnit = parseCurrency(text);
          let precioLinea = '';
          if (precioUnit !== null) {
            precioUnit = +precioUnit.toFixed(2);
            precioLinea = +(precioUnit * cantidad).toFixed(2);
            sumaLineas += Number(precioLinea);
          } else {
            precioUnit = '';
            precioLinea = '';
          }

          let nombrePlato = text
            .replace(/^\s*\d+\s*[x×]\s*/i, '')
            .replace(/^\s*\d+\s+/i, '')
            .replace(/([0-9]+[.,][0-9]{1,2})\s*€?/g, '')
            .replace(/\b(cada|ud|unidad|importe|total|precio)\b/ig, '')
            .replace(/[-–—]\s*$/,'')
            .trim();

          if (!nombrePlato) nombrePlato = text;

          filasComanda.push([
            '',
            `Comanda ${comandaId}`,
            nombrePlato,
            cantidad || '',
            precioUnit === '' ? '' : Number(precioUnit).toFixed(2),
            precioLinea === '' ? '' : Number(precioLinea).toFixed(2),
            ''
          ]);
        });
      }

      if ((!precioTotal || precioTotal === '') && sumaLineas > 0) {
        precioTotal = Number(sumaLineas).toFixed(2);
      }

      if (filasComanda.length) {
        filasComanda[0][6] = precioTotal || '';
        filasComanda.forEach(f => rows.push(f));
      } else {
        rows.push([``, `Comanda ${comandaId}`, '', '', '', '', precioTotal || '']);
      }
    });
  });

  if (!rows.length) {
    alert('No hay datos dentro de #contenedor-mesas para exportar.');
    return false;
  }

  const finalFilename = filename || `comandas_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function generarXlsHtml() {
    let html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>`;
    headers.forEach(h => html += `<th>${escapeHtml(h)}</th>`);
    html += `</tr></thead><tbody>`;
    rows.forEach(r => {
      html += `<tr>
        <td>${escapeHtml(r[0]||'')}</td>
        <td>${escapeHtml(r[1]||'')}</td>
        <td>${escapeHtml(r[2]||'')}</td>
        <td>${escapeHtml(r[3]||'')}</td>
        <td>${escapeHtml(r[4]||'')}</td>
        <td>${escapeHtml(r[5]||'')}</td>
        <td>${escapeHtml(r[6]||'')}</td>
      </tr>`;
    });
    html += `</tbody></table></body></html>`;

    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename.replace(/\.xlsx?$/i, '.xls');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function generarXlsxConSheetJS() {
    try {
      const aoa = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      Object.keys(ws).forEach(k => {
        if (k[0] === '!') return;
        const cell = ws[k];
        if (typeof cell.v === 'number' || (!isNaN(Number(cell.v)) && cell.v !== '')) {
          cell.t = 'n';
          cell.v = Number(cell.v);
        }
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Comandas');
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

// Si existe un botón con id 'btnExportMesas', le enlazamos la acción
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnExportMesas');
  if (btn) {
    btn.addEventListener('click', () => {
      exportMesasToExcel();
    });
  }
});

// Exponer en window para llamadas desde consola o inline onclick
window.exportMesasToExcel = exportMesasToExcel;

// estado monitor/export
let _offlineMonitor = null;
let _exportDone = false;

function showOfflineAlert() {
  if (document.querySelector('.offline-alert')) return;

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
        <div style="font-size:12px;">Se ha perdido la conexión a internet. Descarga las comandas para conservarlas.</div>
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

function aplicarEstiloDeshabilitado(el) {
  el.disabled = true;
  el.style.pointerEvents = 'none';
  el.style.background = '#343a40';
  el.style.color = '#ffffff';
  el.style.border = '1px solid #23272b';
  el.style.cursor = 'not-allowed';
  el.style.opacity = '0.95';
}

function aplicarEstiloHabilitado(el) {
  el.disabled = false;
  el.style.pointerEvents = 'auto';
  el.style.background = '';
  el.style.color = '';
  el.style.border = '';
  el.style.cursor = 'pointer';
  el.style.opacity = '';
}

function configureDownloadButton() {
  const btn = document.getElementById('btnDescargarExcelOffline');
  if (!btn) return;
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  const allRowsExist = document.querySelectorAll('#contenedor-mesas .mesa-card').length > 0;

  if (allRowsExist) {
    aplicarEstiloHabilitado(newBtn);
    newBtn.textContent = 'Descargar Excel';
    newBtn.addEventListener('click', () => {
      // prevenir múltiples exports
      if (_exportDone) return;
      _exportDone = true;
      exportMesasToExcel();
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
      // al volver la conexión
      stopOfflineMonitor();
      closeOfflineAlert();
      showOnlinePopup();
    } else {
      // si sigue offline, asegurarse de que el botón esté actualizado
      if (!document.querySelector('.offline-alert')) showOfflineAlert();
      configureDownloadButton();
    }
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

window.addEventListener('offline', () => {
  console.warn('Se detectó pérdida de conexión. Mostrando alerta superior...');
  startOfflineMonitor(1000);
});

window.addEventListener('online', () => {
  if (_offlineMonitor) stopOfflineMonitor();
  closeOfflineAlert();
  showOnlinePopup();
});
