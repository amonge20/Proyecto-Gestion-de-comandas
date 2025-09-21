
let platosElegidos = []; // array global de IDs elegidos

function toggleSeleccion(btn, id_plato, nombre_plato, precio_plato, imagen_plato, alergenos) {
    const platoElegido = {
        id_plato,
        nombre_plato,
        precio_plato,
        imagen_plato,
        alergenos
    };

    if (platosElegidos.find(obj => obj.id_plato === id_plato)) {
        // Quitar plato
        btn.classList.remove('quitar');
        btn.textContent = 'Elegir plato';

        // Eliminar del array
        platosElegidos = platosElegidos.filter(plato => plato.id_plato !== id_plato);
    } else {
        // Añadir plato
        btn.classList.add('quitar');
        btn.textContent = 'Quitar plato';

        platosElegidos.push(platoElegido);
    }
      
    // --- Enviar la lista actualizada al servidor ---
    fetch('guardar_sesion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(platosElegidos) // enviamos el array como JSON
    })
    .then(response => response.text())
    .then(data => console.log(data)) // mensaje de confirmación opcional
    .catch(error => console.error('Error al guardar en sesión:', error));
}


// Reactivar botones después de AJAX
function reactivarBotones() {
    document.querySelectorAll('.seleccionar-btn').forEach(btn => {
        btn.onclick = function() { toggleSeleccion(this); };
    });
}

// Llama a reactivarBotones() después de refrescar la lista con AJAX

function filtrarPlatos() {
  const form = document.getElementById("filtroAlergenos");
  const checkboxes = form.querySelectorAll('input[name="alergenos[]"]:checked');
  const id_tipo = form.querySelector('input[name="id_tipo"]').value;

  let query = "id_tipo=" + id_tipo + "&ajax=1";
  checkboxes.forEach((chk) => {
    query += "&alergenos[]=" + chk.value;
  });

  fetch("mostrar_platos.php?" + query)
    .then((res) => res.text())
    .then((html) => {
      document.querySelector(".platos-container").innerHTML = html;
      document.querySelectorAll(".seleccionar-btn").forEach((btn) => {
        btn.onclick = function () {
          toggleSeleccion(this);
        };
      });
    });
}
