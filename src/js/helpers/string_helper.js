/**
 * @module string
 * @description
 * Funciones utilitarias para manipulación de cadenas de texto.
 * No incluye validaciones ni lógica numérica.
 */
const string = {
  /**
   * Capitaliza la primera letra de una cadena
   * @param {string} text
   * @returns {string}
   *
   * @example string.capitalize("hola mundo") // "Hola mundo"
   */
  capitalize: (text) => {
    if (typeof text !== "string" || !text.length) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Convierte un texto a mayúsculas
   * @param {string} text
   * @returns {string}
   */
  upper: (text) =>
    typeof text === "string" ? text.toUpperCase() : "",

  /**
   * Convierte un texto a minúsculas
   * @param {string} text
   * @returns {string}
   */
  lower: (text) =>
    typeof text === "string" ? text.toLowerCase() : "",

  /**
   * Recorta espacios al inicio y final
   * @param {string} text
   * @returns {string}
   */
  trim: (text) =>
    typeof text === "string" ? text.trim() : "",

  /**
   * Trunca un texto a una longitud máxima
   * @param {string} text
   * @param {number} max
   * @param {string} [suffix="..."]
   * @returns {string}
   *
   * @example string.truncate("Hola mundo", 4) // "Hola..."
   */
  truncate: (text, max, suffix = "...") => {
    if (typeof text !== "string") return "";
    if (text.length <= max) return text;
    return text.substring(0, max) + suffix;
  },

  /**
   * Elimina acentos y caracteres especiales
   * @param {string} text
   * @returns {string}
   *
   * @example string.normalize("José Pérez") // "Jose Perez"
   */
  normalize: (text) => {
    if (typeof text !== "string") return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  /**
   * Reemplaza múltiples espacios por uno solo
   * @param {string} text
   * @returns {string}
   */
  cleanSpaces: (text) => {
    if (typeof text !== "string") return "";
    return text.replace(/\s+/g, " ").trim();
  },
};

export default string;
