/**
 * @module Editor
 * @description
 * Helper para editores WYSIWYG Quill en HR Library.
 * Auto-inicialización por atributo, gestión de instancias, contenido y eventos.
 * Combina lo mejor de V1 (getText, isEmpty, onChange, setEnabled, destroy limpio)
 * con V2 (usa config.editor para las opciones base).
 *
 * @example
 * // Auto-init: <div data-editor="quill"></div>
 * Editor.init();
 *
 * // Manual
 * Editor.create("#descripcion");
 * Editor.setHtml("#descripcion", "<p>Hola</p>");
 * const html = Editor.getHtml("#descripcion");
 * Editor.onChange("#descripcion", (html) => console.log(html));
 *
 * @version 3.0.0
 */

import Quill  from "quill";
import config from "../core/config.js";

/** Mapa de instancias activas: HTMLElement → Quill. @private */
const _instances = new Map();

/** @param {string|HTMLElement} target @returns {HTMLElement|null} @private */
const _el = (target) => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  return document.querySelector(target);
};

const Editor = {

  /* ── Core ── */

  /**
   * Crea un editor Quill en un elemento.
   * Si ya existe una instancia, la retorna sin duplicar.
   *
   * @param {string|HTMLElement} target
   * @param {Object} [options={}]  Opciones Quill adicionales.
   * @returns {Quill|null}
   */
  create(target, options = {}) {
    const el = _el(target);
    if (!el) { console.warn("[Editor] Elemento no encontrado:", target); return null; }
    if (_instances.has(el)) return _instances.get(el);

    const theme = el.dataset.theme ?? config.editor.theme;
    const quill = new Quill(el, { ...config.editor.base, ...options, theme });

    _instances.set(el, quill);
    return quill;
  },

  /**
   * Retorna la instancia Quill de un elemento.
   * @param {string|HTMLElement} target
   * @returns {Quill|null}
   */
  get(target) {
    const el = _el(target);
    return _instances.get(el) ?? null;
  },

  /**
   * Destruye un editor y limpia el elemento.
   * @param {string|HTMLElement} target
   */
  destroy(target) {
    const el = _el(target);
    if (!el || !_instances.has(el)) return;
    const quill = _instances.get(el);
    const toolbar = quill.getModule("toolbar");
    if (toolbar?.container?.parentNode) toolbar.container.parentNode.removeChild(toolbar.container);
    _instances.delete(el);
    el.innerHTML = "";
  },

  /* ── Contenido ── */

  /** @param {string|HTMLElement} target @returns {string} */
  getHtml(target) {
    const q = this.get(target);
    return q ? q.root.innerHTML : "";
  },

  /** @param {string|HTMLElement} target @param {string} html */
  setHtml(target, html) {
    const q = this.get(target);
    if (q) q.root.innerHTML = html ?? "";
  },

  /** @param {string|HTMLElement} target @returns {string} Texto plano */
  getText(target) {
    const q = this.get(target);
    return q ? q.getText() : "";
  },

  /** @param {string|HTMLElement} target */
  clear(target) {
    const q = this.get(target);
    if (q) q.setContents([]);
  },

  /**
   * Verifica si el editor está vacío.
   * @param {string|HTMLElement} target
   * @returns {boolean}
   */
  isEmpty(target) {
    const text = this.getText(target).trim();
    return text === "" || text === "\n";
  },

  /**
   * Habilita o deshabilita el editor (modo lectura).
   * @param {string|HTMLElement} target
   * @param {boolean} [enabled=true]
   */
  setEnabled(target, enabled = true) {
    const q = this.get(target);
    if (q) q.enable(enabled);
  },

  /* ── Eventos ── */

  /**
   * Callback ejecutado al cambiar el contenido.
   * @param {string|HTMLElement} target
   * @param {Function} callback  `(html, text) => void`
   */
  onChange(target, callback) {
    const q = this.get(target);
    if (!q || typeof callback !== "function") return;
    q.on("text-change", () => callback(q.root.innerHTML, q.getText()));
  },

  /* ── Init ── */

  /**
   * Auto-inicializa elementos con `data-editor="quill"`.
   * @param {HTMLElement|Document} [scope=document]
   */
  init(scope = document) {
    if (typeof Quill === "undefined") { console.warn("[Editor] Quill no está disponible."); return; }
    scope.querySelectorAll("[data-editor='quill']").forEach((el) => this.create(el));
  },
};

export default Object.freeze(Editor);
