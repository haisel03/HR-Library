/**
 * @module Api
 * @description
 * Helper centralizado para peticiones HTTP en HR Library.
 * Axios con interceptores, autenticación Bearer, CSRF de Laravel,
 * manejo de errores globales y alertas automáticas.
 *
 * Fusiona:
 * - Estructura robusta de interceptores de V1
 * - CSRF token automático de V2
 * - getSelect(), upload() con progreso de V1
 *
 * @example
 * Api.setToken("eyJhbGci...");
 * const usuarios = await Api.get("/usuarios");
 * const nuevo    = await Api.post("/usuarios", { nombre: "Ana" });
 * await Api.upload("/fotos", formData, (pct) => console.log(pct + "%"));
 *
 * @version 3.0.0
 */

import axios    from "axios";
import config   from "../core/config.js";
import Alert    from "./Alert.js";
import Storage  from "./Storage.js";

/* ── Estado interno ── */
const _state = {
  token:      null,
  autoAlerts: true,
};

/* ── Mensajes HTTP localizados ── */
const _HTTP_MESSAGES = Object.freeze({
  401: "Sesión expirada o no autorizada.",
  403: "No tiene permisos para realizar esta acción.",
  404: "El recurso solicitado no fue encontrado.",
  422: null,  // usa el mensaje del servidor
  500: "Error interno del servidor. Inténtelo más tarde.",
});

/* ── Instancia Axios ── */
const _instance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept":           "application/json",
  },
});

// Soporte automático de CSRF Token (Laravel / frameworks similares)
const _csrfToken = typeof document !== "undefined"
  ? document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
  : null;
if (_csrfToken) {
  _instance.defaults.headers.common["X-CSRF-TOKEN"] = _csrfToken;
}

/* ── Funciones privadas ── */
const _extractMessage = (error) =>
  error?.response?.data?.message ??
  error?.response?.data?.error   ??
  error?.message                  ??
  config.messages.error;

const _showError = (message) => {
  if (_state.autoAlerts) Alert.error(message);
};

/* ── Interceptores ── */
_instance.interceptors.request.use(
  (request) => {
    if (_state.token) request.headers.Authorization = `Bearer ${_state.token}`;
    return request;
  },
  (error) => Promise.reject(error),
);

_instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response
      ? (_HTTP_MESSAGES[error.response.status] ?? _extractMessage(error))
      : "No se pudo conectar con el servidor.";
    _showError(message);
    return Promise.reject(error);
  },
);

/* ── Api ── */

const Api = {

  /* ── Configuración ── */

  /**
   * Establece el token Bearer. Null o vacío lo elimina.
   * @param {string|null} token
   */
  setToken(token) {
    _state.token = (!token || String(token).trim() === "") ? null : token;
  },

  /** @returns {string|null} */
  getToken: () => _state.token,

  /**
   * Habilita o deshabilita las alertas automáticas de error.
   * @param {boolean} [value=true]
   */
  setAutoAlerts: (value = true) => { _state.autoAlerts = Boolean(value); },

  /* ── Peticiones ── */

  /**
   * GET — obtener recursos.
   * @param {string} url
   * @param {Object} [params={}]
   * @param {Object} [options={}]
   * @returns {Promise<*>}
   */
  get:    (url, params = {}, options = {}) => _instance.get(url, { params, ...options }),

  /**
   * POST — crear recurso.
   * @param {string} url
   * @param {Object|FormData} [data={}]
   * @param {Object} [options={}]
   * @returns {Promise<*>}
   */
  post:   (url, data = {}, options = {}) => _instance.post(url, data, options),

  /**
   * PUT — reemplazar recurso completo.
   * @param {string} url
   * @param {Object|FormData} [data={}]
   * @param {Object} [options={}]
   * @returns {Promise<*>}
   */
  put:    (url, data = {}, options = {}) => _instance.put(url, data, options),

  /**
   * PATCH — actualización parcial.
   * @param {string} url
   * @param {Object|FormData} [data={}]
   * @param {Object} [options={}]
   * @returns {Promise<*>}
   */
  patch:  (url, data = {}, options = {}) => _instance.patch(url, data, options),

  /**
   * DELETE — eliminar recurso.
   * @param {string} url
   * @param {Object} [options={}]
   * @returns {Promise<*>}
   */
  delete: (url, options = {}) => _instance.delete(url, options),

  /**
   * Sube archivo con multipart/form-data y soporte de progreso.
   * @param {string}   url
   * @param {FormData} formData
   * @param {Function} [onProgress] - `(percent: number) => void`
   * @returns {Promise<*>}
   * @example
   * const fd = new FormData();
   * fd.append("foto", file);
   * await Api.upload("/fotos", fd, (pct) => console.log(pct + "%"));
   */
  upload: (url, formData, onProgress) =>
    _instance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? ({ loaded, total }) => onProgress(Math.round((loaded * 100) / total))
        : undefined,
    }),

  /**
   * Carga un select con datos del servidor.
   * @param {string|HTMLSelectElement} el  - Selector o elemento select.
   * @param {string} url                   - Endpoint que retorna [{id, nombre}].
   * @param {Object} [params={}]
   * @returns {Promise<void>}
   * @example
   * await Api.getSelect("#selectPais", "/paises");
   */
  async getSelect(el, url, params = {}) {
    const select = typeof el === "string" ? document.querySelector(el) : el;
    if (!select) return;
    try {
      const data = await Api.get(url, params);
      const items = Array.isArray(data) ? data : (data?.data ?? []);
      select.innerHTML = `<option value="">Seleccione...</option>` +
        items.map((item) => `<option value="${item.id}">${item.nombre ?? item.name ?? item.label ?? ""}</option>`).join("");
    } catch {
      // Error ya manejado por el interceptor
    }
  },

  /** Retorna la instancia Axios para configuración avanzada. */
  raw: () => _instance,

  /** @returns {void} */
  init() {
    const token = Storage.session.get(config.storage.tokenKey);
    if (token) Api.setToken(token);
    if (config.isDev()) console.info("[Api] Inicializado →", config.api.baseURL);
  },
};

export default Object.freeze(Api);
