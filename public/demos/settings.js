document.addEventListener("DOMContentLoaded", function () {
    // Manejo institucional de guardado de formularios
    $('form').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $btn = $form.find('button[type="submit"]');
        const originalText = $btn.html();

        if (HR.isValidForm(this)) {
            HR.msgLoading();
            $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Procesando...');

            setTimeout(() => {
                HR.msgLoading(true); // Ocultar
                HR.msgSuccess('Cambios Guardados', 'Tu configuración institucional ha sido actualizada correctamente en el sistema.');
                $btn.prop('disabled', false).html(originalText);
            }, 1500);
        }
    });

    // Simulación de carga de imagen
    $('.btn-primary:contains("Subir")').on('click', function () {
        HR.msgInfo('Módulo de Imagen', 'Selecciona el archivo oficial para tu perfil institucional.');
    });
});
