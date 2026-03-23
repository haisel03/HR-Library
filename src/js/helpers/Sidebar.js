import SimpleBar from "simplebar";
import Config from "../core/config.js";

/**
 * @module Sidebar
 * @description
 * Helper para el sidebar: toggle, colapso, SimpleBar, active link y persistencia.
 *
 * Comportamiento según viewport:
 * - Desktop (≥ lg): sidebar visible por defecto, `.collapsed` lo reduce a íconos.
 * - Mobile (< lg):  sidebar oculto por defecto, `.collapsed` lo muestra completo.
 *
 * El estado se persiste en localStorage usando la clave `sidebar:collapsed`.
 *
 * @example
 * // Inicialización automática desde init.js:
 * Sidebar.init();
 *
 * @example
 * // Uso manual:
 * Sidebar.toggle();
 * Sidebar.isCollapsed(); // → true | false
 */

// ── Config ──────────────────────────────────────────────────────────────────

const cfg = { ...Config.sidebar };

// Clave de localStorage para persistir el estado
const STORAGE_KEY = "sidebar:collapsed";

// Breakpoint a partir del cual aplica la lógica de desktop (px)
const DESKTOP_BREAKPOINT = 992; // equivalente a Bootstrap 'lg'

// ── Estado interno ───────────────────────────────────────────────────────────

let simplebarInstance = null;

// ── Helpers privados ─────────────────────────────────────────────────────────

/**
 * Devuelve true si la pantalla es desktop (>= lg).
 * @returns {boolean}
 * @private
 */
const _isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

/**
 * Guarda el estado colapsado en localStorage.
 * @param {boolean} collapsed
 * @private
 */
const _saveState = (collapsed) => {
	try {
		localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
	} catch {
		// localStorage puede no estar disponible (modo privado estricto)
	}
};

/**
 * Lee el estado persistido. Devuelve null si no existe.
 * @returns {boolean|null}
 * @private
 */
const _loadState = () => {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === null) return null;
		return v === "1";
	} catch {
		return null;
	}
};

/**
 * Despacha un evento `resize` al finalizar la transición CSS del sidebar.
 * Necesario para que los gráficos (Chart.js, DataTables, etc.) recalculen
 * su ancho después de que el sidebar termina de animarse.
 * @param {HTMLElement} el
 * @private
 */
const _dispatchResizeOnEnd = (el) => {
	el.addEventListener(
		"transitionend",
		() => window.dispatchEvent(new Event("resize")),
		{ once: true }
	);
};

/**
 * Marca el enlace activo en el sidebar comparando el href con la URL actual.
 * Sube hasta encontrar el `.sidebar-item` padre y le agrega `.active`.
 * Si el enlace activo está dentro de un dropdown colapsado, lo expande.
 * @private
 */
const _markActiveLink = () => {
	const currentPage = window.location.pathname.split("/").pop() || "index.html";

	document
		.querySelectorAll(`${cfg.sidebarSelector} .sidebar-link[href]`)
		.forEach((link) => {
			const href = link.getAttribute("href");
			if (!href || href === "#") return;

			const linkPage = href.split("/").pop().split("?")[0];

			if (linkPage === currentPage) {
				// Marcar el item padre como activo
				link.closest(".sidebar-item")?.classList.add("active");

				// Si está dentro de un dropdown, expandirlo
				const dropdown = link.closest(".sidebar-dropdown");
				if (dropdown) {
					dropdown.classList.add("show");

					// Actualizar el toggle del collapse padre
					const collapseId = dropdown.id;
					const toggle = document.querySelector(
						`[data-bs-target="#${collapseId}"]`
					);
					if (toggle) {
						toggle.classList.remove("collapsed");
						toggle.setAttribute("aria-expanded", "true");
					}
				}
			}
		});
};

// ── API pública ───────────────────────────────────────────────────────────────

