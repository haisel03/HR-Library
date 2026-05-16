/**
 * @file profile.js
 * CAMBIOS v3:
 * - App.msgSuccess(t, m) → App.success(texto)
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.msgInfo(t, m)    → App.info(texto)
 */

document.addEventListener("DOMContentLoaded", function () {
	$("#btn-seguir").on("click", function () {
		const $btn     = $(this);
		const isActive = $btn.hasClass("btn-success");

		if (!isActive) {
			$btn.removeClass("btn-primary").addClass("btn-success")
			    .html('<i class="bi bi-check-lg me-1"></i> Siguiendo');
			App.success("Ahora recibirás notificaciones de la actividad institucional de este usuario.");
		} else {
			$btn.removeClass("btn-success").addClass("btn-primary")
			    .html('<i class="bi bi-person-plus me-1"></i> Seguir');
		}
	});

	$("#btn-cargar-actividad").on("click", function () {
		App.loading();
		setTimeout(() => {
			App.loading(false);
			App.info("Has llegado al final de la actividad reciente disponible en el sistema.");
		}, 1000);
	});
});
