/**
 * @file table.js
 * @description Demo CRUD optimizado usando HR.table helper
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;

	/* =====================================================
		 INIT
	===================================================== */

	const initTable = async () => {
		try {
			$HR.msgLoading();

			const users = await $HR.getApi(API_URL);

			$HR.msgLoading(true);

			dt = $Table.initTable("#usersTable", {
				data: users,
				columns: [
					$Table.col("id", "#"),
					$Table.col("name", "Nombre"),
					$Table.col("username", "Usuario"),
					$Table.col("email", "Email"),
					$Table.col("phone", "Teléfono"),
					$Table.actions(["edit", "delete"])
				]
			});

		} catch (error) {
			$HR.msgLoading(true);
			$HR.msgError("No se pudieron cargar los datos de la API.");
		}
	};

	await initTable();

	/* =====================================================
		 ACTIONS
	===================================================== */

	$Table.onAction("#usersTable", async ({ action, row, button }) => {

		// 🔹 EDITAR
		if (action === "edit") {
			$HR.text("#userModalTitle", "Editar Usuario");
			$Table.modal.open("userModal", row);
		}

		// 🔹 ELIMINAR
		if (action === "delete") {
			try {
				$HR.msgLoading();

				await $HR.deleteApi(`${API_URL}/${row.id}`);

				$HR.msgLoading(true);
				$HR.toastSuccess("Usuario eliminado (Simulado)");

				// eliminar fila directamente
				$Table.removeRow("#usersTable", button);

			} catch (error) {
				$HR.msgLoading(true);
				$HR.msgError("No se pudo eliminar el recurso.");
			}
		}

		// 🔹 VER (opcional)
		if (action === "view") {
			console.log("Ver usuario:", row);
		}

	});

	/* =====================================================
		 CREATE
	===================================================== */

	$("#btnAddUser").on("click", () => {
		$HR.clearForm("#userForm");
		$HR.val("#userId", "");
		$HR.text("#userModalTitle", "Nuevo Usuario");

		$Table.modal.open("userModal");
	});

	/* =====================================================
		 SAVE (CREATE / UPDATE)
	===================================================== */

	$("#userForm").on("submit", async function (e) {
		e.preventDefault();

		const id = $HR.val("#userId");

		const data = {
			name: $HR.val("#userName"),
			email: $HR.val("#userEmail"),
			username: $HR.val("#userUsername"),
			phone: $HR.val("#userPhone"),
		};

		try {
			$HR.msgLoading();

			let response;

			// 🔹 UPDATE
			if (id) {
				response = await $HR.putApi(`${API_URL}/${id}`, data);

				$Table.updateRow("#usersTable", `[data-id="${id}"]`, response);

				$HR.msgSuccess(`Usuario "${response.name}" actualizado (Simulado)`);

			} else {
				// 🔹 CREATE
				response = await $HR.postApi(API_URL, data);

				$Table.addRow("#usersTable", response);

				$HR.msgSuccess(`Usuario "${response.name}" creado (Simulado)`);
			}

			$HR.msgLoading(true);
			$Table.modal.close("userModal");

		} catch (error) {
			$HR.msgLoading(true);
			$HR.msgError("Ocurrió un error al guardar los datos.");
		}
	});

	/* =====================================================
		 CANCEL
	===================================================== */

	$("#btnCancelUser").on("click", () => {
		$HR.clearForm("#userForm");
		$Table.modal.close("userModal");
	});
});
