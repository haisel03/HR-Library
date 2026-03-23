# TODO: Normalizar Helpers y HR para jsDoc v3.0

Estado: Pendiente ✅/En progreso ⏳/Completado ☑️/Bloqueado ❌

## Plan detallado (pasos lógicos):

### 1. ☑️ Crear este TODO.md (tracking de progreso)

### 2. ☑️ Normalizar src/js/HR.js (HTTP, Alertas, Toasts, Modales, Table, Export - parcial)

- Continuar resto métodos en próximo paso.

### 3. ⏳ Normalizar archivos core/

- src/js/core/config.js: @module Config, documentar métodos/exports.
- src/js/core/plugin-system.js: @module, funciones.
- src/js/core/spanish.js, init.js (ya bueno).
- src/js/core/init.js: Ya excelente, solo verificar.

### 4-33. ⏳ Normalizar helpers/ (30 archivos, agrupar por complejidad)

**Prioridad Alta (10 principales usados en demos):**

- 4.  src/js/helpers/Alert.js ☑️ (ya excelente)
- 5.  src/js/helpers/Api.js ☑️
- 6.  src/js/helpers/Table.js
- 7.  src/js/helpers/Forms.js
- 8.  src/js/helpers/Validation.js ☑️
- 9.  src/js/helpers/Date.js
- 10. src/js/helpers/Dom.js
- 11. src/js/helpers/Storage.js
- 12. src/js/helpers/Modal.js
- 13. src/js/helpers/Number.js

**Prioridad Media (15 comunes):**

- Humanize, Strings, Currency, File, Editor, Select2, Charts, Print, ExportTbl, Event, Drag, Iframe, Sidebar, Fullscreen, Icons

**Prioridad Baja (5 menos usados):**

- Codes, Excel, Calendar, Signature, Asset

Para cada uno:

- Header: /\*_ @module Nombre @description ... @version 3.0.0 @example _/
- TODAS funciones: @param types, @returns, @private si aplica.
- Namespaces documentados.
- init() siempre /\*_ @returns {void} _/

### 34. ⏳ Actualizar jsdoc.json

- Asegurar recurse:true, paths correctos.
- Agregar tags allowUnknownTags si custom.

### 35. ☑️ Ejecutar JSDoc: npx jsdoc -c jsdoc.json

- Verificar docs/ generados sin errores.
- Revisar index.html, modules list.

### 36. ☑️ Verificar docs/

- Navegar docs/, buscar Helpers/HR, validar renderizado.
- Comandos: npx http-server docs

### 37. ☑️ attempt_completion

**Notas:**

- Ediciones con edit_file (diff exactos).
- Usar múltiples tools parallel.
- Todo en español descriptivo, tipos {Promise<Object>} etc.
- Regenerar JSDoc después de grupos de edits.
- Actualizar este TODO cada paso completado.

**Progreso total:** 2/37 (5%)"
