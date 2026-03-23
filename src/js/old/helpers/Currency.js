import config from "../core/config";
import NumberHelper from "./Number";

/**
 * @module Currency
 * @description Helpers para formateo y conversión de monedas.
 */

const Currency = {
	/**
	 * Obtiene el símbolo de una moneda
	 */
	getSymbol: (code) => config.monedas?.[code] ?? "",

	/**
	 * Formatea un valor monetario
	 */
	format: (value, code = "P", decimals = 2) => {
		const symbol = Currency.getSymbol(code);
		const n = NumberHelper.formatNumber(value, decimals, config.formats.locale);
		return n ? `${symbol} ${n}` : "";
	},

	/**
	 * Convierte un monto usando tasa
	 */
	convert: (value, rate, decimals = 2) => {
		const n = NumberHelper.toNumber(value, null);
		if (n === null) return null;
		return NumberHelper.round(n * rate, decimals);
	},
};

export default Currency;
