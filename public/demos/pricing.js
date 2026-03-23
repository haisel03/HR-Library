/**
 * @file pricing.js
 * CAMBIOS v3:
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgSuccess(t, m) → $Alert.success(texto) — un solo argumento
 * - $HR.msgInfo(t, m)    → $Alert.info(texto)
 */

document.addEventListener("DOMContentLoaded", function () {
	$(".btn-select-plan").on("click", function () {
		const plan = $(this).closest(".card-body").find("h5").text();
		$Alert.loading();

		setTimeout(() => {
			$Alert.loading(false);
			$Alert.success(`Has seleccionado el plan ${plan}. Estamos preparando tu entorno institucional.`);
		}, 1200);
	});

	$("#btn-ventas").on("click", function () {
		$Alert.info("Un ejecutivo de ventas se pondrá en contacto contigo en breve para personalizar tu plan Enterprise.");
	});
});
