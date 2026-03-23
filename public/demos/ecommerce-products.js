/**
 * @file ecommerce-products.js
 * CAMBIOS v3:
 * - $HR.msgLoading(false)   → $HR.msgLoading(false) o $Alert.close()
 *   El loading se cierra con false, no con true
 *   (en el original msgLoading(true) era confuso — ahora true=abrir, false=cerrar)
 * - $HR.msgSuccess(msg)     — ya no acepta título separado, solo texto.
 *   Si se quiere título, usar Alert.show() con HTML
 */

document.addEventListener("DOMContentLoaded", function () {
	$('.btn-primary:contains("Añadir al Carrito")').on("click", function (e) {
		e.preventDefault();
		const $btn        = $(this);
		const productName = $btn.closest(".card-body").find(".card-title").text();

		// loading() sin arg = abrir
		$HR.msgLoading();

		setTimeout(() => {
			// loading(false) = cerrar
			$HR.msgLoading(false);
			$HR.msgSuccess(`¡"${productName}" reservado en tu carrito institucional!`);
			$btn.removeClass("btn-primary").addClass("btn-success")
			    .html('<i class="bi bi-check2-all me-1"></i> En el Carrito');
		}, 800);
	});
});
