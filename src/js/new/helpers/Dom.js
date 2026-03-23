/**
 * @module Dom
 * @description
 * Helper de utilidades DOM para HR Library.
 * Fusiona la versión extendida de V1 (qa, dispatch, createElement, traversal)
 * con la claridad y compacidad de V2.
 *
 * @example
 * Dom.hide("#modal");
 * Dom.text("#titulo", "Bienvenido");
 * Dom.on("#btn", "click", () => console.log("click"));
 * Dom.qa(".fila").forEach(el => Dom.hide(el));
 *
 * @version 3.0.0
 */

const HIDDEN_CLASS = "d-none";

/* ── Normalizador ── */

/**
 * Normaliza un target a un elemento DOM.
 * Acepta selector CSS, ID sin prefijo, HTMLElement, document o window.
 * @param {string|HTMLElement|Window|Document|null|undefined} target
 * @returns {HTMLElement|Window|Document|null}
 */
const _el = (target) => {
  if (!target) return null;
  if (target instanceof HTMLElement || target === document || target === window) return target;
  if (typeof target === "string") {
    return (target.startsWith("#") || target.startsWith("."))
      ? document.querySelector(target)
      : document.getElementById(target);
  }
  return null;
};

/* ── Dom ── */

const Dom = {

  /* ── Selección ── */

  /**
   * Normaliza un target a elemento DOM.
   * @param {string|HTMLElement|Window|Document|null} target
   * @returns {HTMLElement|Window|Document|null}
   */
  el: _el,

  /**
   * Selecciona el primer elemento que coincida.
   * @param {string} selector
   * @param {HTMLElement|Document} [context=document]
   * @returns {HTMLElement|null}
   */
  q: (selector, context = document) => context.querySelector(selector),

  /**
   * Selecciona todos los elementos que coincidan.
   * @param {string} selector
   * @param {HTMLElement|Document} [context=document]
   * @returns {HTMLElement[]}
   */
  qa: (selector, context = document) => Array.from(context.querySelectorAll(selector)),

  /* ── Visibilidad ── */

  show:          (t) => _el(t)?.classList.remove(HIDDEN_CLASS),
  hide:          (t) => _el(t)?.classList.add(HIDDEN_CLASS),
  toggle:        (t) => _el(t)?.classList.toggle(HIDDEN_CLASS),
  isHidden:      (t) => _el(t)?.classList.contains(HIDDEN_CLASS) ?? true,
  isVisible:     (t) => {
    const e = _el(t);
    if (!e) return false;
    return e.offsetWidth > 0 && e.offsetHeight > 0 &&
           getComputedStyle(e).display !== "none" &&
           getComputedStyle(e).visibility !== "hidden";
  },

  /* ── Estado ── */

  enable:         (t) => { const e = _el(t); if (e) e.disabled = false; },
  disable:        (t) => { const e = _el(t); if (e) e.disabled = true; },
  toggleDisabled: (t) => { const e = _el(t); if (e) e.disabled = !e.disabled; },
  isDisabled:     (t) => !!(_el(t)?.disabled),

  /* ── Contenido ── */

  /**
   * Getter/setter de innerHTML.
   * @param {string|HTMLElement} t
   * @param {string} [html]
   * @returns {string|null}
   */
  html: (t, html) => {
    const e = _el(t);
    if (!e) return null;
    if (html !== undefined) { e.innerHTML = html; return null; }
    return e.innerHTML;
  },

  /**
   * Getter/setter de textContent.
   * @param {string|HTMLElement} t
   * @param {string} [text]
   * @returns {string|null}
   */
  text: (t, text) => {
    const e = _el(t);
    if (!e) return null;
    if (text !== undefined) { e.textContent = text; return null; }
    return e.textContent;
  },

  /**
   * Getter/setter de value.
   * @param {string|HTMLElement} t
   * @param {string|number} [value]
   * @returns {string|null}
   */
  val: (t, value) => {
    const e = _el(t);
    if (!e) return null;
    if (value !== undefined) { e.value = value; return null; }
    return e.value;
  },

  clear:     (t) => { const e = _el(t); if (e) e.innerHTML = ""; },
  clearVal:  (t) => { const e = _el(t); if (e) e.value = ""; },
  changeDiv: (t, h) => Dom.html(t, h),

  /* ── Clases ── */

  addClass:    (t, classes) => {
    const e = _el(t);
    if (!e) return;
    Array.isArray(classes) ? e.classList.add(...classes) : e.classList.add(classes);
  },
  removeClass: (t, classes) => {
    const e = _el(t);
    if (!e) return;
    Array.isArray(classes) ? e.classList.remove(...classes) : e.classList.remove(classes);
  },
  toggleClass: (t, className) => _el(t)?.classList.toggle(className),
  hasClass:    (t, className) => !!(_el(t)?.classList.contains(className)),

  /* ── Atributos ── */

  /**
   * Getter/setter de atributo. Acepta mapa para multi-set.
   * @param {string|HTMLElement} t
   * @param {string|Object} attr
   * @param {string} [value]
   * @returns {string|null}
   */
  attr: (t, attr, value) => {
    const e = _el(t);
    if (!e) return null;
    if (typeof attr === "object") { Object.entries(attr).forEach(([k, v]) => e.setAttribute(k, v)); return null; }
    if (value !== undefined) { e.setAttribute(attr, value); return null; }
    return e.getAttribute(attr);
  },
  removeAttr: (t, attr) => _el(t)?.removeAttribute(attr),

  /**
   * Getter/setter de dataset.
   * @param {string|HTMLElement} t
   * @param {string} key
   * @param {*} [value]
   */
  data: (t, key, value) => {
    const e = _el(t);
    if (!e) return null;
    if (value !== undefined) { e.dataset[key] = value; return null; }
    return e.dataset[key] ?? null;
  },

  /* ── Eventos ── */

  /**
   * Agrega listener de evento.
   * @param {string|HTMLElement} t
   * @param {string} eventType
   * @param {Function} handler
   */
  on:  (t, eventType, handler) => _el(t)?.addEventListener(eventType, handler),

  /**
   * Elimina listener de evento.
   * @param {string|HTMLElement} t
   * @param {string} eventType
   * @param {Function} handler
   */
  off: (t, eventType, handler) => _el(t)?.removeEventListener(eventType, handler),

  /**
   * Dispara un evento personalizado.
   * @param {string|HTMLElement} t
   * @param {string} eventType
   * @param {*} [detail]
   * @example Dom.dispatch("#form", "hr:guardado", { id: 5 });
   */
  dispatch: (t, eventType, detail) => {
    _el(t)?.dispatchEvent(new CustomEvent(eventType, { detail, bubbles: true }));
  },

  /* ── Traversal ── */

  find:    (t, selector) => { const e = _el(t); return e ? Array.from(e.querySelectorAll(selector)) : []; },
  findOne: (t, selector) => _el(t)?.querySelector(selector) ?? null,
  parent:  (t)           => _el(t)?.parentElement ?? null,
  is:      (t, selector) => !!(_el(t)?.matches(selector)),

  /* ── Creación ── */

  /**
   * Crea un elemento DOM desde HTML string.
   * @param {string} html
   * @returns {HTMLElement|null}
   * @example const btn = Dom.createElement('<button class="btn">Guardar</button>');
   */
  createElement: (html) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild ?? null;
  },

  /**
   * Crea múltiples elementos DOM desde HTML string.
   * @param {string} html
   * @returns {HTMLElement[]}
   */
  createAll: (html) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return Array.from(tpl.content.children);
  },

  /* ── DOM Ready ── */

  /**
   * Ejecuta callback cuando el DOM esté listo.
   * Si ya está listo, lo ejecuta de inmediato.
   * @param {Function} callback
   */
  ready: (callback) => {
    document.readyState !== "loading"
      ? callback()
      : document.addEventListener("DOMContentLoaded", callback);
  },

  /** @returns {void} */
  init() {},
};

export default Object.freeze(Dom);
