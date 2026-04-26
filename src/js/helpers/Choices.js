/**
 * @module Choices
 * @description Helper para usar la libreria  Choices.js en los selects
 */

import ChoicesLib from "choices.js";
import config from "../core/config.js";
import Dom from "./utils/Dom.js";

/**
 * @module Choices
 * @description Wrapper completo para Choices.js selects. Tree-shakeable.
 * @version 3.0.0
 * @example
 * const select = Choices.init("#miSelect", { searchEnabled: true });
 * select.setChoiceByValue("1");
 * select.destroy();
 */

const Choices = {
  /**
   * Inicializa Choices.js en elemento.
   * @param {string|HTMLElement} selector
   * @param {Object} [options={}]
   * @returns {Choices} instancia o null
   */
  init(selector, options = {}) {
    const el = Dom.el(selector);
    if (!el) return null;

    const defaults = {
      searchEnabled: true,
      itemSelectText: "",
      shouldSort: false,
      placeholder: true,
      ...config.choices || {},
      ...options
    };

    return new ChoicesLib(el, defaults);
  },

  /**
   * Inicializa múltiples selects en scope.
   * @param {HTMLElement|Document} [scope=document]
   */
  initAll(scope = document) {
    Dom.qa('select[data-choices]', scope).forEach((el) => {
      const opts = el.dataset.choices ? JSON.parse(el.dataset.choices) : {};
      Choices.init(el, opts);
    });
  },

  /**
   * Destruye instancia.
   * @param {Choices} instance
   */
  destroy(instance) {
    if (instance?.destroy) instance.destroy();
  },

  /**
   * Destruye todos en scope.
   * @param {HTMLElement|Document} [scope=document]
   */
  destroyAll(scope = document) {
    Dom.qa('.choices__inner', scope).forEach((container) => {
      const hidden = container.previousElementSibling;
      if (hidden?._choices) Choices.destroy(hidden._choices);
    });
  },
};

export default Object.freeze(Choices);
