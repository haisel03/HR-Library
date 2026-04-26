/**
 * @module Forms
 * @description
 * Helper de formularios para HR Library.
 * Fusiona el manejo de errores Select2-aware de V2 con las
 * funcionalidades avanzadas de V1: submit a API, watch, dirty, fill, submitConfirm.
 * Ahora usa utils/Validation + utils/Dom para SRP perfecto.
 *
 * @example
 * const data = Forms.serialize("#formUsuario");
 * Forms.fill("#formUsuario", usuario);
 * await Forms.submit("#formUsuario", "/usuarios", { method: "post", onSuccess: () => Table.reload("#tbl") });
 * Forms.watch("#formUsuario", (campo, datos) => console.log(campo.name, datos));
 *
 * @version 3.0.0
 */

import Dom from "../utils/Dom.js";
import Validation from "../utils/Validation.js";
import Api from "../data/Api.js";
import Alert from "./Alert.js";
import config from "../../core/config.js";

/* ── Constantes ── */
const FIELDS = "input, select, textarea";
const CLASS_INVALID = "is-invalid";
const CLASS_VALID = "is-valid";
const CLASS_FEEDBACK = "invalid-feedback";

/* ── Utilidades internas ── */

/**
 * Inserta .invalid-feedback después del elemento (Select2/Choices-aware).
 * @private
 */
const _addError = (input, message) => {
	const isSelect2 = input.classList.contains("select2-hidden-accessible");
	const isChoices = input.classList.contains("choices__input--cloned");
	const anchor = isSelect2 ? input.nextElementSibling : input;

	input.classList.add(CLASS_INVALID);
	if (isSelect2 && anchor) anchor.classList.add(CLASS_INVALID);

	const existing = anchor?.nextElementSibling;
	if (existing?.classList.contains(CLASS_FEEDBACK)) existing.remove();

	const div = document.createElement("div");
	div.className = CLASS_FEEDBACK;
	div.textContent = message;
	anchor
		? anchor.insertAdjacentElement("afterend", div)
		: input.insertAdjacentElement("afterend", div);
};

/**
 * Marca un campo como válido y limpia errores previos.
 * @private
 */
const _setValid = (input) => {
	input.classList.remove(CLASS_INVALID);
	input.classList.add(CLASS_VALID);
	const next = input.nextElementSibling;
	if (
		next?.classList.contains("select2-container") ||
		next?.classList.contains("choices__inner")
	) {
		next.classList.remove(CLASS_INVALID);
		next.classList.add(CLASS_VALID);
	}
	const feedback = next?.nextElementSibling?.classList.contains(CLASS_FEEDBACK)
		? next.nextElementSibling
		: input.nextElementSibling?.classList.contains(CLASS_FEEDBACK)
			? input.nextElementSibling
			: null;
	feedback?.remove();
};

/* ── Forms ── */

