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
