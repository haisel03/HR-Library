import SimpleBar from "simplebar";
import Config from "../core/config";

/**
 * Configuración del sidebar
 * @type {SidebarConfig}
 */
const config = Config.sidebar;

/**
 * @module sidebar
 * @description
 * Helper para manejar el comportamiento del sidebar:
 * colapso, expansión, toggle y scroll con SimpleBar.
 */

/**
 * @typedef {Object} SidebarConfig
 * @property {string} sidebarSelector Selector del sidebar
 * @property {string} toggleSelector Selector del botón toggle
 * @property {string} simplebarSelector Selector del contenedor con SimpleBar
 * @property {string} collapseClass Clase CSS que define el estado colapsado
 */

const Sidebar = (() => {
  /** @type {SimpleBar|null} */
  let simplebarInstance = null;

  /* =====================================================
     UTILIDADES PRIVADAS
  ===================================================== */

  /**
   * Obtiene el elemento sidebar
   * @returns {HTMLElement|null}
   */
  const getSidebar = () =>
    document.querySelector(config.sidebarSelector);

  /**
   * Obtiene el botón toggle
   * @returns {HTMLElement|null}
   */
  const getToggle = () =>
    document.querySelector(config.toggleSelector);

  /**
   * Dispara un evento resize al finalizar una transición CSS
   * @param {HTMLElement} el
   */
  const dispatchResizeOnTransitionEnd = (el) => {
    el.addEventListener(
      "transitionend",
      () => window.dispatchEvent(new Event("resize")),
      { once: true }
    );
  };

  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  /**
   * Inicializa el sidebar
   * @param {Partial<SidebarConfig>} [customConfig={}]
   */
  const init = (customConfig = {}) => {
    Object.assign(config, customConfig);
    initScroll();
    initToggle();
  };

  /**
   * Inicializa SimpleBar y escucha cambios en collapses internos
   */
  const initScroll = () => {
    const el = document.querySelector(config.simplebarSelector);
    if (!el) return;

    if (!simplebarInstance) {
      simplebarInstance = new SimpleBar(el);
    }

    document
      .querySelectorAll(`${config.sidebarSelector} [data-bs-parent]`)
      .forEach((collapse) => {
        collapse.addEventListener("shown.bs.collapse", refresh);
        collapse.addEventListener("hidden.bs.collapse", refresh);
      });
  };

  /**
   * Inicializa el botón toggle del sidebar
   */
  const initToggle = () => {
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest(config.toggleSelector);
      const sidebar = getSidebar();

      if (toggle && sidebar) {
        toggleSidebar();
        dispatchResizeOnTransitionEnd(sidebar);
      }
    });
  };

  /* =====================================================
     API PÚBLICA
  ===================================================== */

  /**
   * Colapsa el sidebar
   */
  const collapse = () => {
    getSidebar()?.classList.add(config.collapseClass);
  };

  /**
   * Expande el sidebar
   */
  const expand = () => {
    getSidebar()?.classList.remove(config.collapseClass);
  };

  /**
   * Alterna el estado del sidebar
   */
  const toggleSidebar = () => {
    const sidebar = getSidebar();
    if (sidebar) {
      sidebar.classList.toggle(config.collapseClass);
    }
  };

  /**
   * Recalcula el tamaño del SimpleBar
   */
  const refresh = () => {
    simplebarInstance?.recalculate();
  };

  /**
   * Indica si el sidebar está colapsado
   * @returns {boolean}
   */
  const isCollapsed = () =>
    getSidebar()?.classList.contains(config.collapseClass) ?? false;

  return {
    init,
    collapse,
    expand,
    toggle: toggleSidebar,
    refresh,
    isCollapsed,
  };
})();

export default Sidebar;
