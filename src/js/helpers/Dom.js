/**
 * @module Dom
 * @description
 * Helper de utilidades DOM puras.
 * Centraliza operaciones comunes sobre elementos HTML sin dependencias externas.
 */

const Dom = {

	/* =====================================================
	   RESOLUCIÓN DE ELEMENTOS
	===================================================== */

	/**
	 * Normaliza un target en un elemento DOM.
	 * Acepta selector CSS, id sin #, HTMLElement, document o window.
	 *
	 * @param {string|HTMLElement|Document|Window|null} target
	 * @returns {HTMLElement|Document|Window|null}
	 *
	 * @example
	 * Dom.el("#myId");       // por selector
	 * Dom.el("myId");        // por id
	 * Dom.el(document.body); // elemento directo
	 */
	el: (target) => {
		if (!target) return null;
		if (target instanceof HTMLElement || target === document || target === window) return target;
		if (typeof target === "string") {
			if (target.startsWith("#") || target.startsWith(".")) {
				return document.querySelector(target);
			}
			return document.getElementById(target);
		}
		return null;
	},

	/* =====================================================
	   VISIBILIDAD
	===================================================== */

	/**
	 * Muestra un elemento removiendo la clase `d-none`.
	 * @param {string|HTMLElement} t
	 */
	show: (t) => Dom.el(t)?.classList.remove("d-none"),

	/**
	 * Oculta un elemento agregando la clase `d-none`.
	 * @param {string|HTMLElement} t
	 */
	hide: (t) => Dom.el(t)?.classList.add("d-none"),

	/**
	 * Alterna la visibilidad con la clase `d-none`.
	 * @param {string|HTMLElement} t
	 */
	toggle: (t) => Dom.el(t)?.classList.toggle("d-none"),

	/**
	 * Verifica si un elemento es visible en el DOM.
	 * @param {string|HTMLElement} t
	 * @returns {boolean}
	 */
	isVisible: (t) => {
		const e = Dom.el(t);
		return !!(
			e &&
			e.offsetWidth > 0 &&
			e.offsetHeight > 0 &&
			getComputedStyle(e).display !== "none"
		);
	},

	/**
	 * Verifica si un elemento está oculto.
	 * @param {string|HTMLElement} t
	 * @returns {boolean}
	 */
	isHidden: (t) => !Dom.isVisible(t),

	/* =====================================================
	   ESTADO
	===================================================== */

	/**
	 * Habilita un elemento (disabled = false).
	 * @param {string|HTMLElement} t
	 */
	enable: (t) => {
		const e = Dom.el(t);
		if (e) e.disabled = false;
	},

	/**
	 * Deshabilita un elemento (disabled = true).
	 * @param {string|HTMLElement} t
	 */
	disable: (t) => {
		const e = Dom.el(t);
		if (e) e.disabled = true;
	},

	/**
	 * Alterna el estado disabled.
	 * @param {string|HTMLElement} t
	 */
	toggleDisabled: (t) => {
		const e = Dom.el(t);
		if (e) e.disabled = !e.disabled;
	},

	/* =====================================================
	   CONTENIDO
	===================================================== */

	/**
	 * Obtiene o establece el innerHTML de un elemento.
	 * Sin segundo argumento actúa como getter.
	 *
	 * @param {string|HTMLElement} t
	 * @param {string} [value]
	 * @returns {string|void}
	 *
	 * @example
	 * Dom.html("#div");          // getter
	 * Dom.html("#div", "<b>X</b>"); // setter
	 */
	html: (t, value) => {
		const e = Dom.el(t);
		if (!e) return;
		if (value === undefined) return e.innerHTML;
		e.innerHTML = value;
	},

	/**
	 * Obtiene o establece el textContent de un elemento.
	 * Sin segundo argumento actúa como getter.
	 *
	 * @param {string|HTMLElement} t
	 * @param {string} [value]
	 * @returns {string|void}
	 */
	text: (t, value) => {
		const e = Dom.el(t);
		if (!e) return;
		if (value === undefined) return e.textContent;
		e.textContent = value;
	},

	/**
	 * Vacía el contenido HTML de un elemento.
	 * @param {string|HTMLElement} t
	 */
	clear: (t) => {
		const e = Dom.el(t);
		if (e) e.innerHTML = "";
	},

	/**
	 * Reemplaza el contenido HTML de un elemento (alias semántico de html setter).
	 * @param {string|HTMLElement} t
	 * @param {string} html
	 */
	changeDiv: (t, html) => Dom.html(t, html),

	/* =====================================================
	   CLASES CSS
	===================================================== */

	/**
	 * Agrega una o varias clases CSS.
	 * @param {string|HTMLElement} t
	 * @param {...string} classes
	 */
	addClass: (t, ...classes) => Dom.el(t)?.classList.add(...classes),

	/**
	 * Remueve una o varias clases CSS.
	 * @param {string|HTMLElement} t
	 * @param {...string} classes
	 */
	removeClass: (t, ...classes) => Dom.el(t)?.classList.remove(...classes),

	/**
	 * Alterna una clase CSS.
	 * @param {string|HTMLElement} t
	 * @param {string} cls
	 */
	toggleClass: (t, cls) => Dom.el(t)?.classList.toggle(cls),

	/**
	 * Verifica si un elemento tiene una clase CSS.
	 * @param {string|HTMLElement} t
	 * @param {string} cls
	 * @returns {boolean}
	 */
	hasClass: (t, cls) => Dom.el(t)?.classList.contains(cls) ?? false,

	/* =====================================================
	   VALORES DE INPUT
	===================================================== */

	/**
	 * Obtiene o establece el value de un input/select/textarea.
	 * Sin segundo argumento actúa como getter.
	 *
	 * @param {string|HTMLElement} t
	 * @param {string} [value]
	 * @returns {string|void}
	 *
	 * @example
	 * Dom.val("#input");         // getter → "texto"
	 * Dom.val("#input", "hola"); // setter
	 */
	val: (t, value) => {
		const e = Dom.el(t);
		if (!e) return;
		if (value === undefined) return e.value ?? "";
		e.value = value;
	},

	/**
	 * Limpia el value de un input.
	 * @param {string|HTMLElement} t
	 */
	clearVal: (t) => Dom.val(t, ""),

	/* =====================================================
	   DATA ATTRIBUTES
	===================================================== */

	/**
	 * Obtiene o establece un data-attribute de un elemento.
	 * Sin tercer argumento actúa como getter.
	 *
	 * @param {string|HTMLElement} t
	 * @param {string} key   Nombre del atributo (sin el prefijo "data-")
	 * @param {*} [value]
	 * @returns {string|void}
	 *
	 * @example
	 * Dom.data("#btn", "id");       // getter → "42"
	 * Dom.data("#btn", "id", "42"); // setter
	 */
	data: (t, key, value) => {
		const e = Dom.el(t);
		if (!e) return;
		if (value === undefined) return e.dataset[key];
		e.dataset[key] = value;
	},

	/* =====================================================
	   EVENTOS
	===================================================== */

	/**
	 * Registra un event listener en un elemento.
	 *
	 * @param {string|HTMLElement|Document|Window} t
	 * @param {string} event  Nombre del evento (ej: "click", "change")
	 * @param {Function} callback
	 * @param {boolean|AddEventListenerOptions} [options]
	 *
	 * @example
	 * Dom.on("#btn", "click", () => console.log("click"));
	 * Dom.on(document, "keydown", (e) => console.log(e.key));
	 */
	on: (t, event, callback, options) => {
		const e = Dom.el(t);
		e?.addEventListener(event, callback, options);
	},

	/**
	 * Remueve un event listener de un elemento.
	 *
	 * @param {string|HTMLElement|Document|Window} t
	 * @param {string} event
	 * @param {Function} callback
	 */
	off: (t, event, callback) => {
		const e = Dom.el(t);
		e?.removeEventListener(event, callback);
	},
};

export default Dom;
