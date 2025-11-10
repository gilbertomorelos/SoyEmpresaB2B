// Obtener la query de la URL
function obtenerQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

async function mostrarResultadosBusqueda() {
  const query = obtenerQuery().toLowerCase().trim();
  const contenedor = document.getElementById('resultados-busqueda');
  const titulo = document.getElementById('titulo-busqueda');

  if (!query) {
    titulo.textContent = 'No se proporcionó ninguna búsqueda';
    return;
  }

  try {
    // Asegúrate de que empresas.json está en la carpeta static
    const response = await fetch('static/empresas.json');
    if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');

    const empresas = await response.json();

    const resultados = empresas.filter(e =>
      e.empresa.toLowerCase().includes(query) ||
      e.categoria.toLowerCase().includes(query) ||
      e.ubicacion.toLowerCase().includes(query)
    );

    if (resultados.length === 0) {
      titulo.textContent = `No se encontraron resultados para "${query}"`;
      contenedor.innerHTML = ''; // limpiar contenedor
      return;
    }

    titulo.textContent = `Resultados para "${query}":`;

    contenedor.innerHTML = resultados.map(e => `
      <div class="resultado">
        <h4>${e.empresa}</h4>
        <p><b>Categoría:</b> ${e.categoria} | <b>Ubicación:</b> ${e.ubicacion}</p>
        <p>${e.descripcion}</p>
        <p class="contacto"><b>Contacto:</b> ${e.contacto}</p>
      </div>
    `).join('');

  } catch (error) {
    titulo.textContent = 'Error al cargar los datos.';
    contenedor.innerHTML = '';
    console.error('Error al cargar empresas.json:', error);
  }
}

// Ejecutar al cargar la página
window.onload = mostrarResultadosBusqueda;
