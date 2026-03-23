/**
 * @file panel.js
 * @description Demo del modo Iframe (AdminLTE style)
 *
 * CAMBIOS v3:
 * - $HR.msgConfirm → $Alert.confirm
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

		$Iframe.open(title, href, icon);
		$(".tab-empty").addClass("d-none");
	});

	// 2. Botones de Control
	$("#btnIframeFullscreen").on("click", () => $Iframe.toggleFullscreen());
	$("#btnIframeRefresh").on("click",    () => $Iframe.refresh());

	$("#btnCloseOthers").on("click", function (e) {
		e.preventDefault();
		$Alert.confirm("¿Cerrar las demás pestañas?", "Se cerrarán todas las pestañas excepto la actual.", () => {
			$Iframe.closeOthers();
			$Alert.toast.info("Pestañas cerradas");
		});
	});

	$("#btnCloseAll").on("click", function (e) {
		e.preventDefault();
		$Alert.confirm("¿Cerrar todas las pestañas?", "Se cerrarán todas las ventanas abiertas.", () => {
			$Iframe.closeAll();
			$Alert.toast.info("Todas las pestañas cerradas");
		});
	});
});
