# Portal de Colombia con API

## Descripción
Sitio web de varias paginas que consume datos en tiempo real de la API publica de Colombia ([api-colombia.com](https://api-colombia.com/)) y los muestra dinamicamente en el DOM con JavaScript. Tiene dos secciones:

- **Explorador de Departamentos:** nombre, región, población, superficie y descripción de cada departamento, más un conteo de departamentos por region.
- **Sabores de Colombia:** platos típicos con nombre, departamento, ingredientes, descripcion e imagen (con imagen de respaldo si alguna falla), más el total de platos.

Ambas paginas muestran un mensaje de carga mientras llegan los datos y un mensaje de error, con botón para reintentar, si la peticion falla.

## Tecnologias usadas
- **HTML5:** estructura semantica de las paginas.
- **CSS3:** diseño responsivo con Flexbox y CSS Grid.
- **JavaScript (vanilla):** `fetch`, `async/await`, `Promise.all`, manipulación del DOM y manejo de errores con `try...catch`.
- **API:** [API Colombia](https://api-colombia.com/) (`/Department`, `/Region` y `/TypicalDish`).

## Estructura del proyecto
```
├── index.html
├── pages/
│   ├── departamentos.html
│   └── sabores.html
├── css/
│   └── styles.css
└── js/
    ├── utils.js
    ├── departamentos.js
    └── sabores.js
```
## Capturas (opcional)
Agrega aquí capturas de pantalla de las paginas.

## Estudiante
Santiago Rojas Buitrago

## Pdt
Tuve problemas con el repocitorio lo cual me toco reiniciarlo hacique solo tenga un commit.
