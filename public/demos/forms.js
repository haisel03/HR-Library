/**
 * @file forms.js
 * CAMBIOS v3:
 * - $HR.isValidForm  → $Forms.isValidForm
 * - $HR.msgLoading() → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)  (true=abrir, false=cerrar)
 * - $HR.msgSuccess   → $Alert.success (un solo string)
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#validation-form").on("submit", function (e) {
		e.preventDefault();

		if ($Forms.isValidForm(this)) {
			$Alert.loading();

			setTimeout(() => {
				$Alert.loading(false);
				$Alert.success("La solicitud ha sido procesada correctamente.");
			}, 1500);
		}
	});
});
