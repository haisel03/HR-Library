/**
 * @file lock.js
 * $/
 */

$(function () {
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


