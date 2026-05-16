/**
 * @namespace $HR
 * @description
 * Alias de compatibilidad para HR Library v4.0.
 * Todas las funciones están ahora en `App`.
 *
 * @example
 * // Nueva forma recomendada:
 * App.success("Guardado");
 *
 * // Compatibilidad (sigue funcionando):
 * $HR.msgSuccess("Guardado");
 *
 * @version 4.0.0
 */

import App from "./app.js";

const $HR = App;

if (typeof window !== "undefined") {
  // Compatibilidad: algunos demos usan $HR y otros referencian HR
  window.$HR = $HR;
  window.HR = App;
}


export default $HR;
