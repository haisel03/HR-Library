document.addEventListener("DOMContentLoaded", function () {
    // Feedback visual al seguir
    $('#btn-seguir').on('click', function () {
        const $btn = $(this);
        const isActive = $btn.hasClass('btn-success');

        if (!isActive) {
            $btn.removeClass('btn-primary').addClass('btn-success').html('<i class="bi bi-check-lg me-1"></i> Siguiendo');
            $HR.msgSuccess('Suscripción Activa', 'Ahora recibirás notificaciones de la actividad institucional de este usuario.');
        } else {
            $btn.removeClass('btn-success').addClass('btn-primary').html('<i class="bi bi-person-plus me-1"></i> Seguir');
        }
    });

    // Simulación de carga de actividad
    $('#btn-cargar-actividad').on('click', function () {
        $HR.msgLoading();
        setTimeout(() => {
            $HR.msgLoading(true);
            $HR.msgInfo('Archivo Histórico', 'Has llegado al final de la actividad reciente disponible en el sistema.');
        }, 1000);
    });
});
