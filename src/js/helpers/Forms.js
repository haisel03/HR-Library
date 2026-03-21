import Inputmask from "inputmask";
import Validation from "./Validation";
import Dom from "./Dom";

/**
 * @module Forms
 * @description
 * Helper de formularios: máscaras, validación visual y serialización.
 * Compatible con Bootstrap 5, Select2 e Inputmask.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   UTILIDADES INTERNAS
───────────────────────────────────────────────────────────────────────────── */

/**
 * Inserta un .invalid-feedback después del elemento correcto.
 * Si el campo es un Select2, el feedback va después del contenedor .select2.
 * @param {HTMLElement} input
 * @param {string} message
 * @private
 */
const _addError = (input, message) => {
	const isSelect2 = input.classList.contains("select2-hidden-accessible");

	// El anchor es el span.select2 visible (para Select2) o el input mismo
	const anchor = isSelect2 ? input.nextElementSibling : input;

	input.classList.add("is-invalid");

	// Marcar también el contenedor visual de Select2
	if (isSelect2 && anchor) {
		anchor.classList.add("is-invalid");
	}

	// Evitar duplicar feedback
	const existing = anchor?.nextElementSibling;
	if (existing?.classList.contains("invalid-feedback")) existing.remove();

	const div = document.createElement("div");
	div.className = "invalid-feedback";
	div.textContent = message;

	anchor
		? anchor.insertAdjacentElement("afterend", div)
		: input.insertAdjacentElement("afterend", div);
};

/**
 * Marca un campo como válido y limpia errores previos.
 * @param {HTMLElement} input
 * @private
 */
const _setValid = (input) => {
	input.classList.remove("is-invalid");
	input.classList.add("is-valid");

	// Select2: limpiar también el span visual
	const next = input.nextElementSibling;
	if (next?.classList.contains("select2")) {
		next.classList.remove("is-invalid");
		next.classList.add("is-valid");
	}

	// Remover feedback de error
	const feedback =
		next?.nextElementSibling?.classList.contains("invalid-feedback")
			? next.nextElementSibling
			: input.nextElementSibling?.classList.contains("invalid-feedback")
			? input.nextElementSibling
			: null;
	feedback?.remove();
};

/**
 * Verifica si un <select> (nativo o Select2) no tiene valor seleccionado.
 * @param {HTMLSelectElement} select
 * @returns {boolean}
 * @private
 */
