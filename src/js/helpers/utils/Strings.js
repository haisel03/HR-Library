/**
 * @module Strings
 * @description
 * Utilidades para manipulación y formateo de cadenas de texto en HR Library.
 * Fusiona los métodos de máscara, highlight y formateo de documentos dominicanos
 * de V2 con slugify, format (plantilla), reverse y extras de V1.
 *
 * @example
 * Strings.slug("Gestión Académica 2024");       // "gestion-academica-2024"
 * Strings.mask("8095551234", "###-###-####");    // "809-555-1234"
 * Strings.formatCedula("00102345678");           // "001-0234567-8"
 * Strings.highlight("María García", "garcia");   // "María <mark>García</mark>"
 * Strings.format("Hola {nombre}", { nombre: "Ana" }); // "Hola Ana"
 *
 * @version 3.0.0
 */

const Strings = {

  /* ── Transformación básica ── */

  /**
   * Capitaliza la primera letra de la cadena.
   * @param {string} text @returns {string}
   */
  capitalize: (text) => {
    if (typeof text !== "string" || !text.length) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Convierte cada palabra a mayúscula inicial (title case).
   * @param {string} text @returns {string}
   * @example Strings.titleCase("juan pablo duarte"); // "Juan Pablo Duarte"
   */
  titleCase: (text) => {
    if (typeof text !== "string") return "";
    return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  },

  upper: (text) => (typeof text === "string" ? text.toUpperCase() : ""),
  lower: (text) => (typeof text === "string" ? text.toLowerCase() : ""),
  trim:  (text) => (typeof text === "string" ? text.trim()        : ""),

  /**
   * Invierte una cadena.
   * @param {string} str @returns {string}
   * @example Strings.reverse("hola"); // "aloh"
   */
  reverse: (str) => (typeof str !== "string" || !str ? "" : [...str].reverse().join("")),

  /* ── Normalización ── */

  /**
   * Elimina acentos y diacríticos.
   * @param {string} text @returns {string}
   * @example Strings.normalize("María García"); // "Maria Garcia"
   */
  normalize: (text) => {
    if (typeof text !== "string") return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },

  /**
   * Reemplaza múltiples espacios/tabs/saltos por un solo espacio.
   * @param {string} text @returns {string}
   */
  cleanSpaces: (text) => {
    if (typeof text !== "string") return "";
    return text.replace(/\s+/g, " ").trim();
  },

  /* ── Recorte / Formato ── */

  /**
   * Trunca un texto a longitud máxima con sufijo.
   * @param {string} text @param {number} max @param {string} [suffix="..."] @returns {string}
   */
  truncate: (text, max, suffix = "...") => {
    if (typeof text !== "string") return "";
    if (text.length <= max) return text;
    return text.substring(0, max) + suffix;
  },

  /**
   * Rellena a la izquierda hasta la longitud indicada.
   * @param {string|number} value @param {number} length @param {string} [char="0"] @returns {string}
   * @example Strings.padStart(5, 4); // "0005"
   */
  padStart: (value, length, char = "0") => String(value).padStart(length, char),

  /**
   * Rellena a la derecha hasta la longitud indicada.
   * @param {string|number} value @param {number} length @param {string} [char=" "] @returns {string}
   */
  padEnd: (value, length, char = " ") => String(value).padEnd(length, char),

  /** Repite una cadena N veces. */
  repeat: (str, times) => (typeof str !== "string" || times < 1 ? "" : str.repeat(times)),

  /* ── URLs / Identifiers ── */

  /**
   * Convierte texto a slug amigable para URLs.
   * @param {string} text @returns {string}
   * @example Strings.slug("Gestión Académica 2024"); // "gestion-academica-2024"
   */
  slug: (text) => {
    if (typeof text !== "string") return "";
    return Strings.normalize(text)
      .toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },

  /** Alias de slug para compatibilidad con V1 */
  slugify: (text) => Strings.slug(text),

  /**
   * Genera un ID único alfanumérico aleatorio.
   * @param {number} [length=8] @returns {string}
   * @example Strings.uid(); // "a3f8b2c1"
   */
  uid: (length = 8) => Math.random().toString(36).substring(2, 2 + length),

  /* ── Búsqueda / Comparación ── */

  /**
   * Verifica si una cadena contiene un texto (case-insensitive, sin acentos).
   * @param {string} text @param {string} search @returns {boolean}
   * @example Strings.contains("María García", "garcia"); // true
   */
  contains: (text, search) => {
    if (typeof text !== "string" || typeof search !== "string") return false;
    return Strings.normalize(text.toLowerCase())
      .includes(Strings.normalize(search.toLowerCase()));
  },

  startsWith: (str, prefix) => typeof str === "string" && str.startsWith(String(prefix)),
  endsWith:   (str, suffix) => typeof str === "string" && str.endsWith(String(suffix)),

  /**
   * Cuenta las ocurrencias de una subcadena.
   * @param {string} text @param {string} search @returns {number}
   * @example Strings.countOccurrences("banana", "a"); // 3
   */
  countOccurrences: (text, search) => {
    if (!text || !search) return 0;
    return text.split(search).length - 1;
  },

  replaceAll: (str, search, replace) =>
    (typeof str !== "string" ? "" : str.replaceAll(search, replace)),

  /* ── Plantilla / Interpolación ── */

  /**
   * Interpola variables en una plantilla usando {clave}.
   * @param {string} template @param {Object} data @returns {string}
   * @example Strings.format("Hola {nombre}, tienes {n} mensajes.", { nombre: "Ana", n: 3 });
   */
  format: (template, data) => {
    if (!template || typeof data !== "object" || data === null) return String(template ?? "");
    return String(template).replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : `{${key}}`
    );
  },

  /* ── Máscara / Formateo de datos ── */

  /**
   * Aplica una máscara de caracteres. `#` se reemplaza con cada dígito del valor.
   * @param {string|number} value @param {string} mask @returns {string}
   * @example Strings.mask("8095551234", "###-###-####"); // "809-555-1234"
   */
  mask: (value, mask) => {
    const str = String(value).replace(/\D/g, "");
    let result = "", si = 0;
    for (let mi = 0; mi < mask.length && si < str.length; mi++) {
      result += mask[mi] === "#" ? str[si++] : mask[mi];
    }
    return result;
  },

  /** Formatea número de teléfono dominicano (10 dígitos → ###-###-####). */
  formatPhone:  (phone)  => Strings.mask(String(phone).replace(/\D/g, ""), "###-###-####"),

  /** Formatea cédula dominicana (11 dígitos → ###-#######-#). */
  formatCedula: (cedula) => Strings.mask(String(cedula).replace(/\D/g, ""), "###-#######-#"),

  /** Formatea RNC dominicano (9 dígitos → ###-#####-#). */
  formatRNC:    (rnc)    => Strings.mask(String(rnc).replace(/\D/g, ""), "###-#####-#"),

  /* ── Utilidades ── */

  /**
   * Escapa caracteres HTML especiales para prevenir XSS.
   * @param {string} text @returns {string}
   */
  escapeHtml: (text = "") =>
    String(text).replace(/[&<>"']/g, (m) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])),

  /**
   * Resalta coincidencias de una búsqueda en HTML con <mark>.
   * @param {string} text @param {string} search @returns {string}
   * @example Strings.highlight("María García", "garcia"); // "María <mark>García</mark>"
   */
  highlight: (text, search) => {
    if (!search || typeof text !== "string") return text;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
  },

  /** Elimina todas las etiquetas HTML de una cadena. */
  stripHtml: (html) => (typeof html !== "string" ? "" : html.replace(/<[^>]*>/g, "")),

  /** @returns {void} */
  init() {},
};

export default Object.freeze(Strings);
