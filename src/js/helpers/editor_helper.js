import Quill from "quill";
import config from "../core/config";

/**
 * @namespace editor
 * @description Helper para editores WYSIWYG usando Quill
 */
const editor = (() => {
  /** @type {Map<HTMLElement, Quill>} */
  const instances = new Map();

  /* =====================================================
     CORE
  ===================================================== */

  /**
   * Inicializa editores Quill
   *
   * @param {HTMLElement|Document} scope
   */
  const init = (scope = document) => {
    scope.querySelectorAll("[data-editor='quill']").forEach((el) => {
      create(el);
    });
  };

  /**
   * Crea un editor Quill
   *
   * @param {HTMLElement|string} el
   * @param {Object} [options]
   * @returns {Quill|null}
   */
  const create = (el, options = {}) => {
    const container =
      typeof el === "string" ? document.querySelector(el) : el;

    if (!container || instances.has(container)) return null;

    const theme = container.dataset.theme || config.editor.theme;

    const quill = new Quill(container, {
      theme,
      ...config.editor.base,
      ...options,
    });

    instances.set(container, quill);
    return quill;
  };

  /**
   * Retorna el contenido HTML del editor
   *
   * @param {HTMLElement|string} el
   * @returns {string}
   */
  const getHtml = (el) => {
    const q = get(el);
    return q ? q.root.innerHTML : "";
  };

  /**
   * Establece contenido HTML
   *
   * @param {HTMLElement|string} el
   * @param {string} html
   */
  const setHtml = (el, html) => {
    const q = get(el);
    if (q) q.root.innerHTML = html;
  };

  /**
   * Retorna instancia Quill
   *
   * @param {HTMLElement|string} el
   * @returns {Quill|null}
   */
  const get = (el) => {
    const container =
      typeof el === "string" ? document.querySelector(el) : el;

    return instances.get(container) ?? null;
  };

  /**
   * Destruye un editor
   *
   * @param {HTMLElement|string} el
   */
  const destroy = (el) => {
    const container =
      typeof el === "string" ? document.querySelector(el) : el;

    if (instances.has(container)) {
      instances.delete(container);
      container.innerHTML = "";
    }
  };

  return {
    init,
    create,
    get,
    getHtml,
    setHtml,
    destroy,
  };
})();

export default editor;
