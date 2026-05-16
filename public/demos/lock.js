/**
 * @file lock.js
 * CAMBIOS v3:
 * - App.isValidForm      → $Forms.isValidForm
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.toast.success → ya estaba bien
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#lockForm").on("submit", function (e) {
		e.preventDefault();

		if (App.isValidForm(this)) {
			App.loading();
			setTimeout(() => {
				App.loading(false);
				App.toastSuccess("Sesión recuperada");
				// window.location.href = 'index.html';
			}, 1000);
		}
	});
});
