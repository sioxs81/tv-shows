# 📺 TV Shows

App que consume la [API de TVMaze](https://www.tvmaze.com/api) para mostrar información de series y sus episodios agrupados por temporada, con un sistema de colores basado en el rating.

## Estructura

```
tv-shows/
├── src/
│   ├── index.html          # HTML principal
│   ├── index.css           # CSS global
│   ├── index.js            # JS principal (renderizado del DOM)
│   └── services/
│       └── tvmaze.js       # Módulo con las llamadas a la API
├── .gitignore
├── package.json
└── README.md
```

## Instalación y uso

```bash
npm install
npm run dev
```

## API usada

- `GET /shows/:id` → Datos de la serie (nombre, rating, imagen)
- `GET /shows/:id/episodes` → Lista de episodios (agrupados por temporada con `Object.groupBy`)

## Conceptos practicados

- `fetch` con `async/await`
- Manejo de errores con `try/catch`
- `Promise.all` para peticiones en paralelo
- `Object.groupBy` para agrupar episodios
- Módulos ES (`import` / `export`)
- Manipulación del DOM con `setHTMLUnsafe`
