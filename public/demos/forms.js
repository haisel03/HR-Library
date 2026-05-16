/**
 * @file forms.js
 * CAMBIOS v3:
 * - App.isValidForm  → $Forms.isValidForm
 * - App.msgLoading() → App.loading()
 * - App.msgLoading(true) → App.loading(false)  (true=abrir, false=cerrar)
 * - App.msgSuccess   → App.success (un solo string)
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#validation-form").on("submit", function (e) {
		e.preventDefault();

		if (App.isValidForm(this)) {
			App.loading();

			setTimeout(() => {
				App.loading(false);
				App.success("La solicitud ha sido procesada correctamente.");
			}, 1500);
		}
	});
});
