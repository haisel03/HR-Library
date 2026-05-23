/**
 * @module ChoicesJS
 * @description
 * Helper para Choices JS en HR Library.
 * Acceso principal via App.choices*.
 * Auto-inicialización en selects con clase `.choices`.
 *
 * @example
 * ChoicesJS.init();
 * ChoicesJS.setValue("#pais", "DO");
 * ChoicesJS.clear("#pais");
 * ChoicesJS.onChange("#pais", (val) => console.log(val));
 *
 * @version 1.0.0
 */

import Choices from "choices.js";

/* ── Almacén de instancias ── */

const _instances = new WeakMap();

/* ── Config base Choices ── */

const _BASE = Object.freeze({
	silent: false,
	shouldSort: true,
	searchEnabled: true,
	searchChoices: true,
	searchFloor: 1,
	searchResultLimit: 4,
	position: "auto",
	removeItemButton: false,
	placeholder: true,
	placeholderValue: null,
	itemSelectText: "",
	classNames: {
		containerOuter: "choices",
		containerInner: "choices__inner",
		input: "choices__input",
		inputCloned: "choices__input--cloned",
		list: "choices__list",
		listItems: "choices__list--multiple",
		listSingle: "choices__list--single",
		listDropdown: "choices__list--dropdown",
		item: "choices__item",
		itemSelectable: "choices__item--selectable",
		itemDisabled: "choices__item--disabled",
		itemChoice: "choices__item--choice",
		placeholder: "choices__placeholder",
		group: "choices__group",
		groupHeading: "choices__heading",
		button: "choices__button",
		activeState: "is-active",
		focusState: "is-focused",
		openState: "is-open",
		disabledState: "is-disabled",
		highlightedState: "is-highlighted",
		selectedState: "is-selected",
		flippedState: "is-flipped",
		loadingState: "is-loading",
		noResults: "has-no-results",
		noChoices: "has-no-choices",
	},
	renderChoiceLimit: -1,
	recurseLimit: 3,
});

/* ── Helpers privados ── */

const _el = (target) => {
	if (!target) return null;
	if (target instanceof HTMLElement) return target;
	return document.querySelector(target);
};

const _getInstance = (el) => {
	const element = _el(el);
	return element ? _instances.get(element) : null;
};

const _destroy = (el) => {
	const instance = _getInstance(el);
	if (instance) {
		instance.destroy();
		_instances.delete(_el(el));
	}
};

/* ── ChoicesJS ── */

const ChoicesJS = {
	/* ── Inicialización ── */

	/**
	 * Inicializa Choices en todos los `<select class="choices">` del scope.
	 * Detecta el atributo `multiple` y ajusta opciones automáticamente.
	 *
	 * @param {HTMLElement|Document} [scope=document]
	 * @param {Object} [options={}]  Opciones adicionales de Choices.
	 */
	init(scope = document, options = {}) {
		const root = scope === document ? document : _el(scope);
		if (!root) return;

		const selects = root.querySelectorAll("select.choices");
		if (!selects.length) return;

		selects.forEach((select) => {
			_destroy(select);

			const isMultiple = select.hasAttribute("multiple");
			const hasRemoveBtn = select.dataset.removeItemButton === "true";

			const instance = new Choices(select, {
				..._BASE,
				removeItemButton: isMultiple ? true : hasRemoveBtn,
				placeholderValue: select.dataset.placeholder || null,
				searchEnabled: select.dataset.search !== "false",
				...options,
			});

			_instances.set(select, instance);
		});
	},

	/* ── Control de instancias ── */

	/**
	 * Obtiene la instancia de Choices asociada a un select.
	 * @param {string|HTMLElement} el
	 * @returns {Object|null}
	 */
	getInstance: (el) => _getInstance(el),

	/**
	 * Obtiene el valor actual de un Choices.
	 * @param {string|HTMLElement} el
	 * @param {boolean} [asString=true] true devuelve string, false devuelve array de objetos {value, label}
	 * @returns {string|string[]|null}
	 */
	getValue(el, asString = true) {
		const instance = _getInstance(el);
		if (!instance) return null;
		return instance.getValue(asString);
	},

	/**
	 * Establece el valor de un Choices.
	 * @param {string|HTMLElement} el
	 * @param {string|string[]|{value:string,label:string}[]} value
	 *   Si es string o string[], se envuelve automáticamente.
	 * @param {boolean} [triggerChange=true] Dispara evento change.
	 */
	setValue(el, value, triggerChange = true) {
		const instance = _getInstance(el);
		if (!instance) return;

		const items = Array.isArray(value)
			? value.map((v) => (typeof v === "object" ? v : { value: v, label: v }))
			: [{ value, label: value }];

		instance.setValue(items);
		if (triggerChange) {
			const native = _el(el);
			if (native) native.dispatchEvent(new Event("change"));
		}
	},

	/**
	 * Limpia la selección de un Choices.
	 * @param {string|HTMLElement} el
	 */
	clear(el) {
		const instance = _getInstance(el);
		if (!instance) return;
		instance.removeActiveItems();
	},

	/* ── Estado ── */

	/**
	 * Habilita un Choices.
	 * @param {string|HTMLElement} el
	 */
	enable(el) {
		const instance = _getInstance(el);
		if (!instance) return;
		instance.setEnabled(true);
	},

	/**
	 * Deshabilita un Choices.
	 * @param {string|HTMLElement} el
	 */
	disable(el) {
		const instance = _getInstance(el);
		if (!instance) return;
		instance.setEnabled(false);
	},

	/**
	 * Destruye la instancia de Choices.
	 * @param {string|HTMLElement} el
	 */
	destroy: (el) => _destroy(el),

	/* ── Eventos ── */

	/**
	 * Registra un callback al cambiar el valor.
	 * @param {string|HTMLElement} el
	 * @param {Function} callback  `(value) => void`
	 */
	onChange(el, callback) {
		if (typeof callback !== "function") return;
		const element = _el(el);
		if (!element) return;
		element.addEventListener("change", () => {
			const instance = _getInstance(element);
			if (!instance) return;
			callback(instance.getValue(true));
		});
	},
};

export default Object.freeze(ChoicesJS);
