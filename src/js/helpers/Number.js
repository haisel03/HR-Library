/**
 * @module Number
 * @description Funciones utilitarias para manejo, conversión y formateo de números.
 */

const NumberHelper = {
	/**
	 * Formatea un número según locale y decimales
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
	 */
	round: (n, d = 2) => {
		const num = Number(n);
		if (isNaN(num)) return null;
		return Math.round(num * 10 ** d) / 10 ** d;
	},

	/**
	 * Convierte un valor a número seguro
	 */
	toNumber: (n, defaultValue = 0) => {
		const num = Number(n);
		return isNaN(num) ? defaultValue : num;
	},

	/**
	 * Genera un número entero aleatorio entre dos valores (inclusive)
	 */
	randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

export default NumberHelper;
