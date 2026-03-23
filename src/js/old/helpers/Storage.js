/**
 * @module Storage
 * @description
 * Helper para almacenamiento local y de sesión.
 * Maneja serialización/deserialización JSON y errores de localStorage
 * (modo privado estricto, cuota excedida, etc.) de forma silenciosa.
 *
 * @example
 * $Storage.set("user", { id: 1, nombre: "Carlos" });
 * $Storage.get("user");            // { id: 1, nombre: "Carlos" }
 * $Storage.has("user");            // true
 * $Storage.setTtl("token", "abc", 3600); // expira en 1 hora
 */

const Storage = {

	/* ── localStorage ────────────────────────────────────────────────────────── */

	/**
	 * Guarda un valor en localStorage (JSON stringify automático).
	 * @param {string} key
	 * @param {*} value
	 * @returns {boolean}  true si se guardó correctamente
	 */
	set: (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	},

	/**
	 * Obtiene un valor de localStorage.
	 * @param {string} key
	 * @param {*} [defaultValue=null]
	 * @returns {*}
	 */
	get: (key, defaultValue = null) => {
		try {
			const v = localStorage.getItem(key);
			if (v === null) return defaultValue;
			return JSON.parse(v);
		} catch {
			return defaultValue;
		}
	},

	/**
	 * Verifica si una clave existe en localStorage.
	 * @param {string} key
	 * @returns {boolean}
	 */
	has: (key) => {
		try {
			return localStorage.getItem(key) !== null;
		} catch {
			return false;
		}
	},

	/**
	 * Elimina una clave de localStorage.
	 * @param {string} key
	 */
	remove: (key) => {
		try { localStorage.removeItem(key); } catch { /* noop */ }
	},

	/**
	 * Limpia todo el localStorage.
	 * ⚠️ Elimina TODAS las claves del dominio.
	 */
	clear: () => {
		try { localStorage.clear(); } catch { /* noop */ }
	},

	/**
	 * Guarda un valor con TTL (tiempo de vida en segundos).
	 * `Storage.getTtl` valida la expiración al leer.
	 * @param {string} key
	 * @param {*} value
	 * @param {number} ttlSeconds
	 * @returns {boolean}
	 */
	setTtl: (key, value, ttlSeconds) =>
		Storage.set(key, {
			__v:       value,
			__expires: Date.now() + ttlSeconds * 1000,
		}),

	/**
	 * Obtiene un valor con TTL. Elimina la clave si expiró.
	 * @param {string} key
	 * @param {*} [defaultValue=null]
	 * @returns {*}  null si expiró
	 */
	getTtl: (key, defaultValue = null) => {
		const stored = Storage.get(key);
		if (!stored || typeof stored !== "object" || !stored.__expires) {
			return defaultValue;
		}
		if (Date.now() > stored.__expires) {
			Storage.remove(key);
			return defaultValue;
		}
		return stored.__v ?? defaultValue;
	},

	/**
	 * Devuelve todas las claves de localStorage como array.
	 * @returns {string[]}
	 */
	keys: () => {
		try {
			return Object.keys(localStorage);
		} catch {
			return [];
		}
	},

	/* ── sessionStorage ──────────────────────────────────────────────────────── */

	/**
	 * Guarda un valor en sessionStorage.
	 * @param {string} key
	 * @param {*} value
	 * @returns {boolean}
	 */
	setSession: (key, value) => {
		try {
			sessionStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	},

	/**
	 * Obtiene un valor de sessionStorage.
	 * @param {string} key
	 * @param {*} [defaultValue=null]
	 * @returns {*}
	 */
	getSession: (key, defaultValue = null) => {
		try {
			const v = sessionStorage.getItem(key);
			if (v === null) return defaultValue;
			return JSON.parse(v);
		} catch {
			return defaultValue;
		}
	},

	/**
	 * Verifica si una clave existe en sessionStorage.
	 * @param {string} key
	 * @returns {boolean}
	 */
	hasSession: (key) => {
		try {
			return sessionStorage.getItem(key) !== null;
		} catch {
			return false;
		}
	},

	/**
	 * Elimina una clave de sessionStorage.
	 * @param {string} key
	 */
	removeSession: (key) => {
		try { sessionStorage.removeItem(key); } catch { /* noop */ }
	},

	/**
	 * Limpia todo el sessionStorage.
	 */
	clearSession: () => {
		try { sessionStorage.clear(); } catch { /* noop */ }
	},
};

export default Storage;
