/**
 * @file report-users.js
 * @description Demo de Reporte con exportaciones usando HR.api y DataTables.
 */

$(async function () {
    const API_URL = "https://jsonplaceholder.typicode.com/users";
    let dt = null;

    // Iniciar carga
    HR.msgLoading();

    try {
        // 1. Obtener datos
        const users = await HR.getApi(API_URL);

        // 2. Inicializar DataTable con exportaciones
        dt = HR.createTbl("#reportUsersTable", {
            data: users,
            // Botones de exportación desde la configuración con iconos
            dom: 'Bfrtip',
            buttons: HR.tblButtons('icons'),
            columns: [
                HR.tblCol("id", "#"),
                HR.tblCol("name", "Nombre Completo"),
                HR.tblCol("email", "Correo Electrónico"),
                HR.tblCol("company.name", "Empresa"),
                HR.tblCol("address.city", "Ciudad"),
                HR.tblCol("phone", "Teléfono"),
                HR.tblCol("website", "Sitio Web", (data) => {
                    return `<a href="http://${data}" target="_blank" class="text-primary text-decoration-none border-bottom border-primary border-opacity-25">${data}</a>`;
                }),
            ],
            // Configuración extra para reporte
            pageLength: 10,
            order: [[1, 'asc']], // Ordenar por nombre por defecto
        });

        // Cerrar carga
        HR.msgLoading(true);

    } catch (error) {
        HR.msgLoading(true);
        HR.msgError("Error al generar el reporte de usuarios.");
        console.error(error);
    }
});
