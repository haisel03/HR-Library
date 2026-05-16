# Contribuyendo a HR-Library

Gracias por tu interés en contribuir. Por favor sigue estas pautas.

## Requisitos

- Node.js 22+
- npm

## Setup

```bash
git clone https://github.com/haisel03/HR-Library.git
cd HR-Library
npm install
```

## Flujo de trabajo

1. Crea un branch desde `develop`: `git checkout -b feature/mi-feature`
2. Haz cambios y asegúrate de que pasen las verificaciones:

```bash
npm run lint      # ESLint
npm run format    # Prettier
npm test          # Vitest
npm run build     # Build producción
```

3. Commitea con mensajes descriptivos en español o inglés
4. Abre un Pull Request a `develop`

## Convenciones

### JavaScript

- Módulos ES6 (`import`/`export`)
- Objetos congelados (`Object.freeze`) para helpers
- JSDoc en español para toda función/método pública
- Arrow functions para métodos internos
- `camelCase` para variables y funciones

### Estilos (SCSS)

- Arquitectura 7-1 en `src/scss/`
- Variables en `1-variables/`
- Mixins en `2-mixins/`
- Componentes en `3-components/`
- Utilidades en `4-utilities/`
- Vendors en `5-vendor/`
- Temas en `6-themes/`

### Commits

Usa prefijos descriptivos:

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `refactor:` refactorización
- `chore:` tareas de mantenimiento
- `docs:` documentación
- `test:` tests

## Tests

Los tests están en `src/**/*.test.js` junto al código que prueban.

```bash
npm test              # Una ejecución
npm run test:watch    # Modo watch
```

## Documentación

La documentación JSDoc se genera con:

```bash
npm run docs
```

Los archivos generados van a `docs/` (gitignored).
