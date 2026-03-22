/**
 * @module Strings
 * @description
 * Funciones utilitarias para manipulación y formateo de cadenas de texto.
 * Sin dependencias externas — puro JavaScript.
 *
 * @example
 * $String.capitalize("hola mundo");   // "Hola mundo"
 * $String.slug("Gestión académica");  // "gestion-academica"
 * $String.mask("18095551234", "###-###-####"); // "180-955-1234"
 */

const Strings = {

	/* ── Transformación básica ───────────────────────────────────────────────── */

	/**
	 * Capitaliza la primera letra de una cadena.
	 * @param {string} text
	 * @returns {string}
	 */
	capitalize: (text) => {
		if (typeof text !== "string" || !text.length) return "";
		return text.charAt(0).toUpperCase() + text.slice(1);
	},

	/**
	 * Convierte cada palabra a mayúscula inicial (title case).
	 * @param {string} text
	 * @returns {string}
	 * @example $String.titleCase("juan pablo duarte"); // "Juan Pablo Duarte"
	 */
	titleCase: (text) => {
		if (typeof text !== "string") return "";
		return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
	},

	/** @param {string} text @returns {string} */
	upper: (text) => (typeof text === "string" ? text.toUpperCase() : ""),

	/** @param {string} text @returns {string} */
	lower: (text) => (typeof text === "string" ? text.toLowerCase() : ""),

	/** @param {string} text @returns {string} */
	trim:  (text) => (typeof text === "string" ? text.trim() : ""),

	/**
	 * Elimina acentos y diacríticos.
	 * @param {string} text
	 * @returns {string}
	 * @example $String.normalize("María García"); // "Maria Garcia"
	 */
	normalize: (text) => {
		if (typeof text !== "string") return "";
		return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	},

	/**
	 * Reemplaza múltiples espacios/tabs/saltos por un solo espacio.
	 * @param {string} text
	 * @returns {string}
	 */
	cleanSpaces: (text) => {
		if (typeof text !== "string") return "";
		return text.replace(/\s+/g, " ").trim();
	},

	/* ── Recorte / Formato ───────────────────────────────────────────────────── */

	/**
	 * Trunca un texto a una longitud máxima agregando sufijo.
	 * @param {string} text
	 * @param {number} max
	 * @param {string} [suffix="..."]
	 * @returns {string}
	 */
	truncate: (text, max, suffix = "...") => {
		if (typeof text !== "string") return "";
		if (text.length <= max) return text;
		return text.substring(0, max) + suffix;
	},

	/**
	 * Rellena una cadena a la izquierda hasta la longitud indicada.
	 * @param {string|number} value
	 * @param {number} length
	 * @param {string} [char="0"]
	 * @returns {string}
	 * @example $String.padStart(5, 4); // "0005"
	 */
	padStart: (value, length, char = "0") =>
		String(value).padStart(length, char),

	/**
	 * Rellena una cadena a la derecha hasta la longitud indicada.
	 * @param {string|number} value
	 * @param {number} length
	 * @param {string} [char=" "]
	 * @returns {string}
	 */
	padEnd: (value, length, char = " ") =>
		String(value).padEnd(length, char),

	/* ── URLs / Identifiers ──────────────────────────────────────────────────── */

	/**
	 * Convierte texto a slug amigable para URLs.
	 * Elimina acentos, convierte a minúsculas y reemplaza espacios con guiones.
	 * @param {string} text
	 * @returns {string}
	 * @example $String.slug("Gestión Académica 2024"); // "gestion-academica-2024"
	 */
	slug: (text) => {
		if (typeof text !== "string") return "";
		return Strings.normalize(text)
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	},

	/**
	 * Genera un ID único alfanumérico aleatorio.
	 * @param {number} [length=8]
	 * @returns {string}
	 * @example $String.uid();    // "a3f8b2c1"
	 */
	uid: (length = 8) =>
		Math.random().toString(36).substring(2, 2 + length),

	/* ── Búsqueda / Comparación ──────────────────────────────────────────────── */

	/**
	 * Verifica si una cadena contiene un texto (case-insensitive, sin acentos).
	 * Útil para filtros de búsqueda.
	 * @param {string} text
	 * @param {string} search
	 * @returns {boolean}
	 * @example $String.contains("María García", "garcia"); // true
	 */
	contains: (text, search) => {
		if (typeof text !== "string" || typeof search !== "string") return false;
		return Strings.normalize(text.toLowerCase())
			.includes(Strings.normalize(search.toLowerCase()));
	},

	/**
	 * Cuenta las ocurrencias de una subcadena.
	 * @param {string} text
	 * @param {string} search
	 * @returns {number}
	 */
	countOccurrences: (text, search) => {
		if (!text || !search) return 0;
		return text.split(search).length - 1;
	},

	/* ── Formateo de datos ───────────────────────────────────────────────────── */

	/**
	 * Aplica una máscara de caracteres a un string.
	 * `#` se reemplaza con cada carácter del valor.
	 * @param {string|number} value
	 * @param {string} mask  Patrón con `#` como placeholder, ej: "###-###-####"
	 * @returns {string}
	 * @example $String.mask("8095551234", "###-###-####"); // "809-555-1234"
	 */
	mask: (value, mask) => {
		const str = String(value).replace(/\D/g, "");
		let result = "";
		let si = 0;
		for (let mi = 0; mi < mask.length && si < str.length; mi++) {
			if (mask[mi] === "#") {
				result += str[si++];
			} else {
				result += mask[mi];
			}
		}
		return result;
	},

	/**
	 * Formatea un número de teléfono dominicano.
	 * @param {string|number} phone  10 dígitos
	 * @returns {string}  Ej: "809-555-1234"
	 */
	formatPhone: (phone) =>
		Strings.mask(String(phone).replace(/\D/g, ""), "###-###-####"),

	/**
	 * Formatea una cédula dominicana.
	 * @param {string|number} cedula  11 dígitos
	 * @returns {string}  Ej: "001-1234567-8"
	 */
	formatCedula: (cedula) =>
		Strings.mask(String(cedula).replace(/\D/g, ""), "###-#######-#"),

	/**
	 * Formatea un RNC dominicano.
	 * @param {string|number} rnc  9 dígitos
	 * @returns {string}  Ej: "101-12345-6"
	 */
	formatRNC: (rnc) =>
		Strings.mask(String(rnc).replace(/\D/g, ""), "###-#####-#"),

	/**
	 * Resalta las ocurrencias de un texto de búsqueda en un string.
	 * Devuelve HTML con <mark> alrededor de las coincidencias.
	 * @param {string} text
	 * @param {string} search
	 * @returns {string}  HTML seguro (solo envuelve coincidencias)
	 */
	highlight: (text, search) => {
		if (!search || typeof text !== "string") return text;
		const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex   = new RegExp(`(${escaped})`, "gi");
		return text.replace(regex, "<mark>$1</mark>");
	},
};

export default Strings;
