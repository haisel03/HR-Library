# Funciones Avanzadas

HR-Library incluye herramientas potentes para tareas específicas como generación de códigos, manejo de archivos e impresión.

## Generación de Códigos

Puedes crear códigos de barras y QR sobre elementos `<img>`, `<canvas>` o contenedores.

```javascript
// Barcode
HR.codeBarcode('#barcode', '123456789', { format: 'CODE128' });

// Código QR
HR.codeQrCanvas('#qrCanvas', 'https://google.com');
HR.codeQrImage('#qrImg', 'Texto para el QR');
```

## Manejo de Archivos (Files)

Validación y lectura de archivos del lado del cliente.

```javascript
const file = input.files[0];

if (HR.fileIsValidSize(file, 2 * 1024 * 1024)) {
    if (HR.fileIsValidExtension(file, ['jpg', 'png'])) {
        HR.fileReadBase64(file).then(base64 => {
            console.log('Archivo cargado:', base64);
        });
    }
}

// Descargas
HR.fileDownloadText('Contenido del archivo', 'nota.txt');
HR.fileDownloadUrl('/path/to/server/file.pdf', 'reporte.pdf');
```

## Impresión

Imprime cualquier elemento DOM o toda la página aplicando estilos de impresión automáticos.

```javascript
// Imprime un div específico
HR.printEl('#areaImpresion');

// Imprime toda la página
HR.printEl();
```

## Drag & Drop

Gestión sencilla de arrastrar y soltar entre contenedores.

```javascript
HR.dragCreate('miGrupo', [
    document.getElementById('lista1'),
    document.getElementById('lista2')
]);
```
