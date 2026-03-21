/**
 * @file form-editor.js
 * @description Lógica para la demostración de formularios enriquecidos
 */

$(async function () {
    // 1. Inicializar Componentes vía HR
    const editor = $Editor.create('#full-editor');
    const signature = $Signature.create('#signature-pad');

    // 2. Setup Select2
    $('.select2').each(function () {
        $(this).select2({
            placeholder: $(this).data('placeholder'),
            allowClear: true,
            width: '100%'
        });
    });

    // 3. Setup Flatpickr
    $('.datetimepicker').flatpickr($Date.flatpickr({
        enableTime: true,
        altInput: true,
        altFormat: "F j, Y - H:i",
        dateFormat: "Y-m-d H:i",
    }));

    // 4. Input Masks (Automático via data-mask o manual si se prefiere)
    // La librería HR ya debería inicializar data-mask en el init general,
    // pero podemos forzarlo o agregar comportamientos.

    // 5. Manejo de Firma
    $('#clear-signature').on('click', function () {
        $Signature.clear('#signature-pad');
        $('#signature-input').val('');
        updateDebugger();
    });

    // 6. Validación y Envío
    $('#richForm').on('submit', function (e) {
        e.preventDefault();

        if (!$HR.isValidForm(this)) {
            $HR.msgWarning("Por favor completa los campos requeridos.");
            return;
        }

        // Obtener datos
        const data = $HR.serializeForm(this);
        data.description = $Editor.getHtml('#full-editor');
        data.signature = $Signature.getSignatureData('#signature-pad');

        if (!data.signature) {
            $HR.msgWarning("La firma es obligatoria para este registro.");
            return;
        }

        $HR.msgLoading("Procesando registro...");

        setTimeout(() => {
            $HR.msgLoading(true);
            $HR.msgSuccess("¡Formulario procesado con éxito!", "Los datos han sido validados y serializados correctamente.");
            console.log("Form Data:", data);

            // Resetear después de éxito (opcional)
            // $HR.clearForm('#richForm');
            // $Signature.clear('#signature-pad');
            // $Editor.setHtml('#full-editor', '');
        }, 1500);
    });

    $('#btnReset').on('click', function () {
        $HR.msgConfirm("¿Reiniciar formulario?", "Se perderán todos los cambios ingresados.", () => {
            $HR.clearForm('#richForm');
            $Signature.clear('#signature-pad');
            $Editor.setHtml('#full-editor', '<p>Escribe aquí los detalles del registro...</p>');
            $('.select2').val(null).trigger('change');
            updateDebugger();
            $Alert.toast.info("Formulario reiniciado");
        });
    });

    // 7. Debugger en tiempo real
    $('input, select, textarea').on('input change', updateDebugger);

    function updateDebugger() {
        const data = $HR.serializeForm('#richForm');
        // Limpiar base64 de la firma para el visualizador si es muy largo
        const sig = $Signature.getSignatureData('#signature-pad');
        if (sig) data.signature = "[Base64 Signature Data]";

        $('#form-debugger').text(JSON.stringify(data, null, 4));
    }

    // Inicializar debugger
    updateDebugger();
});
