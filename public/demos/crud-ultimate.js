/**
 * @file crud-ultimate.js
 * @description Demo avanzada que integra casi todos los helpers del framework.
 *
 * $/
 */

$(async function () {
	const API_MOCK = "https://jsonplaceholder.typicode.com/users";
	let dt = null;
	let currentDraft = null;

	/* ── INIT ── */

	const initPage = async () => {
		try {
			App.loading();

			const data = await App.getApi(API_MOCK);

			// col(data, title, { render }) — render dentro de options
			const $tbl = App.el("#employeeTable");
			dt = App.initTable($tbl, {
				ordering: false,
				language: App.lang.datatables,
				data,
				columns: [
					App.tblCol("id", "#"),
					App.tblCol("name", "Empleado", {
						render: (v, type, r) => `
							<div class="d-flex align-items-center">
								${App.bi("person-circle", { class: "fs-4 text-primary me-2" }).outerHTML}
								<div>
									<div class="fw-bold">${v}</div>
									<div class="small text-muted">${r.email}</div>
								</div>
							</div>`,
					}),
					App.tblCol("company.name", "Depto", {
						render: (v) => `<span class="badge bg-light text-dark border">${v || "General"}</span>`,
					}),
					App.tblCol("phone", "Contacto", {
						icon: "bi bi-telephone-fill",
						classIcon: "text-white",
					}),
					App.tblCol("website", "Salario (Sim)", {
						render: (v) => App.currencyFormat((v?.length || 1) * 1000, "P"),
					}),
					App.tblActionsCol(["view", "edit", "delete", "print"]),
				],
				// exportButtons() — buttons("icons") no existe en la librería
				buttons: App.tblButtons(["excel", "pdf", "print"]),
			});

			App.select2Init(document, { placeholder: "Seleccionar Rol..." });

			// App.flatpickrOptions() devuelve opciones — se pasan al llamado nativo de flatpickr
			flatpickr("#empJoinDate", App.flatpickrOptions({ type: "date", defaultDate: "today", altInput: true }));

			App.createEditor("#empNotes", { placeholder: "Ingrese notas sobre el desempeño..." });
			App.createSignature("#empSignature");

			App.on("#btnFullscreen", "click", () => App.toggle());

			const draft = App.getLocal("employee_draft");
			if (draft) {
				App.toastInfo("Tienes un borrador guardado");
				currentDraft = draft;
			}

			App.close();
		} catch (error) {
			App.close();
			App.error("Fallo al inicializar la plataforma demo.");
		}
	};

	await initPage();

	/* ── ACCIONES TABLA ── */

	App.onTableAction("#employeeTable", async ({ action, row, button }) => {
		if (action === "edit") {
			resetForm();
			App.text("#employeeModalTitle", `Editar Registro: ${row.name}`);
			App.val("#empId",    row.id);
			App.val("#empName",  row.name);
			App.val("#empEmail", row.email);
			App.val("#empPhone", row.phone);
			App.select2Set("#empRole", "IT");
			App.val("#empSalary", (row.username?.length || 5) * 5000);
			updateSalaryPreview();
			App.modalOpen("#employeeModal");
		}

		// "delete" ya tiene confirmación automática via config.dt_actions.delete.confirm
		// Si se quiere lógica post-confirmación adicional, usar onAction con acción distinta
		if (action === "delete") {
			App.loading();
			try {
				await App.deleteApi(`${API_MOCK}/${row.id}`);
				App.removeTblRow("#employeeTable", button);
				App.toastSuccess("Eliminado correctamente");
			} catch {
				App.error("No se pudo eliminar.");
			} finally {
				App.close();
			}
		}
	});

	/* ── FORMULARIO ── */

	App.on("#btnAddEmployee", "click", () => {
		resetForm();
		App.text("#employeeModalTitle", "Registrar Nuevo Empleado");
		if (currentDraft) {
			App.confirm("Borrador encontrado", "¿Deseas cargar los datos guardados?", () => fillFromData(currentDraft));
		}
		App.modalOpen("#employeeModal");
	});

	App.on("#empSalary", "input", updateSalaryPreview);

	App.on("#employeeForm", "submit", async function (e) {
		e.preventDefault();

		if (!App.isValidForm(this)) {
			return App.toastError("Por favor completa los campos requeridos");
		}

		// $Signature.toDataURL — la instancia se accede así, no signaturePad.isEmpty()
		const sigData = App.getSignatureData("#empSignature");
		if (!sigData) return App.warning("Se requiere la firma del empleado");

		const notes = App.getEditorHtml("#empNotes");
		App.val("#empNotesHidden", notes);

		const data = App.serializeForm(this);

		try {
			App.loading();
			const isEdit = !!data.id;
			let result;

			if (isEdit) {
				result = await App.putApi(`${API_MOCK}/${data.id}`, data);
				App.updateTblRow("#employeeTable", `[data-id="${data.id}"]`, result);
			} else {
				result = await App.postApi(API_MOCK, data);
				App.addTblRow("#employeeTable", result);
			}

			App.close();
			App.modalClose("#employeeModal");
			App.success(`Empleado ${isEdit ? "actualizado" : "registrado"} con éxito`);
			App.removeLocal("employee_draft");
			currentDraft = null;
		} catch {
			App.close();
			App.error("Error al procesar el servidor.");
		}
	});

	App.on("#btnSaveDraft", "click", () => {
		const data = App.serializeForm("#employeeForm");
		App.setLocal("employee_draft", data);
		App.toastSuccess("Borrador guardado localmente");
		currentDraft = data;
	});

	App.on("#btnCancelEmployee", "click", () => App.modalClose("#employeeModal"));
	App.on("#btnClearSignature",  "click", () => App.clearSignature("#empSignature"));

	/* ── HELPERS LOCALES ── */

	function resetForm() {
		App.clearForm("#employeeForm");
		App.clearSignature("#empSignature");
		App.setEditorHtml("#empNotes", "");
		App.val("#empSalary", "");
		App.text("#salaryFormatted", "");
		App.el("#avatarPreview").src = "img/avatars/avatar.jpg";
	}

	function fillFromData(data) {
		App.val("#empName",  data.name);
		App.val("#empEmail", data.email);
		App.val("#empPhone", data.phone);
		App.select2Set("#empRole", data.role);
		App.val("#empSalary", data.salary);
		updateSalaryPreview();
	}

	function updateSalaryPreview() {
		const raw = App.val("#empSalary");
		App.text("#salaryFormatted", raw ? `Equivale a: ${App.currencyFormat(raw, "P")}` : "");
	}

	// Validación de avatar via $File
	App.on("#empAvatar", "change", function (e) {
		const file = e.target.files[0];
		if (!file) return;

		if (!App.fileIsValidSize(file, 2 * 1024 * 1024)) {
			App.error("El archivo supera los 2MB");
			return (this.value = "");
		}
		if (!App.fileIsValidExtension(file, ["jpg", "jpeg", "png"])) {
			App.error("Solo se permiten imágenes (JPG, PNG)");
			return (this.value = "");
		}

		App.fileReadBase64(file).then((base64) => {
			App.el("#avatarPreview").src = base64;
			App.toastSuccess("Foto cargada correctamente");
		});
	});
});

