import { Modal } from "bootstrap";
import dom from "./dom_helper";

/**
 * @namespace modal
 * @description Helper para manejo de modales Bootstrap 5
 */

const instances = new Map();

/* =====================================================
   UTILIDADES
===================================================== */

/**
 * Normaliza un modal a HTMLElement
 * @param {string|HTMLElement} modal
 * @returns {HTMLElement|null}
 */
const resolve = (modal) => {
  if (!modal) return null;
  if (modal instanceof HTMLElement) return modal;
  return dom.el(modal);
};

/**
 * Obtiene o crea instancia Bootstrap Modal
 * @param {HTMLElement} el
 * @returns {Modal}
 */
const getInstance = (el) => {
  if (!instances.has(el)) {
    instances.set(el, new Modal(el));
  }
  return instances.get(el);
};

/* =====================================================
   API PÚBLICA
===================================================== */

/**
 * Abre un modal
 * @param {string|HTMLElement} modal
 * @param {Object} [data]
 */
const open = (modal, data = {}) => {
  const el = resolve(modal);
  if (!el) return;

  el.__data = data;
  getInstance(el).show();
};

/**
 * Cierra un modal
 * @param {string|HTMLElement} modal
 */
const close = (modal) => {
  const el = resolve(modal);
  if (!el) return;

  getInstance(el).hide();
};

/**
 * Alterna un modal
 * @param {string|HTMLElement} modal
 */
const toggle = (modal) => {
  const el = resolve(modal);
  if (!el) return;

  getInstance(el).toggle();
};

/**
 * Obtiene los datos pasados al modal
 * @param {string|HTMLElement} modal
 * @returns {Object|null}
 */
const data = (modal) => {
  const el = resolve(modal);
  return el?.__data ?? null;
};

export default {
  open,
  close,
  toggle,
  data,
};