const _isSelectEmpty = (select) => {
	const val = select.value;
	return val === null || val === "" || val === undefined;
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER PRINCIPAL
───────────────────────────────────────────────────────────────────────────── */

const Forms = {

	/**
	 * Normaliza cualquier input en un HTMLFormElement.
	 * @param {string|HTMLElement} form
	 * @returns {HTMLFormElement|null}
	 */
	resolveForm: (form) => {
		const el = Dom.el(form);
		if (el instanceof HTMLFormElement) return el;
		return null;
	},

	/**
	 * Limpia todos los estilos y mensajes de validación del formulario.
	 * Soporta Bootstrap 5 y contenedores Select2.
	 * @param {string|HTMLFormElement} form
	 */
	clearValidation: (form) => {
		const f = Forms.resolveForm(form);
		if (!f) return;
		f.querySelectorAll(".is-invalid, .is-valid")
			.forEach((el) => el.classList.remove("is-invalid", "is-valid"));
		f.querySelectorAll(".invalid-feedback, .valid-feedback")
			.forEach((el) => el.remove());
	},

	/**
	 * Inicializa máscaras Inputmask en elementos con data-mask.
	 * @param {string|HTMLElement|Document} [scope=document]
	 */
	init: (scope = document) => {
		const root = scope === document ? document : Dom.el(scope);
		if (!root) return;
		root.querySelectorAll("[data-mask]").forEach((el) => {
			const mask = el.dataset.maskConfig ?? null;
			if (mask && !el.inputmask) Inputmask(mask).mask(el);
		});
	},

	/**
	 * Valida un formulario completo con soporte para:
	 *
	 * - **Required**: `input[required]`, `textarea[required]`, `select[required]`
	 * - **Select2**: detecta `.select2-hidden-accessible`, coloca el feedback
	 *   después del span visual generado por Select2
	 * - **Checkboxes y radios** requeridos (agrupados por `name`)
	 * - **Email**: `input[type="email"]` y `input.email`
	 * - **Teléfono**: `input[type="tel"]` y `input.phone`
	 * - **Inputmask** (`data-mask`): valida `isComplete()` solo si la máscara
	 *   fue inicializada y el campo tiene valor
	 * - Foco automático en el primer campo inválido (Select2 incluido)
	 *
	 * @param {string|HTMLFormElement} form
	 * @returns {boolean} `true` si el formulario es válido
	 *
	 * @example
	 * $('#myForm').on('submit', function(e) {
	 *   e.preventDefault();
	 *   if (Forms.isValidForm(this)) {
	 *     // procesar...
	 *   }
	 * });
	 */
	isValidForm: (form) => {
		const f = Forms.resolveForm(form);
		if (!f) return false;

		Forms.clearValidation(f);
		let valid = true;

		/* ── 1. Inputs y Textareas required ── */
		f.querySelectorAll("input[required], textarea[required]").forEach((input) => {
			// Checkboxes y radios se manejan en su sección propia
			if (input.type === "checkbox" || input.type === "radio") return;
			// El <select> oculto de Select2 tiene este atributo — se maneja en sección 2
			if (input.classList.contains("select2-hidden-accessible")) return;

			if (Validation.isEmpty(input.value)) {
				valid = false;
				_addError(input, "Campo requerido");
			} else {
				_setValid(input);
			}
		});

		/* ── 2. Selects required (nativos + Select2) ── */
		f.querySelectorAll("select[required]").forEach((select) => {
			const isSelect2 = select.classList.contains("select2-hidden-accessible");

			if (_isSelectEmpty(select)) {
				valid = false;
				_addError(select, "Seleccione una opción");

				// Marcar también el .select2-selection (borde rojo Bootstrap 5)
				if (isSelect2) {
					select.nextElementSibling
						?.querySelector(".select2-selection")
						?.classList.add("is-invalid");
				}
			} else {
				_setValid(select);
			}
		});

		/* ── 3. Checkboxes required ── */
		// Agrupa por name — basta con que uno esté marcado en el grupo
		const checkGroups = new Map();
		f.querySelectorAll("input[type='checkbox'][required]").forEach((cb) => {
			const key = cb.name || cb.id;
			if (!checkGroups.has(key)) checkGroups.set(key, []);
			checkGroups.get(key).push(cb);
		});

		checkGroups.forEach((checks) => {
			const anyChecked = checks.some((cb) => cb.checked);
			if (!anyChecked) {
				valid = false;
				_addError(checks[checks.length - 1], "Marca al menos una opción");
			} else {
				checks.forEach(_setValid);
			}
		});

		/* ── 4. Radios required ── */
		const radioGroups = new Map();
		f.querySelectorAll("input[type='radio'][required]").forEach((rb) => {
			if (!radioGroups.has(rb.name)) radioGroups.set(rb.name, []);
			radioGroups.get(rb.name).push(rb);
		});

		radioGroups.forEach((radios) => {
			const anyChecked = radios.some((rb) => rb.checked);
			if (!anyChecked) {
				valid = false;
				_addError(radios[radios.length - 1], "Selecciona una opción");
			} else {
				radios.forEach(_setValid);
			}
		});

		/* ── 5. Email ── */
		f.querySelectorAll("input[type='email'], input.email").forEach((input) => {
			if (Validation.isEmpty(input.value)) return; // vacío ya evaluado en required
			if (!Validation.isValidEmail(input.value)) {
				valid = false;
				_addError(input, "Correo electrónico inválido");
			} else {
				_setValid(input);
			}
		});

		/* ── 6. Teléfono ── */
		f.querySelectorAll("input[type='tel'], input.phone").forEach((input) => {
			if (Validation.isEmpty(input.value)) return;
			if (!Validation.isValidPhone(input.value)) {
				valid = false;
				_addError(input, "Número de teléfono inválido");
			} else {
				_setValid(input);
			}
		});

		/* ── 7. Inputmask ── */
		// Solo validar si: la máscara fue inicializada Y el campo tiene valor
		// (los campos vacíos required ya fueron evaluados en el paso 1)
		f.querySelectorAll("[data-mask]").forEach((input) => {
			if (!input.inputmask) return;
			if (Validation.isEmpty(input.value)) return;

			if (!input.inputmask.isComplete()) {
				valid = false;
				_addError(input, "Formato incompleto");
			} else if (!input.classList.contains("is-invalid")) {
				_setValid(input);
			}
		});

		/* ── 8. Foco en primer campo inválido ── */
		if (!valid) {
			const firstInvalid = f.querySelector(".is-invalid");
			if (firstInvalid?.classList.contains("select2-hidden-accessible")) {
				// Select2: enfocar el input de búsqueda interno
				firstInvalid.nextElementSibling
					?.querySelector(".select2-search__field")
					?.focus();
			} else {
				firstInvalid?.focus();
			}
		}

		return valid;
	},

	/**
	 * Limpia y resetea un formulario.
	 * @param {string|HTMLFormElement} form
	 */
	clearForm: (form) => {
		const f = Forms.resolveForm(form);
		if (!f) return;
		f.reset();
		Forms.clearValidation(f);
	},

	/**
	 * Serializa un formulario en un objeto plano { key: value }.
	 * @param {string|HTMLFormElement} form
	 * @returns {Object}
	 */
	serializeForm: (form) => {
		const f = Forms.resolveForm(form);
		if (!f) return {};
		const data = {};
		new FormData(f).forEach((value, key) => { data[key] = value; });
		return data;
	},

	/**
	 * Obtiene el valor sin máscara de un input Inputmask.
	 * @param {string} selector
	 * @returns {string|null}
	 */
	unmask: (selector) =>
		document.querySelector(selector)?.inputmask?.unmaskedvalue() ?? null,

	/**
	 * Verifica si la máscara de un input está completa.
	 * @param {string} selector
	 * @returns {boolean}
	 */
	isMaskComplete: (selector) =>
		document.querySelector(selector)?.inputmask?.isComplete() ?? false,
};

export default Forms;
