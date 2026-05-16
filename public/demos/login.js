/**
 * @file login.js
 * $/
 */

$(function () {
	$("#loginForm").on("submit", function (e) {
		e.preventDefault();

		if (App.isValidForm(this)) {
			App.loading();
			setTimeout(() => {
				App.loading(false);
				App.success("¡Bienvenido de nuevo!");
				// window.location.href = 'index.html';
			}, 1500);
		}
	});

	$("#lockForm").on("submit", function (e) {
		e.preventDefault();
		if (App.isValidForm(this)) {
			App.loading();
			setTimeout(() => {
				App.loading(false);
				App.success("¡Bienvenido de nuevo!");
				window.location.href = "index.html";
			}, 1500);
		}
	});
});


