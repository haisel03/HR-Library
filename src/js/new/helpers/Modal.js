/**
 * @module Modal
 * @description
 * Helper para manejo de modales Bootstrap 5 en Coffee Schools.
 * Gestiona instancias, datos entre apertura, callbacks y contenido dinámico.
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 2.1.0
 *
 * @example
 * import Modal from "./Modal.js";
 *
 * Modal.open("#modalUsuario", { id: 5, nombre: "Juan" });
 * const datos = Modal.getData("#modalUsuario"); // { id: 5, nombre: "Juan" }
 *
 * Modal.onClose("#modalUsuario", () => Form.clear("#formUsuario"));
 */

import { Modal as BsModal } from "bootstrap";
import Dom from "./Dom.js";

// ─────────────────────────────────────────────
// Registros internos
// ─────────────────────────────────────────────

/**
 * Instancias Bootstrap Modal activas.
 * @private
 */
const _instances = new Map();

/**
 * Datos pasados al abrir cada modal.
 * @private
 */
const _data = new Map();

// ─────────────────────────────────────────────
// Función privada de resolución
// ─────────────────────────────────────────────

/**
 * Normaliza un target a HTMLElement de modal.
 * @private
 * @param {string|HTMLElement} target
 * @returns {HTMLElement|null}
 */
const _el = (target) => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  return Dom.q(target);
};

/**
 * Obtiene o crea la instancia Bootstrap Modal de un elemento.
 * @private
 * @param {HTMLElement} el
 * @returns {BsModal}
 */
const _getInstance = (el) => {
  if (!_instances.has(el)) {
    _instances.set(el, new BsModal(el));
  }
  return _instances.get(el);
};

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────

/**
 * @namespace Modal
 */
const Modal = {

  // ── Apertura / Cierre ─────────────────────────────────────────────────

  /**
   * Abre un modal, opcionalmente pasando datos.
   * @param {string|HTMLElement} target
   * @param {Object} [data={}] - Datos accesibles con `Modal.getData()`.
   * @returns {void}
   *
   * @example
   * Modal.open("#modalEditar", { id: 10, nombre: "Ana" });
   */
  open(target, data = {}) {
    const el = _el(target);
    if (!el) {
      console.warn("[Modal] Elemento no encontrado:", target);
      return;
    }
    _data.set(el, data);
    _getInstance(el).show();
  },

  /**
   * Cierra un modal.
   * @param {string|HTMLElement} target
   * @returns {void}
   *
   * @example
   * Modal.close("#modalEditar");
   */
  close(target) {
    const el = _el(target);
    if (!el) return;
    _getInstance(el).hide();
  },

  /**
   * Alterna la visibilidad de un modal.
   * @param {string|HTMLElement} target
   * @returns {void}
   */
  toggle(target) {
    const el = _el(target);
    if (!el) return;
    _getInstance(el).toggle();
  },

  /**
   * Destruye la instancia del modal y limpia el registro.
   * @param {string|HTMLElement} target
   * @returns {void}
   */
  destroy(target) {
    const el = _el(target);
    if (!el) return;
    _instances.get(el)?.dispose();
    _instances.delete(el);
    _data.delete(el);
  },

  // ── Datos ─────────────────────────────────────────────────────────────

  /**
   * Retorna los datos pasados al abrir el modal.
   * @param {string|HTMLElement} target
   * @returns {Object}
   *
   * @example
   * const { id } = Modal.getData("#modalEditar");
   */
  getData(target) {
    const el = _el(target);
    return _data.get(el) ?? {};
  },

  // ── Contenido ─────────────────────────────────────────────────────────

  /**
   * Establece el título del modal (elemento `.modal-title`).
   * @param {string|HTMLElement} target
   * @param {string} title
   * @returns {void}
   *
   * @example
   * Modal.setTitle("#modalEditar", "Editar Usuario");
   */
  setTitle(target, title) {
    const el = _el(target);
    if (!el) return;
    const titleEl = Dom.q(".modal-title", el);
    if (titleEl) titleEl.textContent = title;
  },

  /**
   * Establece el contenido HTML del cuerpo del modal (`.modal-body`).
   * @param {string|HTMLElement} target
   * @param {string} html
   * @returns {void}
   *
   * @example
   * Modal.setBody("#modalVer", "<p>Detalles del registro...</p>");
   */
  setBody(target, html) {
    const el = _el(target);
    if (!el) return;
    const body = Dom.q(".modal-body", el);
    if (body) body.innerHTML = html;
  },

  /**
   * Establece título y cuerpo en una sola llamada.
   * @param {string|HTMLElement} target
   * @param {string} title
   * @param {string} html
   * @returns {void}
   *
   * @example
   * Modal.setContent("#modal", "Nuevo Registro", "<form>...</form>");
   */
  setContent(target, title, html) {
    this.setTitle(target, title);
    this.setBody(target, html);
  },

  // ── Eventos ───────────────────────────────────────────────────────────

  /**
   * Registra un callback que se ejecuta cuando el modal termina de cerrarse.
   * @param {string|HTMLElement} target
   * @param {Function} callback
   * @returns {void}
   *
   * @example
   * Modal.onClose("#modalEditar", () => Form.clear("#formEditar"));
   */
  onClose(target, callback) {
    const el = _el(target);
    if (!el || typeof callback !== "function") return;
    el.addEventListener("hidden.bs.modal", callback, { once: false });
  },

  /**
   * Registra un callback que se ejecuta cuando el modal termina de abrirse.
   * @param {string|HTMLElement} target
   * @param {Function} callback
   * @returns {void}
   *
   * @example
   * Modal.onOpen("#modalEditar", () => Dom.q("#nombre").focus());
   */
  onOpen(target, callback) {
    const el = _el(target);
    if (!el || typeof callback !== "function") return;
    el.addEventListener("shown.bs.modal", callback, { once: false });
  },

  // ── Init ──────────────────────────────────────────────────────────────

  /**
   * Punto de entrada del helper. Reservado para Init.js.
   * @returns {void}
   */
  init() {},

};

export default Object.freeze(Modal);
