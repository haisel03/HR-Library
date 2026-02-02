import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";
import "select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css";
import config from "../core/config";

/**
 * @namespace select2
 * @description Helper para inicializar y controlar Select2 con Bootstrap 5
 */

/* =====================================================
   CORE
===================================================== */

/**
 * Verifica si un select ya está inicializado con Select2
 * @param {JQuery} $el Elemento select
 * @returns {boolean}
 * @private
 */
const isInit = ($el) => $el.hasClass("select2-hidden-accessible");

/**
 * Destruye Select2 si está inicializado
 * @param {JQuery} $el Elemento select
 * @private
 */
const destroy = ($el) => {
  if (isInit($el)) {
    $el.select2("destroy");
  }
};

/* =====================================================
   INIT
===================================================== */

/**
 * Inicializa Select2 en todos los selects dentro del scope
 * que tengan la clase `.select2`
 *
 * @param {HTMLElement|Document} [scope=document] Contenedor donde buscar selects
 * @param {Object} [options={}] Opciones adicionales de Select2
 *
 * @example
 * select2.init();
 *
 * @example
 * select2.init(document, { minimumResultsForSearch: Infinity });
 */
const init = (scope = document, options = {}) => {
  $(scope)
    .find("select.select2")
    .each(function () {
      const $select = $(this);

      destroy($select);

      const parentModal = $select.closest(".modal");

      $select.select2({
        theme: config.select2.theme,
        width: config.select2.width,
        language: config.select2.language,
        placeholder:
          $select.data("placeholder") || config.select2.placeholder,
        allowClear: config.select2.allowClear,
        dropdownParent: parentModal.length
          ? parentModal
          : $(document.body),
        ...options,
      });
    });
};

/* =====================================================
   UTILIDADES
===================================================== */

/**
 * Establece el valor de un Select2
 * @param {string|HTMLElement|JQuery} el Select
 * @param {*} value Valor a asignar
 * @param {boolean} [trigger=true] Dispara evento change
 *
 * @example
 * select2.setValue("#country", "DO");
 */
const setValue = (el, value, trigger = true) => {
  const $el = $(el);
  if (!$el.length) return;

  $el.val(value);
  if (trigger) $el.trigger("change");
};

/**
 * Limpia el valor del Select2
 * @param {string|HTMLElement|JQuery} el Select
 *
 * @example
 * select2.clear("#country");
 */
const clear = (el) => setValue(el, null);

/**
 * Habilita un Select2
 * @param {string|HTMLElement|JQuery} el Select
 */
const enable = (el) => $(el).prop("disabled", false);

/**
 * Deshabilita un Select2
 * @param {string|HTMLElement|JQuery} el Select
 */
const disable = (el) => $(el).prop("disabled", true);

/**
 * Recarga el Select2 (útil para AJAX o cambios dinámicos)
 * @param {string|HTMLElement|JQuery} el Select
 */
const reload = (el) => $(el).trigger("change");

/* =====================================================
   EXPORT
===================================================== */

export default {
  init,
  setValue,
  clear,
  enable,
  disable,
  reload,
};
