/**
 * @module init
 * @description
 * Inicializador global de helpers del proyecto.
 * Se ejecuta en DOMContentLoaded desde app.js vía $HR.init().
 *
 * Orden de inicialización:
 * 1. Sidebar     — SimpleBar + toggle + active link + estado persistido
 * 2. Icons       — feather.replace() para íconos data-feather
 * 3. Forms       — máscaras Inputmask + toggle-password listeners
 * 4. Select2     — inicializa select.select2 dentro del scope
 * 5. Table       — inicializa table[data-target="dt"]
 * 6. Signature   — inicializa canvas[data-signature]
 * 7. Editor      — inicializa [data-editor="quill"]
 * 8. Fullscreen  — binding de [data-widget="fullscreen"]
 * 9. Excel       — binding de [data-excel]
 * 10. Modo iframe — oculta sidebar/navbar si ?iframe=1
 */

import Sidebar    from "../helpers/Sidebar";
import Icons      from "../helpers/Icons";
import Forms      from "../helpers/Forms";
import Select2    from "../helpers/Select2";
import Table      from "../helpers/Table";
import Signature  from "../helpers/Signature";
import Editor     from "../helpers/Editor";
import Fullscreen from "../helpers/Fullscreen";
import Excel      from "../helpers/Excel";
import Dom        from "../helpers/Dom";
import DateHelper from "../helpers/Date";

/**
 * Inicializa todos los helpers automáticos del framework.
 *
 * @param {HTMLElement|Document|string} [scope=document]
 *   Elemento raíz para limitar el alcance de la inicialización.
 *   Útil al abrir modales o cargar contenido dinámico.
 *
 * @example
 * // Inicio global (en app.js)
 * $(function () { $HR.init(); });
 *
 * @example
 * // Reinicializar dentro de un modal recién abierto
 * $HR.init("#myModal");
 */
export default function init(scope = document) {
	const root = scope === document ? document : Dom.el(scope);

	// 1. Sidebar — solo en init global (no re-inicializar en cada modal)
	if (scope === document) {
		Sidebar.init();
	}

	// 2. Feather Icons
	Icons.init();

	// 3. Máscaras y toggle-password
	Forms.init(root);

	// 4. Select2
	Select2.init(root);

	// 5. DataTables auto-init
	Table.init(root);

	// 6. Firmas digitales
	Signature.init(root);

	// 7. Editor Quill
	Editor.init(root);

	// 8. Fullscreen — solo en init global
	if (scope === document) {
		Fullscreen.init();
	}
	// 9. DateHelper
	DateHelper.init(root);

	// 10. Excel data-excel buttons
	Excel.init();

	// 11. Detección de modo iframe
	

	// Si la URL tiene ?iframe=1, ocultar sidebar y navbar para uso embebido
	if (scope === document) {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("iframe")) {
			document.body.classList.add("is-iframe-content");

			const sidebar = document.getElementById("sidebar");
			if (sidebar) sidebar.style.display = "none";

			Dom.addClass(".wrapper", "p-0");
			Dom.addClass(".main", "w-100");

			const navbar = document.querySelector(".navbar");
			if (navbar) navbar.style.display = "none";
		}
	}
}
