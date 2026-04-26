# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [Unreleased]

### Cambios (BlackboxAI)

- Normalizar JSDoc en español para Helpers y HR.js flat API (HTTP, Alertas, Tables, Forms, Validation, etc.).
- Reemplazar todas referencias "Coffee Schools" → "HR-Library" (20+ archivos helpers/modules/new).
- jsdoc.json exclude legacy/core/vendor para docs clean (solo warnings menores).
- Docs generados ./docs/ sin errores.

### Corregido

- Build JS corregido al actualizar `Choices.js` para usar imports compatibles con Webpack 5 y la nueva ubicación de `Dom`.
- ESLint actualizado para soportar sintaxis moderna del proyecto (`ecmaVersion: 2021`, `browser`, `es2021`).
- Warnings de JSDoc corregidos en `plugin-system.js` y `Table.js`.
- Warnings ruidosos de Sass y performance afinados en `webpack.prod.js`, manteniendo visibles solo los avisos de bundle realmente relevantes.

## [1.0.0] - 2026-02-01

### Añadido

- Lanzamiento inicial de **HR-Library**.
- API central `HR` para la gestión unificada de plugins.
- Plugins integrados: Bootstrap 5, DataTables, Axios, SweetAlert2, Select2, Flatpickr, Chart.js, y más.
- Conjunto completo de helpers: `api`, `date`, `currency`, `forms`, `validation`, `table`, etc.
- Soporte para **Modo Iframe** con navegación por pestañas.
- Sistema de documentación usando JSDoc y el tema `docdash`.
- Sistema de compilación con Webpack y Babel.
- Páginas de demo para mostrar las características de la librería.
