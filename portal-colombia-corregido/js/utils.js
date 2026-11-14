/* Funciones compartidas por las páginas de Departamentos y Sabores */

// Pide datos a la API y devuelve el JSON.
// fetch NO lanza error con un 404 o 500, por eso se revisa respuesta.ok.
async function obtenerJSON(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error(`La API respondió con el código ${respuesta.status}`);
    }
    return respuesta.json();
}

// Crea un elemento con clase y texto opcionales.
// Se usa textContent (y no innerHTML) para que el texto de la API nunca se interprete como HTML.
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) {
        elemento.className = clase;
    }
    if (texto !== undefined && texto !== null) {
        elemento.textContent = texto;
    }
    return elemento;
}

// Crea un párrafo del tipo "Etiqueta: valor" con la etiqueta en negrita.
function crearDato(etiqueta, valor) {
    const parrafo = crearElemento('p');
    parrafo.append(crearElemento('strong', '', `${etiqueta}: `), valor);
    return parrafo;
}

// Recorta un texto largo sin partir palabras. Solo agrega "…" si realmente se recortó.
function recortarTexto(texto, maximo) {
    if (!texto) {
        return '';
    }
    if (texto.length <= maximo) {
        return texto;
    }
    const corte = texto.lastIndexOf(' ', maximo);
    return texto.slice(0, corte > 0 ? corte : maximo).trimEnd() + '…';
}

// Muestra el mensaje de error con un botón para reintentar sin recargar la página.
function mostrarError(contenedor, mensaje, alReintentar) {
    contenedor.replaceChildren();
    contenedor.append(crearElemento('p', '', mensaje));

    const boton = crearElemento('button', 'btn-reintentar', 'Reintentar');
    boton.type = 'button';
    boton.addEventListener('click', alReintentar);
    contenedor.append(boton);

    contenedor.hidden = false;
}
