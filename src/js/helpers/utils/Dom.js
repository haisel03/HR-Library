/**
 * @module Dom
 * @description DOM manipulation pura. Tree-shakeable, sin side-effects.
 * @version 3.0.0
 */

const Dom = {
  /**
   * Selector único ($).
   * @param {string} selector
   * @param {ParentNode} [scope=document]
   * @returns {Element|null}
   */
  el(selector, scope = document) {
    return scope.querySelector(selector);
  },

  /**
   * Selectores múltiples ($$).
   * @param {string} selector
   * @param {ParentNode} [scope=document]
   * @returns {NodeListOf<Element>}
   */
  qa(selector, scope = document) {
    return scope.querySelectorAll(selector);
  },

  /**
   * Muestra elemento.
   * @param {HTMLElement|string} el
   */
  show(el) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.style.display = "";
  },

  hide(el) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.style.display = "none";
  },

  toggle(el) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.style.display = e.style.display === "none" ? "" : "none";
  },

  /**
   * Toggle class.
   * @param {HTMLElement|string} el
   * @param {string} className
   */
  toggleClass(el, className) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.classList.toggle(className);
  },

  /**
   * Valor input/select.
   * @param {HTMLElement|string} el
   * @param {string} [value]
   * @returns {string}
   */
  val(el, value) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (!e) return "";
    if (value !== undefined) e.value = value;
    return e.value;
  },

  /**
   * Event listener.
   * @param {HTMLElement|string} el
   * @param {string} event
   * @param {Function} callback
   */
  on(el, event, callback) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.addEventListener(event, callback);
  },

  dispatch(el, eventType, detail = {}) {
    const e = typeof el === "string" ? Dom.el(el) : el;
    if (e) e.dispatchEvent(new CustomEvent(eventType, { detail, bubbles: true }));
  },
};

export default Object.freeze(Dom);

