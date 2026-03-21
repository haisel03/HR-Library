document.addEventListener("DOMContentLoaded", function () {
    // Selección de plan
    $('.btn-select-plan').on('click', function () {
        const plan = $(this).closest('.card-body').find('h5').text();
        $HR.msgLoading();

        setTimeout(() => {
            $HR.msgLoading(true);
            $HR.msgSuccess('Suscripción Actualizada', `Has seleccionado el plan ${plan}. Estamos preparando tu entorno institucional.`);
        }, 1200);
    });

    // Contactar ventas
    $('#btn-ventas').on('click', function () {
        $HR.msgInfo('Soporte Institucional', 'Un ejecutivo de ventas se pondrá en contacto contigo en breve para personalizar tu plan Enterprise.');
    });
});
