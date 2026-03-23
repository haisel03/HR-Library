import Quill from "quill";
import config from "../core/config";

/**
 * @module Editor
 * @description Helper para editores WYSIWYG usando Quill
 */

const instances = new Map();

const Editor = {
	/**
	 * Inicializa editores Quill
	 */
	init: (scope = document) => {
		scope.querySelectorAll("[data-editor='quill']").forEach((el) => {
			Editor.create(el);
		});
	},

	/**
	 * Crea un editor Quill
	 */
	create: (el, options = {}) => {
		const container = typeof el === "string" ? document.querySelector(el) : el;
		if (!container || instances.has(container)) return null;

		const theme = container.dataset.theme || config.editor.theme;

		const quill = new Quill(container, {
			theme,
			...config.editor.base,
			...options,
		});

		instances.set(container, quill);
		return quill;
	},

	/**
	 * Retorna instancia Quill
	 */
	get: (el) => {
		const container = typeof el === "string" ? document.querySelector(el) : el;
		return instances.get(container) ?? null;
	},

	/**
	 * Retorna el contenido HTML del editor
	 */
	getHtml: (el) => {
		const q = Editor.get(el);
		return q ? q.root.innerHTML : "";
	},

	/**
	 * Establece contenido HTML
	 */
	setHtml: (el, html) => {
		const q = Editor.get(el);
		if (q) q.root.innerHTML = html;
	},

	/**
	 * Destruye un editor
	 */
	destroy: (el) => {
		const container = typeof el === "string" ? document.querySelector(el) : el;
		if (instances.has(container)) {
			instances.delete(container);
			container.innerHTML = "";
		}
	},
};

export default Editor;
