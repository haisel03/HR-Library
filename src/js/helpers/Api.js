import axios from "axios";
import config from "../core/config";
import Alert from "./Alert";
import Validation from "./Validation";
import str from "./Strings";

/**
 * @module Api
 * @description
 * Helper centralizado para llamadas HTTP usando Axios.
 */

const instance = axios.create({
	baseURL: config.api?.baseUrl ?? "",
	timeout: config.api?.timeout ?? 15000,
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		Accept: "application/json",
	},
});

let authToken = null;
let autoAlerts = true;

const Api = {
	/**
	 * Extrae un mensaje de error legible desde Axios error
	 * @param {any} error
	 * @returns {string}
	 * @private
	 */
	_extractError: (error) => {
		if (error?.response?.data?.message) return error.response.data.message;
		if (error?.message) return error.message;
		return config.messages.default;
	},

	/**
	 * Muestra alerta de error
	 * @param {string} message
	 * @private
	 */
	_showError: (message) => {
		if (!autoAlerts) return;
		Alert.alert(message, "d");
	},

	/**
	 * Establece el token de autenticación
	 */
	setToken: (token) => {
		authToken = Validation.isNullOrEmpty(token) ? null : token;
	},

	/**
	 * Obtiene el token actual
	 */
	getToken: () => authToken,

	/**
	 * Habilita o deshabilita alertas automáticas
	 */
	setAutoAlerts: (value = true) => {
		autoAlerts = Boolean(value);
	},

	/**
	 * GET
	 */
	get: (url, params = {}, options = {}) => instance.get(url, { params, ...options }),

	/**
	 * POST
	 */
	post: (url, data = {}, options = {}) => instance.post(url, data, options),

	/**
	 * PUT
	 */
	put: (url, data = {}, options = {}) => instance.put(url, data, options),

	/**
	 * PATCH
	 */
	patch: (url, data = {}, options = {}) => instance.patch(url, data, options),

	/**
	 * DELETE
	 */
	delete: (url, options = {}) => instance.delete(url, options),

	/**
	 * Full Instance
	 */
	raw: () => instance,

	fetch: async (url, params = {}, type = "GET") => {
		const method = type.toUpperCase();
		let options = {
			method,
			headers: { 'Content-Type': 'application/json' }
		};

		let finalUrl = url;
		if (method === 'GET') {
			if (Object.keys(params).length > 0) {
				finalUrl += "?" + new URLSearchParams(params).toString();
			}
		} else {
			options.body = JSON.stringify(params);
		}

		try {
			const response = await fetch(finalUrl, options);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP Error ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error("[Api.fetch] Error:", error);
			return error;
		}
	},

	getSelect: async (el, url, params = {}) => {
		const selector = el.startsWith(".") || el.startsWith("#") ? el : `.sl${str.capitalize(el)}`;
		const sl = document.querySelector(selector);
		if (!sl) return;

		sl.innerHTML = '<option value="">Seleccione...</option>';
		try {
			const response = await Api.fetch(url, params);
			const data = response?.data || response; // Handle both {data:[]} and []

			if (Array.isArray(data)) {
				data.forEach(v => {
					const option = document.createElement("option");
					option.value = v.codigo || v.id || "";
					option.textContent = v.descripcion || v.name || v.text || "";
					sl.appendChild(option);
				});
			}
		} catch (error) {
			console.error("[Api.getSelect] Error:", error);
		}
	},
};

// Interceptor Request
instance.interceptors.request.use(
	(request) => {
		if (authToken) {
			request.headers.Authorization = `Bearer ${authToken}`;
		}
		return request;
	},
	(error) => Promise.reject(error)
);

// Interceptor Response
instance.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const message = Api._extractError(error);

		if (error.response) {
			switch (error.response.status) {
				case 401: Api._showError("Sesión expirada o no autorizada"); break;
				case 403: Api._showError("No tiene permisos para esta acción"); break;
				case 404: Api._showError("Recurso no encontrado"); break;
				case 422: Api._showError(message); break;
				case 500: Api._showError("Error interno del servidor"); break;
				default: Api._showError(message);
			}
		} else {
			Api._showError("No se pudo conectar con el servidor");
		}

		return Promise.reject(error);
	},
);
export default Api;
