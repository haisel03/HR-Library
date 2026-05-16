/**
 * @file reset-password.js
 * $/
 */

$(function () {
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


