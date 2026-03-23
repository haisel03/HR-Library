/**
 * @file reset-password.js
 * CAMBIOS v3:
 * - $HR.isValidForm      → $Forms.isValidForm
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgSuccess       → $Alert.success
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#resetForm").on("submit", function (e) {
		e.preventDefault();

		if ($Forms.isValidForm(this)) {
			$Alert.loading();
			setTimeout(() => {
				$Alert.loading(false);
				$Alert.success("Correo enviado con éxito. Revisa tu bandeja de entrada.");
				// window.location.href = 'login.html';
			}, 2000);
		}
	});
});
