# Primeros Pasos

Aprende a instalar e integrar HR-Library en tu proyecto en pocos minutos.

## 1. Instalación

Copia los archivos del bundle generado (`dist/`) a tu carpeta de assets.

```html
<!-- Estilos -->
<link rel="stylesheet" href="assets/css/app.css">

<!-- Scripts -->
<script src="assets/js/app.js"></script>
```

## 2. Inicialización

La librería ofrece un inicializador global que activa todas las funciones automáticas del DOM.

```javascript
import { HR } from 'hr-library'; // Si usas módulos
// O usa el objeto global window.HR

$(function() {
    // Inicializa todos los componentes automáticos
    HR.init(); 
});
```

## 3. Ejemplo Rápido

### Formulario con Validación y Moneda
```html
<form id="userForm">
    <div class="mb-3">
        <label for="cedula" class="required">Cédula</label>
        <input type="text" id="cedula" name="cedula" 
               class="form-control" 
               data-mask 
               data-mask-config="999-9999999-9">
    </div>

    <div class="mb-3">
        <label>Precio</label>
        <div id="precioFormat" class="fw-bold"></div>
    </div>
    
    <button type="button" onclick="save()">Guardar</button>
</form>

<script>
// Usando helpers de moneda
const precio = 1500.50;
HR.text('#precioFormat', HR.currencyFormat(precio, 'P'));

function save() {
    if (HR.isValidForm('#userForm')) {
        const data = HR.serializeForm('#userForm');
        HR.msgLoading();
        
        HR.postApi('/users', data)
            .then(() => HR.msgSuccess('Usuario guardado'))
            .finally(() => HR.msgLoading(true));
    }
}
</script>
```
