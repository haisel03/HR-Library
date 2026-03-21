import SimpleBar from "simplebar";
import Config from "../core/config";

const config = Config.sidebar;

/**
 * @module Sidebar
 * @description Helper para manejar el comportamiento del sidebar.
 */

let simplebarInstance = null;

const Sidebar = {
	/**
	 * Obtiene el elemento sidebar
	 */
	getSidebar: () => document.querySelector(config.sidebarSelector),

	/**
	 * Obtiene el botón toggle
	 */
	getToggle: () => document.querySelector(config.toggleSelector),

	/**
	 * Dispara un evento resize al finalizar una transición CSS
	 */
	dispatchResize: (el) => {
		el.addEventListener(
			"transitionend",
			() => window.dispatchEvent(new Event("resize")),
			{ once: true }
		);
	},

	/**
	 * Inicializa el sidebar
	 */
	init: (customConfig = {}) => {
		Object.assign(config, customConfig);
		Sidebar.initScroll();
		Sidebar.initToggle();
	},

	/**
	 * Inicializa SimpleBar
	 */
	initScroll: () => {
		const el = document.querySelector(config.simplebarSelector);
		if (!el) return;

		if (!simplebarInstance) {
			simplebarInstance = new SimpleBar(el);
		}

		document
			.querySelectorAll(`${config.sidebarSelector} [data-bs-parent]`)
			.forEach((collapse) => {
				collapse.addEventListener("shown.bs.collapse", Sidebar.refresh);
				collapse.addEventListener("hidden.bs.collapse", Sidebar.refresh);
			});
	},

	/**
	 * Inicializa el botón toggle
	 */
	initToggle: () => {
		document.addEventListener("click", (e) => {
			const toggle = e.target.closest(config.toggleSelector);
			const sidebar = Sidebar.getSidebar();

			if (toggle && sidebar) {
				Sidebar.toggle();
				Sidebar.dispatchResize(sidebar);
			}
		});
	},

	/**
	 * Colapsa el sidebar
	 */
	collapse: () => {
		Sidebar.getSidebar()?.classList.add(config.collapseClass);
	},

	/**
	 * Expande el sidebar
	 */
	expand: () => {
		Sidebar.getSidebar()?.classList.remove(config.collapseClass);
	},

	/**
	 * Alterna el estado del sidebar
	 */
	toggle: () => {
		const sidebar = Sidebar.getSidebar();
		if (sidebar) {
			sidebar.classList.toggle(config.collapseClass);
		}
	},

	/**
	 * Recalcula el tamaño del SimpleBar
	 */
	refresh: () => {
		simplebarInstance?.recalculate();
	},

	/**
	 * Indica si el sidebar está colapsado
	 */
	isCollapsed: () => Sidebar.getSidebar()?.classList.contains(config.collapseClass) ?? false,
};

export default Sidebar;
