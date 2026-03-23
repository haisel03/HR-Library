/**
 * @module Validation
 * @description
 * Funciones de validación para HR Library.
 * Fusiona la organización modular de V2 con las validaciones adicionales de V1.
 * Los regex de email/phone son configurables desde config.validation.
 *
 * @example
 * Validation.isNullOrEmpty("");            // true
 * Validation.isValidEmail("x@y.com");     // true
 * Validation.isValidCedula("001-1234567-8"); // true/false
 * Validation.isValidPlaca("A123456");     // true
 * Validation.isCurrency("1,500.00");      // true
 *
 * @version 3.0.0
 */

import config from "../core/config.js";

/* ── Regex internos (no configurables) ── */
const REGEX = Object.freeze({
  time:      /^([01]\d|2[0-3]):([0-5]\d)$/,
  currency:  /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$|^-?\d+(\.\d{1,2})?$/,
  rnc:       /^\d{9}$/,
  alpha:     /^[\p{L}\s]+$/u,
  alphaNum:  /^[\p{L}\p{N}]+$/u,
  placa:     /^[A-Z]{1,2}\d{5,6}$/,
});

const Validation = {

  /* ── Vacío / Nulo ── */

  /**
   * Verifica si un valor es null, undefined o cadena vacía/solo espacios.
   * @param {*} value @returns {boolean}
   */
  isNullOrEmpty: (value) =>
    value === null || value === undefined ||
    (typeof value === "string" && value.trim() === ""),

  /**
   * Verifica si un valor está vacío.
   * Cubre: null, undefined, string vacío, array vacío, objeto vacío.
   * @param {*} value @returns {boolean}
   */
  isEmpty: (value) => {
    if (Validation.isNullOrEmpty(value)) return true;
    if (Array.isArray(value))            return value.length === 0;
    if (typeof value === "object")       return Object.keys(value).length === 0;
    return false;
  },

  /** Verifica que un campo no esté vacío (campo obligatorio). */
  required: (value) => !Validation.isEmpty(value),

  /* ── Números ── */

  /** @param {*} value @returns {boolean} Número finito válido */
  isNumber:   (value) => { const n = Number(value); return !isNaN(n) && isFinite(n); },
  isInteger:  (value) => Validation.isNumber(value) && Number.isInteger(Number(value)),
  isPositive: (value) => Validation.isNumber(value) && Number(value) > 0,
  isNegative: (value) => Validation.isNumber(value) && Number(value) < 0,
  isDecimal:  (value) => Validation.isNumber(value) && !Number.isInteger(Number(value)),

  /**
   * Verifica si un número está dentro de un rango inclusivo.
   * @param {number} value @param {number} min @param {number} max @returns {boolean}
   */
  isInRange: (value, min, max) => {
    const n = Number(value);
    return Validation.isNumber(n) && n >= min && n <= max;
  },

  /* ── Texto ── */

  isAlpha:        (value) => typeof value === "string" && REGEX.alpha.test(value),
  isAlphanumeric: (value) => typeof value === "string" && REGEX.alphaNum.test(value),
  minLength:      (value, n) => typeof value === "string" && value.length >= n,
  maxLength:      (value, n) => typeof value === "string" && value.length <= n,
  matchesRegex:   (value, regex) => typeof value === "string" && regex.test(value),

  /* ── Email / Teléfono ── */

  /**
   * Valida dirección de correo electrónico.
   * Regex configurable via config.validation.emailRegex.
   * @param {string} email @param {RegExp} [regex] @returns {boolean}
   */
  isValidEmail: (email, regex = config.validation.emailRegex) =>
    typeof email === "string" && regex.test(email.trim()),

  /**
   * Valida número de teléfono.
   * Formato: 809-555-1234 / (809) 555 1234 / 8095551234
   * @param {string} phone @param {RegExp} [regex] @returns {boolean}
   */
  isValidPhone: (phone, regex = config.validation.phoneRegex) =>
    typeof phone === "string" && regex.test(phone.trim()),

  /* ── Documentos dominicanos ── */

  /**
   * Valida cédula dominicana con dígito verificador (módulo 10).
   * Acepta: "00102345678" o "001-0234567-8"
   * @param {string} cedula @returns {boolean}
   */
  isValidCedula: (cedula) => {
    if (typeof cedula !== "string") return false;
    const v = cedula.replace(/-/g, "");
    if (!/^\d{11}$/.test(v)) return false;
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      let n = parseInt(v[i]) * ((i % 2) + 1);
      sum += n > 9 ? n - 9 : n;
    }
    return (10 - (sum % 10)) % 10 === parseInt(v[10]);
  },

  /**
   * Valida RNC dominicano (9 dígitos, con o sin guiones).
   * @param {string} rnc @returns {boolean}
   */
  isValidRNC: (rnc) => {
    if (typeof rnc !== "string") return false;
    return REGEX.rnc.test(rnc.replace(/-/g, ""));
  },

  /**
   * Valida placa vehicular dominicana.
   * Formatos aceptados: A123456, AB12345
   * @param {string} placa @returns {boolean}
   */
  isValidPlaca: (placa) => {
    if (typeof placa !== "string") return false;
    return REGEX.placa.test(placa.trim().toUpperCase());
  },

  /* ── URLs ── */

  /**
   * Verifica si es una URL válida (http o https).
   * @param {string} url @returns {boolean}
   */
  isValidUrl: (url) => {
    if (typeof url !== "string") return false;
    try { const u = new URL(url); return u.protocol === "http:" || u.protocol === "https:"; }
    catch { return false; }
  },

  /* ── Fechas ── */

  /**
   * Verifica si un valor es una fecha válida.
   * @param {string|Date|number} value @returns {boolean}
   */
  isValidDate: (value) => {
    if (!value) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  },

  /** @param {string|Date} date @param {string|Date} after @returns {boolean} */
  isAfter: (date, after) => {
    const a = new Date(date), b = new Date(after);
    return Validation.isValidDate(a) && Validation.isValidDate(b) && a > b;
  },

  /** @param {string|Date} date @param {string|Date} before @returns {boolean} */
  isBefore: (date, before) => {
    const a = new Date(date), b = new Date(before);
    return Validation.isValidDate(a) && Validation.isValidDate(b) && a < b;
  },

  /* ── Tiempo ── */

  /** Valida hora en formato HH:MM (24 horas). */
  isTime: (value) => typeof value === "string" && REGEX.time.test(value),

  /* ── Monedas ── */

  /**
   * Valida un monto monetario. Acepta: 1000, 1000.00, 1,000.00, -500.
   * @param {string|number} value @returns {boolean}
   */
  isCurrency: (value) => REGEX.currency.test(String(value)),

  /* ── Archivos ── */

  /**
   * Verifica si un archivo tiene una extensión permitida.
   * @param {File|string} file @param {string[]} allowed @returns {boolean}
   */
  isAllowedExtension: (file, allowed = []) => {
    const name = file instanceof File ? file.name : String(file);
    const ext  = name.split(".").pop()?.toLowerCase() ?? "";
    return allowed.map((e) => e.toLowerCase()).includes(ext);
  },

  /**
   * Verifica si un archivo no supera el tamaño máximo.
   * @param {File} file @param {number} maxMB @returns {boolean}
   */
  isValidFileSize: (file, maxMB) =>
    file instanceof File && file.size <= maxMB * 1024 * 1024,

  /* ── Estructuras ── */

  isArray:       (value) => Array.isArray(value),
  isEmptyArray:  (value) => Array.isArray(value) && value.length === 0,
  isObject:      (value) => typeof value === "object" && value !== null && !Array.isArray(value),
  isEmptyObject: (value) => Validation.isObject(value) && Object.keys(value).length === 0,
  equals:        (a, b)  => a === b,
  oneOf:         (value, list) => Array.isArray(list) && list.includes(value),

  /** @returns {void} */
  init() {},
};

export default Object.freeze(Validation);
