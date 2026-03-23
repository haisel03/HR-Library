/**
 * @module Dinero
 * @description
 * Helper para formateo, conversión y operaciones con valores monetarios.
 * Depende de Config (locale, monedas) y Num (redondeo, formateo).
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 2.1.0
 *
 * @example
 * import Dinero from "./Dinero.js";
 *
 * Dinero.format(1500);           // "$ 1,500.00"
 * Dinero.format(1500, "U");      // "$ 1,500.00" (USD)
 * Dinero.convert(100, 58.5);     // 5850
 * Dinero.percent(1000, 18);      // 180
 */

import Config from "./Config.js";
import Num from "./Num.js";

// ─────────────────────────────────────────────
// Dinero
// ─────────────────────────────────────────────

/**
 * @namespace Dinero
 */
const Dinero = {

  // ── Configuración ─────────────────────────────────────────────────────

  /**
   * Retorna el símbolo de una moneda por su código.
   * @param {string} code - Código de moneda configurado en Config.monedas.
   * @returns {string} Símbolo o cadena vacía si no existe.
   *
   * @example
   * Dinero.getSymbol("P"); // "RD$"
   * Dinero.getSymbol("U"); // "$"
   */
  getSymbol: (code) => Config.monedas?.[code] ?? "",

  /**
   * Retorna el locale configurado para formateo numérico.
   * @returns {string}
   *
   * @example
   * Dinero.getLocale(); // "es-DO"
   */
  getLocale: () => Config.app?.locale ?? "es-DO",

  // ── Formateo ──────────────────────────────────────────────────────────

  /**
   * Formatea un valor monetario con símbolo de moneda.
   * @param {number|string} value
   * @param {string} [code="P"] - Código de moneda.
   * @param {number} [decimals=2]
   * @returns {string} Valor formateado o "" si es inválido.
   *
   * @example
   * Dinero.format(1500);       // "RD$ 1,500.00"
   * Dinero.format(1500, "U");  // "$ 1,500.00"
   */
  format: (value, code = "P", decimals = 2) => {
    const symbol = Dinero.getSymbol(code);
    const locale = Dinero.getLocale();
    const n = Num.format(value, decimals, locale);
    return n ? `${symbol} ${n}` : "";
  },

  /**
   * Formatea un valor numérico sin símbolo de moneda.
   * @param {number|string} value
   * @param {number} [decimals=2]
   * @returns {string}
   *
   * @example
   * Dinero.formatNumber(1500); // "1,500.00"
   */
  formatNumber: (value, decimals = 2) => {
    const locale = Dinero.getLocale();
    return Num.format(value, decimals, locale);
  },

  // ── Conversión ────────────────────────────────────────────────────────

  /**
   * Convierte un monto aplicando una tasa de cambio.
   * @param {number|string} value
   * @param {number} rate
   * @param {number} [decimals=2]
   * @returns {number|null} Resultado o null si el valor es inválido.
   *
   * @example
   * Dinero.convert(100, 58.5); // 5850
   */
  convert: (value, rate, decimals = 2) => {
    const n = Num.toNumber(value);
    if (n === null) return null;
    return Num.round(n * rate, decimals);
  },

  /**
   * Convierte un monto y lo retorna formateado con símbolo.
   * @param {number|string} value
   * @param {number} rate
   * @param {string} [code="P"]
   * @param {number} [decimals=2]
   * @returns {string}
   *
   * @example
   * Dinero.convertAndFormat(100, 58.5, "P"); // "RD$ 5,850.00"
   */
  convertAndFormat: (value, rate, code = "P", decimals = 2) => {
    const converted = Dinero.convert(value, rate, decimals);
    if (converted === null) return "";
    return Dinero.format(converted, code, decimals);
  },

  // ── Parsing ───────────────────────────────────────────────────────────

  /**
   * Convierte un string monetario a número limpio.
   * Elimina símbolos de moneda, espacios y separadores de miles.
   *
   * @param {string|number} value
   * @returns {number|null}
   *
   * @example
   * Dinero.parse("RD$ 1,200.50"); // 1200.50
   * Dinero.parse(1500);           // 1500
   */
  parse: (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    return Num.toNumber(value);
  },

  /**
   * Verifica si un valor es un monto monetario válido.
   * @param {*} value
   * @returns {boolean}
   *
   * @example
   * Dinero.isValid("1,500.00"); // true
   * Dinero.isValid("abc");      // false
   */
  isValid: (value) => {
    const n = Dinero.parse(value);
    return n !== null && Number.isFinite(n);
  },

  // ── Operaciones ───────────────────────────────────────────────────────

  /**
   * Suma múltiples valores monetarios.
   * Ignora valores inválidos (los trata como 0).
   *
   * @param {...(number|string)} values
   * @returns {number}
   *
   * @example
   * Dinero.sum(10, "20", "$ 30"); // 60
   */
  sum: (...values) =>
    values.reduce((acc, val) => acc + (Dinero.parse(val) ?? 0), 0),

  /**
   * Resta dos valores monetarios.
   * @param {number|string} a
   * @param {number|string} b
   * @returns {number}
   *
   * @example
   * Dinero.subtract(100, 30); // 70
   */
  subtract: (a, b) => (Dinero.parse(a) ?? 0) - (Dinero.parse(b) ?? 0),

  /**
   * Calcula el porcentaje de un monto.
   * @param {number|string} value
   * @param {number} percent
   * @param {number} [decimals=2]
   * @returns {number|null}
   *
   * @example
   * Dinero.percent(1000, 18); // 180
   * Dinero.percent(1000, 18, 0); // 180
   */
  percent: (value, percent, decimals = 2) => {
    const n = Dinero.parse(value);
    if (n === null) return null;
    return Num.round(n * (percent / 100), decimals);
  },

  // ── Init ──────────────────────────────────────────────────────────────

  /**
   * Punto de entrada del helper. Reservado para Init.js.
   * @returns {void}
   */
  init() { },

};

export default Object.freeze(Dinero);
