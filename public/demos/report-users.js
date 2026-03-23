/**
 * @file report-users.js
 * @description Demo de Reporte con exportaciones usando $Api y DataTables.
 *
 * CAMBIOS v3:
 * - $HR.msgLoading()     → $Alert.loading()
 * - $HR.msgLoading(true) → $Alert.loading(false)
 * - $HR.msgError         → $Alert.error
 * - $HR.getApi           → $Api.get  (o se puede mantener $HR.getApi que es alias)
 * - $HR.createTbl        → $Table.initTable
 * - $HR.tblButtons('icons') → $Table.exportButtons([...])  — 'icons' no existe
 * - $HR.tblCol(data, title, render) → $Table.col(data, title, { render })
 *   render va dentro de options object, no como 3er argumento directo
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;

	$Alert.loading();

	try {
		const users = await $Api.get(API_URL);

		dt = $Table.initTable("#reportUsersTable", {
			data:   users,
			dom:    "Bfrtip",
			// exportButtons() — tblButtons("icons") no existe
			buttons: $Table.exportButtons(["excel", "pdf", "print", "copy", "csv"]),
			columns: [
				$Table.col("id",           "#"),
				$Table.col("name",         "Nombre Completo"),
				$Table.col("email",        "Correo Electrónico"),
				$Table.col("company.name", "Empresa"),
				$Table.col("address.city", "Ciudad"),
				$Table.col("phone",        "Teléfono"),
				// render dentro de options object
				$Table.col("website", "Sitio Web", {
					render: (data) =>
						`<a href="http://${data}" target="_blank"
						    class="text-primary text-decoration-none border-bottom border-primary border-opacity-25">${data}</a>`,
				}),
			],
			pageLength: 10,
			order:      [[1, "asc"]],
		});

		$Alert.loading(false);
	} catch (error) {
		$Alert.loading(false);
		$Alert.error("Error al generar el reporte de usuarios.");
		console.error(error);
	}
});
