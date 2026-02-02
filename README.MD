# 🚀 HR-Library

[![Versión](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/haisel03/HR-Library)
[![Licencia](https://img.shields.io/badge/license-ISC-green.svg)](https://github.com/haisel03/HR-Library)

**HR-Library** es un toolkit premium de desarrollo frontend "todo en uno". Centraliza el poder de los plugins estándar de la industria (Bootstrap 5, DataTables, Quill, Axios, SweetAlert2) en una API única, unificada y fácil de usar.

---

## ✨ Características Principales

- 📦 **Dependencias Consolidadas**: Maneja UI, Datos, API y Utilidades a través de una sola librería.
- 🪄 **Inicialización Automágica**: La mayoría de los componentes se pueden configurar mediante atributos de datos HTML estándar.
- 🛠️ **API HR Unificada**: Una experiencia de desarrollo consistente en todos los módulos.
- 🎨 **Estética Moderna**: Soporte integrado para Bootstrap 5 y temas premium de terceros.
- 📑 **Herramientas Completas**: Incluye helpers integrados para Fechas, Moneda, manipulación del DOM, Formularios y más.
- 🖥️ **Modo Iframe**: Soporte para diseños de iframe con pestañas, similar a las plantillas de administración profesionales.

---

## 📂 Estructura del Proyecto

```text
HR-Library/
├── dist/                # Archivos de producción (CSS, JS)
├── docs/                # Documentación técnica (JSDoc)
├── public/              # Páginas de demo y activos estáticos
│   └── demos/           # Scripts de demostración en JavaScript
├── src/                 # Código fuente
│   ├── js/              # Módulos y helpers de JavaScript
│   │   ├── core/        # Lógica central de la librería
│   │   ├── helpers/     # Funciones de utilidad especializadas
│   │   └── modules/     # Envoltorios de plugins
│   ├── scss/            # Archivos fuente de estilos
│   └── views/           # Plantillas de Handlebars
└── webpack/             # Configuración de compilación
```

---

## 🛠️ Módulos y Helpers

| Categoría | Helpers Incluidos |
| :--- | :--- |
| **UI y Layout** | `sidebar`, `modal`, `fullscreen`, `iframe`, `icons` |
| **Datos y Tablas** | `table`, `exportTbl`, `charts` |
| **Formularios e Inputs** | `forms`, `validation`, `select2`, `flatpickr`, `inputmask`, `signature` |
| **Excel** | `excelExport`, `excelImport`, `jsonToExcel`, `jsonToCsv` |
| **Utilidades** | `api`, `date`, `currency`, `string`, `number`, `storage`, `humanize` |
| **Feedback** | `alert` (SweetAlert2), `toast` |

---

## 🚀 Empezando

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v16.x o superior recomendado)
- [NPM](https://www.npmjs.com/)

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/haisel03/HR-Library.git
   cd HR-Library
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Compilar el proyecto:**
   ```bash
   npm run build
   ```

---

## 📖 Uso Básico

### 1. Incluir Activos
Incluye el CSS y JS compilado en tu proyecto:
```html
<link rel="stylesheet" href="dist/app.css">
<script src="dist/app.js"></script>
```

### 2. Inicialización HTML
Usa atributos de datos para una configuración rápida:
```html
<select class="select2" data-placeholder="Elige una opción">
    <option value="1">Opción A</option>
</select>
```

### 3. API de JavaScript
Accede a toda la funcionalidad a través del objeto global `HR`:
```javascript
// Inicializar los componentes de HR-Library
HR.init();

// Mostrar un mensaje de éxito
HR.msgSuccess("¡Operación completada con éxito!");

// Llamada simple a la API
HR.getApi('/api/data').then(response => {
    console.log(response);
});
```

### 4. Exportar e Importar Excel
Maneja archivos Excel fácilmente:
```javascript
// Exportar datos a Excel
const usuarios = [
    { nombre: 'Juan', edad: 30, ciudad: 'Santo Domingo' },
    { nombre: 'María', edad: 25, ciudad: 'Santiago' }
];
HR.excelExport(usuarios, 'usuarios.xlsx');

// Importar desde Excel
const fileInput = document.querySelector('#file-input');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const data = await HR.excelImport(file);
    console.log(data); // Array de objetos
});

// Exportar múltiples hojas
const reporteCompleto = {
    Ventas: [{ producto: 'Laptop', cantidad: 5 }],
    Clientes: [{ nombre: 'Juan', email: 'juan@example.com' }]
};
HR.excelExportMultiple(reporteCompleto, 'reporte.xlsx');
```

---

## 📚 Documentación y Demos

- **JSDoc**: Ejecuta `npm run docs` y abre `docs/index.html`.
- **Demos**: Explora la carpeta `public/` para ver ejemplos de implementación de cada módulo.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia ISC**.

---

Desarrollado con ❤️ por [Haisel Ramirez](https://github.com/haisel03)
