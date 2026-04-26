/**
 * @module Storage
 * @description
 * Helper de almacenamiento para HR Library.
 * Fusiona lo mejor de ambas versiones:
 * - Namespace por aplicación de V1 (evita colisiones entre apps)
 * - TTL nativo (setTtl/getTtl) de V2
 * - Métodos de sessionStorage planos de V2 (más ergonómicos)
 * - Manejo silencioso de errores de cuota/modo privado
 *
 * @example
 * Storage.set("usuario", { nombre: "Ana" });
 * Storage.get("usuario");                  // { nombre: "Ana" }
 * Storage.setTtl("token", "abc123", 3600); // expira en 1 hora
 * Storage.getTtl("token");                 // "abc123" (o null si expiró)
 * Storage.setSession("vistas", 5);
 *
 * @version 3.0.0
 */

import config from "../../core/config.js";

/* ── Utilidades internas ── */

/**
 * Construye la clave con el prefijo del namespace de la app.
 * Evita colisiones con otras apps en el mismo dominio.
 * @private
 */
const _key = (key) => `${config.storage.namespace}:${key}`;

/**
 * Wrapper genérico para operaciones sobre un Storage.
 * @private
 */
const _wrap = (store) => ({
  set(key, value) {
    try   { store.setItem(_key(key), JSON.stringify(value)); return true; }
    catch { return false; }
  },
  get(key, defaultValue = null) {
    try {
      const v = store.getItem(_key(key));
      if (v === null) return defaultValue;
      return JSON.parse(v);
    } catch { return defaultValue; }
  },
  has:    (key) => { try { return store.getItem(_key(key)) !== null; } catch { return false; } },
  remove: (key) => { try { store.removeItem(_key(key)); } catch { /* noop */ } },
  keys() {
    const prefix = `${config.storage.namespace}:`;
    try { return Object.keys(store).filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length)); }
    catch { return []; }
  },
  clear() { this.keys().forEach((k) => this.remove(k)); },
});

/* ── Storage ── */

const Storage = {

  /* ── localStorage ── */

  /** Guarda un valor en localStorage (JSON stringify automático). @returns {boolean} */
  set:    (key, value)           => _wrap(localStorage).set(key, value),
  /** Obtiene un valor de localStorage. */
  get:    (key, defaultValue = null) => _wrap(localStorage).get(key, defaultValue),
  /** Verifica si una clave existe en localStorage. */
  has:    (key)                  => _wrap(localStorage).has(key),
  /** Elimina una clave de localStorage. */
  remove: (key)                  => _wrap(localStorage).remove(key),
  /** Lista las claves del namespace en localStorage. */
  keys:   ()                     => _wrap(localStorage).keys(),
  /** Limpia solo las claves del namespace en localStorage (no afecta otras apps). */
  clear:  ()                     => _wrap(localStorage).clear(),

  /* ── TTL (Time To Live) ── */

  /**
   * Guarda un valor con tiempo de vida en segundos.
   * @param {string} key
   * @param {*}      value
   * @param {number} ttlSeconds
   * @returns {boolean}
   * @example Storage.setTtl("session", userData, 1800); // 30 min
   */
  setTtl: (key, value, ttlSeconds) =>
    Storage.set(key, { __v: value, __expires: Date.now() + ttlSeconds * 1000 }),

  /**
   * Obtiene un valor con TTL. Elimina la clave si expiró.
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}  null (o defaultValue) si expiró o no existe
   */
  getTtl: (key, defaultValue = null) => {
    const stored = Storage.get(key);
    if (!stored || typeof stored !== "object" || !stored.__expires) return defaultValue;
    if (Date.now() > stored.__expires) { Storage.remove(key); return defaultValue; }
    return stored.__v ?? defaultValue;
  },

  /* ── sessionStorage (métodos planos, más ergonómicos que sub-objeto) ── */

  /** @param {string} key @param {*} value @returns {boolean} */
  setSession:    (key, value)             => _wrap(sessionStorage).set(key, value),
  /** @param {string} key @param {*} [defaultValue] @returns {*} */
  getSession:    (key, defaultValue=null) => _wrap(sessionStorage).get(key, defaultValue),
  /** @param {string} key @returns {boolean} */
  hasSession:    (key)                    => _wrap(sessionStorage).has(key),
  /** @param {string} key */
  removeSession: (key)                    => _wrap(sessionStorage).remove(key),
  /** Limpia las claves del namespace en sessionStorage */
  clearSession:  ()                       => _wrap(sessionStorage).clear(),

  /* ── Sub-objeto session (compatibilidad V1) ── */
  session: {
    set:    (key, value)             => _wrap(sessionStorage).set(key, value),
    get:    (key, defaultValue=null) => _wrap(sessionStorage).get(key, defaultValue),
    has:    (key)                    => _wrap(sessionStorage).has(key),
    remove: (key)                    => _wrap(sessionStorage).remove(key),
    keys:   ()                       => _wrap(sessionStorage).keys(),
    clear:  ()                       => _wrap(sessionStorage).clear(),
  },

  /** @returns {void} */
  init() {
    const tokenKey = config.storage.tokenKey;
    const token = Storage.session.get(tokenKey);
    if (token) Api.setToken(token);
    if (config.isDev()) console.info("[Storage] Token restaurado");
  },
};

export default Object.freeze(Storage);
