/**
 * @module Print
 * @description
 * Helper de impresión nativa para HR-Library.
 * Sin dependencias externas. Usa iframe oculto para
 * imprimir elementos o HTML arbitrario sin afectar la página.
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 2.1.0
 *
 * @example
 * import Print from "./Print.js";
 *
 * Print.element("#factura");
 * Print.html("<h1>Reporte</h1><p>Contenido...</p>");
 */

import Dom from "./Dom.js";

// ─────────────────────────────────────────────
// Función privada de impresión por iframe
// ─────────────────────────────────────────────

/**
 * Abre un iframe oculto, inyecta contenido y lanza window.print().
 * Copia los estilos de la página actual al iframe.
 * @private
 * @param {string} html - Contenido HTML a imprimir.
 * @param {string} [title=""] - Título de la ventana de impresión.
 */
const _printFrame = (html, title = "") => {
	// Eliminar iframe previo si existe
	Dom.q("#cs-print-frame")?.remove();

	const iframe = document.createElement("iframe");
	iframe.id = "cs-print-frame";
	iframe.style.position = "fixed";
	iframe.style.top = "-9999px";
	iframe.style.left = "-9999px";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "none";

	document.body.appendChild(iframe);

	// Copiar estilos de la página
	const styles = Array.from(document.styleSheets)
		.map((ss) => {
			try {
				return Array.from(ss.cssRules).map((r) => r.cssText).join("\n");
			} catch { return ""; }
		})
		.join("\n");

	const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
	if (!doc) return;

	doc.open();
	doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>${html}</body>
    </html>
  `);
	doc.close();

	iframe.contentWindow?.focus();
	iframe.contentWindow?.print();

	// Limpiar iframe después de imprimir
	iframe.contentWindow?.addEventListener("afterprint", () => iframe.remove());
};

// ─────────────────────────────────────────────
// Print
// ─────────────────────────────────────────────

/**
 * @namespace Print
 */
const Print = {

	/**
	 * Imprime el contenido de un elemento del DOM.
	 * @param {string|HTMLElement} target - Selector o elemento a imprimir.
	 * @param {string} [title=""] - Título de la ventana de impresión.
	 * @returns {void}
	 *
	 * @example
	 * Print.element("#factura");
	 * Print.element("#reporte", "Reporte de Ventas");
	 */
	element(target, title = "") {
		const el = target instanceof HTMLElement ? target : Dom.q(target);
		if (!el) {
			console.warn("[Print] Elemento no encontrado:", target);
			return;
		}
		_printFrame(el.outerHTML, title);
	},

	/**
	 * Imprime una cadena HTML arbitraria.
	 * @param {string} html - Contenido HTML a imprimir.
	 * @param {string} [title=""]
	 * @returns {void}
	 *
	 * @example
	 * Print.html(`<h1>Factura #001</h1><table>...</table>`, "Factura");
	 */
	html(html, title = "") {
		if (!html) return;
		_printFrame(html, title);
	},

	/**
	 * Imprime la página completa actual.
	 * @returns {void}
	 */
	page() {
		window.print();
	},

	// ── Init ──────────────────────────────────────────────────────────────

	/**
	 * Punto de entrada del helper. Reservado para Init.js.
	 * @returns {void}
	 */
	init() { },

};

export default Object.freeze(Print);
