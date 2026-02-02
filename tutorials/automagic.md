# Funciones Automáticas (Automagic)

La librería HR escanea automáticamente el DOM para activar comportamientos basados en atributos HTML.

## Atributos de Formulario

| Atributo | Uso | Resultado |
| :--- | :--- | :--- |
| `class="required"` | En el `<label>` | Marca el input (vía `for`) como obligatorio. |
| `class="email"` | En el `<input>` | Valida formato de correo. |
| `class="phone"` | En el `<input>` | Valida formato de teléfono. |
| `data-mask` | En el `<input>` | Activa el plugin Inputmask. |
| `data-mask-config`| En el `<input>` | Define la máscara (ej. `999-9999999-9`). |

## Atributos de Componentes

| Atributo | Valor | Resultado |
| :--- | :--- | :--- |
| `class="select2"` | - | Inicializa Select2 con el tema Bootstrap 5. |
| `data-target` | `dt` | Convierte una `<table>` en DataTable. |
| `data-editor` | `quill` | Convierte un elemento en Editor Quill. |
| `data-signature` | - | Convierte un `<canvas>` en panel de firma. |
| `data-feather` | (nombre) | Inserta un icono de Feather Icons. |

## Re-inicialización Dinámica

Si cargas contenido vía AJAX, puedes re-inicializar el scope específico para activar todos los componentes a la vez:

```javascript
// Ejemplo: Inicializar todo un contenedor dinámico (tabs, modales, etc.)
HR.init('#nuevoContenedor');

// Ejemplo: Inicializar solo una tabla nueva
// (Aunque HR.init lo hace, puedes usar el helper específico si prefieres)
// HR.createTbl('#miNuevaTabla'); 
```

