/**
 * @file login.js
 * CAMBIOS v3:
 * - $HR.isValidForm      → $Forms.isValidForm
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgSuccess       → $Alert.success
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#loginForm").on("submit", function (e) {
		e.preventDefault();

		if ($Forms.isValidForm(this)) {
			$Alert.loading();
			setTimeout(() => {
				$Alert.loading(false);
				$Alert.success("¡Bienvenido de nuevo!");
				// window.location.href = 'index.html';
			}, 1500);
		}
	});

	$("#lockForm").on("submit", function (e) {
		e.preventDefault();
		if ($Forms.isValidForm(this)) {
			$Alert.loading();
			setTimeout(() => {
				$Alert.loading(false);
				$Alert.success("¡Bienvenido de nuevo!");
				window.location.href = "index.html";
			}, 1500);
		}
	});
});