const Forms = {
	/* ── Resolución ── */

	/**
	 * Normaliza un target a HTMLFormElement.
	 * @param {string|HTMLFormElement} form @returns {HTMLFormElement|null}
	 */
	resolveForm: (form) => {
		if (!form) return null;
		if (form instanceof HTMLFormElement) return form;
		if (typeof form === "string") {
			const el = Dom.el(form);
			return el instanceof HTMLFormElement ? el : null;
		}
		return null;
	},

	/** Alias de resolveForm (compatibilidad V1) */
	resolve: (form) => Forms.resolveForm(form),

	/* ── Serialización ── */

	/**
	 * Serializa los campos del formulario a un objeto plano.
	 * Ignora campos deshabilitados y botones.
	 * @param {string|HTMLFormElement} form @returns {Object}
	 */
	serialize(form) {
		const f = Forms.resolveForm(form);
		if (!f) return {};
		const data = {};
		Dom.qa(FIELDS, f).forEach((el) => {
			const key = el.name || el.id;
			if (!key || el.disabled) return;
			const { type } = el;
			if (type === "button" || type === "submit" || type === "reset") return;
			if (type === "checkbox") {
				data[key] = el.checked;
				return;
			}
			if (type === "radio") {
				if (el.checked) data[key] = el.value;
				return;
			}
			if (type === "number") {
				data[key] = el.value === "" ? null : Number(el.value);
				return;
			}
			data[key] = el.value;
		});
		return data;
	},

	/** Alias de serialize */
	serializeForm: (form) => Forms.serialize(form),

	/* ── Limpieza ── */

	/**
	 * Limpia el formulario y elimina mensajes de error.
	 * @param {string|HTMLFormElement} form
	 */
	clear(form) {
		const f = Forms.resolveForm(form);
		if (!f) return;
		f.reset();
		Forms.resetErrors(f);
		Dom.qa(`.${CLASS_VALID}`, f).forEach((el) =>
			el.classList.remove(CLASS_VALID),
		);
	},

	/** Alias de clear */
	clearForm: (form) => Forms.clear(form),

	/**
	 * Elimina todos los mensajes de error de validación visual.
	 * @param {string|HTMLFormElement} form
	 */
	resetErrors(form) {
		const f = Forms.resolveForm(form);
		if (!f) return;
		Dom.qa(`.${CLASS_INVALID}`, f).forEach((el) =>
			el.classList.remove(CLASS_INVALID),
		);
		Dom.qa(`.${CLASS_FEEDBACK}`, f).forEach((el) => el.remove());
	},

	/* ── Validación visual ── */

	/**
	 * Marca un campo como inválido con mensaje.
	 * Funciona con Select2/Choices.
	 * @param {HTMLElement} input @param {string} message
	 */
	setInvalid: (input, message) => {
		if (input) _addError(input, message);
	},

	/** Marca un campo como válido y limpia errores. */
	setValid: (input) => {
		if (input) _setValid(input);
	},

	/**
	 * Valida el formulario usando HTML5 + utils/Validation.
	 * @param {string|HTMLFormElement} form @returns {boolean}
	 */
	isValid(form) {
		const f = Forms.resolveForm(form);
		if (!f) return false;
		if (!f.checkValidity()) {
			f.reportValidity();
			return false;
		}
		return true;
	},

	/** Alias de isValid */
	isValidForm: (form) => Forms.isValid(form),

	/* ── Llenado ── */

	/**
	 * Rellena los campos del formulario con datos.
	 * @param {string|HTMLFormElement} form @param {Object} [data={}]
	 */
	fill(form, data = {}) {
		const f = Forms.resolveForm(form);
		if (!f) return;
		Object.entries(data).forEach(([key, value]) => {
			const el = Dom.el(`[name="${key}"], #${key}`, f);
			if (!el) return;
			const { type } = el;
			if (type === "checkbox") {
				el.checked = Boolean(value);
				return;
			}
			if (type === "radio") {
				const radio = Dom.el(
					`input[type="radio"][name="${key}"][value="${value}"]`,
					f,
				);
				if (radio) radio.checked = true;
				return;
			}
			el.value = value ?? "";
		});
	},

	/* ── Detección de cambios ── */

	/**
	 * Verifica si formulario dirty.
	 * @param {string|HTMLFormElement} form @returns {boolean}
	 */
	dirty(form) {
		const f = Forms.resolveForm(form);
		if (!f) return false;
		return Dom.qa(FIELDS, f).some((el) => el.defaultValue !== el.value);
	},

	/**
	 * Watch cambios en form.
	 * @param {string|HTMLFormElement} form
	 * @param {Function} callback `(campo, datos) => void`
	 */
	watch(form, callback) {
		const f = Forms.resolveForm(form);
		if (!f || typeof callback !== "function") return;
		Dom.qa(FIELDS, f).forEach((el) => {
			Dom.on(el, "change", (e) => callback(e.target, Forms.serialize(f)));
		});
	},

	/* ── Toggle Password ── */

	togglePassword(passwordInput, toggleButton) {
		const input = Dom.el(passwordInput);
		if (!input) return;
		const type =
			input.getAttribute("type") === "password" ? "text" : "password";
		input.setAttribute("type", type);
		if (toggleButton) {
			const btn = Dom.el(toggleButton);
			const icon = btn?.querySelector("i");
			if (icon) {
				icon.classList.toggle("bi-eye");
				icon.classList.toggle("bi-eye-slash");
			}
		}
	},

	/* ── Submit API ── */

	async submit(form, url, options = {}) {
		const f = Forms.resolveForm(form);
		if (!f) return;
		const { method = "post", reset = true, onSuccess, onError } = options;
		if (!Forms.isValid(f)) return;
		const data = Forms.serialize(f);
		const endpoint = url.startsWith("/") ? url : config.api.apiUrl(url);
		try {
			Alert.loading(true);
			const response = await Api[method](endpoint, data);
			Alert.toast.success(response?.message ?? config.messages.success);
			if (reset) Forms.clear(f);
			if (onSuccess) onSuccess(response);
			return response;
		} catch (error) {
			const msg = error?.response?.data?.message ?? config.messages.error;
			Alert.error(msg);
			if (onError) onError(error);
			throw error;
		} finally {
			Alert.loading(false);
		}
	},

	async submitConfirm(form, url, options = {}) {
		const ok = await Alert.confirm(
			options.confirmMessage ?? "¿Guardar registro?",
		);
		if (!ok) return;
		return Forms.submit(form, url, options);
	},

	init(scope = document) {
		Dom.qa("[data-toggle-password]", scope).forEach((btn) => {
			const targetId = btn.dataset.togglePassword;
			Dom.on(btn, "click", () => Forms.togglePassword(targetId, btn));
		});
	},
};

export default Forms;
