/**
 * @module Strings
 * @description Funciones utilitarias para manipulación de cadenas de texto.
 */

const Strings = {
	/**
	 * Capitaliza la primera letra de una cadena
	 */
	capitalize: (text) => {
		if (typeof text !== "string" || !text.length) return "";
		return text.charAt(0).toUpperCase() + text.slice(1);
	},

	/**
	 * Convierte un texto a mayúsculas
	 */
	upper: (text) => (typeof text === "string" ? text.toUpperCase() : ""),

	/**
	 * Convierte un texto a minúsculas
	 */
	lower: (text) => (typeof text === "string" ? text.toLowerCase() : ""),

	/**
	 * Recorta espacios al inicio y final
	 */
	trim: (text) => (typeof text === "string" ? text.trim() : ""),

	/**
	 * Trunca un texto a una longitud máxima
	 */
	truncate: (text, max, suffix = "...") => {
		if (typeof text !== "string") return "";
		if (text.length <= max) return text;
		return text.substring(0, max) + suffix;
	},

	/**
	 * Elimina acentos y caracteres especiales
	 */
	normalize: (text) => {
		if (typeof text !== "string") return "";
		return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	},

	/**
	 * Reemplaza múltiples espacios por uno solo
	 */
	cleanSpaces: (text) => {
		if (typeof text !== "string") return "";
		return text.replace(/\s+/g, " ").trim();
	},

	/**
	 * Convierte un texto a un slug amigable para URLs
	 */
	slug: (text) => {
		if (typeof text !== "string") return "";
		return Strings.normalize(text)
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	}
};

export default Strings;