const Sidebar = {

	/**
	 * Devuelve el elemento `<nav id="sidebar">`.
	 * @returns {HTMLElement|null}
	 */
	getSidebar: () => document.querySelector(cfg.sidebarSelector),

	/**
	 * Inicializa el sidebar completo.
	 * Llama a: initScroll, initToggle, initActiveLink, initState.
	 *
	 * @param {Object} [overrides={}]  Sobreescribe valores de config en runtime
	 *
	 * @example
	 * Sidebar.init(); // usa config por defecto
	 * Sidebar.init({ collapseClass: "mini" }); // override puntual
	 */
	init: (overrides = {}) => {
		Object.assign(cfg, overrides);
		Sidebar.initScroll();
		Sidebar.initToggle();
		Sidebar.initActiveLink();
		Sidebar.initState();
	},

	/**
	 * Inicializa SimpleBar en el contenedor `.js-simplebar` del sidebar.
	 * Recalcula SimpleBar cuando un collapse de Bootstrap se abre o cierra.
	 */
	initScroll: () => {
		// BUG del original: buscaba por #sidebar-scroll (id) pero el HBS
		// usa .js-simplebar (clase). Ahora busca por .js-simplebar dentro del sidebar.
		const el = document.querySelector(
			`${cfg.sidebarSelector} .js-simplebar`
		);
		if (!el) return;

		simplebarInstance = new SimpleBar(el, {
			autoHide: false,          // barra siempre visible para indicar scroll
			scrollbarMinSize: 24,
		});

		// Recalcular SimpleBar cuando un accordion Bootstrap cambia de altura
		document
			.querySelectorAll(`${cfg.sidebarSelector} [data-bs-parent]`)
			.forEach((collapse) => {
				collapse.addEventListener("shown.bs.collapse",  Sidebar.refresh);
				collapse.addEventListener("hidden.bs.collapse", Sidebar.refresh);
			});
	},

	/**
	 * Inicializa el listener del botón hamburger.
	 * Delega el click en `document` para soportar botones creados dinámicamente.
	 */
	initToggle: () => {
		document.addEventListener("click", (e) => {
			const toggle  = e.target.closest(cfg.toggleSelector);
			const sidebar = Sidebar.getSidebar();
			if (!toggle || !sidebar) return;

			Sidebar.toggle();
			_dispatchResizeOnEnd(sidebar);
		});
	},

	/**
	 * Marca automáticamente el enlace del sidebar que corresponde a la página actual.
	 * En mobile también hace scroll hasta el enlace activo para que sea visible.
	 */
	initActiveLink: () => {
		_markActiveLink();

		// Scroll hasta el link activo en SimpleBar (útil en sidebars largos)
		const activeLink = document.querySelector(
			`${cfg.sidebarSelector} .sidebar-item.active > .sidebar-link`
		);

		if (activeLink && simplebarInstance) {
			setTimeout(() => {
				const scrollEl = simplebarInstance.getScrollElement();
				const offset   = activeLink.offsetTop - scrollEl.clientHeight / 2;
				scrollEl.scrollTop = Math.max(0, offset);
			}, 100);
		}
	},

	/**
	 * Restaura el estado colapsado desde localStorage.
	 * Solo aplica en desktop — en mobile el estado inicial siempre es abierto.
	 */
	initState: () => {
		if (!_isDesktop()) return;

		const saved = _loadState();
		if (saved === true)  Sidebar.collapse();
		if (saved === false) Sidebar.expand();
		// null → no hay estado guardado → respetar el CSS por defecto
	},

	/**
	 * Colapsa el sidebar (agrega `.collapsed`).
	 * En desktop reduce a íconos; en mobile oculta el sidebar.
	 */
	collapse: () => {
		const sidebar = Sidebar.getSidebar();
		if (!sidebar) return;
		sidebar.classList.add(cfg.collapseClass);
		_saveState(true);
	},

	/**
	 * Expande el sidebar (remueve `.collapsed`).
	 */
	expand: () => {
		const sidebar = Sidebar.getSidebar();
		if (!sidebar) return;
		sidebar.classList.remove(cfg.collapseClass);
		_saveState(false);
	},

	/**
	 * Alterna entre colapsado y expandido.
	 * @returns {boolean} Nuevo estado — `true` si quedó colapsado
	 */
	toggle: () => {
		const sidebar = Sidebar.getSidebar();
		if (!sidebar) return false;

		const willCollapse = !sidebar.classList.contains(cfg.collapseClass);
		sidebar.classList.toggle(cfg.collapseClass, willCollapse);
		_saveState(willCollapse);
		return willCollapse;
	},

	/**
	 * Recalcula las dimensiones de SimpleBar.
	 * Llamar después de agregar o remover contenido dinámico en el sidebar.
	 */
	refresh: () => {
		simplebarInstance?.recalculate();
	},

	/**
	 * Devuelve `true` si el sidebar está actualmente colapsado.
	 * @returns {boolean}
	 */
	isCollapsed: () =>
		Sidebar.getSidebar()?.classList.contains(cfg.collapseClass) ?? false,

	/**
	 * Devuelve la instancia de SimpleBar, o null si no fue inicializado.
	 * @returns {SimpleBar|null}
	 */
	getSimpleBar: () => simplebarInstance,
};

export default Sidebar;
