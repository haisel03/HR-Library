# HR-Library

[![Versión](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/haisel03/HR-Library)
[![Licencia](https://img.shields.io/badge/license-ISC-green.svg)](https://github.com/haisel03/HR-Library)
![CI](https://github.com/haisel03/HR-Library/actions/workflows/ci.yml/badge.svg)

**HR-Library** es un toolkit premium de desarrollo frontend "todo en uno". Centraliza el poder de los plugins estándar de la industria (Bootstrap 5, DataTables, Quill, Axios, SweetAlert2) en una API única, unificada y fácil de usar.

---

## Stack

| Herramienta | Versión |
| :--- | :--- |
| Node.js | 24.15.0 |
| Vite | 8.x |
| Sass | 1.99+ |
| Vitest | 3.x |
| ESLint | 9.x (flat config) |
| Prettier | 3.x |
| Handlebars | 4.x |

---

## Características Principales

- **API Unificada `App`**: Un solo objeto global para acceder a toda la funcionalidad.
- **Inicialización Automágica**: Componentes configurables mediante atributos `data-*` HTML.
- **Plugins Integrados**: Bootstrap 5, DataTables, Chart.js, FullCalendar, Quill, Select2, Flatpickr, SweetAlert2, y más.
- **Helpers Especializados**: Validation, Strings, Date, Number, Forms, DOM, Alertas, API, Storage, etc.
- **Soporte Multi-tema**: Temas claro/oscuro, café, y más.
- **Modo Iframe**: Diseños con pestañas tipo panel de administración profesional.
- **Exportación**: Excel (XLSX), PDF, CSV, impresión.
- **Build Optimizado**: Code splitting por vendor, CSS dividido por página.

---

## Estructura del Proyecto

```text
HR-Library/
├── dist/                    # Build de producción
├── docs/                    # Documentación JSDoc (generada)
├── public/demos/            # Scripts de demostración
├── src/
│   ├── js/
│   │   ├── core/            # App facade, config, init, plugin-system
│   │   ├── helpers/         # 31 helpers especializados
│   │   └── modules/         # Envoltorios de plugins
│   ├── scss/                # Estilos Sass con arquitectura 7-1
│   └── views/               # Plantillas Handlebars (layouts, pages, partials)
├── .github/workflows/       # CI con GitHub Actions
├── vite.config.js           # Configuración de Vite
├── eslint.config.js         # ESLint flat config
└── vitest.config.js         # Configuración de Vitest
```

---

## Empezando

### Requisitos

- Node.js 22+
- npm

### Instalación

```bash
git clone https://github.com/haisel03/HR-Library.git
cd HR-Library
npm install
```

### Desarrollo

```bash
npm run dev        # Servidor de desarrollo (puerto 9000)
npm run build      # Build de producción
npm run preview    # Vista previa del build
```

### Calidad

```bash
npm run lint       # ESLint
npm run format     # Prettier (check)
npm test           # Vitest (124+ tests)
npm run docs       # Generar documentación JSDoc
```

---

## API de JavaScript

Toda la funcionalidad se accede a través del objeto global `App`:

```javascript
// Inicializar componentes en la página
App.init();

// Alertas
App.success("Guardado correctamente");
App.error("Ocurrió un error");
App.loading("Procesando...");

// Peticiones HTTP
const users = await App.getApi("/api/usuarios");
const user  = await App.postApi("/api/usuarios", { name: "Juan" });

// Tablas DataTable
const dt = App.initTable("#tabla", {
  data: users,
  columns: [App.tblCol("name", "Nombre")],
});

// Formularios
App.fillForm("#userForm", { name: "Juan" });
const data = App.serializeForm("#userForm");

// Fechas
App.DateHelper.format("2026-03-08");         // "08/03/2026"
App.DateHelper.addDays(new Date(), 7);       // Date +7 días

// Validación
App.Validation.isValidEmail("user@ex.com");  // true
App.Validation.isValidCedula("001-0234567-8");

// Strings
App.Strings.slug("Gestión Académica");       // "gestion-academica"
App.Strings.escapeHtml("<script>xss</script>");
```

### Plugins Pesados (Carga Bajo Demanda)

Quill, FullCalendar y Chart.js están separados en chunks independientes.
Se cargan automáticamente al usar `App.createEditor()`, `App.initCalendar()`
o `App.createChart()` respectivamente.

---

## Comandos

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción |
| `npm test` | Ejecutar tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (check) |
| `npm run format:fix` | Prettier (auto-fix) |
| `npm run docs` | Generar JSDoc |
| `npm run api` | Iniciar JSON Server mock |
| `npm run api:reset` | Resetear base de datos mock |
| `npm run build:lib` | Build para CDN/distribución |

---

## Documentación y Demos

- **JSDoc**: `npm run docs` y abre `docs/index.html`.
- **Demos**: Explora las páginas en el servidor de desarrollo (cada `.html` es una demo).

---

## Licencia

ISC — Desarrollado por [Haisel Ramirez](https://github.com/haisel03)
