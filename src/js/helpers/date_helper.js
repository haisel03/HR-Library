/**
 * @module date
 * @description
 * Helper de fechas como capa de normalización.
 * No reemplaza Humanizer, FullCalendar ni Flatpickr.
 * Centraliza formatos, conversiones y utilidades comunes.
 */

import config from "../core/config";
import flatpickr from "flatpickr";

/**
 * Helper de fechas
 * @namespace date
 */
const date = {
  /* =====================================================
     BASICOS
  ===================================================== */

  /**
   * Devuelve la fecha actual
   * @returns {Date}
   */
  now: () => new Date(),

  /**
   * Crea un objeto Date seguro
   * @param {Date|string|number} value
   * @returns {Date|null}
   */
  create: (value) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  },

  /**
   * Verifica si un valor es una fecha válida
   * @param {Date|string|number} value
   * @returns {boolean}
   */
  isValid: (value) => {
    const d = new Date(value);
    return !isNaN(d.getTime());
  },

  /* =====================================================
     FORMATOS CENTRALIZADOS
  ===================================================== */

  /**
   * Formatea una fecha usando los formatos del config
   * (uso general, no UI compleja)
   *
   * @param {Date|string|number} value
   * @param {"date"|"datetime"} [type="date"]
   * @param {string} [locale=config.formats.locale]
   * @returns {string}
   *
   * @example date.format("2025-01-01")
   * @example date.format(new Date(), "datetime")
   */
  format: (value, type = "date", locale = config.formats.locale) => {
    const d = date.create(value);
    if (!d) return "";

    const options =
      type === "datetime"
        ? { dateStyle: "short", timeStyle: "short" }
        : { dateStyle: "short" };

    return new Intl.DateTimeFormat(locale, options).format(d);
  },

  /**
   * Convierte una fecha a ISO Date (YYYY-MM-DD)
   * Ideal para APIs y Flatpickr
   *
   * @param {Date|string|number} value
   * @returns {string}
   */
  toISODate: (value) => {
    const d = date.create(value);
    return d ? d.toISOString().split("T")[0] : "";
  },

  /**
   * Convierte una fecha a ISO Datetime completo
   * @param {Date|string|number} value
   * @returns {string}
   */
  toISOString: (value) => {
    const d = date.create(value);
    return d ? d.toISOString() : "";
  },

  /* =====================================================
     OPERACIONES
  ===================================================== */

  /**
   * Suma o resta días a una fecha
   * @param {Date|string|number} value
   * @param {number} days Puede ser negativo
   * @returns {Date|null}
   */
  addDays: (value, days) => {
    const d = date.create(value);
    if (!d) return null;
    d.setDate(d.getDate() + Number(days));
    return d;
  },

  /**
   * Calcula diferencia en días entre dos fechas
   * @param {Date|string|number} start
   * @param {Date|string|number} end
   * @returns {number|null}
   */
  diffDays: (start, end) => {
    const a = date.create(start);
    const b = date.create(end);
    if (!a || !b) return null;

    const diff = b.getTime() - a.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  /* =====================================================
     INTEGRACIONES
  ===================================================== */

  /**
   * Devuelve configuración base para Flatpickr
   * @param {Object} [overrides]
   * @returns {Object}
   *
   * @example flatpickr(el, date.flatpickr())
   */
  flatpickr: (overrides = {}) => ({
    dateFormat: "Y-m-d",
    locale: "es",
    allowInput: true,
    ...overrides,
  }),

  /**
   * Devuelve configuración base para FullCalendar
   * @param {Object} [overrides]
   * @returns {Object}
   */
  fullCalendar: (overrides = {}) => ({
    locale: "es",
    firstDay: 1,
    height: "auto",
    nowIndicator: true,
    ...overrides,
  }),
};

export default date;
