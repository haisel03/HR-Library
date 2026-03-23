/**
 * @file crud-ultimate.js
 * @description Demo avanzada que integra casi todos los helpers del framework.
 *
 * CAMBIOS v3:
 * - Table.col(data, title, options)  — render va en options.render, NO como 3er arg directo
 * - $Currency.format(val, "P")       — código "P"/"U"/"E", NO "DOP"
 * - $Table.exportButtons([...])      — reemplaza $Table.buttons("icons") que no existe
 * - flatpickr("#el", $Date.flatpickr(...)) — $Date.flatpickr() devuelve opciones, no inicializa
 * - $Signature.toDataURL("#el")      — era signaturePad.isEmpty() (instancia directa)
 * - $Forms.serialize / $Forms.clear  — reemplaza serializeForm / clearForm (aliases existen)
 * - $Modal.open("#id") / $Modal.close("#id") — con # selector
 * - $Alert.confirmDelete(cb)         — en lugar de $Alert.confirm manual para delete
 */

$(async function () {
	const API_MOCK = "https://jsonplaceholder.typicode.com/users";
	let dt = null;
	let currentDraft = null;

	/* ── INIT ── */

	const initPage = async () => {
		try {
			$Alert.loading();

			const data = await $Api.get(API_MOCK);

			// col(data, title, { render }) — render dentro de options
			const $tbl = $Dom.el("#employeeTable");
			dt = $Table.initTable($tbl, {
				ordering: false,
				language: $HR.lang.datatables,
				data,
				columns: [
					$Table.col("id", "#"),
					$Table.col("name", "Empleado", {
						render: (v, type, r) => `
							<div class="d-flex align-items-center">
								${$Icons.bi("person-circle", { class: "fs-4 text-primary me-2" }).outerHTML}
								<div>
									<div class="fw-bold">${v}</div>
									<div class="small text-muted">${r.email}</div>
								</div>
							</div>`,
					}),
					$Table.col("company.name", "Depto", {
						render: (v) => `<span class="badge bg-light text-dark border">${v || "General"}</span>`,
					}),
					$Table.col("phone", "Contacto", {
						icon: "bi bi-telephone-fill",
						classIcon: "text-white",
					}),
					$Table.col("website", "Salario (Sim)", {
						render: (v) => $Currency.format((v?.length || 1) * 1000, "P"),
					}),
					$Table.actions(["view", "edit", "delete", "print"]),
				],
				// exportButtons() — buttons("icons") no existe en la librería
				buttons: $Table.exportButtons(["excel", "pdf", "print"]),
			});

			$Select2.init(document, { placeholder: "Seleccionar Rol..." });

			// $Date.flatpickr() devuelve opciones — se pasan al llamado nativo de flatpickr
			flatpickr("#empJoinDate", $Date.flatpickr({ type: "date", defaultDate: "today", altInput: true }));

			$Editor.create("#empNotes", { placeholder: "Ingrese notas sobre el desempeño..." });
			$Signature.create("#empSignature");

			$Dom.on("#btnFullscreen", "click", () => $Fullscreen.toggle());

			const draft = $Storage.get("employee_draft");
			if (draft) {
				$Alert.toast.info("Tienes un borrador guardado");
				currentDraft = draft;
			}

			$Alert.close();
		} catch (error) {
			$Alert.close();
			$Alert.error("Fallo al inicializar la plataforma demo.");
		}
	};

	await initPage();

	/* ── ACCIONES TABLA ── */

	$Table.onAction("#employeeTable", async ({ action, row, button }) => {
		if (action === "edit") {
			resetForm();
			$Dom.text("#employeeModalTitle", `Editar Registro: ${row.name}`);
			$Dom.val("#empId",    row.id);
			$Dom.val("#empName",  row.name);
			$Dom.val("#empEmail", row.email);
			$Dom.val("#empPhone", row.phone);
			$Select2.setValue("#empRole", "IT");
			$Dom.val("#empSalary", (row.username?.length || 5) * 5000);
			updateSalaryPreview();
			$Modal.open("#employeeModal");
		}

		// "delete" ya tiene confirmación automática via config.dt_actions.delete.confirm
		// Si se quiere lógica post-confirmación adicional, usar onAction con acción distinta
		if (action === "delete") {
			$Alert.loading();
			try {
				await $Api.delete(`${API_MOCK}/${row.id}`);
				$Table.removeRow("#employeeTable", button);
				$Alert.toast.success("Eliminado correctamente");
			} catch {
				$Alert.error("No se pudo eliminar.");
			} finally {
				$Alert.close();
			}
		}
	});

	/* ── FORMULARIO ── */

	$Dom.on("#btnAddEmployee", "click", () => {
		resetForm();
		$Dom.text("#employeeModalTitle", "Registrar Nuevo Empleado");
		if (currentDraft) {
			$Alert.confirm("Borrador encontrado", "¿Deseas cargar los datos guardados?", () => fillFromData(currentDraft));
		}
		$Modal.open("#employeeModal");
	});

	$Dom.on("#empSalary", "input", updateSalaryPreview);

	$Dom.on("#employeeForm", "submit", async function (e) {
		e.preventDefault();

		if (!$Forms.isValidForm(this)) {
			return $Alert.toast.error("Por favor completa los campos requeridos");
		}

		// $Signature.toDataURL — la instancia se accede así, no signaturePad.isEmpty()
		const sigData = $Signature.toDataURL("#empSignature");
		if (!sigData) return $Alert.warning("Se requiere la firma del empleado");

		const notes = $Editor.getHtml("#empNotes");
		$Dom.val("#empNotesHidden", notes);

		const data = $Forms.serialize(this);

		try {
			$Alert.loading();
			const isEdit = !!data.id;
			let result;

			if (isEdit) {
				result = await $Api.put(`${API_MOCK}/${data.id}`, data);
				$Table.updateRow("#employeeTable", `[data-id="${data.id}"]`, result);
			} else {
				result = await $Api.post(API_MOCK, data);
				$Table.addRow("#employeeTable", result);
			}

			$Alert.close();
			$Modal.close("#employeeModal");
			$Alert.success(`Empleado ${isEdit ? "actualizado" : "registrado"} con éxito`);
			$Storage.remove("employee_draft");
			currentDraft = null;
		} catch {
			$Alert.close();
			$Alert.error("Error al procesar el servidor.");
		}
	});

	$Dom.on("#btnSaveDraft", "click", () => {
		const data = $Forms.serialize("#employeeForm");
		$Storage.set("employee_draft", data);
		$Alert.toast.success("Borrador guardado localmente");
		currentDraft = data;
	});

	$Dom.on("#btnCancelEmployee", "click", () => $Modal.close("#employeeModal"));
	$Dom.on("#btnClearSignature",  "click", () => $Signature.clear("#empSignature"));

	/* ── HELPERS LOCALES ── */

	function resetForm() {
		$Forms.clear("#employeeForm");
		$Signature.clear("#empSignature");
		$Editor.setHtml("#empNotes", "");
		$Dom.val("#empSalary", "");
		$Dom.text("#salaryFormatted", "");
		$Dom.el("#avatarPreview").src = "img/avatars/avatar.jpg";
	}

	function fillFromData(data) {
		$Dom.val("#empName",  data.name);
		$Dom.val("#empEmail", data.email);
		$Dom.val("#empPhone", data.phone);
		$Select2.setValue("#empRole", data.role);
		$Dom.val("#empSalary", data.salary);
		updateSalaryPreview();
	}

	function updateSalaryPreview() {
		const raw = $Dom.val("#empSalary");
		$Dom.text("#salaryFormatted", raw ? `Equivale a: ${$Currency.format(raw, "P")}` : "");
	}

	// Validación de avatar via $File
	$Dom.on("#empAvatar", "change", function (e) {
		const file = e.target.files[0];
		if (!file) return;

		if (!$File.isValidSize(file, 2 * 1024 * 1024)) {
			$Alert.error("El archivo supera los 2MB");
			return (this.value = "");
		}
		if (!$File.isValidExtension(file, ["jpg", "jpeg", "png"])) {
			$Alert.error("Solo se permiten imágenes (JPG, PNG)");
			return (this.value = "");
		}

		$File.readAsBase64(file).then((base64) => {
			$Dom.el("#avatarPreview").src = base64;
			$Alert.toast.success("Foto cargada correctamente");
		});
	});
});
