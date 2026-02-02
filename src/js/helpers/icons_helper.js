import feather from "feather-icons";
import config from "../core/config";

/**
 * @module icons
 * @description
 * Helper para manejo de íconos del proyecto.
 *
 * Soporta múltiples librerías de íconos:
 * - Font Awesome
 * - Bootstrap Icons
 * - Feather Icons
 *
 * Permite generar íconos como elementos DOM y definir
 * una librería por defecto a nivel global.
 */

/* =====================================================
   CONFIGURACIÓN
===================================================== */

/**
 * Librerías de íconos soportadas.
 *
 * @constant {Object}
 * @property {string} fa Font Awesome
 * @property {string} bi Bootstrap Icons
 * @property {string} feather Feather Icons
 */
const LIBS = config.icons;

/**
 * Librería de íconos por defecto
 *
 * @type {string}
 */
let defaultLib = LIBS.default || LIBS.bi;

/* =====================================================
   CORE
===================================================== */

/**
 * Define la librería de íconos por defecto
 *
 * @param {string} lib
 * Nombre de la librería (`fa`, `bi`, `feather`)
 *
 * @returns {void}
 *
 * @example
 * icons.setDefault("bi");
 */
function setDefault(lib) {
  if (Object.values(LIBS).includes(lib)) {
    defaultLib = lib;
  }
}

/**
 * Crea un ícono como elemento DOM (`<i>`)
 *
 * @param {string} name
 * Nombre del ícono (sin prefijo)
 *
 * @param {string} [lib=defaultLib]
 * Librería a utilizar (`fa`, `bi`, `feather`)
 *
 * @param {Object} [options={}]
 * Opciones visuales del ícono
 *
 * @param {string} [options.class]
 * Clases CSS adicionales
 *
 * @param {string|number} [options.size]
 * Tamaño del ícono:
 * - Bootstrap Icons: `fs-{n}`
 * - FontAwesome: `fa-{n}x`
 *
 * @param {string} [options.color]
 * Color CSS del ícono
 *
 * @returns {HTMLElement}
 * Elemento `<i>` configurado
 *
 * @example
 * iconEl("check");
 *
 * @example
 * iconEl("check", "bi", { class: "text-primary", size: 3 });
 *
 * @example
 * iconEl("user", "feather", { color: "red" });
 */
function iconEl(name, lib = defaultLib, options = {}) {
  const el = document.createElement("i");
  const cls = options.class ?? "";
  const size = options.size ? ` fs-${options.size}` : "";

  switch (lib) {
    case LIBS.bi:
      el.className = `bi bi-${name}${size} ${cls}`.trim();
      break;

    case LIBS.feather:
      el.setAttribute("data-feather", name);
      if (cls) el.className = cls;
      break;

    case LIBS.fa:
    default: {
      const faSize = options.size ? ` fa-${options.size}x` : "";
      el.className = `fa fa-${name}${faSize} ${cls}`.trim();
      break;
    }
  }

  if (options.color) {
    el.style.color = options.color;
  }

  return el;
}

/* =====================================================
   SHORTCUTS
===================================================== */

/**
 * Crea un ícono Font Awesome
 *
 * @param {string} name
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
const fa = (name, options = {}) =>
  iconEl(name, LIBS.fa, options);

/**
 * Crea un ícono Bootstrap Icons
 *
 * @param {string} name
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
const bi = (name, options = {}) =>
  iconEl(name, LIBS.bi, options);

/**
 * Crea un ícono Feather
 *
 * @param {string} name
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
const featherIcon = (name, options = {}) =>
  iconEl(name, LIBS.feather, options);

/* =====================================================
   FEATHER ICONS
===================================================== */

/**
 * Inicializa Feather Icons reemplazando automáticamente
 * los elementos con `data-feather`
 *
 * Debe ejecutarse luego de insertar los íconos en el DOM.
 *
 * @returns {void}
 *
 * @example
 * icons.init();
 */
function init() {
  feather.replace();
}

/* =====================================================
   EXPORT
===================================================== */

export default {
  LIBS,
  setDefault,
  iconEl,
  fa,
  bi,
  feather: featherIcon,
  init,
};
