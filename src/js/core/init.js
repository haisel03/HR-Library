/**
 * @module init
 * @description
 * Inicializador global de helpers del proyecto.
 *
 * Este módulo se encarga de ejecutar la inicialización de los helpers
 * que requieren configuración o binding automático al cargar la aplicación.
 *
 * Helpers inicializados:
 * - sidebar_helper → Manejo del sidebar / navegación
 * - icons_helper   → Registro e inicialización de librerías de iconos
 * - forms_helper   → Máscaras, validaciones y bindings de formularios
 */

import sidebar from "../helpers/sidebar_helper";
import icons from "../helpers/icons_helper";
import forms from "../helpers/forms_helper";
import select2 from "../helpers/select2_helper";
import table from "../helpers/table_helper";
import signature from "../helpers/signature_helper";
import editor from "../helpers/editor_helper";
import fullscreen from "../helpers/fullscreen_helper";
import excel from "../helpers/excel_helper";

/**
 * Inicializa los helpers globales del proyecto.
 *
 * @function init
 * @param {HTMLElement|Document|string} [scope=document] Elemento raíz para buscar componentes
 * @returns {void}
 *
 * @example
 * import init from "./init";
 * init();
 */
export default function init(scope = document) {
	sidebar.init();
	icons.init();
	forms.init(scope);
	select2.init(scope);
	table.init(scope);
	signature.init(scope);
	editor.init(scope);
	fullscreen.init();
	excel.init();

	// 1. Detectar Modo Iframe (Hider)
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('iframe')) {
		document.body.classList.add('is-iframe-content');

		// Opcional: Forzar ocultamiento si no se usa layout-pure
		const sidebarEl = document.getElementById('sidebar');
		if (sidebarEl) sidebarEl.style.display = 'none';

		const wrapper = document.querySelector('.wrapper');
		if (wrapper) wrapper.classList.add('p-0');

		const main = document.querySelector('.main');
		if (main) main.classList.add('w-100');

		const navbar = document.querySelector('.navbar');
		if (navbar) navbar.style.display = 'none';
	}
}
