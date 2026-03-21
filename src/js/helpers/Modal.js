import { Modal as BSModal } from "bootstrap";
import Dom from "./Dom";

/**
 * @module Modal
 * @description Helper para manejo de modales Bootstrap 5
 */

const instances = new Map();

const Modal = {
	/**
	 * Normaliza un modal a HTMLElement
	 * @param {string|HTMLElement} modal
	 * @returns {HTMLElement|null}
	 */
	resolve: (modal) => {
		if (!modal) return null;
		if (modal instanceof HTMLElement) return modal;
		return Dom.el(modal);
	},

	/**
	 * Obtiene o crea instancia Bootstrap Modal
	 */
	getInstance: (el) => {
		if (!instances.has(el)) {
			instances.set(el, new BSModal(el));
		}
		return instances.get(el);
	},

	/**
	 * Abre un modal
	 */
	open: (modal, data = {}) => {
		const el = Modal.resolve(modal);
		if (!el) return;

		el.__data = data;
		Modal.getInstance(el).show();
	},

	/**
	 * Cierra un modal
	 */
	close: (modal) => {
		const el = Modal.resolve(modal);
		if (!el) return;

		Modal.getInstance(el).hide();
	},

	/**
	 * Alterna un modal
	 */
	toggle: (modal) => {
		const el = Modal.resolve(modal);
		if (!el) return;

		Modal.getInstance(el).toggle();
	},

	/**
	 * Obtiene los datos pasados al modal
	 */
	data: (modal) => {
		const el = Modal.resolve(modal);
		return el?.__data ?? null;
	},
};

export default Modal;
