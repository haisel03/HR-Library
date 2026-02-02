/**
 * @module currency
 * @description
 * Helpers para formateo y conversión de monedas.
 */

import config from "../core/config";
import number from "./number_helper";

const currency = {
  /**
   * Obtiene el símbolo de una moneda
   * @param {string} code Código ('U','E','P')
   * @returns {string}
   */
  getSymbol: (code) => config.monedas?.[code] ?? "",

  /**
   * Formatea un valor monetario
   * @param {number|string} value
   * @param {string} [currency="P"]
   * @param {number} [decimals=2]
   * @returns {string}
   *
   * @example currency.format(1500)
   * @example currency.format(1500, "U")
   */
  format: (value, code = "P", decimals = 2) => {
    const symbol = currency.getSymbol(code);
    const n = number.formatNumber(value, decimals, config.formats.locale);
    return n ? `${symbol} ${n}` : "";
  },

  /**
   * Convierte un monto usando tasa
   * @param {number|string} value
   * @param {number} rate
   * @param {number} [decimals=2]
   * @returns {number|null}
   */
  convert: (value, rate, decimals = 2) => {
    const n = number.toNumber(value, null);
    if (n === null) return null;
    return number.round(n * rate, decimals);
  },
};

export default currency;
