import config from "../core/config";

/**
 * @module Number
 * @description
 * Funciones utilitarias para manejo, conversión, formateo y cálculo numérico.
 * Reutiliza config.formats.locale para formateo consistente.
 *
 * @example
 * $Number.formatNumber(1234567.89);     // "1,234,567.89"
 * $Number.currency(50000, "P");         // "RD$ 50,000.00"
 * $Number.percent(0.75);                // "75%"
 */

const NumberHelper = {

	/* ── Conversión segura ───────────────────────────────────────────────────── */

	/**
	 * Convierte cualquier valor a número seguro.
	 * Si no puede convertir, retorna el defaultValue.
	 * @param {*} n
	 * @param {number|null} [defaultValue=0]
	 * @returns {number|null}
	 */
	toNumber: (n, defaultValue = 0) => {
		const num = Number(n);
		return isNaN(num) ? defaultValue : num;
	},

	/**
	 * Verifica si un valor es un número finito válido.
	 * @param {*} value
	 * @returns {boolean}
	 */
	isValid: (value) => {
		const n = Number(value);
		return !isNaN(n) && isFinite(n);
	},

	/* ── Redondeo ────────────────────────────────────────────────────────────── */

	/**
	 * Redondea a los decimales indicados (evita errores de punto flotante).
	 * @param {number} n
	 * @param {number} [d=2]
	 * @returns {number|null}
	 */
	round: (n, d = 2) => {
		const num = Number(n);
		if (isNaN(num)) return null;
		return Math.round(num * 10 ** d) / 10 ** d;
	},

	/**
	 * Redondea hacia arriba.
	 * @param {number} n
	 * @param {number} [d=0]
	 * @returns {number}
	 */
	ceil: (n, d = 0) => {
		const num = Number(n);
		if (isNaN(num)) return 0;
		return Math.ceil(num * 10 ** d) / 10 ** d;
	},

	/**
	 * Redondea hacia abajo.
	 * @param {number} n
	 * @param {number} [d=0]
	 * @returns {number}
	 */
	floor: (n, d = 0) => {
		const num = Number(n);
		if (isNaN(num)) return 0;
		return Math.floor(num * 10 ** d) / 10 ** d;
	},

	/* ── Formateo ────────────────────────────────────────────────────────────── */

	/**
	 * Formatea un número con separadores de miles y decimales según locale.
	 * @param {number} n
	 * @param {number} [d=2]  Decimales
	 * @param {string} [locale]  Locale (default: config.formats.locale)
	 * @returns {string}
	 */
	formatNumber: (n, d = 2, locale = config?.formats?.locale ?? "es-DO") => {
		const num = Number(n);
		if (isNaN(num)) return "";
		return num.toLocaleString(locale, {
			minimumFractionDigits: d,
			maximumFractionDigits: d,
		});
	},

	/**
	 * Formatea como porcentaje.
	 * @param {number} value  Valor entre 0 y 1 (ej: 0.75) o entero (ej: 75)
	 * @param {number} [d=1]  Decimales
	 * @param {boolean} [isDecimal=true]  Si true, multiplica por 100
	 * @returns {string}
	 * @example $Number.percent(0.754);   // "75.4%"
	 * @example $Number.percent(75, 0, false); // "75%"
	 */
	percent: (value, d = 1, isDecimal = true) => {
		const num = Number(value);
		if (isNaN(num)) return "";
		const pct = isDecimal ? num * 100 : num;
		return `${NumberHelper.round(pct, d)}%`;
	},

	/**
	 * Formatea como moneda usando el símbolo definido en config.monedas.
	 * @param {number} value
	 * @param {string} [code="P"]  Código de moneda (P=RD$, U=USD$, E=EUR€)
	 * @param {number} [d=2]
	 * @returns {string}
	 * @example $Number.currency(50000);       // "RD$ 50,000.00"
	 * @example $Number.currency(1200, "U");   // "USD$ 1,200.00"
	 */
	currency: (value, code = "P", d = 2) => {
		const symbols = config?.monedas ?? { P: "RD$", U: "USD$", E: "EUR€" };
		const symbol  = symbols[code] ?? code;
		const n       = NumberHelper.formatNumber(value, d);
		return n ? `${symbol} ${n}` : "";
	},

	/* ── Cálculos ────────────────────────────────────────────────────────────── */

	/**
	 * Genera un número entero aleatorio entre min y max (ambos inclusive).
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	randomInt: (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min,

	/**
	 * Clampea un número dentro de un rango [min, max].
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 * @example $Number.clamp(150, 0, 100); // 100
	 */
	clamp: (value, min, max) => {
		const n = Number(value);
		if (isNaN(n)) return min;
		return Math.min(Math.max(n, min), max);
	},

	/**
	 * Calcula el porcentaje de `part` respecto a `total`.
	 * @param {number} part
	 * @param {number} total
	 * @param {number} [d=1]
	 * @returns {number|null}  null si total es 0
	 * @example $Number.percentOf(25, 200); // 12.5
	 */
	percentOf: (part, total, d = 1) => {
		if (!total || total === 0) return null;
		return NumberHelper.round((part / total) * 100, d);
	},

	/**
	 * Suma un array de números de forma segura (ignora NaN).
	 * @param {number[]} arr
	 * @returns {number}
	 */
	sum: (arr) =>
		arr.reduce((acc, v) => acc + (NumberHelper.toNumber(v, 0)), 0),

	/**
	 * Calcula el promedio de un array de números.
	 * @param {number[]} arr
	 * @returns {number|null}
	 */
	avg: (arr) => {
		if (!arr.length) return null;
		return NumberHelper.round(NumberHelper.sum(arr) / arr.length, 2);
	},
};

export default NumberHelper;
