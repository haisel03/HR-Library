document.addEventListener("DOMContentLoaded", function () {
    $('#validation-form').on('submit', function (e) {
        e.preventDefault();

        if ($HR.isValidForm(this)) {
            $HR.msgLoading();

            // Simulación de procesamiento asíncrono
            setTimeout(() => {
                $HR.msgLoading(true); // Ocultar loading
                $HR.msgSuccess('¡Éxito!', 'La solicitud ha sido procesada de manera institucional correctamente.');
            }, 1500);
        }
    });
});
