/**
 * @module number
 * @description
 * Funciones utilitarias para manejo, conversión y formateo de números.
 *
 * Este helper no depende de otros helpers y no contiene lógica
 * de validación de objetos o strings.
 */
const number = {
  /**
   * Formatea un número según locale y decimales
   *
   * @param {number|string} n
   * Número a formatear
   *
   * @param {number} [d=2]
   * Cantidad de decimales
   *
   * @param {string} [locale="es-DO"]
   * Locale para el formateo
   *
   * @returns {string}
   * Número formateado o cadena vacía si el valor no es válido
   *
   * @example
   * number.formatNumber(1234.567); // "1,234.57"
   *
   * @example
   * number.formatNumber(1234.567, 0); // "1,235"
   *
   * @example
   * number.formatNumber("abc"); // ""
   */
  formatNumber: (n, d = 2, locale = "es-DO") => {
    const num = Number(n);
    if (isNaN(num)) return "";
    return num.toLocaleString(locale, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  },

  /**
   * Redondea un número a los decimales indicados
   *
   * @param {number|string} n
   * Número a redondear
   *
   * @param {number} [d=2]
   * Decimales
   *
   * @returns {number|null}
   * Número redondeado o `null` si no es válido
   *
   * @example
   * number.round(123.4567); // 123.46
   *
   * @example
   * number.round("abc"); // null
   */
  round: (n, d = 2) => {
    const num = Number(n);
    if (isNaN(num)) return null;
    return Math.round(num * 10 ** d) / 10 ** d;
  },

  /**
   * Convierte un valor a número seguro
   *
   * @param {*} n
   * Valor a convertir
   *
   * @param {number} [defaultValue=0]
   * Valor retornado si la conversión falla
   *
   * @returns {number}
   *
   * @example
   * number.toNumber("123"); // 123
   *
   * @example
   * number.toNumber("abc", 5); // 5
   */
  toNumber: (n, defaultValue = 0) => {
    const num = Number(n);
    return isNaN(num) ? defaultValue : num;
  },

  /**
   * Genera un número entero aleatorio entre dos valores (inclusive)
   *
   * @param {number} min
   * Valor mínimo
   *
   * @param {number} max
   * Valor máximo
   *
   * @returns {number}
   *
   * @example
   * number.randomInt(1, 5); // 1, 2, 3, 4 o 5
   */
  randomInt: (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
};

export default number;
