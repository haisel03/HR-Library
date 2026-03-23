/**
 * @file settings.js
 * CAMBIOS v3:
 * - $HR.isValidForm      → $Forms.isValidForm
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgSuccess(t, m) → $Alert.success(texto)
 * - $HR.msgInfo          → $Alert.info
 */

document.addEventListener("DOMContentLoaded", function () {
	$("form").on("submit", function (e) {
		e.preventDefault();
		const $form = $(this);
		const $btn  = $form.find('button[type="submit"]');
		const originalText = $btn.html();

		if ($Forms.isValidForm(this)) {
			$Alert.loading();
			$btn.prop("disabled", true)
			    .html('<span class="spinner-border spinner-border-sm me-1"></span> Procesando...');

			setTimeout(() => {
				$Alert.loading(false);
				$Alert.success("Tu configuración institucional ha sido actualizada correctamente en el sistema.");
				$btn.prop("disabled", false).html(originalText);
			}, 1500);
		}
	});

	$('.btn-primary:contains("Subir")').on("click", function () {
		$Alert.info("Selecciona el archivo oficial para tu perfil institucional.");
	});
});
