/**
 * @file table.js
 * @description Demo de CRUD usando HR.api y DataTables.
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;
	HR.msgLoading();

	// 1. Inicializar Tabla
	const initTable = async () => {
		try {
			HR.msgLoading();
			const users = await HR.getApi(API_URL);
			HR.msgLoading(true);
			dt = HR.createTbl("#usersTable", {
				data: users,
				columns: [
					HR.tblCol("id", "#"),
					HR.tblCol("name", "Nombre"),
					HR.tblCol("username", "Usuario"),
					HR.tblCol("email", "Email"),
					HR.tblCol("phone", "Teléfono"),
					HR.tblActionsCol((_, __, row) => {
						return `
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-light btn-edit" data-id="${row.id}" title="Editar">
                                    <i class="bi bi-pencil text-primary"></i>
                                </button>
                                <button class="btn btn-light btn-delete" data-id="${row.id}" title="Eliminar">
                                    <i class="bi bi-trash text-danger"></i>
                                </button>
                            </div>
                        `;
					})
				]
			});
		} catch (error) {
			HR.msgLoading(true);
			HR.msgError("No se pudieron cargar los datos de la API.");
		}
	};

	await initTable();

	// 2. Evento: Abrir Modal de Creación
	$("#btnAddUser").on("click", function () {
		HR.clearForm("#userForm");
		HR.val("#userId", "");
		HR.text("#userModalTitle", "Nuevo Usuario");
		HR.openModal("userModal", {});
	});

	// 3. Evento: Editar
	$(document).on("click", ".btn-edit", async function () {
		const id = $(this).data("id");
		try {
			HR.msgLoading();
			const user = await HR.getApi(`${API_URL}/${id}`);
			HR.msgLoading(true);

			HR.val("#userId", user.id);
			HR.val("#userName", user.name);
			HR.val("#userEmail", user.email);
			HR.val("#userUsername", user.username);
			HR.val("#userPhone", user.phone);

			HR.text("#userModalTitle", "Editar Usuario");
			HR.openModal("userModal", {});
		} catch (error) {
			HR.msgLoading(true);
			HR.msgError("No se pudo obtener la información del usuario.");
		}
	});

	// 4. Evento: Guardar (Create/Update)
	$("#userForm").on("submit", async function (e) {
		e.preventDefault();
		const id = HR.val("#userId");
		const data = {
			name: HR.val("#userName"),
			email: HR.val("#userEmail"),
			username: HR.val("#userUsername"),
			phone: HR.val("#userPhone"),
		};

		try {
			HR.msgLoading();
			let response;
			if (id) {
				// UPDATE (Simulado por JSONPlaceholder)
				response = await HR.putApi(`${API_URL}/${id}`, data);
				HR.msgSuccess(`Usuario "${response.name}" actualizado correctamente (Simulado)`);
			} else {
				// CREATE (Simulado por JSONPlaceholder)
				response = await HR.postApi(API_URL, data);
				HR.msgSuccess(`Usuario "${response.name}" creado con éxito (Simulado, ID: ${response.id})`);
			}
			HR.msgLoading(true);
			HR.closeModal("userModal");

			// Nota: JSONPlaceholder no persiste cambios, pero en un app real aquí recargaríamos.
			// HR.reloadTbl("#usersTable");
		} catch (error) {
			HR.msgLoading(true);
			HR.msgError("Ocurrió un error al intentar guardar los datos.");
		}
	});

	// 5. Evento: Eliminar
	$(document).on("click", ".btn-delete", function () {
		const id = $(this).data("id");
		const row = $(this).closest("tr");
		const name = row.find("td:nth-child(2)").text();

		HR.msgConfirm("¿Estás seguro?", `Vas a eliminar al usuario "${name}". Esta acción no se puede deshacer.`, async () => {
			try {
				HR.msgLoading();
				await HR.deleteApi(`${API_URL}/${id}`);
				HR.msgLoading(true);

				HR.toastSuccess("Usuario eliminado (Simulado)");

				// Animación local para el demo
				row.fadeOut(400, () => {
					// dt.row(row).remove().draw(false); // Si fuera persistente
				});
			} catch (error) {
				HR.msgLoading(true);
				HR.msgError("No se pudo eliminar el recurso.");
			}
		});
	});

	// 6. Evento: Cancelar
	$("#btnCancelUser").on("click", function () {
		HR.clearForm("#userForm");
		HR.closeModal("userModal");
	});
});
