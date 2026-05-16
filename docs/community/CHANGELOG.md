# Changelog

## [4.0.0] - 2026-05-16

### Cambios

- **App facade**: Nueva API unificada `App` reemplaza `$HR`. Todos los helpers accesibles desde un solo objeto.
- **Build system**: Migración de Webpack a Vite 8 (builds 3-5x más rápidos).
- **ESM**: Proyecto migrado completamente a ES Modules (`"type": "module"`).
- **Code splitting**: Los vendors se dividen en chunks lógicos (calendar, editor, charts, tables, etc.).
- **CSS splitting**: CSS separado por página en vez de un único bundle de 815 KB.
- **ESLint**: Migrado a flat config (v9) + Prettier integrado.
- **Testing**: Vitest + jsdom con 124 tests unitarios para helpers core.
- **CI/CD**: GitHub Actions con lint + format + test + build en cada push.
- **JSDoc**: Documentación completa en español (~160 métodos documentados).
- **Bundle visualizer**: Reporte de composición del bundle en `dist/stats.html`.

### Eliminado

- `$HR` global eliminado. Usar `App` en su lugar.
- 16 paquetes npm no utilizados.
- 8 archivos fuente no utilizados.
- Webpack y Babel (reemplazados por Vite).
- `.eslintrc` (reemplazado por `eslint.config.js` flat config).

## [3.0.0] - 2026-04-01

### Cambios

- Reorganización de helpers en carpeta `helpers/`.
- Eliminación del patrón Singleton; helpers como objetos planos congelados.
- Nuevos helpers: Calendar, Editor, Charts, Drag, Print, Signature, Select2.
- Temas: café claro/oscuro.
- JSDoc con `docdash`.

## [2.0.0] - 2026-03-01

### Cambios

- Integración de Bootstrap 5.
- DataTables con botones de exportación.
- Chart.js con registro selectivo de componentes.
- FullCalendar con plugins básicos.
- Nuevos helpers: Codes, Currency, Excel, ExportTbl, File, Fullscreen, Humanize, Icons, Iframe, IframeTab, Modal, Print, Sidebar, Signature, Storage.

## [1.0.0] - 2026-02-01

### Añadido

- Lanzamiento inicial.
- API central `HR` para gestión unificada de plugins.
- Plugins: Bootstrap 5, DataTables, Axios, SweetAlert2, Select2, Flatpickr, Chart.js y más.
- Helpers: api, date, currency, forms, validation, table, etc.
- Modo Iframe con navegación por pestañas.
- JSDoc con tema `docdash`.
- Build con Webpack + Babel.
- Páginas de demo.
