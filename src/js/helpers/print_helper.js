import $ from "jquery";
import "jQuery.print";
import config from "../core/config";

/**
 * @namespace print
 * @description Helper de impresión usando jQuery.print
 */
const print = (() => {
	/**
	 * Normaliza target
	 * @param {string|HTMLElement|null} target
	 * @returns {HTMLElement|jQuery}
	 */
	const resolve = (target) => {
		if (!target) return $("body");
		if (target instanceof HTMLElement) return $(target);
		return $(target);
	};

	/**
	 * Imprime un elemento o toda la página
	 * @param {string|HTMLElement|null} target
	 * @param {Object} options
	 */
	const run = (target = null, options = {}) => {
		const el = resolve(target);

		el.print({
			...config.print,
			...options, // permite override puntual
		});
	};

	return {
		print: run,
	};
})();

export default print;
