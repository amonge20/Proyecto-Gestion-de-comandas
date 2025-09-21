function mostrarComanda() {
  const lista = document.getElementById('comanda');

   platosElegidos.forEach(plato => {
    // Creamos un elemento para cada plato
    const platoDiv = document.createElement('div');
    platoDiv.classList.add('plato');

    // Si no hay imagen ponemos un texto alternativo
    const imgSrc = plato.imagen_plato;

    platoDiv.innerHTML = `
      <img src="${imgSrc}" alt="${plato.nombre_plato}" width="50">
      <h4>${plato.nombre_plato}</h4>
      <p>Precio: €${plato.precio_plato}</p>
      <p>Alergenos: ${plato.alergenos}</p>
    `;

    console.log(platoDiv);

    lista.appendChild(platoDiv);
  });
}
