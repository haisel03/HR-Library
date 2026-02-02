/**
 * @module dom
 * @description
 * Helper de utilidades DOM puras.
 * Centraliza operaciones comunes sobre elementos HTML sin dependencias externas.
 */

/* =====================================================
   NORMALIZADOR
===================================================== */

/**
 * Normaliza un target en un elemento DOM
 *
 * @param {string|HTMLElement|null|undefined} target
 * Selector CSS, ID sin '#', o elemento DOM
 *
 * @returns {HTMLElement|null} Elemento encontrado o null
 */
function el(target) {
  if (!target) return null;
  if (target instanceof HTMLElement || target === document || target === window) return target;

  if (typeof target === "string") {
    if (target.startsWith("#") || target.startsWith(".")) {
      return document.querySelector(target);
    }
    return document.getElementById(target);
  }

  return null;
}

/* =====================================================
   VISIBILIDAD
===================================================== */

/**
 * Muestra un elemento (remueve `d-none`)
 * @param {string|HTMLElement} t
 */
const show = (t) => el(t)?.classList.remove("d-none");

/**
 * Oculta un elemento (agrega `d-none`)
 * @param {string|HTMLElement} t
 */
const hide = (t) => el(t)?.classList.add("d-none");

/**
 * Alterna visibilidad (`d-none`)
 * @param {string|HTMLElement} t
 */
const toggle = (t) => el(t)?.classList.toggle("d-none");

/**
 * Verifica si un elemento es visible en el DOM
 * @param {string|HTMLElement} t
 * @returns {boolean}
 */
const isVisible = (t) => {
  const e = el(t);
  return !!(
    e &&
    e.offsetWidth > 0 &&
    e.offsetHeight > 0 &&
    getComputedStyle(e).display !== "none"
  );
};

/**
 * Verifica si un elemento está oculto
 * @param {string|HTMLElement} t
 * @returns {boolean}
 */
const isHidden = (t) => !isVisible(t);

/* =====================================================
   ESTADOS
===================================================== */

/**
 * Habilita un elemento (disabled = false)
 * @param {string|HTMLElement} t
 */
const enable = (t) => {
  const e = el(t);
  if (e) e.disabled = false;
};

/**
 * Deshabilita un elemento (disabled = true)
 * @param {string|HTMLElement} t
 */
const disable = (t) => {
  const e = el(t);
  if (e) e.disabled = true;
};

/**
 * Alterna el estado disabled
 * @param {string|HTMLElement} t
 */
const toggleDisabled = (t) => {
  const e = el(t);
  if (e) e.disabled = !e.disabled;
};

/* =====================================================
   CONTENIDO
===================================================== */

/**
 * Obtiene o establece HTML interno
 * @param {string|HTMLElement} t
 * @param {string} [content]
 * @returns {string|undefined}
 */
const html = (t, content = undefined) => {
  const e = el(t);
  if (!e) return;
  if (content === undefined) return e.innerHTML;
  e.innerHTML = content;
};

/**
 * Obtiene o establece texto
 * @param {string|HTMLElement} t
 * @param {string} [content]
 * @returns {string|undefined}
 */
const text = (t, content = undefined) => {
  const e = el(t);
  if (!e) return;
  if (content === undefined) return e.textContent;
  e.textContent = content;
};

/**
 * Limpia el contenido HTML
 * @param {string|HTMLElement} t
 */
const clear = (t) => {
  const e = el(t);
  if (e) e.innerHTML = "";
};

/* =====================================================
   CLASES
===================================================== */

/**
 * Agrega una o varias clases
 * @param {string|HTMLElement} t
 * @param {string} cls Clases separadas por espacio
 */
const addClass = (t, cls) => el(t)?.classList.add(...cls.split(" "));

/**
 * Remueve una o varias clases
 * @param {string|HTMLElement} t
 * @param {string} cls
 */
const removeClass = (t, cls) =>
  el(t)?.classList.remove(...cls.split(" "));

/**
 * Alterna una clase
 * @param {string|HTMLElement} t
 * @param {string} cls
 */
const toggleClass = (t, cls) => el(t)?.classList.toggle(cls);

/**
 * Verifica si tiene una clase
 * @param {string|HTMLElement} t
 * @param {string} cls
 * @returns {boolean}
 */
const hasClass = (t, cls) => el(t)?.classList.contains(cls) || false;

/* =====================================================
   VALORES
===================================================== */

/**
 * Obtiene o establece el valor de un input
 * @param {string|HTMLElement} t
 * @param {*} [value]
 * @returns {*}
 */
const val = (t, value = undefined) => {
  const e = el(t);
  if (!e) return;
  if (value === undefined) return e.value;
  e.value = value;
};

/**
 * Limpia el valor de un input
 * @param {string|HTMLElement} t
 */
const clearVal = (t) => {
  const e = el(t);
  if (e) e.value = "";
};

/* =====================================================
   DATA ATTRIBUTES
===================================================== */

/**
 * Obtiene o establece un data-attribute
 * @param {string|HTMLElement} t
 * @param {string} key
 * @param {*} [value]
 * @returns {*}
 */
const data = (t, key, value = undefined) => {
  const e = el(t);
  if (!e) return;
  if (value === undefined) return e.dataset[key];
  e.dataset[key] = value;
};

/* =====================================================
   EVENTOS
===================================================== */

/**
 * Asigna un evento
 * @param {string|HTMLElement} t
 * @param {string} evt
 * @param {Function} cb
 */
const on = (t, evt, cb) => el(t)?.addEventListener(evt, cb);

/**
 * Remueve un evento
 * @param {string|HTMLElement} t
 * @param {string} evt
 * @param {Function} [cb]
 */
const off = (t, evt, cb = null) => {
  const e = el(t);
  if (!e) return;

  if (cb) e.removeEventListener(evt, cb);
  else {
    const clone = e.cloneNode(true);
    e.parentNode?.replaceChild(clone, e);
  }
};

/* =====================================================
   CAMBIO DE VISTAS
===================================================== */

/**
 * Oculta un elemento y muestra otro
 * @param {string|HTMLElement} hideTarget
 * @param {string|HTMLElement} showTarget
 */
const changeDiv = (hideTarget, showTarget) => {
  hide(hideTarget);
  show(showTarget);
};

/* =====================================================
   EXPORT
===================================================== */

export default {
  el,

  // Visibilidad
  show,
  hide,
  toggle,
  isVisible,
  isHidden,

  // Estados
  enable,
  disable,
  toggleDisabled,

  // Contenido
  html,
  text,
  clear,

  // Clases
  addClass,
  removeClass,
  toggleClass,
  hasClass,

  // Valores
  val,
  clearVal,

  // Data
  data,

  // Eventos
  on,
  off,

  // Vistas
  changeDiv,
};
