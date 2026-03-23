/**
 * @file form-editor.js
 * @description Lógica para la demostración de formularios enriquecidos.
 *
 * CAMBIOS v3:
 * - $('.datetimepicker').flatpickr($Date.flatpickr({...}))
 *   → flatpickr('.datetimepicker', $Date.flatpickr({...}))
 *   jQuery .flatpickr() no existe — usar la función global flatpickr()
 * - $HR.isValidForm     → $Forms.isValidForm
 * - $HR.serializeForm   → $Forms.serialize
 * - $HR.clearForm       → $Forms.clear
 * - $HR.msgLoading()    → $Alert.loading()
 * - $HR.msgLoading(true)→ $Alert.loading(false)  (true=abrir, false=cerrar)
 * - $HR.msgSuccess      → $Alert.success  (un solo argumento de texto)
 * - $HR.msgWarning      → $Alert.warning
 * - $HR.msgConfirm      → $Alert.confirm
 * - $Signature.getSignatureData → $Signature.toDataURL
 */

$(async function () {
	// 1. Inicializar Componentes
	const editor    = $Editor.create("#full-editor");
	const signature = $Signature.create("#signature-pad");

	// 2. Select2 — inicialización nativa (no usa $Select2.init aquí para mayor control)
	$(".select2").each(function () {
		$(this).select2({
			placeholder: $(this).data("placeholder"),
			allowClear:  true,
			width:       "100%",
		});
	});

	// 3. Flatpickr — flatpickr(selector, opciones), NO jQuery .flatpickr()
	flatpickr(".datetimepicker", $Date.flatpickr({
		type:      "datetime",
		altInput:  true,
		altFormat: "F j, Y - H:i",
	}));

	// 5. Manejo de Firma
	$("#clear-signature").on("click", function () {
		$Signature.clear("#signature-pad");
		$("#signature-input").val("");
		updateDebugger();
	});

	// 6. Validación y Envío
	$("#richForm").on("submit", function (e) {
		e.preventDefault();

		if (!$Forms.isValidForm(this)) {
			$Alert.warning("Por favor completa los campos requeridos.");
			return;
		}

		const data        = $Forms.serialize(this);
		data.description  = $Editor.getHtml("#full-editor");
		// $Signature.toDataURL — reemplaza getSignatureData que no existe
		data.signature    = $Signature.toDataURL("#signature-pad");

		if (!data.signature) {
			$Alert.warning("La firma es obligatoria para este registro.");
			return;
		}

		// loading() = abrir, loading(false) = cerrar
		$Alert.loading();

		setTimeout(() => {
			$Alert.loading(false);
			$Alert.success("¡Formulario procesado con éxito! Los datos han sido validados y serializados correctamente.");
			console.log("Form Data:", data);
		}, 1500);
	});

	$("#btnReset").on("click", function () {
		$Alert.confirm("¿Reiniciar formulario?", "Se perderán todos los cambios ingresados.", () => {
			$Forms.clear("#richForm");
			$Signature.clear("#signature-pad");
			$Editor.setHtml("#full-editor", "<p>Escribe aquí los detalles del registro...</p>");
			$(".select2").val(null).trigger("change");
			updateDebugger();
			$Alert.toast.info("Formulario reiniciado");
		});
	});

	// 7. Debugger en tiempo real
	$("input, select, textarea").on("input change", updateDebugger);

	function updateDebugger() {
		const data = $Forms.serialize("#richForm");
		const sig  = $Signature.toDataURL("#signature-pad");
		if (sig) data.signature = "[Base64 Signature Data]";
		$("#form-debugger").text(JSON.stringify(data, null, 4));
	}

	updateDebugger();
});
