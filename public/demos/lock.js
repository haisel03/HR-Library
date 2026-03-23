/**
 * @file lock.js
 * CAMBIOS v3:
 * - $HR.isValidForm      → $Forms.isValidForm
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $Alert.toast.success → ya estaba bien
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#lockForm").on("submit", function (e) {
		e.preventDefault();

		if ($Forms.isValidForm(this)) {
			$Alert.loading();
			setTimeout(() => {
				$Alert.loading(false);
				$Alert.toast.success("Sesión recuperada");
				// window.location.href = 'index.html';
			}, 1000);
		}
	});
});
