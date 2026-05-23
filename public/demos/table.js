/**
 * @file table.js
 * @description Demo CRUD con HR.table helper.
 *
 * $/
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;

	/* ── INIT ── */

	const initTable = async () => {
		try {
			App.loading();

			const users = await App.getApi(API_URL);

			App.loading(false);

			dt = App.initTable("#usersTable", {
				data: users,
				columns: [
					App.tblCol("id",       "#"),
					App.tblCol("name",     "Nombre"),
					App.tblCol("username", "Usuario"),
					App.tblCol("email",    "Email"),
					App.tblCol("phone",    "Teléfono"),
					App.tblActionsCol(["edit", "delete"]),
				],
			});
		} catch (error) {
			App.loading(false);
			App.error("No se pudieron cargar los datos de la API.");
		}
	};

	await initTable();

	/* ── ACTIONS ── */

	App.onTableAction("#usersTable", async ({ action, row, button }) => {

		if (action === "edit") {
			App.text("#userModalTitle", "Editar Usuario");
			App.modalOpen("#userModal", row);
		}

		// "delete" ya tiene confirmación automática desde config.dt_actions.delete.confirm
		if (action === "delete") {
			try {
				App.loading();
				await App.deleteApi(`${API_URL}/${row.id}`);
				App.loading(false);
				App.toastSuccess("Usuario eliminado (Simulado)");
				App.removeTblRow("#usersTable", button);
			} catch (error) {
				App.loading(false);
				App.error("No se pudo eliminar el recurso.");
			}
		}

		if (action === "view") {
			App.info("Usuario: " + row.name);
		}
	});

	/* ── CREATE ── */

	$("#btnAddUser").on("click", () => {
		App.clearForm("#userForm");
		App.val("#userId", "");
		App.text("#userModalTitle", "Nuevo Usuario");
		App.modalOpen("#userModal");
	});

	/* ── SAVE (CREATE / UPDATE) ── */

	$("#userForm").on("submit", async function (e) {
		e.preventDefault();

		const id   = App.val("#userId");
		const data = {
			name:     App.val("#userName"),
			email:    App.val("#userEmail"),
			username: App.val("#userUsername"),
			phone:    App.val("#userPhone"),
		};

		try {
			App.loading();
			let response;

			if (id) {
				response = await App.putApi(`${API_URL}/${id}`, data);
				App.updateTblRow("#usersTable", `[data-id="${id}"]`, response);
				App.success(`Usuario "${response.name}" actualizado (Simulado)`);
			} else {
				response = await App.postApi(API_URL, data);
				App.addTblRow("#usersTable", response);
				App.success(`Usuario "${response.name}" creado (Simulado)`);
			}

			App.loading(false);
			App.modalClose("userModal");
		} catch (error) {
			App.loading(false);
			App.error("Ocurrió un error al guardar los datos.");
		}
	});

	/* ── CANCEL ── */

	$("#btnCancelUser").on("click", () => {
		App.clearForm("#userForm");
		App.modalClose("userModal");
	});
});

