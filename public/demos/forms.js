/**
 * @file forms.js
 * $/
 */

$(function () {
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


