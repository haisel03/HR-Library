/**
 * @file table.js
 * @description Demo CRUD con HR.table helper.
 *
 * CAMBIOS v3:
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgError         → $Alert.error
 * - $HR.msgSuccess       → $Alert.success
 * - $HR.toastSuccess     → $Alert.toast.success
 * - $HR.getApi           → $Api.get
 * - $HR.deleteApi        → $Api.delete
 * - $HR.putApi           → $Api.put
 * - $HR.postApi          → $Api.post
 * - $HR.text             → $Dom.text
 * - $HR.val              → $Dom.val
 * - $HR.clearForm        → $Forms.clear
 * - $Table.modal.open / close → permanece igual (es parte de Table v3)
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;

	/* ── INIT ── */

	const initTable = async () => {
		try {
			$Alert.loading();

			const users = await $Api.get(API_URL);

			$Alert.loading(false);

			dt = $Table.initTable("#usersTable", {
				data: users,
				columns: [
					$Table.col("id",       "#"),
					$Table.col("name",     "Nombre"),
					$Table.col("username", "Usuario"),
					$Table.col("email",    "Email"),
					$Table.col("phone",    "Teléfono"),
					$Table.actions(["edit", "delete"]),
				],
			});
		} catch (error) {
			$Alert.loading(false);
			$Alert.error("No se pudieron cargar los datos de la API.");
		}
	};

	await initTable();

	/* ── ACTIONS ── */

	$Table.onAction("#usersTable", async ({ action, row, button }) => {

		if (action === "edit") {
			$Dom.text("#userModalTitle", "Editar Usuario");
			$Table.modal.open("userModal", row);
		}

		// "delete" ya tiene confirmación automática desde config.dt_actions.delete.confirm
		if (action === "delete") {
			try {
				$Alert.loading();
				await $Api.delete(`${API_URL}/${row.id}`);
				$Alert.loading(false);
				$Alert.toast.success("Usuario eliminado (Simulado)");
				$Table.removeRow("#usersTable", button);
			} catch (error) {
				$Alert.loading(false);
				$Alert.error("No se pudo eliminar el recurso.");
			}
		}

		if (action === "view") {
			console.log("Ver usuario:", row);
		}
	});

	/* ── CREATE ── */

	$("#btnAddUser").on("click", () => {
		$Forms.clear("#userForm");
		$Dom.val("#userId", "");
		$Dom.text("#userModalTitle", "Nuevo Usuario");
		$Table.modal.open("userModal");
	});

	/* ── SAVE (CREATE / UPDATE) ── */

	$("#userForm").on("submit", async function (e) {
		e.preventDefault();

		const id   = $Dom.val("#userId");
		const data = {
			name:     $Dom.val("#userName"),
			email:    $Dom.val("#userEmail"),
			username: $Dom.val("#userUsername"),
			phone:    $Dom.val("#userPhone"),
		};

		try {
			$Alert.loading();
			let response;

			if (id) {
				response = await $Api.put(`${API_URL}/${id}`, data);
				$Table.updateRow("#usersTable", `[data-id="${id}"]`, response);
				$Alert.success(`Usuario "${response.name}" actualizado (Simulado)`);
			} else {
				response = await $Api.post(API_URL, data);
				$Table.addRow("#usersTable", response);
				$Alert.success(`Usuario "${response.name}" creado (Simulado)`);
			}

			$Alert.loading(false);
			$Table.modal.close("userModal");
		} catch (error) {
			$Alert.loading(false);
			$Alert.error("Ocurrió un error al guardar los datos.");
		}
	});

	/* ── CANCEL ── */

	$("#btnCancelUser").on("click", () => {
		$Forms.clear("#userForm");
		$Table.modal.close("userModal");
	});
});
