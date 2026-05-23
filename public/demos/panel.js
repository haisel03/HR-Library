/**
 * @file panel.js
 * @description Demo del modo Iframe (AdminLTE style)
 *
 * $/
 */

$(function () {
	// 1. Interceptar clicks del sidebar
	$(document).on("click", "#sidebar .sidebar-link", function (e) {
		const href = $(this).attr("href");
		if (!href || href === "#" || $(this).data("bs-toggle") === "collapse") return;

		e.preventDefault();

		const title = $(this).find("span").text() || $(this).text();
		const icon  = $(this).find("i").attr("class") || "bi bi-file-earmark";

		App.iframeOpen(title, href, icon);
	});

	// 2. Botones de Control
	$("#btnIframeFullscreen").on("click", () => App.iframeFullscreen());
	$("#btnIframeRefresh").on("click",    () => App.iframeRefresh());

	$("#btnCloseOthers").on("click", function (e) {
		e.preventDefault();
		App.confirm("¿Cerrar las demás pestañas?", "Se cerrarán todas las pestañas excepto la actual.", () => {
			App.iframeCloseOthers();
			App.toastInfo("Pestañas cerradas");
		});
	});

	$("#btnCloseAll").on("click", function (e) {
		e.preventDefault();
		App.confirm("¿Cerrar todas las pestañas?", "Se cerrarán todas las ventanas abiertas.", () => {
			App.iframeCloseAll();
			App.toastInfo("Todas las pestañas cerradas");
		});
	});
});
