/**
 * @module Number
 * @description
 * Utilidades numéricas para HR Library.
 * Combina la limpieza de conversión de V1 (elimina símbolos, comas) con
 * los cálculos extendidos de V2 (percent, percentOf, avg, sum, currency).
 *
 * Nota: Se llama `NumberHelper` internamente para evitar colisión con el built-in `Number`.
 *
 * @example
 * NumberHelper.formatNumber(1234567.89);     // "1,234,567.89"
 * NumberHelper.currency(50000, "P");         // "RD$ 50,000.00"
 * NumberHelper.toNumber("$ 1,200.50");       // 1200.50
 * NumberHelper.percent(0.75);               // "75%"
 * NumberHelper.avg([10, 20, 30]);           // 20
 *
 * @version 3.0.0
 */

import config from "../core/config.js";

const NumberHelper = {

  /* ── Conversión segura ── */

  /**
   * Convierte cualquier valor a número limpio (elimina símbolos y separadores de miles).
   * @param {*} n
   * @param {number|null} [defaultValue=null]
   * @returns {number|null}
   * @example NumberHelper.toNumber("$ 1,200.50"); // 1200.50
   * @example NumberHelper.toNumber("abc");        // null
   */
  toNumber: (n, defaultValue = null) => {
    if (n === null || n === undefined || n === "") return defaultValue;
    if (typeof n === "number") return Number.isFinite(n) ? n : defaultValue;
    const clean = String(n).replace(/[^\d.-]/g, "");
    const num   = parseFloat(clean);
    return isNaN(num) ? defaultValue : num;
  },

  /** @param {*} value @returns {boolean} Número finito válido */
  isValid: (value) => { const n = Number(value); return !isNaN(n) && isFinite(n); },

  toInt:   (value, base = 10) => parseInt(value, base),
  toFloat: (value)            => parseFloat(value),

  /* ── Redondeo ── */

  /**
   * Redondea a los decimales indicados.
   * @param {number} n @param {number} [d=2] @returns {number|null}
   */
  round: (n, d = 2) => {
    const num = Number(n);
    if (isNaN(num)) return null;
    return Math.round(num * 10 ** d) / 10 ** d;
  },

  /** @param {number} n @param {number} [d=0] @returns {number} */
  ceil: (n, d = 0) => {
    const num = Number(n);
    if (isNaN(num)) return 0;
    return Math.ceil(num * 10 ** d) / 10 ** d;
  },

  /** @param {number} n @param {number} [d=0] @returns {number} */
  floor: (n, d = 0) => {
    const num = Number(n);
    if (isNaN(num)) return 0;
    return Math.floor(num * 10 ** d) / 10 ** d;
  },

  /* ── Formateo ── */

  /**
   * Formatea un número con separadores de miles y decimales según locale.
   * @param {number} n @param {number} [d=2] @param {string} [locale] @returns {string}
   */
  formatNumber: (n, d = 2, locale = config?.formats?.locale ?? "es-DO") => {
    const num = NumberHelper.toNumber(n);
    if (num === null) return "";
    return num.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  },

  /**
   * Alias de formatNumber (compatibilidad V1).
   */
  format: (value, decimals = 2, locale = config?.formats?.locale ?? "es-DO") =>
    NumberHelper.formatNumber(value, decimals, locale),

  /**
   * Formatea como porcentaje.
   * @param {number} value  Valor entre 0 y 1 (isDecimal=true) o entero (isDecimal=false)
   * @param {number} [d=1]
   * @param {boolean} [isDecimal=true]  Si true, multiplica por 100
   * @returns {string}
   * @example NumberHelper.percent(0.754);        // "75.4%"
   * @example NumberHelper.percent(75, 0, false); // "75%"
   */
  percent: (value, d = 1, isDecimal = true) => {
    const num = Number(value);
    if (isNaN(num)) return "";
    const pct = isDecimal ? num * 100 : num;
    return `${NumberHelper.round(pct, d)}%`;
  },

  /**
   * Formatea como moneda usando símbolos de config.monedas.
   * @param {number} value @param {string} [code="P"] @param {number} [d=2] @returns {string}
   * @example NumberHelper.currency(50000);       // "RD$ 50,000.00"
   * @example NumberHelper.currency(1200, "U");   // "USD$ 1,200.00"
   */
  currency: (value, code = "P", d = 2) => {
    const symbols = config?.monedas ?? { P: "RD$", U: "USD$", E: "EUR€" };
    const symbol  = symbols[code] ?? code;
    const n       = NumberHelper.formatNumber(value, d);
    return n ? `${symbol} ${n}` : "";
  },

  /* ── Cálculos ── */

  /** Entero aleatorio entre min y max (ambos inclusive). */
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /** Decimal aleatorio entre min y max. */
  random: (min, max) => Math.random() * (max - min) + min,

  /**
   * Clampea un número dentro de [min, max].
   * @param {number} value @param {number} min @param {number} max @returns {number}
   * @example NumberHelper.clamp(150, 0, 100); // 100
   */
  clamp: (value, min, max) => {
    const n = Number(value);
    if (isNaN(n)) return min;
    return Math.min(Math.max(n, min), max);
  },

  /**
   * Calcula qué porcentaje representa `part` de `total`.
   * @param {number} part @param {number} total @param {number} [d=1] @returns {number|null}
   * @example NumberHelper.percentOf(25, 200); // 12.5
   */
  percentOf: (part, total, d = 1) => {
    if (!total || total === 0) return null;
    return NumberHelper.round((part / total) * 100, d);
  },

  /**
   * Suma un array de números de forma segura (ignora NaN).
   * @param {number[]} arr @returns {number}
   */
  sum: (arr) => arr.reduce((acc, v) => acc + (NumberHelper.toNumber(v) ?? 0), 0),

  /**
   * Calcula el promedio de un array de números.
   * @param {number[]} arr @returns {number|null}
   */
  avg: (arr) => {
    if (!arr.length) return null;
    return NumberHelper.round(NumberHelper.sum(arr) / arr.length, 2);
  },

  /** @returns {void} */
  init() {},
};

export default Object.freeze(NumberHelper);
