function openPopup(estado, id) {
  if (estado == "elegir_plato") {
    fetch("mostrar_platos.php?id_tipo=" + id)
      .then((response) => response.text())
      .then((html) => {
        const popup = document.getElementById("popup");
        document.getElementById("popup-text").innerHTML = html;
        popup.style.display = "flex";
      });
  } else if (estado == "enviar_comanda") {
    fetch("enviar_comanda.php")
      .then((response) => response.text())
      .then((html) => {
        const popup = document.getElementById("popup");
        document.getElementById("popup-text").innerHTML = html;
        popup.style.display = "flex";

        mostrarComanda();
      });
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
