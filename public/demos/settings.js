/**
 * @file settings.js
 * CAMBIOS v3:
 * - App.isValidForm      → $Forms.isValidForm
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.msgSuccess(t, m) → App.success(texto)
 * - App.msgInfo          → App.info
 */

document.addEventListener("DOMContentLoaded", function () {
	$("form").on("submit", function (e) {
		e.preventDefault();
		const $form = $(this);
		const $btn  = $form.find('button[type="submit"]');
		const originalText = $btn.html();

		if (App.isValidForm(this)) {
			App.loading();
			$btn.prop("disabled", true)
			    .html('<span class="spinner-border spinner-border-sm me-1"></span> Procesando...');

			setTimeout(() => {
				App.loading(false);
				App.success("Tu configuración institucional ha sido actualizada correctamente en el sistema.");
				$btn.prop("disabled", false).html(originalText);
			}, 1500);
		}
	});

	$('.btn-primary:contains("Subir")').on("click", function () {
		App.info("Selecciona el archivo oficial para tu perfil institucional.");
	});
});
