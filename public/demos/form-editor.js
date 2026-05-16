/**
 * @file form-editor.js
 * @description Lógica para la demostración de formularios enriquecidos.
 *
 * $/
 */

$(async function () {
	// 1. Inicializar Componentes
	const editor    = App.createEditor("#full-editor");
	const signature = App.createSignature("#signature-pad");

	// 2. Select2 — inicialización nativa (no usa $Select2.init aquí para mayor control)
	$(".select2").each(function () {
		$(this).select2({
			placeholder: $(this).data("placeholder"),
			allowClear:  true,
			width:       "100%",
		});
	});

	// 3. Flatpickr — flatpickr(selector, opciones), NO jQuery .flatpickr()
	flatpickr(".datetimepicker", App.flatpickrOptions({
		type:      "datetime",
		altInput:  true,
		altFormat: "F j, Y - H:i",
	}));

	// 5. Manejo de Firma
	$("#clear-signature").on("click", function () {
		App.clearSignature("#signature-pad");
		$("#signature-input").val("");
		updateDebugger();
	});

	// 6. Validación y Envío
	$("#richForm").on("submit", function (e) {
		e.preventDefault();

		if (!App.isValidForm(this)) {
			App.warning("Por favor completa los campos requeridos.");
			return;
		}

		const data        = App.serializeForm(this);
		data.description  = App.getEditorHtml("#full-editor");
		// $Signature.toDataURL — reemplaza getSignatureData que no existe
		data.signature    = App.getSignatureData("#signature-pad");

		if (!data.signature) {
			App.warning("La firma es obligatoria para este registro.");
			return;
		}

		// loading() = abrir, loading(false) = cerrar
		App.loading();

		setTimeout(() => {
			App.loading(false);
			App.success("¡Formulario procesado con éxito! Los datos han sido validados y serializados correctamente.");
			console.log("Form Data:", data);
		}, 1500);
	});

	$("#btnReset").on("click", function () {
		App.confirm("¿Reiniciar formulario?", "Se perderán todos los cambios ingresados.", () => {
			App.clearForm("#richForm");
			App.clearSignature("#signature-pad");
			App.setEditorHtml("#full-editor", "<p>Escribe aquí los detalles del registro...</p>");
			$(".select2").val(null).trigger("change");
			updateDebugger();
			App.toastInfo("Formulario reiniciado");
		});
	});

	// 7. Debugger en tiempo real
	$("input, select, textarea").on("input change", updateDebugger);

	function updateDebugger() {
		const data = App.serializeForm("#richForm");
		const sig  = App.getSignatureData("#signature-pad");
		if (sig) data.signature = "[Base64 Signature Data]";
		$("#form-debugger").text(JSON.stringify(data, null, 4));
	}

	updateDebugger();
});

