/**
 * @file report-users.js
 * @description Demo de Reporte con exportaciones usando $Api y DataTables.
 *
 * CAMBIOS v3:
 * - App.msgLoading()     → App.loading()
 * - App.msgLoading(true) → App.loading(false)
 * - App.msgError         → App.error
 * - App.getApi           → $Api.get  (o se puede mantener App.getApi que es alias)
 * - App.createTbl        → $Table.initTable
 * - App.tblButtons('icons') → App.tblButtons([...])  — 'icons' no existe
 * - App.tblCol(data, title, render) → App.tblCol(data, title, { render })
 *   render va dentro de options object, no como 3er argumento directo
 */

$(async function () {
	const API_URL = "https://jsonplaceholder.typicode.com/users";
	let dt = null;

	App.loading();

	try {
		const users = await App.getApi(API_URL);

		dt = App.initTable("#reportUsersTable", {
			data:   users,
			dom:    "Bfrtip",
			// exportButtons() — tblButtons("icons") no existe
			buttons: App.tblButtons(["excel", "pdf", "print", "copy", "csv"]),
			columns: [
				App.tblCol("id",           "#"),
				App.tblCol("name",         "Nombre Completo"),
				App.tblCol("email",        "Correo Electrónico"),
				App.tblCol("company.name", "Empresa"),
				App.tblCol("address.city", "Ciudad"),
				App.tblCol("phone",        "Teléfono"),
				// render dentro de options object
				App.tblCol("website", "Sitio Web", {
					render: (data) =>
						`<a href="http://${data}" target="_blank"
						    class="text-primary text-decoration-none border-bottom border-primary border-opacity-25">${data}</a>`,
				}),
			],
			pageLength: 10,
			order:      [[1, "asc"]],
		});

		App.loading(false);
	} catch (error) {
		App.loading(false);
		App.error("Error al generar el reporte de usuarios.");
		console.error(error);
	}
});
