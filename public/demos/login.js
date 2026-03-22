document.addEventListener("DOMContentLoaded", function () {
	// Interacción con HR
	$('#loginForm').on('submit', function (e) {
		e.preventDefault();

		if ($HR.isValidForm(this)) {
			$HR.msgLoading();
			// Simulación de login
			setTimeout(() => {
				$HR.msgLoading(true);
				$HR.msgSuccess('¡Bienvenido de nuevo!');
				// window.location.href = 'index.html';
			}, 1500);
		}
	});

	$('#lockForm').on('submit', function (e) {
		e.preventDefault();
		if ($HR.isValidForm(this)) {
			$HR.msgLoading();
			// Simulación de login
			setTimeout(() => {
				$HR.msgLoading(true);
				$HR.msgSuccess('¡Bienvenido de nuevo!');
				window.location.href = 'index.html';
			}, 1500);
		}
	});

});
