/**
 * @module Fullscreen
 * @description
 * Helper para manejo de pantalla completa en HR Library.
 * Soporta API nativa con fallbacks webkit/ms.
 * Auto-binding por `data-widget="fullscreen"` con sincronización de iconos.
 *
 * @example
 * Fullscreen.request();           // página completa
 * Fullscreen.toggle("#miPanel");  // alternar en elemento
 * Fullscreen.isActive();          // true | false
 * Fullscreen.onChange((activo) => console.log(activo ? "Entró" : "Salió"));
 *
 * @version 3.0.0
 */

import Dom from "./utils/Dom.js";

/* ── Helpers privados de API nativa ── */

const _requestFS = (el) =>
  el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.() ?? el.msRequestFullscreen?.();

const _exitFS = () =>
  document.exitFullscreen?.() ?? document.webkitExitFullscreen?.() ?? document.msExitFullscreen?.();

const _activeEl = () =>
  document.fullscreenElement ?? document.webkitFullscreenElement ?? document.msFullscreenElement ?? null;

/** Sincroniza iconos en botones [data-widget="fullscreen"]. @private */
const _syncIcons = () => {
  const isFS = _activeEl() !== null;
  Dom.qa('[data-widget="fullscreen"]').forEach((btn) => {
    const icon = btn.querySelector("i");
    if (!icon) return;
    icon.classList.toggle("bi-fullscreen",      !isFS);
    icon.classList.toggle("bi-fullscreen-exit",  isFS);
  });
};

const Fullscreen = {

  /**
   * Solicita pantalla completa en un elemento.
   * @param {string|HTMLElement} [target=document.documentElement]
   */
  request(target = document.documentElement) {
    const el = Dom.el(target) ?? document.documentElement;
    _requestFS(el);
  },

  /** Sale del modo pantalla completa. */
  exit() {
    if (this.isActive()) _exitFS();
  },

  /**
   * Alterna pantalla completa.
   * @param {string|HTMLElement} [target=document.documentElement]
   */
  toggle(target = document.documentElement) {
    this.isActive() ? this.exit() : this.request(target);
  },

  /** @returns {boolean} Si hay un elemento en pantalla completa. */
  isActive: () => _activeEl() !== null,

  /** @returns {Element|null} Elemento actualmente en pantalla completa. */
  getActive: () => _activeEl(),

  /**
   * Registra callback al cambiar estado de pantalla completa.
   * @param {Function} callback  `(isActive: boolean) => void`
   */
  onChange(callback) {
    if (typeof callback !== "function") return;
    const handler = () => callback(this.isActive());
    Dom.on(document, "fullscreenchange",       handler);
    Dom.on(document, "webkitfullscreenchange", handler);
    Dom.on(document, "msfullscreenchange",     handler);
  },

  /**
   * Inicializa binding automático para `[data-widget="fullscreen"]`
   * y sincronización de iconos.
   */
  init() {
    Dom.on(document, "click", (e) => {
      const btn = e.target.closest('[data-widget="fullscreen"]');
      if (!btn) return;
      e.preventDefault();
      this.toggle();
    });

    Dom.on(document, "fullscreenchange",       _syncIcons);
    Dom.on(document, "webkitfullscreenchange", _syncIcons);
    Dom.on(document, "msfullscreenchange",     _syncIcons);
  },
};

export default Object.freeze(Fullscreen);
