import $ from "jquery";
import "jQuery.print";
import config from "../core/config";

/**
 * @module Print
 * @description Helper de impresión usando jQuery.print.
 */

const Print = {
	/**
	 * Normaliza target
	 */
	resolve: (target) => {
		if (!target) return $("body");
		if (target instanceof HTMLElement) return $(target);
		return $(target);
	},

	/**
	 * Imprime un elemento o toda la página
	 */
	print: (target = null, options = {}) => {
		const el = Print.resolve(target);
		el.print({
			...config.print,
			...options,
		});
	},
};

export default Print;
