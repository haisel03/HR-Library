import config from "../core/config";

/**
 * @module Validation
 * @description
 * Funciones de validación para strings, números, objetos y datos dominicanos.
 * Reutilizado por Forms.js, Api.js, y disponible globalmente como $Validation.
 *
 * @example
 * $Validation.isNullOrEmpty("");        // true
 * $Validation.isValidEmail("x@y.com"); // true
 * $Validation.isValidCedula("001-1234567-1"); // true/false
 */

const Validation = {

	/* ── Vacío / nulo ────────────────────────────────────────────────────────── */

	/**
	 * Verifica si un valor es null, undefined o cadena vacía/solo espacios.
	 * @param {*} value
	 * @returns {boolean}
	 */
	isNullOrEmpty: (value) =>
		value === null ||
		value === undefined ||
		(typeof value === "string" && value.trim() === ""),

	/**
	 * Verifica si un valor está vacío.
	 * Abarca: null, undefined, string vacío, array vacío, objeto vacío.
	 * @param {*} value
	 * @returns {boolean}
	 */
	isEmpty: (value) => {
		if (Validation.isNullOrEmpty(value)) return true;
		if (Array.isArray(value))            return value.length === 0;
		if (typeof value === "object")       return Object.keys(value).length === 0;
		return false;
	},

	/* ── Email / Teléfono ────────────────────────────────────────────────────── */

	/**
	 * Valida formato de correo electrónico.
	 * @param {string} email
	 * @param {RegExp} [regex]  Regex personalizado (opcional)
	 * @returns {boolean}
	 */
	isValidEmail: (email, regex = config.validation.emailRegex) =>
		typeof email === "string" && regex.test(email.trim()),

	/**
	 * Valida número de teléfono.
	 * Formato por defecto: 809-555-1234 / (809) 555 1234 / 8095551234
	 * @param {string} phone
	 * @param {RegExp} [regex]
	 * @returns {boolean}
	 */
	isValidPhone: (phone, regex = config.validation.phoneRegex) =>
		typeof phone === "string" && regex.test(phone.trim()),

	/* ── Documentos dominicanos ──────────────────────────────────────────────── */

	/**
	 * Valida una cédula dominicana con su dígito verificador (módulo 10).
	 * Acepta formatos: "00102345678" o "001-0234567-8"
	 * @param {string} cedula
	 * @returns {boolean}
	 */
	isValidCedula: (cedula) => {
		if (typeof cedula !== "string") return false;
		const v = cedula.replace(/-/g, "");
		if (!/^\d{11}$/.test(v)) return false;

		let sum = 0;
		for (let i = 0; i < 10; i++) {
			let n = parseInt(v[i]) * ((i % 2) + 1);
			sum += n > 9 ? n - 9 : n;
		}
		return (10 - (sum % 10)) % 10 === parseInt(v[10]);
	},

	/**
	 * Valida un RNC (Registro Nacional del Contribuyente) dominicano.
	 * Formato: 9 dígitos numéricos (con o sin guiones).
	 * @param {string} rnc
	 * @returns {boolean}
	 */
	isValidRNC: (rnc) => {
		if (typeof rnc !== "string") return false;
		const v = rnc.replace(/-/g, "");
		return /^\d{9}$/.test(v);
	},

	/**
	 * Valida una placa vehicular dominicana.
	 * Formatos aceptados: A123456, AB12345
	 * @param {string} placa
	 * @returns {boolean}
	 */
	isValidPlaca: (placa) => {
		if (typeof placa !== "string") return false;
		return /^[A-Z]{1,2}\d{5,6}$/.test(placa.trim().toUpperCase());
	},

	/* ── Números ─────────────────────────────────────────────────────────────── */

	/**
	 * Verifica si un valor es un número válido (no NaN, no Infinity).
	 * @param {*} value
	 * @returns {boolean}
	 */
	isNumber: (value) => {
		const n = Number(value);
		return !isNaN(n) && isFinite(n);
	},

	/**
	 * Verifica si un valor es un número entero.
	 * @param {*} value
	 * @returns {boolean}
	 */
	isInteger: (value) =>
		Validation.isNumber(value) && Number.isInteger(Number(value)),

	/**
	 * Verifica si un número está dentro de un rango (inclusive).
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @returns {boolean}
	 */
	isInRange: (value, min, max) => {
		const n = Number(value);
		return Validation.isNumber(n) && n >= min && n <= max;
	},

	/* ── URLs / Rutas ────────────────────────────────────────────────────────── */

	/**
	 * Verifica si una cadena es una URL válida (http o https).
	 * @param {string} url
	 * @returns {boolean}
	 */
	isValidUrl: (url) => {
		if (typeof url !== "string") return false;
		try {
			const u = new URL(url);
			return u.protocol === "http:" || u.protocol === "https:";
		} catch {
			return false;
		}
	},

	/* ── Fechas ──────────────────────────────────────────────────────────────── */

	/**
	 * Verifica si un valor es una fecha válida.
	 * @param {string|Date|number} value
	 * @returns {boolean}
	 */
	isValidDate: (value) => {
		if (!value) return false;
		const d = new Date(value);
		return !isNaN(d.getTime());
	},

	/**
	 * Verifica si una fecha es posterior a otra.
	 * @param {string|Date} date
	 * @param {string|Date} after
	 * @returns {boolean}
	 */
	isAfter: (date, after) => {
		const a = new Date(date);
		const b = new Date(after);
		return Validation.isValidDate(a) && Validation.isValidDate(b) && a > b;
	},

	/**
	 * Verifica si una fecha es anterior a otra.
	 * @param {string|Date} date
	 * @param {string|Date} before
	 * @returns {boolean}
	 */
	isBefore: (date, before) => {
		const a = new Date(date);
		const b = new Date(before);
		return Validation.isValidDate(a) && Validation.isValidDate(b) && a < b;
	},

	/* ── Archivos ────────────────────────────────────────────────────────────── */

	/**
	 * Verifica si un archivo tiene una extensión permitida.
	 * @param {File|string} file  Objeto File o nombre de archivo
	 * @param {string[]} allowed  Extensiones permitidas, ej: ["jpg","png","pdf"]
	 * @returns {boolean}
	 */
	isAllowedExtension: (file, allowed = []) => {
		const name = file instanceof File ? file.name : String(file);
		const ext  = name.split(".").pop()?.toLowerCase() ?? "";
		return allowed.map((e) => e.toLowerCase()).includes(ext);
	},

	/**
	 * Verifica si un archivo no supera un tamaño máximo.
	 * @param {File} file
	 * @param {number} maxMB  Tamaño máximo en MB
	 * @returns {boolean}
	 */
	isValidFileSize: (file, maxMB) =>
		file instanceof File && file.size <= maxMB * 1024 * 1024,
};

export default Validation;
