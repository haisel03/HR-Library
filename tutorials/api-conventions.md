# Convenciones de la API

El objeto global `HR` sigue una nomenclatura estandarizada para facilitar el desarrollo.

## Prefijos de Funciones

Para evitar colisiones y mejorar la legibilidad, las funciones se agrupan por prefijos:

| Prefijo | Área | Ejemplos |
| :--- | :--- | :--- |
| `api` | Peticiones HTTP | `HR.getApi`, `HR.postApi`, `HR.setToken` |
| `msg` | Alertas y UI | `HR.msgSuccess`, `HR.msgConfirm`, `HR.msgLoading` |
| `toast` | Notificaciones rapidas | `HR.toastSuccess`, `HR.toastError` |
| `tbl` | DataTables | `HR.tblCol`, `HR.tblButtons`, `HR.reloadTbl` |
| `code` | Códigos (Barcode/QR) | `HR.codeBarcode`, `HR.codeQrCanvas` |
| `currency` | Monedas | `HR.currencyFormat`, `HR.currencyConvert` |
| `file` | Archivos | `HR.fileExtension`, `HR.fileDownloadUrl` |
| `str` | Strings | `HR.strCapital`, `HR.strTruncate`, `HR.strSlug` |
| `num` | Números | `HR.numFormat`, `HR.numRound`, `HR.numRandom` |
| `editor` | Quill Editor | `HR.createEditor`, `HR.getEditorHtml` |
| `sidebar` | Sidebar | `HR.sidebarToggle`, `HR.sidebarExpand` |

## Inicialización Global

| Función | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `HR.init` | Escanea el DOM y activa todos los componentes automáticos. | `HR.init()` o `HR.init('#scope')` |

## Manejo de Elementos DOM

La mayoría de las funciones de `HR` aceptan tres tipos de argumentos para identificar elementos:
1. **Selector String**: `"#id"`, `".clase"`, `"div > p"`.
2. **Elemento DOM**: `document.getElementById('id')`.
3. **Objeto jQuery**: `$('#id')`.

```javascript
// Todos estos son válidos y equivalentes:
HR.hide('#miDiv');
HR.hide(document.getElementById('miDiv'));
HR.hide($('#miDiv'));
```
