/**
 * @module storage
 * @description
 * Helper para manejar almacenamiento local y de sesión
 * con serialización automática.
 */

const storage = {
  /**
   * Guarda un valor en localStorage
   * @param {string} key
   * @param {*} value
   */
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Obtiene un valor de localStorage
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}
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
   * @param {string} key
   */
  remove: (key) => localStorage.removeItem(key),

  /**
   * Limpia todo el localStorage
   */
  clear: () => localStorage.clear(),

  /**
   * Guarda un valor en sessionStorage
   * @param {string} key
   * @param {*} value
   */
  setSession: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Obtiene un valor de sessionStorage
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}
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
   * @param {string} key
   */
  removeSession: (key) => sessionStorage.removeItem(key),
};

export default storage;
