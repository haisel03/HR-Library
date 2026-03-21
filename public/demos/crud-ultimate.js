/**
 * @file crud-ultimate.js
 * @description Demo avanzada que integra casi todos los helpers del framework.
 */

$(async function () {
	/* =====================================================
		 CONFIG & ESTADO
	===================================================== */
	const API_MOCK = "https://jsonplaceholder.typicode.com/users"; // Usamos users como base mock
	let dt = null;
	let signaturePad = null;
	let quillEditor = null;
	let currentDraft = null;

	/* =====================================================
		 INICIALIZACIÓN DE COMPONENTES
	===================================================== */

	const initPage = async () => {
		try {
			// 1. Mostrar Loading Global via $Alert
			$Alert.loading();

			// 2. Cargar Datos via $Api
			const data = await $Api.get(API_MOCK);

			// 3. Inicializar Tabla via $Table
			dt = $Table.initTable("#employeeTable", {
				data: data,
				columns: [
					$Table.col("id", "#"),
					$Table.col("name", "Empleado", (v, r) => {
						return `
                            <div class="d-flex align-items-center">
                                ${$Icons.bi("person-circle", { class: "fs-4 text-primary me-2" }).outerHTML}
                                <div>
                                    <div class="fw-bold">${v}</div>
                                    <div class="small text-muted">${r.email}</div>
                                </div>
                            </div>
                        `;
					}),
					$Table.col("company.name", "Depto", (v) => {
						return `<span class="badge bg-light text-dark border">${v || "General"}</span>`;
					}),
					$Table.col("phone", "Contacto"),
					$Table.col("website", "Salario (Sim)", (v) => {
						// Usar $Currency y $Number
						const val = (v.length || 1) * 1000;
						return $Currency.format(val, "DOP");
					}),
					$Table.actions(["edit", "delete"]),
				],
				buttons: $Table.buttons("icons"),
			});

			// 4. Inicializar Select2 via $Select2
			$Select2.init(document, { placeholder: "Seleccionar Rol..." });

			// 5. Inicializar Fechas via $Date
			const joinDate = $Date.flatpickr("#empJoinDate", {
				defaultDate: "today",
				altInput: true,
			});

			// 6. Inicializar Editor via $Editor
			quillEditor = $Editor.create("#empNotes", {
				placeholder: "Ingrese notas sobre el desempeño...",
			});

			// 7. Inicializar Firma via $Signature
			signaturePad = $Signature.create("#empSignature");

			// 8. Pantalla Completa via $Fullscreen
			$Dom.on("#btnFullscreen", "click", () => $Fullscreen.toggle());

			// 9. Verificar Drafts en LocalStorage via $Storage
			const draft = $Storage.get("employee_draft");
			if (draft) {
				$Alert.toast.info("Tienes un borrador guardado");
				currentDraft = draft;
			}

			// Cerrar Loading
			$Alert.close();
		} catch (error) {
			$Alert.close();
			$Alert.error("Fallo al inicializar la plataforma demo.");
		}
	};

	await initPage();

	/* =====================================================
		 ACCIONES DE TABLA
	===================================================== */

	$Table.onAction("#employeeTable", async ({ action, row, button }) => {
		if (action === "edit") {
			resetForm();
			$Dom.text("#employeeModalTitle", `Editar Registro: ${row.name}`);

			// Mapear datos a Form
			$Dom.val("#empId", row.id);
			$Dom.val("#empName", row.name);
			$Dom.val("#empEmail", row.email);
			$Dom.val("#empPhone", row.phone);

			// Simulamos datos extras
			$Select2.setValue("#empRole", "IT");
			$Dom.val("#empSalary", (row.username?.length || 5) * 5000);
			updateSalaryPreview();

			$Modal.open("employeeModal");
		}

		if (action === "delete") {
			$Alert.confirm("¿Eliminar registro?", `¿Estás seguro de eliminar a ${row.name}?`, async () => {
				$Alert.loading();
				await $Api.delete(`${API_MOCK}/${row.id}`);
				$Table.removeRow("#employeeTable", button);
				$Alert.close();
				$Alert.toast.success("Eliminado correctamente");
			});
		}
	});

	/* =====================================================
		 ACCIONES DE FORMULARIO
	===================================================== */

	$Dom.on("#btnAddEmployee", "click", () => {
		resetForm();
		$Dom.text("#employeeModalTitle", "Registrar Nuevo Empleado");

		if (currentDraft) {
			$Alert.confirm("Borrador encontrado", "¿Deseas cargar los datos guardados?", () => {
				fillFromData(currentDraft);
			});
		}

		$Modal.open("employeeModal");
	});

	$Dom.on("#empSalary", "input", updateSalaryPreview);

	$Dom.on("#employeeForm", "submit", async function (e) {
		e.preventDefault();

		// 1. Validar via HR.$Forms
		if (!$Forms.isValidForm(this)) {
			return $Alert.toast.error("Por favor completa los campos requeridos");
		}

		// 2. Capturar Firma
		if (signaturePad.isEmpty()) {
			return $Alert.warning("Se requiere la firma del empleado");
		}

		// 3. Capturar Editor HTML
		const notes = $Editor.getHtml("#empNotes");
		$Dom.val("#empNotesHidden", notes);

		// 4. Serializar
		const data = $Forms.serializeForm(this);

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
			$Modal.close("employeeModal");
			$Alert.success(`Empleado ${isEdit ? "actualizado" : "registrado"} con éxito`);

			// Limpiar borrador
			$Storage.remove("employee_draft");
			currentDraft = null;
		} catch (error) {
			$Alert.close();
			$Alert.error("Error al procesar el servidor.");
		}
	});

	$Dom.on("#btnSaveDraft", "click", () => {
		const data = $Forms.serializeForm("#employeeForm");
		$Storage.set("employee_draft", data);
		$Alert.toast.success("Borrador guardado localmente");
		currentDraft = data;
	});

	$Dom.on("#btnCancelEmployee", "click", () => {
		$Modal.close("employeeModal");
	});

	$Dom.on("#btnClearSignature", "click", () => {
		$Signature.clear("#empSignature");
	});

	/* =====================================================
		 UTILERIA LOCAL
	===================================================== */

	function resetForm() {
		$Forms.clearForm("#employeeForm");
		$Signature.clear("#empSignature");
		$Editor.setHtml("#empNotes", "");
		$Dom.val("#empSalary", "");
		$Dom.text("#salaryFormatted", "");
		$Dom.el("#avatarPreview").src = "img/avatars/avatar.jpg";
	}

	function fillFromData(data) {
		$Dom.val("#empName", data.name);
		$Dom.val("#empEmail", data.email);
		$Dom.val("#empPhone", data.phone);
		$Select2.setValue("#empRole", data.role);
		$Dom.val("#empSalary", data.salary);
		updateSalaryPreview();
	}

	function updateSalaryPreview() {
		const raw = $Dom.val("#empSalary");
		if (raw) {
			const formatted = $Currency.format(raw, "DOP");
			$Dom.text("#salaryFormatted", `Equivale a: ${formatted}`);
		} else {
			$Dom.text("#salaryFormatted", "");
		}
	}

	// Simulación de validación de archivo via HR.$File
	$Dom.on("#empAvatar", "change", function (e) {
		const file = e.target.files[0];
		if (!file) return;

		if (!$File.isValidSize(file, 2 * 1024 * 1024)) {
			$Alert.error("El archivo supera los 2MB");
			this.value = "";
			return;
		}

		if (!$File.isValidExtension(file, ["jpg", "jpeg", "png"])) {
			$Alert.error("Solo se permiten imágenes (JPG, PNG)");
			this.value = "";
			return;
		}

		// Leer y mostrar preview
		$File.readAsBase64(file).then((base64) => {
			$Dom.el("#avatarPreview").src = base64;
			$Alert.toast.success("Foto cargada correctamente");
		});
	});
});
