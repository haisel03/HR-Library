/**
 * @file app.js
 * @description Entry point de HR Library.
 * Importa todos los módulos de terceros en orden correcto,
 * inicializa $HR y expone globalmente.
 *
 * @version 3.2.0
 */

// ── Estilos ──────────────────────────────────────────
import "../scss/app.scss"; // Manejar via Vite/webpack

// ── Modulos ──────────────────────────────────────────
import "./modules/index.js";

// ── HR Library ────────────────────────────────────────
import $HR from "./helpers/facades.js";

// ── Inicialización ────────────────────────────────────
$(function () {
	$HR.init();
});

export default $HR;
