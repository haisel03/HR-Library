/**
 * @file reset-password.js
 * CAMBIOS v3:
 * - App.isValidForm      → $Forms.isValidForm
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.msgSuccess       → App.success
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#resetForm").on("submit", function (e) {
		e.preventDefault();

		if (App.isValidForm(this)) {
			App.loading();
			setTimeout(() => {
				App.loading(false);
				App.success("Correo enviado con éxito. Revisa tu bandeja de entrada.");
				// window.location.href = 'login.html';
			}, 2000);
		}
	});
});
