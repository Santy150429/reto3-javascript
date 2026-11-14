/* Página: Sabores de Colombia (platos típicos) */

const URL_PLATOS = 'https://api-colombia.com/api/v1/TypicalDish';

// Imagen de respaldo incluida en el propio código (no depende de ningún sitio externo,
// así que nunca puede fallar ni causar un bucle de errores).
const IMAGEN_RESPALDO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">' +
    '<rect width="600" height="360" fill="#f1e4d3"/>' +
    '<text x="300" y="190" font-size="90" text-anchor="middle">🍲</text>' +
    '<text x="300" y="260" font-size="26" text-anchor="middle" fill="#7a5c3a" font-family="sans-serif">Imagen no disponible</text>' +
    '</svg>'
);

// Si una imagen de la API no funciona, reemplázala aquí por una válida.
// Formato: 'Nombre del plato': 'ruta o enlace de la imagen'
// No importan las mayúsculas ni las tildes del nombre.
// Las rutas llevan "../" porque sabores.html está dentro de la carpeta pages/.
const IMAGENES_MANUALES = {
    'Arroz de Lisa': '../img/arroz-de-lisa.jpg',
    'Dulce de guayaba': '../img/dulce-de-guayaba.jpg',
    'Tamal Tolimense': '../img/tamal-tolimense.jpg'
};

const cargandoEl = document.getElementById('loading');
const errorEl = document.getElementById('error-container');
const gridEl = document.getElementById('dishes-grid');
const totalEl = document.getElementById('total-platos');

// Quita tildes, mayúsculas y espacios sobrantes para comparar nombres
function normalizar(texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// Prioridad: imagen puesta a mano > imagen de la API > imagen de respaldo.
function obtenerImagen(plato) {
    const nombre = normalizar(plato.name);
    const manual = Object.entries(IMAGENES_MANUALES)
        .find(([clave]) => normalizar(clave) === nombre);

    if (manual) {
        return manual[1];
    }

    const candidata = plato.imageUrl || plato.image || plato.imageURL || (Array.isArray(plato.images) && plato.images[0]);
    return typeof candidata === 'string' && candidata.trim() ? candidata.trim() : IMAGEN_RESPALDO;
}

async function cargarPlatos() {
    cargandoEl.hidden = false;
    errorEl.hidden = true;
    gridEl.replaceChildren();

    try {
        const platos = await obtenerJSON(URL_PLATOS);
        const ordenados = [...platos].sort((a, b) => a.name.localeCompare(b.name, 'es'));

        // Extra de la actividad: contar los platos
        totalEl.textContent = ordenados.length;

        pintarPlatos(ordenados);
    } catch (error) {
        console.error(error);
        totalEl.textContent = '—';
        mostrarError(
            errorEl,
            `Hubo un error al cargar los datos: ${error.message}. Por favor, intenta de nuevo.`,
            cargarPlatos
        );
    } finally {
        cargandoEl.hidden = true;
    }
}

function pintarPlatos(platos) {
    const tarjetas = platos.map(crearTarjeta);
    gridEl.replaceChildren(...tarjetas);
}

function crearTarjeta(plato) {
    const tarjeta = crearElemento('article', 'card');

    const imagen = crearElemento('img');
    imagen.src = obtenerImagen(plato);
    imagen.alt = `Plato típico: ${plato.name}`;
    imagen.loading = 'lazy';
    // Si la imagen falla, se cambia una sola vez por la de respaldo
    imagen.addEventListener('error', () => {
        imagen.src = IMAGEN_RESPALDO;
    }, { once: true });

    const contenido = crearElemento('div', 'card-content');
    contenido.append(
        crearElemento('h3', '', plato.name),
        crearDato('Departamento', plato.department && plato.department.name ? plato.department.name : 'No registrado')
    );

    if (plato.ingredients) {
        const ingredientes = Array.isArray(plato.ingredients) ? plato.ingredients.join(', ') : String(plato.ingredients);
        contenido.append(crearDato('Ingredientes', ingredientes));
    }

    contenido.append(
        crearElemento('p', '', plato.description ? plato.description : 'Plato tradicional representativo de la región.')
    );

    tarjeta.append(imagen, contenido);
    return tarjeta;
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarPlatos);
