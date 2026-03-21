/**
 * @module Storage
 * @description Helper para manejar almacenamiento local y de sesión.
 */

const Storage = {
	/**
	 * Guarda un valor en localStorage
	 */
	set: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},

	/**
	 * Obtiene un valor de localStorage
	 */
	get: (key, defaultValue = null) => {
		const v = localStorage.getItem(key);
		if (v === null) return defaultValue;
		try {
			return JSON.parse(v);
		} catch {
			return defaultValue;
		}
	},

	/**
	 * Elimina una clave de localStorage
	 */
	remove: (key) => localStorage.removeItem(key),

	/**
	 * Limpia todo el localStorage
	 */
	clear: () => localStorage.clear(),

	/**
	 * Guarda un valor en sessionStorage
	 */
	setSession: (key, value) => {
		sessionStorage.setItem(key, JSON.stringify(value));
	},

	/**
	 * Obtiene un valor de sessionStorage
	 */
	getSession: (key, defaultValue = null) => {
		const v = sessionStorage.getItem(key);
		if (v === null) return defaultValue;
		try {
			return JSON.parse(v);
		} catch {
			return defaultValue;
		}
	},

	/**
	 * Elimina una clave de sessionStorage
	 */
	removeSession: (key) => sessionStorage.removeItem(key),
};

export default Storage;
