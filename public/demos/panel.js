/**
 * @file panel.js
 * @description Demo del modo Iframe (AdminLTE style)
 *
 * CAMBIOS v3:
 * - App.msgConfirm → App.confirm
 * (resto ya usa $Iframe directamente — correcto)
 */

$(function () {
	// 1. Interceptar clicks del sidebar
	$(document).on("click", "#sidebar .sidebar-link", function (e) {
		const href = $(this).attr("href");
		if (!href || href === "#" || $(this).data("bs-toggle") === "collapse") return;

		e.preventDefault();

		const title = $(this).find("span").text() || $(this).text();
		const icon  = $(this).find("i").attr("class") || "bi bi-file-earmark";

		App.open(title, href, icon);
		$(".tab-empty").addClass("d-none");
	});

	// 2. Botones de Control
	$("#btnIframeFullscreen").on("click", () => App.toggleFullscreen());
	$("#btnIframeRefresh").on("click",    () => App.refresh());

	$("#btnCloseOthers").on("click", function (e) {
		e.preventDefault();
		App.confirm("¿Cerrar las demás pestañas?", "Se cerrarán todas las pestañas excepto la actual.", () => {
			App.closeOthers();
			App.toastInfo("Pestañas cerradas");
		});
	});

	$("#btnCloseAll").on("click", function (e) {
		e.preventDefault();
		App.confirm("¿Cerrar todas las pestañas?", "Se cerrarán todas las ventanas abiertas.", () => {
			App.closeAll();
			App.toastInfo("Todas las pestañas cerradas");
		});
	});
});
