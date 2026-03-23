/**
 * @module Select2
 * @description
 * Helper para Select2 con Bootstrap 5 en HR Library.
 * Auto-inicialización, control de valores y eventos.
 * Detecta si el select está dentro de un modal y ajusta dropdownParent.
 *
 * @example
 * Select2.init();
 * Select2.setValue("#pais", "DO");
 * Select2.clear("#pais");
 * Select2.onChange("#pais", (val) => console.log(val));
 *
 * @version 3.0.0
 */

import $      from "jquery";
import config from "../core/config.js";

/* ── Config base Select2 ── */
const _S2_BASE = Object.freeze({
  theme:       "bootstrap-5",
  width:       "100%",
  allowClear:  true,
  language: {
    errorLoading:    () => "No se pudieron cargar los resultados.",
    inputTooLong:    ({ maximum, input }) => `Por favor, elimine ${input.length - maximum} caractere(s).`,
    inputTooShort:   ({ minimum }) => `Por favor, ingrese ${minimum} o más caracteres.`,
    loadingMore:     () => "Cargando más resultados...",
    maximumSelected: ({ maximum }) => `Solo puede seleccionar ${maximum} opción(es).`,
    noResults:       () => "No se encontraron resultados.",
    searching:       () => "Buscando...",
    removeAllItems:  () => "Eliminar todos los elementos.",
  },
  placeholder: "Seleccione una opción",
});

/* ── Helpers privados ── */
const _isInit   = ($el)  => $el.hasClass("select2-hidden-accessible");
const _destroy  = ($el)  => { if (_isInit($el)) $el.select2("destroy"); };

/* ── Select2 ── */

const Select2 = {

  /* ── Inicialización ── */

  /**
   * Inicializa Select2 en todos los `<select class="select2">` del scope.
   * Detecta modales y ajusta dropdownParent automáticamente.
   *
   * @param {HTMLElement|Document} [scope=document]
   * @param {Object} [options={}]  Opciones adicionales de Select2.
   */
  init(scope = document, options = {}) {
    if (typeof $.fn.select2 === "undefined") {
      console.warn("[Select2] Select2 no está disponible.");
      return;
    }

    $(scope).find("select.select2").each(function () {
      const $select     = $(this);
      const parentModal = $select.closest(".modal");

      _destroy($select);

      $select.select2({
        ..._S2_BASE,
        placeholder:    $select.data("placeholder") || _S2_BASE.placeholder,
        dropdownParent: parentModal.length ? parentModal : $(document.body),
        ...options,
      });
    });
  },

  /* ── Control de valores ── */

  /** @param {string|HTMLElement|Object} el @returns {string|string[]|null} */
  getValue: (el) => $(el).val() ?? null,

  /**
   * Establece el valor de un Select2.
   * @param {string|HTMLElement|Object} el
   * @param {*} value
   * @param {boolean} [trigger=true]  Dispara evento change.
   */
  setValue(el, value, trigger = true) {
    const $el = $(el);
    if (!$el.length) return;
    $el.val(value);
    if (trigger) $el.trigger("change");
  },

  /** Limpia el valor del Select2. */
  clear: (el) => Select2.setValue(el, null),

  /* ── Estado ── */

  enable:  (el) => $(el).prop("disabled", false).trigger("change"),
  disable: (el) => $(el).prop("disabled", true).trigger("change"),
  reload:  (el) => $(el).trigger("change"),

  /* ── Eventos ── */

  /**
   * Registra un callback al cambiar el valor.
   * @param {string|HTMLElement|Object} el
   * @param {Function} callback  `(value) => void`
   */
  onChange(el, callback) {
    if (typeof callback !== "function") return;
    $(el).on("change", function () { callback($(this).val()); });
  },
};

export default Object.freeze(Select2);
