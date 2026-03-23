/**
 * @module Drag
 * @description
 * Helper para drag & drop usando Dragula en HR Library.
 * Gestiona instancias con clave, callbacks de eventos y cleanup.
 *
 * @example
 * Drag.create("kanban", [col1, col2, col3]);
 * Drag.onDrop("kanban", (el, target, source) => {
 *   Api.patch(`/tareas/${el.dataset.id}`, { columna: target.id });
 * });
 * Drag.addContainer("kanban", document.getElementById("archivados"));
 * Drag.destroy("kanban");
 *
 * @version 3.0.0
 */

import dragula from "dragula";

/** Mapa de instancias activas: clave → drake. @private */
const _instances = new Map();

const Drag = {

  /**
   * Crea una instancia Dragula con clave identificadora.
   * Si ya existe con esa clave, la retorna sin duplicar.
   *
   * @param {string}        key         Identificador único del grupo drag.
   * @param {HTMLElement[]} containers  Contenedores arrastrables.
   * @param {Object}        [options={}] Opciones de Dragula.
   * @returns {Object} Instancia drake.
   *
   * @example
   * const drake = Drag.create("tareas", [
   *   document.getElementById("pendientes"),
   *   document.getElementById("completadas"),
   * ]);
   */
  create(key, containers = [], options = {}) {
    if (_instances.has(key)) return _instances.get(key);
    const drake = dragula(containers, options);
    _instances.set(key, drake);
    return drake;
  },

  /** @param {string} key @returns {Object|null} */
  get: (key) => _instances.get(key) ?? null,

  /**
   * Destruye una instancia y la elimina del registro.
   * @param {string} key
   */
  destroy(key) {
    const drake = _instances.get(key);
    if (drake) { drake.destroy(); _instances.delete(key); }
  },

  /**
   * Agrega un contenedor a una instancia existente.
   * @param {string}      key
   * @param {HTMLElement} container
   */
  addContainer(key, container) {
    const drake = _instances.get(key);
    if (drake && container instanceof HTMLElement) {
      drake.containers.push(container);
    }
  },

  /**
   * Callback al soltar un elemento.
   * @param {string}   key
   * @param {Function} callback  `(el, target, source, sibling) => void`
   */
  onDrop(key, callback) {
    const drake = _instances.get(key);
    if (drake && typeof callback === "function") drake.on("drop", callback);
  },

  /**
   * Callback al comenzar a arrastrar.
   * @param {string}   key
   * @param {Function} callback  `(el, source) => void`
   */
  onDrag(key, callback) {
    const drake = _instances.get(key);
    if (drake && typeof callback === "function") drake.on("drag", callback);
  },

  /**
   * Callback al cancelar arrastre (revertOnSpill).
   * @param {string}   key
   * @param {Function} callback  `(el, container) => void`
   */
  onCancel(key, callback) {
    const drake = _instances.get(key);
    if (drake && typeof callback === "function") drake.on("cancel", callback);
  },

  /**
   * Callback al soltar fuera de contenedor válido.
   * @param {string}   key
   * @param {Function} callback  `(el, container) => void`
   */
  onSpill(key, callback) {
    const drake = _instances.get(key);
    if (drake && typeof callback === "function") drake.on("spill", callback);
  },

  /** Invocado por init.js */
  init() {},
};

export default Object.freeze(Drag);
