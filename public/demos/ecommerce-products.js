/**
 * @file ecommerce-products.js
 * $/
 */

$(function () {
	$('.btn-primary:contains("Añadir al Carrito")').on("click", function (e) {
		e.preventDefault();
		const $btn        = $(this);
		const productName = $btn.closest(".card-body").find(".card-title").text();

		// loading() sin arg = abrir
		App.msgLoading();

		setTimeout(() => {
			// loading(false) = cerrar
			App.msgLoading(false);
			App.msgSuccess(`¡"${productName}" reservado en tu carrito institucional!`);
			$btn.removeClass("btn-primary").addClass("btn-success")
			    .html('<i class="bi bi-check2-all me-1"></i> En el Carrito');
		}, 800);
	});
});


