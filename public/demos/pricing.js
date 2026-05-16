/**
 * @file pricing.js
 * CAMBIOS v3:
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.msgSuccess(t, m) → App.success(texto) — un solo argumento
 * - App.msgInfo(t, m)    → App.info(texto)
 */

document.addEventListener("DOMContentLoaded", function () {
	$(".btn-select-plan").on("click", function () {
		const plan = $(this).closest(".card-body").find("h5").text();
		App.loading();

		setTimeout(() => {
			App.loading(false);
			App.success(`Has seleccionado el plan ${plan}. Estamos preparando tu entorno institucional.`);
		}, 1200);
	});

	$("#btn-ventas").on("click", function () {
		App.info("Un ejecutivo de ventas se pondrá en contacto contigo en breve para personalizar tu plan Enterprise.");
	});
});
