import axios from "axios";
import config from "../core/config";
import alert from "./alert_helper";
import validation from "./validation_helper";

/**
 * @namespace api
 * @description
 * Helper centralizado para llamadas HTTP usando Axios.
 * Maneja interceptores, errores globales, tokens y alertas.
 */

/* =====================================================
   INSTANCIA AXIOS
===================================================== */

/**
 * Instancia principal de Axios
 * @type {import("axios").AxiosInstance}
 */
const instance = axios.create({
  baseURL: config.api?.baseUrl ?? "",
  timeout: config.api?.timeout ?? 15000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

/* =====================================================
   ESTADO INTERNO
===================================================== */

/**
 * Token de autenticación
 * @type {string|null}
 */
let authToken = null;

/**
 * Habilita o deshabilita alertas automáticas
 * @type {boolean}
 */
let autoAlerts = true;

/* =====================================================
   UTILIDADES PRIVADAS
===================================================== */

/**
 * Extrae un mensaje de error legible desde Axios error
 * @param {any} error
 * @returns {string}
 * @private
 */
const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return config.messages.default;
};

/**
 * Muestra alerta de error si autoAlerts está activo
 * @param {string} message
 * @private
 */
const showError = (message) => {
  if (!autoAlerts) return;
  alert.alert(message, "d");
};

/* =====================================================
   INTERCEPTORS
===================================================== */

/**
 * Interceptor de request
 */
instance.interceptors.request.use(
  (request) => {
    if (authToken) {
      request.headers.Authorization = `Bearer ${authToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error),
);

/**
 * Interceptor de response
 */
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = extractErrorMessage(error);

    // Errores HTTP comunes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          showError("Sesión expirada o no autorizada");
          break;
        case 403:
          showError("No tiene permisos para esta acción");
          break;
        case 404:
          showError("Recurso no encontrado");
          break;
        case 422:
          showError(message);
          break;
        case 500:
          showError("Error interno del servidor");
          break;
        default:
          showError(message);
      }
    } else {
      showError("No se pudo conectar con el servidor");
    }

    return Promise.reject(error);
  },
);

/* =====================================================
   API PÚBLICA
===================================================== */

/**
 * Establece el token de autenticación
 * @param {string|null} token
 * @example HR.api.setToken("jwt-token")
 */
const setToken = (token) => {
  authToken = validation.isNullOrEmpty(token) ? null : token;
};

/**
 * Obtiene el token actual
 * @returns {string|null}
 */
const getToken = () => authToken;

/**
 * Habilita o deshabilita alertas automáticas
 * @param {boolean} value
 * @example HR.api.setAutoAlerts(false)
 */
const setAutoAlerts = (value = true) => {
  autoAlerts = Boolean(value);
};

/**
 * Realiza una petición GET
 * @param {string} url
 * @param {Object} [params]
 * @param {Object} [options]
 * @returns {Promise<any>}
 *
 * @example HR.api.get("/users", { page: 1 })
 */
const get = (url, params = {}, options = {}) =>
  instance.get(url, { params, ...options });

/**
 * Realiza una petición POST
 * @param {string} url
 * @param {Object|FormData} data
 * @param {Object} [options]
 * @returns {Promise<any>}
 *
 * @example HR.api.post("/users", { name: "Juan" })
 */
const post = (url, data = {}, options = {}) =>
  instance.post(url, data, options);

/**
 * Realiza una petición PUT
 * @param {string} url
 * @param {Object|FormData} data
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
const put = (url, data = {}, options = {}) =>
  instance.put(url, data, options);

/**
 * Realiza una petición PATCH
 * @param {string} url
 * @param {Object|FormData} data
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
const patch = (url, data = {}, options = {}) =>
  instance.patch(url, data, options);

/**
 * Realiza una petición DELETE
 * @param {string} url
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
const destroy = (url, options = {}) =>
  instance.delete(url, options);

/**
 * Acceso directo a la instancia Axios
 * @returns {import("axios").AxiosInstance}
 */
const raw = () => instance;

/* =====================================================
   EXPORT
===================================================== */

export default {
  // Configuración
  setToken,
  getToken,
  setAutoAlerts,

  // Requests
  get,
  post,
  put,
  patch,
  delete: destroy,

  // Avanzado
  raw,
};
