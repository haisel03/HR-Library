/**
 * @module Currency
 * @description
 * Helper para formateo, conversión y operaciones con valores monetarios.
 * Depende de config (locale, monedas) y NumberHelper (redondeo, formateo).
 *
 * @example
 * Currency.format(1500);            // "RD$ 1,500.00"
 * Currency.format(1500, "U");       // "USD$ 1,500.00"
 * Currency.convert(100, 58.5);      // 5850
 * Currency.percent(1000, 18);       // 180
 * Currency.sum(10, "20", "RD$ 30"); // 60
 *
 * @version 3.0.0
 */

import config       from "../core/config.js";
import NumberHelper from "./utils/Number.js";

const Currency = {

  /* ── Configuración ── */

  /** @param {string} code @returns {string} Símbolo de moneda o "" */
  getSymbol: (code) => config.monedas?.[code] ?? "",

  /** @returns {string} Locale configurado */
  getLocale: () => config.formats?.locale ?? config.app?.locale ?? "es-DO",

  /* ── Formateo ── */

  /**
   * Formatea un valor monetario con símbolo de moneda.
   * @param {number|string} value
   * @param {string} [code="P"]  Código: "P"=RD$, "U"=USD$, "E"=EUR€
   * @param {number} [decimals=2]
   * @returns {string}
   * @example Currency.format(1500);       // "RD$ 1,500.00"
   * @example Currency.format(1500, "U");  // "USD$ 1,500.00"
   */
  format: (value, code = "P", decimals = 2) => {
    const symbol = Currency.getSymbol(code);
    const n      = NumberHelper.formatNumber(value, decimals, Currency.getLocale());
    return n ? `${symbol} ${n}` : "";
  },

  /**
   * Formatea un valor numérico sin símbolo de moneda.
   * @param {number|string} value @param {number} [decimals=2] @returns {string}
   */
  formatNumber: (value, decimals = 2) =>
    NumberHelper.formatNumber(value, decimals, Currency.getLocale()),

  /* ── Conversión ── */

  /**
   * Convierte un monto aplicando una tasa de cambio.
   * @param {number|string} value @param {number} rate @param {number} [decimals=2]
   * @returns {number|null}
   * @example Currency.convert(100, 58.5); // 5850
   */
  convert: (value, rate, decimals = 2) => {
    const n = NumberHelper.toNumber(value);
    if (n === null) return null;
    return NumberHelper.round(n * rate, decimals);
  },

  /**
   * Convierte y formatea con símbolo.
   * @param {number|string} value @param {number} rate @param {string} [code="P"] @param {number} [decimals=2]
   * @returns {string}
   */
  convertAndFormat: (value, rate, code = "P", decimals = 2) => {
    const converted = Currency.convert(value, rate, decimals);
    if (converted === null) return "";
    return Currency.format(converted, code, decimals);
  },

  /* ── Parsing ── */

  /**
   * Convierte un string monetario a número limpio.
   * @param {string|number} value @returns {number|null}
   * @example Currency.parse("RD$ 1,200.50"); // 1200.50
   */
  parse: (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    return NumberHelper.toNumber(value);
  },

  /** @param {*} value @returns {boolean} */
  isValid: (value) => {
    const n = Currency.parse(value);
    return n !== null && Number.isFinite(n);
  },

  /* ── Operaciones ── */

  /**
   * Suma múltiples valores monetarios (ignora inválidos).
   * @param {...(number|string)} values @returns {number}
   * @example Currency.sum(10, "20", "RD$ 30"); // 60
   */
  sum: (...values) =>
    values.reduce((acc, val) => acc + (Currency.parse(val) ?? 0), 0),

  /**
   * Resta dos valores monetarios.
   * @param {number|string} a @param {number|string} b @returns {number}
   */
  subtract: (a, b) => (Currency.parse(a) ?? 0) - (Currency.parse(b) ?? 0),

  /**
   * Calcula el porcentaje de un monto.
   * @param {number|string} value @param {number} percent @param {number} [decimals=2]
   * @returns {number|null}
   * @example Currency.percent(1000, 18); // 180
   */
  percent: (value, percent, decimals = 2) => {
    const n = Currency.parse(value);
    if (n === null) return null;
    return NumberHelper.round(n * (percent / 100), decimals);
  },

  /** @returns {void} */
  init() {},
};

export default Object.freeze(Currency);
