/* Página: Explorador de departamentos de Colombia */

const URL_DEPARTAMENTOS = 'https://api-colombia.com/api/v1/Department';
const URL_REGIONES = 'https://api-colombia.com/api/v1/Region';

// Colores para distinguir las regiones (se asignan en orden alfabético)
const COLORES_REGION = ['#0b7285', '#2b8a3e', '#e67700', '#862e9c', '#c92a2a', '#364fc7', '#087f5b', '#a61e4d'];

const cargandoEl = document.getElementById('loading');
const errorEl = document.getElementById('error-container');
const gridEl = document.getElementById('departments-grid');
const estadisticasEl = document.getElementById('region-stats');
const totalEl = document.getElementById('total-departamentos');

// La lista de departamentos de la API trae solo el regionId, no el nombre de la región.
// Por eso se pide también /Region y se busca el nombre con ese id.
function obtenerNombreRegion(departamento, nombresPorId) {
    if (departamento.region && departamento.region.name) {
        return departamento.region.name;
    }
    return nombresPorId[departamento.regionId] || 'Sin región';
}

async function cargarDepartamentos() {
    cargandoEl.hidden = false;
    errorEl.hidden = true;
    gridEl.replaceChildren();

    try {
        // Las dos peticiones se hacen al mismo tiempo.
        // Si falla solo la de regiones, la página igual muestra los departamentos.
        const [departamentos, regiones] = await Promise.all([
            obtenerJSON(URL_DEPARTAMENTOS),
            obtenerJSON(URL_REGIONES).catch(() => [])
        ]);

        const nombresPorId = {};
        regiones.forEach(region => {
            nombresPorId[region.id] = region.name;
        });

        const lista = departamentos
            .map(dep => ({ ...dep, nombreRegion: obtenerNombreRegion(dep, nombresPorId) }))
            .sort((a, b) => a.name.localeCompare(b.name, 'es'));

        const colores = asignarColores(lista);

        pintarEstadisticas(lista, colores);
        pintarDepartamentos(lista, colores);
    } catch (error) {
        console.error(error);
        mostrarError(
            errorEl,
            `Hubo un error al cargar los datos: ${error.message}. Por favor, intenta de nuevo.`,
            cargarDepartamentos
        );
    } finally {
        cargandoEl.hidden = true;
    }
}

// Devuelve un objeto { nombreRegion: color }
function asignarColores(departamentos) {
    const nombres = [...new Set(departamentos.map(dep => dep.nombreRegion))].sort((a, b) => a.localeCompare(b, 'es'));
    const colores = {};
    nombres.forEach((nombre, indice) => {
        colores[nombre] = COLORES_REGION[indice % COLORES_REGION.length];
    });
    return colores;
}

// Extra de la actividad: contar departamentos por región
function pintarEstadisticas(departamentos, colores) {
    const conteo = {};
    departamentos.forEach(dep => {
        conteo[dep.nombreRegion] = (conteo[dep.nombreRegion] || 0) + 1;
    });

    totalEl.textContent = `Total: ${departamentos.length} departamentos`;
    estadisticasEl.replaceChildren();

    Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .forEach(([region, total]) => {
            const texto = `${region}: ${total} ${total === 1 ? 'departamento' : 'departamentos'}`;
            const insignia = crearElemento('div', 'stat-badge', texto);
            insignia.style.borderLeftColor = colores[region];
            estadisticasEl.append(insignia);
        });
}

function pintarDepartamentos(departamentos, colores) {
    const tarjetas = departamentos.map(dep => crearTarjeta(dep, colores[dep.nombreRegion]));
    gridEl.replaceChildren(...tarjetas);
}

function crearTarjeta(dep, color) {
    const tarjeta = crearElemento('article', 'card card-departamento');
    tarjeta.style.setProperty('--region-color', color);

    const contenido = crearElemento('div', 'card-content');
    contenido.append(
        crearElemento('h3', '', dep.name),
        crearDato('Región', dep.nombreRegion),
        crearDato('Población', dep.population ? dep.population.toLocaleString('es-CO') : 'No registrada'),
        crearDato('Superficie', dep.surface ? `${dep.surface.toLocaleString('es-CO')} km²` : 'No registrada'),
        crearElemento('p', '', dep.description ? recortarTexto(dep.description, 160) : 'Sin descripción disponible.')
    );

    tarjeta.append(contenido);
    return tarjeta;
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarDepartamentos);
