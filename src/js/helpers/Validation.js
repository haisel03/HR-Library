import config from "../core/config";

/**
 * @module Validation
 * @description
 * Funciones de validación para strings, números y objetos.
 */
const Validation = {
	/**
	 * Verifica si un valor es null, undefined o cadena vacía
	 * @param {*} value
	 * @returns {boolean}
	 */
	isNullOrEmpty: (value) =>
		value === null ||
		value === undefined ||
		(typeof value === "string" && value.trim() === ""),

	/**
	 * Verifica si un valor está vacío
	 * (null, undefined, string vacío, array vacío u objeto vacío)
	 * @param {*} value
	 * @returns {boolean}
	 */
	isEmpty: (value) => {
		if (Validation.isNullOrEmpty(value)) return true;
		if (Array.isArray(value)) return value.length === 0;
		if (typeof value === "object") return Object.keys(value).length === 0;
		return false;
	},

	/**
	 * Valida si un email es correcto
	 * @param {string} email
	 * @param {RegExp} [regex]
	 * @returns {boolean}
	 */
	isValidEmail: (email, regex = config.validation.emailRegex) =>
		typeof email === "string" && regex.test(email),

	/**
	 * Valida si un número telefónico es correcto
	 * @param {string} phone
	 * @param {RegExp} [regex]
	 * @returns {boolean}
	 */
	isValidPhone: (phone, regex = config.validation.phoneRegex) =>
		typeof phone === "string" && regex.test(phone),

	/**
	 * Valida una cédula dominicana
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
};

export default Validation;
