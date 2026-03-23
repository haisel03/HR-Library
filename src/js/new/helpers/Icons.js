import feather from "feather-icons";
import config from "../core/config";

/**
 * @module Icons
 * @description Helper para manejo de íconos del proyecto.
 */

const LIBS = config.icons;
let defaultLib = LIBS.default || LIBS.bi;

const Icons = {
	LIBS,

	/**
	 * Define la librería de íconos por defecto
	 */
	setDefault: (lib) => {
		if (Object.values(LIBS).includes(lib)) {
			defaultLib = lib;
		}
	},

	/**
	 * Crea un ícono como elemento DOM
	 */
	iconEl: (name, lib = defaultLib, options = {}) => {
		const el = document.createElement("i");
		const cls = options.class ?? "";
		const size = options.size ? ` fs-${options.size}` : "";

		switch (lib) {
			case LIBS.bi:
				el.className = `bi bi-${name}${size} ${cls}`.trim();
				break;

			case LIBS.feather:
				el.setAttribute("data-feather", name);
				if (cls) el.className = cls;
				break;

			case LIBS.fa:
			default: {
				const faSize = options.size ? ` fa-${options.size}x` : "";
				el.className = `fa fa-${name}${faSize} ${cls}`.trim();
				break;
			}
		}

		if (options.color) {
			el.style.color = options.color;
		}

		return el;
	},

	/**
	 * Crea un ícono Font Awesome
	 */
	fa: (name, options = {}) => Icons.iconEl(name, LIBS.fa, options),

	/**
	 * Crea un ícono Bootstrap Icons
	 */
	bi: (name, options = {}) => Icons.iconEl(name, LIBS.bi, options),

	/**
	 * Crea un ícono Feather
	 */
	feather: (name, options = {}) => Icons.iconEl(name, LIBS.feather, options),

	/**
	 * Inicializa Feather Icons
	 */
	init: () => {
		feather.replace();
	},
};

export default Icons;
