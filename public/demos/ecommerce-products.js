document.addEventListener("DOMContentLoaded", function () {
    // Feedback institucional al añadir al carrito
    $('.btn-primary:contains("Añadir al Carrito")').on('click', function (e) {
        e.preventDefault();
        const $btn = $(this);
        const productName = $btn.closest('.card-body').find('.card-title').text();

        HR.msgLoading();

        setTimeout(() => {
            HR.msgLoading(true);
            HR.msgSuccess('¡Añadido!', `El producto "${productName}" ha sido reservado en tu carrito institucional.`);

            // Efecto visual en el botón
            $btn.removeClass('btn-primary').addClass('btn-success').html('<i class="bi bi-check2-all me-1"></i> En el Carrito');
        }, 800);
    });
});
