/**
 * @module init
 * @description
 * Inicializador global de helpers del proyecto.
 *
 * Este módulo se encarga de ejecutar la inicialización de los helpers
 * que requieren configuración o binding automático al cargar la aplicación.
 */

import Sidebar from "../helpers/Sidebar";
import Icons from "../helpers/Icons";
import Forms from "../helpers/Forms";
import Select2 from "../helpers/Select2";
import Table from "../helpers/Table";
import Signature from "../helpers/Signature";
import Editor from "../helpers/Editor";
import Fullscreen from "../helpers/Fullscreen";
import Excel from "../helpers/Excel";

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
	Sidebar.init();
	Icons.init();
	Forms.init(scope);
	Select2.init(scope);
	Table.init(scope);
	Signature.init(scope);
	Editor.init(scope);
	Fullscreen.init();
	Excel.init();

	// 1. Detectar Modo Iframe (Hider)
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("iframe")) {
		document.body.classList.add("is-iframe-content");

		// Opcional: Forzar ocultamiento si no se usa layout-pure
		const sidebarEl = document.getElementById("sidebar");
		if (sidebarEl) sidebarEl.style.display = "none";

		const wrapper = document.querySelector(".wrapper");
		if (wrapper) wrapper.classList.add("p-0");

		const main = document.querySelector(".main");
		if (main) main.classList.add("w-100");

		const navbar = document.querySelector(".navbar");
		if (navbar) navbar.style.display = "none";
	}
}
