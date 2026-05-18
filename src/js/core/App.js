/**
 * @module App
 * @description
 * Fachada unificada de HR Library v4.0.
 * Agrupa todos los helpers de la librería en un solo objeto `App`
 * con métodos planos, directamente delegados a las implementaciones reales.
 *
 * @example
 * // Alertas
 * App.success("Guardado correctamente");
 * App.error("Ocurrió un error");
 * App.loading();
 *
 * // Peticiones HTTP
 * const users = await App.getApi("/api/usuarios");
 * const user  = await App.postApi("/api/usuarios", { name: "Juan" });
 *
 * // Tablas
 * const dt = App.initTable("#tabla", {
 *   data: users,
 *   columns: [ App.tblCol("name", "Nombre") ],
 * });
 *
 * // Formularios
 * App.fillForm("#userForm", { name: "Juan" });
 * const data = App.serializeForm("#userForm");
 *
 * @version 4.0.0
 */

import { installPlugin, isInstalled, installedPlugins } from "./plugin-system.js";
import config from "./config.js";
import spanish from "./spanish.js";
import init from "./init.js";

import Alert from "../helpers/Alert.js";
import Api from "../helpers/Api.js";
import Asset from "../helpers/Asset.js";
import Calendar from "../helpers/Calendar.js";
import Charts from "../helpers/Charts.js";
import ChoicesJS from "../helpers/ChoicesJS.js";
import Codes from "../helpers/Codes.js";
import Currency from "../helpers/Currency.js";
import DateHelper from "../helpers/Date.js";
import Dom from "../helpers/Dom.js";
import Drag from "../helpers/Drag.js";
import Editor from "../helpers/Editor.js";
import Event from "../helpers/Event.js";
import Excel from "../helpers/Excel.js";
import ExportTbl from "../helpers/ExportTbl.js";
import FileHelper from "../helpers/File.js";
import Forms from "../helpers/Forms.js";
import Fullscreen from "../helpers/Fullscreen.js";
import Humanize from "../helpers/Humanize.js";
import Icons from "../helpers/Icons.js";
import Iframe from "../helpers/Iframe.js";
import Modal from "../helpers/Modal.js";
import NumberHelper from "../helpers/Number.js";
import Print from "../helpers/Print.js";
import Select2 from "../helpers/Select2.js";
import Sidebar from "../helpers/Sidebar.js";
import Signature from "../helpers/Signature.js";
import Storage from "../helpers/Storage.js";
import Strings from "../helpers/Strings.js";
import Table from "../helpers/Table.js";
import Validation from "../helpers/Validation.js";
import Custon from "../helpers/Custon.js";

const App = {
	/* ── Meta ── */

	/**
	 * Versión actual de la librería.
	 * @type {string}
	 */
	version: config.app.version,

	/**
	 * Configuración global de la aplicación.
	 * @type {Object}
	 */
	config,

	/**
	 * Traducciones y textos en español.
	 * @type {Object}
	 */
	lang: spanish,

	/* ── Init ── */

	/**
	 * Inicializa todos los módulos (Select2, Datepicker, Tooltips, etc.)
	 * en un ámbito del DOM. Se llama automáticamente al cargar la página.
	 * @param {HTMLElement|Document|string} [scope=document] Elemento raíz o selector
	 * @returns {void}
	 */
	init: (scope) => init(scope),

	/* ── HTTP ── */

	/**
	 * Establece el token de autorización para todas las peticiones API.
	 * @param {string} token Token JWT o de tipo bearer
	 * @returns {void}
	 */
	setToken: Api.setToken,

	/**
	 * Obtiene el token de autorización actual.
	 * @returns {string|null} Token actual o null si no hay
	 */
	getToken: Api.getToken,

	/**
	 * Activa o desactiva las alertas automáticas en errores HTTP.
	 * @param {boolean} value true para mostrar alertas, false para silenciar
	 * @returns {void}
	 */
	setApiAlerts: Api.setAutoAlerts,

	/**
	 * Petición HTTP GET.
	 * @param {string} url URL del recurso
	 * @param {Object} [params={}] Parámetros de consulta (query string)
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Respuesta del servidor
	 *
	 * @example
	 * const users = await App.getApi("/api/usuarios");
	 * const user  = await App.getApi("/api/usuarios/5");
	 */
	getApi: Api.get,

	/**
	 * Petición HTTP POST.
	 * @param {string} url URL del recurso
	 * @param {Object|FormData} [data={}] Datos a enviar en el cuerpo
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Recurso creado
	 *
	 * @example
	 * const user = await App.postApi("/api/usuarios", { name: "Juan" });
	 */
	postApi: Api.post,

	/**
	 * Petición HTTP PUT (actualización completa).
	 * @param {string} url URL del recurso
	 * @param {Object|FormData} [data={}] Datos actualizados
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Recurso actualizado
	 */
	putApi: Api.put,

	/**
	 * Petición HTTP PATCH (actualización parcial).
	 * @param {string} url URL del recurso
	 * @param {Object|FormData} [data={}] Datos parciales a actualizar
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Recurso actualizado
	 */
	patchApi: Api.patch,

	/**
	 * Petición HTTP DELETE.
	 * @param {string} url URL del recurso a eliminar
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Confirmación de eliminación
	 *
	 * @example
	 * await App.deleteApi("/api/usuarios/5");
	 */
	deleteApi: Api.delete,

	/**
	 * Subida de archivos vía HTTP POST (multipart/form-data).
	 * @param {string} url URL del endpoint
	 * @param {FormData} formData Datos del formulario con archivos
	 * @param {Object} [options={}] Opciones adicionales de Axios
	 * @returns {Promise<*>} Respuesta del servidor
	 */
	uploadApi: Api.upload,

	/**
	 * Llena un elemento &lt;select&gt; con opciones obtenidas de la API.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @param {string} url URL que devuelve un array de opciones
	 * @param {Object} [options={}] Opciones de configuración (valueField, textField, etc.)
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await App.getSelect("#pais", "/api/paises");
	 */
	getSelect: Api.getSelect,

	/**
	 * Instancia de Axios sin interceptores para peticiones personalizadas.
	 * @type {Object}
	 */
	rawAxios: Api.raw,

	/* ── Alertas ── */

	/**
	 * Muestra una alerta de éxito.
	 * @param {string} text Mensaje a mostrar
	 * @param {Function} [cb] Callback al cerrar la alerta
	 * @returns {Promise<boolean>}
	 *
	 * @example
	 * App.success("Usuario guardado correctamente");
	 * App.success("Operación exitosa", () => { location.reload(); });
	 */
	success: Alert.success,

	/**
	 * Muestra una alerta informativa.
	 * @param {string} text Mensaje a mostrar
	 * @param {Function} [cb] Callback al cerrar
	 * @returns {Promise<boolean>}
	 */
	info: Alert.info,

	/**
	 * Muestra una alerta de advertencia.
	 * @param {string} text Mensaje a mostrar
	 * @param {Function} [cb] Callback al cerrar
	 * @returns {Promise<boolean>}
	 */
	warning: Alert.warning,

	/**
	 * Muestra una alerta de error.
	 * @param {string} text Mensaje a mostrar
	 * @param {Function} [cb] Callback al cerrar
	 * @returns {Promise<boolean>}
	 */
	error: Alert.error,

	/**
	 * Muestra un cuadro de confirmación con opciones Aceptar / Cancelar.
	 * @param {string} title Título del cuadro
	 * @param {string} [question=""] Pregunta o descripción
	 * @param {Function} [cb] Callback si acepta (recibe true/false)
	 * @param {string} [type="warning"] Tipo de ícono (warning, success, error, info, question)
	 * @returns {Promise<boolean>}
	 *
	 * @example
	 * App.confirm("¿Eliminar?", "No se podrá recuperar", (ok) => { if (ok) eliminar(); });
	 */
	confirm: Alert.confirm,

	/**
	 * Muestra u oculta un indicador de carga global.
	 * @param {boolean} [open=true] true muestra, false oculta
	 * @returns {void}
	 *
	 * @example
	 * App.loading();           // muestra
	 * App.loading(false);      // oculta
	 */
	loading: Alert.loading,

	/**
	 * Cierra la alerta / loading actualmente abierto.
	 * @returns {void}
	 */
	close: Alert.close,

	/**
	 * Alias de {@link App.close}
	 * @returns {void}
	 */
	closeAlert: Alert.close,

	/**
	 * Confirmación preconfigurada para eliminación de registros.
	 * @param {Function} cb Callback si confirma la eliminación
	 * @returns {Promise<boolean>}
	 */
	confirmDelete: Alert.confirmDelete,

	/**
	 * Confirmación preconfigurada para inserción de registros.
	 * @param {Function} cb Callback si confirma la inserción
	 * @returns {Promise<boolean>}
	 */
	confirmInsert: Alert.confirmInsert,

	/**
	 * Confirmación preconfigurada para actualización de registros.
	 * @param {Function} cb Callback si confirma la actualización
	 * @returns {Promise<boolean>}
	 */
	confirmUpdate: Alert.confirmUpdate,

	/**
	 * Confirmación de eliminación mostrando el nombre del registro.
	 * @param {string} name Nombre del registro a eliminar
	 * @param {Function} cb Callback si confirma
	 * @returns {Promise<boolean>}
	 */
	confirmDeleteByName: Alert.confirmDeleteByName,

	/**
	 * Alias de {@link App.success}
	 * @deprecated Usar App.success() en su lugar
	 */
	msgSuccess: Alert.success,

	/**
	 * Alias de {@link App.info}
	 * @deprecated Usar App.info() en su lugar
	 */
	msgInfo: Alert.info,

	/**
	 * Alias de {@link App.warning}
	 * @deprecated Usar App.warning() en su lugar
	 */
	msgWarning: Alert.warning,

	/**
	 * Alias de {@link App.error}
	 * @deprecated Usar App.error() en su lugar
	 */
	msgError: Alert.error,

	/**
	 * Muestra una alerta genérica con tipo personalizado.
	 * @param {string} text Mensaje a mostrar
	 * @param {string} [type="info"] Tipo: success, info, warning, error, question
	 * @param {Function} [cb] Callback al cerrar
	 * @returns {Promise<boolean>}
	 */
	alert: Alert.show,

	/**
	 * Alias de {@link App.confirm}
	 * @deprecated Usar App.confirm() en su lugar
	 */
	msgConfirm: Alert.confirm,

	/**
	 * Alias de {@link App.loading}
	 * @deprecated Usar App.loading() en su lugar
	 */
	msgLoading: Alert.loading,

	/**
	 * Alias de {@link App.closeAlert}
	 * @deprecated Usar App.closeAlert() en su lugar
	 */
	msgClose: Alert.close,

	/* ── Toasts (notificaciones pequeñas) ── */

	/**
	 * Muestra un toast de éxito.
	 * @param {string} text Mensaje del toast
	 * @returns {Promise}
	 */
	toastSuccess: Alert.toast.success,

	/**
	 * Muestra un toast informativo.
	 * @param {string} text Mensaje del toast
	 * @returns {Promise}
	 */
	toastInfo: Alert.toast.info,

	/**
	 * Muestra un toast de advertencia.
	 * @param {string} text Mensaje del toast
	 * @returns {Promise}
	 */
	toastWarning: Alert.toast.warning,

	/**
	 * Muestra un toast de error.
	 * @param {string} text Mensaje del toast
	 * @returns {Promise}
	 */
	toastError: Alert.toast.error,

	/**
	 * Muestra un toast con tipo personalizado.
	 * @param {string} text Mensaje del toast
	 * @param {string} [type="info"] Tipo: success, info, warning, error
	 * @returns {Promise}
	 */
	toast: Alert.toast.show,

	/* ── Modales Bootstrap ── */

	/**
	 * Abre un modal Bootstrap y opcionalmente lo llena con datos.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {Object} [data={}] Datos para llenar campos del formulario dentro del modal
	 * @returns {void}
	 *
	 * @example
	 * App.modalOpen("#userModal");
	 * App.modalOpen("#userModal", { name: "Juan", email: "juan@mail.com" });
	 */
	modalOpen: Modal.open,

	/**
	 * Cierra un modal Bootstrap.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @returns {void}
	 */
	modalClose: Modal.close,

	/**
	 * Alterna la visibilidad de un modal.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @returns {void}
	 */
	modalToggle: Modal.toggle,

	/**
	 * Obtiene los datos actuales del formulario dentro de un modal.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @returns {Object} Datos serializados del formulario
	 */
	modalGetData: Modal.getData,

	/**
	 * Establece el título de un modal.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {string} title Nuevo título
	 * @returns {void}
	 */
	modalSetTitle: Modal.setTitle,

	/**
	 * Establece el contenido del cuerpo de un modal.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {string} body HTML del cuerpo
	 * @returns {void}
	 */
	modalSetBody: Modal.setBody,

	/**
	 * Establece el contenido completo de un modal (título + cuerpo).
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {Object} content Objeto con propiedades title y/o body
	 * @returns {void}
	 */
	modalSetContent: Modal.setContent.bind(Modal),

	/**
	 * Registra un callback cuando el modal se cierra.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {Function} cb Callback que recibe el evento
	 * @returns {void}
	 */
	modalOnClose: Modal.onClose,

	/**
	 * Registra un callback cuando el modal se abre.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @param {Function} cb Callback que recibe el evento
	 * @returns {void}
	 */
	modalOnOpen: Modal.onOpen,

	/**
	 * Destruye un modal liberando sus eventos.
	 * @param {string|HTMLElement} target ID o elemento del modal
	 * @returns {void}
	 */
	modalDestroy: Modal.destroy,

	/**
	 * Alias de {@link App.modalOpen}
	 * @deprecated Usar App.modalOpen() en su lugar
	 */
	openModal: Modal.open,

	/**
	 * Alias de {@link App.modalClose}
	 * @deprecated Usar App.modalClose() en su lugar
	 */
	closeModal: Modal.close,

	/**
	 * Alias de {@link App.modalToggle}
	 * @deprecated Usar App.modalToggle() en su lugar
	 */
	toggleModal: Modal.toggle,

	/**
	 * Alias de {@link App.modalGetData}
	 * @deprecated Usar App.modalGetData() en su lugar
	 */
	getModalData: Modal.getData,

	/* ── DataTables ── */

	/**
	 * Inicializa una tabla DataTable con opciones.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {Object} [options={}] Opciones de DataTables + columnas helper
	 * @returns {Object|null} Instancia de DataTable o null si falla
	 *
	 * @example
	 * const dt = App.initTable("#usuariosTable", {
	 *   data: usuarios,
	 *   columns: [
	 *     App.tblCol("id", "#"),
	 *     App.tblCol("name", "Nombre"),
	 *     App.tblActionsCol(["edit", "delete"]),
	 *   ],
	 * });
	 */
	initTable: Table.initTable,

	/**
	 * Destruye una instancia de DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @returns {void}
	 */
	destroyTable: Table.destroy,

	/**
	 * Recarga una DataTable con nuevos datos.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {Object[]} [data] Nuevos datos (opcional)
	 * @returns {void}
	 */
	reloadTable: Table.reload,

	/**
	 * Define una columna para DataTable.
	 * @param {string|null} data Campo de datos (null para columna de acciones)
	 * @param {string} title Título visible de la columna
	 * @param {Object} [options={}] Opciones adicionales (render, className, etc.)
	 * @returns {Object} Objeto de columna para DataTables
	 *
	 * @example
	 * App.tblCol("email", "Correo"),
	 * App.tblCol("name", "Nombre", { render: (d) => d.toUpperCase() }),
	 */
	tblCol: Table.col,

	/**
	 * Columna de índice (numeración automática).
	 * @param {Object} [options={}] Opciones adicionales
	 * @returns {Object} Objeto de columna
	 */
	tblIndex: Table.index,

	/**
	 * Columna con checkbox de selección múltiple.
	 * @param {Object} [options={}] Opciones adicionales
	 * @returns {Object} Objeto de columna
	 */
	tblCheckbox: Table.checkbox,

	/**
	 * Columna con badge de estado (activo/inactivo).
	 * @param {Object} [options={}] Opciones (trueLabel, falseLabel, trueClass, falseClass)
	 * @returns {Object} Objeto de columna
	 */
	tblStatus: Table.status,

	/**
	 * Columna con badge booleano (sí/no).
	 * @param {Object} [options={}] Opciones de renderizado
	 * @returns {Object} Objeto de columna
	 */
	tblBoolean: Table.boolean,

	/**
	 * Columna con badge de color.
	 * @param {Object} [options={}] Opciones del badge
	 * @returns {Object} Objeto de columna
	 */
	tblBadge: Table.badge,

	/**
	 * Columna de fecha formateada.
	 * @param {Object} [options={}] Opciones de formato
	 * @returns {Object} Objeto de columna
	 */
	tblDate: Table.date,

	/**
	 * Columna de monto formateado como moneda.
	 * @param {Object} [options={}] Opciones de formato (symbol, decimals)
	 * @returns {Object} Objeto de columna
	 */
	tblMoney: Table.money,

	/**
	 * Columna de número formateado.
	 * @param {Object} [options={}] Opciones de formato (decimals)
	 * @returns {Object} Objeto de columna
	 */
	tblNumber: Table.number,

	/**
	 * Columna de acciones (botones editar / eliminar, etc.).
	 * @param {string[]|Object} [optionsOrActions={}] Array de acciones o objeto de opciones
	 * @returns {Object} Objeto de columna
	 *
	 * @example
	 * App.tblActionsCol(["edit", "delete"]),
	 * App.tblActionsCol({ edit: true, delete: true, show: true }),
	 */
	tblActionsCol: Table.actions,

	/**
	 * Genera botones de exportación para DataTable.
	 * @param {string[]} types Tipos: "excel", "pdf", "print", "copy", "csv"
	 * @returns {Object[]} Array de configuraciones de botones
	 *
	 * @example
	 * buttons: App.tblButtons(["excel", "pdf", "print"])
	 */
	tblButtons: Table.exportButtons,

	/**
	 * Obtiene las filas seleccionadas de una DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @returns {Object[]} Array de datos de filas seleccionadas
	 */
	getSelectedRows: Table.selected,

	/**
	 * Limpia la selección de filas de una DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @returns {void}
	 */
	clearTblSelection: Table.clearSelection,

	/**
	 * Agrega una fila a la DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {Object} rowData Datos de la nueva fila
	 * @returns {void}
	 */
	addTblRow: Table.addRow,

	/**
	 * Elimina una fila de la DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {HTMLElement|number} buttonOrIndex Botón que disparó la acción o índice
	 * @returns {void}
	 */
	removeTblRow: Table.removeRow,

	/**
	 * Actualiza los datos de una fila en la DataTable.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {HTMLElement|string} buttonOrSelector Botón o selector de la fila
	 * @param {Object} data Nuevos datos para la fila
	 * @returns {void}
	 */
	updateTblRow: Table.updateRow,

	/**
	 * Refresca la DataTable con nuevos datos (reemplaza todo).
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {Object[]} data Nuevo array de datos
	 * @returns {void}
	 */
	refreshTbl: Table.refresh,

	/**
	 * Escucha acciones personalizadas (editar, eliminar) en las filas de la tabla.
	 * @param {string|HTMLElement} el Selector o elemento de la tabla
	 * @param {Function} cb Callback que recibe { action, row, button }
	 * @returns {void}
	 *
	 * @example
	 * App.onTableAction("#usuariosTable", ({ action, row }) => {
	 *   if (action === "edit") App.modalOpen("#userModal", row);
	 * });
	 */
	onTableAction: Table.onAction,

	/**
	 * Alias de {@link App.initTable}
	 * @deprecated Usar App.initTable() en su lugar
	 */
	createTbl: Table.initTable,

	/**
	 * Alias de {@link App.destroyTable}
	 * @deprecated Usar App.destroyTable() en su lugar
	 */
	destroyTbl: Table.destroy,

	/**
	 * Alias de {@link App.reloadTable}
	 * @deprecated Usar App.reloadTable() en su lugar
	 */
	reloadTbl: Table.reload,

	/* ── Exportación ── */

	/**
	 * Exporta una DataTable a Excel.
	 * @param {string|HTMLElement} tableSelector Selector o elemento de la tabla
	 * @param {string} [filename="export"] Nombre del archivo
	 * @returns {void}
	 */
	exportExcel: ExportTbl.excel,

	/**
	 * Exporta una DataTable a PDF.
	 * @param {string|HTMLElement} tableSelector Selector o elemento de la tabla
	 * @param {Object} [options={}] Opciones de personalización del PDF
	 * @returns {void}
	 */
	exportPdf: ExportTbl.pdf,

	/**
	 * Exporta una DataTable a CSV.
	 * @param {string|HTMLElement} tableSelector Selector o elemento de la tabla
	 * @param {string} [filename="export"] Nombre del archivo
	 * @returns {void}
	 */
	exportCsv: ExportTbl.csv,

	/**
	 * Exporta una DataTable a JSON.
	 * @param {string|HTMLElement} tableSelector Selector o elemento de la tabla
	 * @returns {Object[]} Array de datos exportados
	 */
	exportJson: ExportTbl.json,

	/* ── Fechas ── */

	/**
	 * Obtiene la fecha y hora actual.
	 * @returns {Date} Fecha actual
	 */
	now: DateHelper.now,

	/**
	 * Crea un objeto Date desde cualquier formato aceptado.
	 * @param {Date|string|number} value Fecha, string ISO o timestamp
	 * @returns {Date|null} Objeto Date o null si es inválido
	 */
	createDate: DateHelper.create,

	/**
	 * Verifica si un valor es una fecha válida.
	 * @param {*} value Valor a validar
	 * @returns {boolean} true si es una fecha válida
	 */
	isValidDate: DateHelper.isValid,

	/**
	 * Formatea una fecha según el tipo especificado.
	 * @param {Date|string|number} value Fecha a formatear
	 * @param {"date"|"time"|"datetime"} [type="date"] Tipo de formato
	 * @param {string} [locale] Código de locale (ej. "es-DO")
	 * @returns {string} Fecha formateada
	 *
	 * @example
	 * App.formatDate("2026-03-08");           // "08/03/2026"
	 * App.formatDate("2026-03-08", "datetime"); // "08/03/2026, 12:00 a. m."
	 */
	formatDate: DateHelper.format,

	/**
	 * Convierte una fecha a string ISO (YYYY-MM-DD).
	 * @param {Date|string|number} value Fecha a convertir
	 * @returns {string|null} Fecha en formato ISO o null
	 */
	toISODate: DateHelper.toISODate,

	/**
	 * Convierte una fecha a string ISO completo (YYYY-MM-DDTHH:mm:ss.sssZ).
	 * @param {Date|string|number} value Fecha a convertir
	 * @returns {string|null} String ISO completo o null
	 */
	toISOString: DateHelper.toISOString,

	/**
	 * Agrega o resta días a una fecha.
	 * @param {Date|string|number} value Fecha base
	 * @param {number} days Número de días (negativo para restar)
	 * @returns {Date|null} Nueva fecha o null
	 *
	 * @example
	 * App.addDays("2026-03-01", 7);  // 2026-03-08
	 * App.addDays(new Date(), -1);    // ayer
	 */
	addDays: DateHelper.addDays,

	/**
	 * Calcula la diferencia en días entre dos fechas.
	 * @param {Date|string|number} start Fecha inicial
	 * @param {Date|string|number} end Fecha final
	 * @returns {number|null} Número de días de diferencia o null
	 */
	diffDays: DateHelper.diffDays,

	/**
	 * Retorna opciones de configuración para flatpickr según el tipo.
	 * @param {Object} [overrides={}] Opciones adicionales
	 * @param {"date"|"datetime"|"time"|"range"} [overrides.type="date"] Tipo de picker
	 * @returns {Object} Objeto de opciones para flatpickr(el, options)
	 *
	 * @example
	 * flatpickr("#input", App.flatpickrOptions({ type: "datetime" }));
	 */
	flatpickrOptions: DateHelper.flatpickr,

	/* ── Storage (localStorage) ── */

	/**
	 * Guarda un valor en localStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} value Valor a guardar (se serializa como JSON)
	 * @returns {void}
	 */
	setLocal: Storage.set,

	/**
	 * Obtiene un valor de localStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} [defaultValue=null] Valor por defecto si no existe
	 * @returns {*} Valor almacenado o defaultValue
	 */
	getLocal: Storage.get,

	/**
	 * Verifica si una clave existe en localStorage.
	 * @param {string} key Clave a verificar
	 * @returns {boolean}
	 */
	hasLocal: Storage.has,

	/**
	 * Elimina un valor de localStorage.
	 * @param {string} key Clave a eliminar
	 * @returns {void}
	 */
	removeLocal: Storage.remove,

	/**
	 * Limpia todo el localStorage.
	 * @returns {void}
	 */
	clearLocal: Storage.clear,

	/**
	 * Guarda un valor con tiempo de expiración en localStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} value Valor a guardar
	 * @param {number} ttlSeconds Tiempo de vida en segundos
	 * @returns {void}
	 */
	setLocalTtl: Storage.setTtl,

	/**
	 * Obtiene un valor con TTL de localStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} [defaultValue=null] Valor por defecto si expiró o no existe
	 * @returns {*} Valor almacenado o defaultValue
	 */
	getLocalTtl: Storage.getTtl,

	/**
	 * Guarda un valor en sessionStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} value Valor a guardar
	 * @returns {void}
	 */
	setSession: Storage.setSession,

	/**
	 * Obtiene un valor de sessionStorage.
	 * @param {string} key Clave del almacenamiento
	 * @param {*} [defaultValue=null] Valor por defecto si no existe
	 * @returns {*} Valor almacenado o defaultValue
	 */
	getSession: Storage.getSession,

	/**
	 * Verifica si una clave existe en sessionStorage.
	 * @param {string} key Clave a verificar
	 * @returns {boolean}
	 */
	hasSession: Storage.hasSession,

	/**
	 * Elimina un valor de sessionStorage.
	 * @param {string} key Clave a eliminar
	 * @returns {void}
	 */
	removeSession: Storage.removeSession,

	/**
	 * Limpia todo el sessionStorage.
	 * @returns {void}
	 */
	clearSession: Storage.clearSession,

	/* ── Charts (Chart.js) ── */

	/**
	 * Crea un gráfico Chart.js en un elemento canvas.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @param {Object} options Opciones del gráfico (tipo, datos, configuración)
	 * @returns {Object|null} Instancia de Chart o null
	 *
	 * @example
	 * App.createChart("#myChart", {
	 *   type: "bar",
	 *   data: { labels: ["A", "B"], datasets: [{ data: [10, 20] }] },
	 * });
	 */
	createChart: Charts.create,

	/**
	 * Destruye un gráfico específico.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @returns {void}
	 */
	destroyChart: Charts.destroy,

	/**
	 * Destruye todos los gráficos creados.
	 * @returns {void}
	 */
	destroyAllCharts: Charts.destroyAll,

	/**
	 * Actualiza los datos de un gráfico.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @param {Object} data Nuevos datos para el gráfico
	 * @returns {void}
	 */
	updateChartData: Charts.updateData,

	/**
	 * Cambia una opción específica de un gráfico.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @param {string} path Ruta de la opción (ej. "options.plugins.legend.display")
	 * @param {*} value Nuevo valor
	 * @returns {void}
	 */
	setChartOption: Charts.setOption,

	/**
	 * Obtiene la instancia de Chart asociada a un canvas.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @returns {Object|null} Instancia de Chart o null
	 */
	getChart: Charts.get,

	/* ── Editor Quill (WYSIWYG) ── */

	/**
	 * Crea un editor de texto enriquecido Quill.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {Object} [options={}] Opciones de Quill (tema, módulos, etc.)
	 * @returns {Object|null} Instancia de Quill
	 */
	createEditor: Editor.create,

	/**
	 * Obtiene la instancia de Quill de un editor.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {Object|null} Instancia de Quill o null
	 */
	getEditor: Editor.get.bind(Editor),

	/**
	 * Obtiene el contenido HTML del editor.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {string} HTML del contenido
	 */
	getEditorHtml: Editor.getHtml.bind(Editor),

	/**
	 * Establece el contenido HTML del editor.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {string} html Contenido HTML a insertar
	 * @returns {void}
	 */
	setEditorHtml: Editor.setHtml.bind(Editor),

	/**
	 * Destruye el editor liberando recursos.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {void}
	 */
	destroyEditor: Editor.destroy.bind(Editor),

	/* ── Firma digital ── */

	/**
	 * Crea un pad de firma digital en un canvas.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @param {Object} [options={}] Opciones (color, ancho de línea, etc.)
	 * @returns {Object|null} Instancia de SignaturePad
	 */
	createSignature: Signature.create,

	/**
	 * Limpia el pad de firma.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @returns {void}
	 */
	clearSignature: Signature.clear,

	/**
	 * Obtiene la imagen de la firma como data URL (base64).
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @returns {string|null} Data URL de la imagen o null
	 */
	getSignatureData: Signature.toDataURL,

	/**
	 * Obtiene la instancia de SignaturePad.
	 * @param {string|HTMLElement} target Selector o elemento canvas
	 * @returns {Object|null} Instancia de SignaturePad
	 */
	getSignature: Signature.get,

	/* ── Calendario (FullCalendar) ── */

	/**
	 * Inicializa un calendario FullCalendar.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {Object} [options={}] Opciones de FullCalendar
	 * @returns {Object|null} Instancia del calendario
	 */
	initCalendar: Calendar.create,

	/**
	 * Obtiene la instancia del calendario.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {Object|null} Instancia del calendario
	 */
	getCalendar: Calendar.get,

	/**
	 * Agrega un evento al calendario.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {Object} eventData Datos del evento (title, start, end, etc.)
	 * @returns {void}
	 */
	addCalendarEvent: Calendar.addEvent,

	/**
	 * Limpia todos los eventos del calendario.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {void}
	 */
	clearCalendarEvents: Calendar.clearEvents,

	/**
	 * Elimina un evento del calendario por su ID.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {string|number} eventId ID del evento
	 * @returns {void}
	 */
	removeCalendarEvent: Calendar.removeEvent,

	/**
	 * Recarga eventos desde la fuente de datos.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {void}
	 */
	refetchCalendarEvents: Calendar.refetchEvents,

	/**
	 * Destruye el calendario liberando recursos.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @returns {void}
	 */
	destroyCalendar: Calendar.destroy,

	/**
	 * Navega a una fecha específica en el calendario.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {Date|string} date Fecha a la que navegar
	 * @returns {void}
	 */
	calendarGoTo: Calendar.goTo,

	/**
	 * Cambia la vista actual del calendario.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {"dayGridMonth"|"timeGridWeek"|"timeGridDay"|"listWeek"} view Nombre de la vista
	 * @returns {void}
	 */
	calendarSetView: Calendar.setView,

	/**
	 * Hace que elementos externos sean arrastrables al calendario.
	 * @param {string|HTMLElement} container Selector o elemento contenedor
	 * @param {Object} [options={}] Opciones de arrastre
	 * @returns {void}
	 */
	calendarDraggable: Calendar.draggable,

	/* ── DOM ── */

	/**
	 * Obtiene un elemento del DOM por selector.
	 * @param {string|HTMLElement|Window|Document|null|undefined} target Selector o elemento
	 * @returns {HTMLElement|Window|Document|null} Elemento encontrado o null
	 */
	el: Dom.el,

	/**
	 * Alias de {@link App.el} usando querySelector.
	 * @param {string} selector Selector CSS
	 * @returns {HTMLElement|null} Primer elemento que coincide
	 */
	q: Dom.q,

	/**
	 * Obtiene todos los elementos que coinciden con un selector.
	 * @param {string} selector Selector CSS
	 * @returns {HTMLElement[]} Array de elementos
	 */
	qa: Dom.qa,

	/**
	 * Muestra un elemento oculto.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	show: Dom.show,

	/**
	 * Oculta un elemento visible.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	hide: Dom.hide,

	/**
	 * Alterna la visibilidad de un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	toggle: Dom.toggle,

	/**
	 * Verifica si un elemento es visible.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {boolean}
	 */
	isVisible: Dom.isVisible,

	/**
	 * Verifica si un elemento está oculto.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {boolean}
	 */
	isHidden: Dom.isHidden,

	/**
	 * Habilita un elemento (quita disabled).
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	enable: Dom.enable,

	/**
	 * Deshabilita un elemento (agrega disabled).
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	disable: Dom.disable,

	/**
	 * Alterna el estado disabled de un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	toggleDisabled: Dom.toggleDisabled,

	/**
	 * Verifica si un elemento está deshabilitado.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {boolean}
	 */
	isDisabled: Dom.isDisabled,

	/**
	 * Obtiene o establece el contenido HTML de un elemento.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} [html] Si se provee, establece el HTML
	 * @returns {string|null} HTML actual (getter) o null (setter)
	 */
	html: Dom.html,

	/**
	 * Obtiene o establece el texto plano de un elemento.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} [text] Si se provee, establece el texto
	 * @returns {string|null} Texto actual (getter) o null (setter)
	 */
	text: Dom.text,

	/**
	 * Vacía el contenido de un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	clear: Dom.clear,

	/**
	 * Reemplaza el contenido de un elemento con nuevo HTML.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} html Nuevo contenido HTML
	 * @returns {void}
	 */
	changeDiv: Dom.changeDiv,

	/**
	 * Agrega una o varias clases CSS a un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} classname Clase o clases separadas por espacio
	 * @returns {void}
	 */
	addClass: Dom.addClass,

	/**
	 * Elimina una o varias clases CSS de un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} classname Clase o clases separadas por espacio
	 * @returns {void}
	 */
	removeClass: Dom.removeClass,

	/**
	 * Alterna una clase CSS en un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} classname Clase a alternar
	 * @returns {void}
	 */
	toggleClass: Dom.toggleClass,

	/**
	 * Verifica si un elemento tiene una clase CSS.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} classname Clase a verificar
	 * @returns {boolean}
	 */
	hasClass: Dom.hasClass,

	/**
	 * Obtiene o establece el value de un input.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string|number} [value] Si se provee, establece el valor
	 * @returns {string|null} Valor actual (getter) o null (setter)
	 */
	val: Dom.val,

	/**
	 * Limpia el valor de un input.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {void}
	 */
	clearVal: Dom.clearVal,

	/**
	 * Obtiene o establece un atributo data-* en un elemento.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} key Nombre del atributo (sin prefijo "data-")
	 * @param {*} [value] Valor a establecer (omitiendo obtiene el valor actual)
	 * @returns {*}
	 */
	data: Dom.data,

	/**
	 * Registra un evento en uno o varios elementos.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} eventType Tipo de evento (click, submit, change, etc.)
	 * @param {Function} handler Función manejadora
	 * @returns {void}
	 *
	 * @example
	 * App.on("#btnSave", "click", () => { App.success("Guardado"); });
	 */
	on: Dom.on,

	/**
	 * Elimina un evento previamente registrado.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} eventType Tipo de evento
	 * @param {Function} handler Función manejadora
	 * @returns {void}
	 */
	off: Dom.off,

	/**
	 * Dispara un evento personalizado en un elemento.
	 * @param {string|HTMLElement} t Selector o elemento
	 * @param {string} eventName Nombre del evento
	 * @param {*} [data] Datos adjuntos al evento
	 * @returns {void}
	 */
	dispatch: Dom.dispatch,

	/**
	 * Busca elementos descendientes dentro de un contenedor.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {string} selector Selector CSS de los descendientes
	 * @returns {HTMLElement[]} Array de elementos encontrados
	 */
	find: Dom.find,

	/**
	 * Busca el primer elemento descendiente dentro de un contenedor.
	 * @param {string|HTMLElement} target Selector o elemento contenedor
	 * @param {string} selector Selector CSS del descendiente
	 * @returns {HTMLElement|null} Primer elemento encontrado o null
	 */
	findOne: Dom.findOne,

	/**
	 * Obtiene el elemento padre de un elemento.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @returns {HTMLElement|null} Elemento padre o null
	 */
	parent: Dom.parent,

	/**
	 * Verifica si un elemento coincide con un selector CSS.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {string} selector Selector CSS a verificar
	 * @returns {boolean}
	 */
	is: Dom.is,

	/**
	 * Crea un elemento HTML con atributos y contenido.
	 * @param {string} tag Etiqueta HTML (div, span, a, etc.)
	 * @param {Object} [attrs={}] Atributos del elemento
	 * @param {string|HTMLElement} [content] Contenido interno
	 * @returns {HTMLElement} Elemento creado
	 */
	createElement: Dom.createElement,

	/**
	 * Crea múltiples elementos HTML desde un template.
	 * @param {Object[]} templates Array de configuraciones de elementos
	 * @returns {HTMLElement[]} Array de elementos creados
	 */
	createAll: Dom.createAll,

	/**
	 * Ejecuta una función cuando el DOM esté listo.
	 * @param {Function} fn Función a ejecutar
	 * @returns {void}
	 */
	ready: Dom.ready,

	/* ── Eventos pub/sub ── */

	/**
	 * Se suscribe a un evento personalizado.
	 * @param {string} event Nombre del evento
	 * @param {Function} handler Función manejadora
	 * @returns {void}
	 */
	eventOn: Event.on,

	/**
	 * Cancela la suscripción a un evento personalizado.
	 * @param {string} event Nombre del evento
	 * @param {Function} handler Función manejadora
	 * @returns {void}
	 */
	eventOff: Event.off,

	/**
	 * Emite un evento personalizado con datos.
	 * @param {string} event Nombre del evento
	 * @param {*} [data] Datos a enviar a los suscriptores
	 * @returns {void}
	 *
	 * @example
	 * App.eventEmit("user:updated", { id: 5, name: "Juan" });
	 */
	eventEmit: Event.emit,

	/**
	 * Se suscribe a un evento personalizado para ejecutarse una sola vez.
	 * @param {string} event Nombre del evento
	 * @param {Function} handler Función manejadora
	 * @returns {void}
	 */
	eventOnce: Event.once,

	/* ── Números ── */

	/**
	 * Formatea un número con separadores de miles y decimales.
	 * @param {number} value Número a formatear
	 * @param {number} [decimals=2] Cantidad de decimales
	 * @param {string} [locale="es-DO"] Código de locale
	 * @returns {string} Número formateado
	 */
	numFormat: NumberHelper.formatNumber,

	/**
	 * Redondea un número a la cantidad especificada de decimales.
	 * @param {number} value Número a redondear
	 * @param {number} [decimals=0] Decimales
	 * @returns {number}
	 */
	numRound: NumberHelper.round,

	/**
	 * Redondea un número hacia arriba (techo).
	 * @param {number} value Número
	 * @param {number} [decimals=0] Decimales
	 * @returns {number}
	 */
	numCeil: NumberHelper.ceil,

	/**
	 * Redondea un número hacia abajo (piso).
	 * @param {number} value Número
	 * @param {number} [decimals=0] Decimales
	 * @returns {number}
	 */
	numFloor: NumberHelper.floor,

	/**
	 * Convierte un valor a número de forma segura.
	 * @param {*} value Valor a convertir
	 * @param {number} [defaultValue=0] Valor por defecto
	 * @returns {number}
	 */
	numToNum: NumberHelper.toNumber,

	/**
	 * Genera un número entero aleatorio en un rango.
	 * @param {number} min Valor mínimo
	 * @param {number} max Valor máximo
	 * @returns {number} Entero aleatorio
	 */
	numRandom: NumberHelper.randomInt,

	/**
	 * Limita un número a un rango específico.
	 * @param {number} value Valor a limitar
	 * @param {number} min Límite inferior
	 * @param {number} max Límite superior
	 * @returns {number}
	 */
	numClamp: NumberHelper.clamp,

	/**
	 * Calcula el porcentaje de un valor respecto a un total.
	 * @param {number} value Valor parcial
	 * @param {number} total Valor total
	 * @param {number} [decimals=2] Decimales del resultado
	 * @returns {string} Porcentaje formateado
	 */
	numPercent: NumberHelper.percent,

	/**
	 * Calcula qué porcentaje representa un número de otro.
	 * @param {number} portion Valor parcial
	 * @param {number} total Valor total
	 * @param {number} [decimals=2] Decimales del resultado
	 * @returns {string} Porcentaje formateado
	 */
	numPercentOf: NumberHelper.percentOf,

	/**
	 * Suma todos los números de un array.
	 * @param {number[]} arr Array de números
	 * @returns {number} Suma total
	 */
	numSum: NumberHelper.sum,

	/**
	 * Calcula el promedio de un array de números.
	 * @param {number[]} arr Array de números
	 * @returns {number} Promedio
	 */
	numAvg: NumberHelper.avg,

	/**
	 * Formatea un número como moneda (ej. RD$ 1,500.00).
	 * @param {number} value Valor a formatear
	 * @param {string} [currency="RD$"] Símbolo de moneda
	 * @param {number} [decimals=2] Decimales
	 * @returns {string} Valor formateado como moneda
	 */
	numCurrency: NumberHelper.currency,

	/* ── Strings ── */

	/**
	 * Capitaliza la primera letra de un texto.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto con primera letra mayúscula
	 */
	strCapital: Strings.capitalize,

	/**
	 * Convierte un texto a formato Título (Cada Palabra en Mayúscula).
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto en formato título
	 */
	strTitleCase: Strings.titleCase,

	/**
	 * Convierte un texto a mayúsculas.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto en mayúsculas
	 */
	strUpper: Strings.upper,

	/**
	 * Convierte un texto a minúsculas.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto en minúsculas
	 */
	strLower: Strings.lower,

	/**
	 * Elimina espacios al inicio y final de un texto.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto sin espacios extremos
	 */
	strTrim: Strings.trim,

	/**
	 * Invierte el orden de los caracteres de un texto.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto invertido
	 */
	strReverse: Strings.reverse,

	/**
	 * Elimina espacios múltiples y los reemplaza por uno solo.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto sin espacios redundantes
	 */
	strCleanSpaces: Strings.cleanSpaces,

	/**
	 * Trunca un texto a una longitud máxima.
	 * @param {string} str Texto de entrada
	 * @param {number} [length=100] Longitud máxima
	 * @param {string} [suffix="..."] Sufijo al truncar
	 * @returns {string} Texto truncado
	 */
	strTruncate: Strings.truncate,

	/**
	 * Convierte un texto a slug URL-friendly.
	 * @param {string} str Texto de entrada
	 * @returns {string} Slug (ej. "Gestión Académica" → "gestion-academica")
	 *
	 * @example
	 * App.strSlug("Gestión Académica"); // "gestion-academica"
	 */
	strSlug: Strings.slug,

	/**
	 * Normaliza un texto eliminando acentos y diacríticos.
	 * @param {string} str Texto de entrada
	 * @returns {string} Texto sin acentos
	 */
	strNormalize: Strings.normalize,

	/**
	 * Agrega caracteres al inicio hasta alcanzar una longitud.
	 * @param {string|number} value Valor a rellenar
	 * @param {number} length Longitud final deseada
	 * @param {string} [char="0"] Carácter de relleno
	 * @returns {string} Texto rellenado
	 *
	 * @example
	 * App.strPadStart(5, 4);   // "0005"
	 * App.strPadStart("abc", 5, "-"); // "--abc"
	 */
	strPadStart: Strings.padStart,

	/**
	 * Agrega caracteres al final hasta alcanzar una longitud.
	 * @param {string|number} value Valor a rellenar
	 * @param {number} length Longitud final deseada
	 * @param {string} [char=" "] Carácter de relleno
	 * @returns {string} Texto rellenado
	 */
	strPadEnd: Strings.padEnd,

	/**
	 * Genera un identificador único alfanumérico.
	 * @param {number} [length=8] Longitud del ID
	 * @returns {string} ID único
	 */
	strUid: Strings.uid,

	/**
	 * Verifica si un texto contiene una subcadena.
	 * @param {string} text Texto completo
	 * @param {string} search Subcadena a buscar
	 * @returns {boolean}
	 */
	strContains: Strings.contains,

	/**
	 * Verifica si un texto comienza con una subcadena.
	 * @param {string} text Texto completo
	 * @param {string} search Subcadena a buscar
	 * @returns {boolean}
	 */
	strStartsWith: Strings.startsWith,

	/**
	 * Verifica si un texto termina con una subcadena.
	 * @param {string} text Texto completo
	 * @param {string} search Subcadena a buscar
	 * @returns {boolean}
	 */
	strEndsWith: Strings.endWith,

	/**
	 * Resalta ocurrencias de una subcadena envolviéndolas en &lt;mark&gt;.
	 * @param {string} text Texto completo
	 * @param {string} search Término a resaltar
	 * @returns {string} HTML con marcas resaltadas
	 */
	strHighlight: Strings.highlight,

	/**
	 * Aplica una máscara a un valor (ej. teléfono, cédula).
	 * @param {string} value Valor a enmascarar
	 * @param {string} mask Patrón de máscara (ej. "###-###-####")
	 * @returns {string} Valor enmascarado
	 */
	strMask: Strings.mask,

	/**
	 * Formatea un número de teléfono dominicano (809-555-1234).
	 * @param {string} phone Número de teléfono
	 * @returns {string} Teléfono formateado
	 */
	strPhone: Strings.formatPhone,

	/**
	 * Formatea una cédula dominicana (001-1234567-8).
	 * @param {string} cedula Número de cédula
	 * @returns {string} Cédula formateada
	 */
	strCedula: Strings.formatCedula,

	/**
	 * Formatea un RNC dominicano (1-01-12345-6).
	 * @param {string} rnc Número de RNC
	 * @returns {string} RNC formateado
	 */
	strRNC: Strings.formatRNC,

	/**
	 * Reemplaza placeholders en un template string.
	 * @param {string} template Template con {placeholders}
	 * @param {Object} data Objeto con valores
	 * @returns {string} Texto con placeholders reemplazados
	 *
	 * @example
	 * App.strFormat("Hola {name}", { name: "Juan" }); // "Hola Juan"
	 */
	strFormat: Strings.format,

	/**
	 * Escapa caracteres HTML para prevenir XSS.
	 * @param {string} text Texto a escapar
	 * @returns {string} Texto con HTML escapado
	 */
	strEscapeHtml: Strings.escapeHtml,

	/**
	 * Elimina etiquetas HTML de un texto.
	 * @param {string} html Texto con HTML
	 * @returns {string} Texto sin etiquetas HTML
	 */
	strStripHtml: Strings.stripHtml,

	/**
	 * Cuenta cuántas veces aparece una subcadena en un texto.
	 * @param {string} text Texto completo
	 * @param {string} search Subcadena a contar
	 * @returns {number} Número de ocurrencias
	 */
	strCount: Strings.countOccurrences,

	/**
	 * Reemplaza todas las ocurrencias de una subcadena.
	 * @param {string} text Texto completo
	 * @param {string} search Subcadena a reemplazar
	 * @param {string} replacement Texto de reemplazo
	 * @returns {string} Texto con reemplazos
	 */
	strReplaceAll: Strings.replaceAll,

	/* ── Fullscreen ── */

	/**
	 * Alterna el modo de pantalla completa.
	 * @param {string|HTMLElement} [target] Elemento o selector (opcional, por defecto document.documentElement)
	 * @returns {void}
	 */
	toggleFullscreen: Fullscreen.toggle,

	/**
	 * Solicita entrar en modo pantalla completa.
	 * @param {string|HTMLElement} [target] Elemento o selector
	 * @returns {void}
	 */
	requestFullscreen: Fullscreen.request,

	/**
	 * Sale del modo pantalla completa.
	 * @returns {void}
	 */
	exitFullscreen: Fullscreen.exit,

	/* ── Iconos ── */

	/**
	 * Establece la librería de iconos por defecto (feather, bi, fa).
	 * @param {string} lib Nombre de la librería ("feather", "bi", "fa")
	 * @returns {void}
	 */
	setDefaultIcon: Icons.setDefault,

	/**
	 * Crea un elemento &lt;i&gt; con el icono especificado.
	 * @param {string} name Nombre del icono
	 * @param {string} [lib] Librería (opcional, usa la default)
	 * @param {Object} [options={}] Opciones adicionales (class, size, color)
	 * @returns {HTMLElement} Elemento i con el icono
	 */
	icon: Icons.iconEl,

	/**
	 * Crea un icono de Font Awesome.
	 * @param {string} name Nombre del icono (ej. "fas fa-user")
	 * @param {Object} [options={}] Opciones adicionales
	 * @returns {HTMLElement}
	 */
	fa: Icons.fa,

	/**
	 * Crea un icono de Bootstrap Icons.
	 * @param {string} name Nombre del icono (ej. "bi-person")
	 * @param {Object} [options={}] Opciones adicionales
	 * @returns {HTMLElement}
	 */
	bi: Icons.bi,

	/**
	 * Crea un icono de Feather Icons.
	 * @param {string} name Nombre del icono (ej. "user")
	 * @param {Object} [options={}] Opciones adicionales
	 * @returns {HTMLElement}
	 */
	feather: Icons.feather,

	/* ── Códigos de barras y QR ── */

	/**
	 * Genera un código de barras en un elemento.
	 * @param {string|HTMLElement} element Selector o elemento contenedor
	 * @param {string} value Valor a codificar
	 * @param {Object} [options={}] Opciones (formato, ancho, alto, etc.)
	 * @returns {void}
	 */
	codeBarcode: Codes.barcode,

	/**
	 * Genera un código QR en un canvas.
	 * @param {string|HTMLElement} element Selector o elemento canvas
	 * @param {string} text Texto o URL a codificar
	 * @param {Object} [options={}] Opciones (tamaño, color, etc.)
	 * @returns {void}
	 */
	codeQrCanvas: Codes.qrCanvas,

	/**
	 * Genera un código QR como imagen.
	 * @param {string|HTMLElement} element Selector o elemento contenedor
	 * @param {string} text Texto o URL a codificar
	 * @param {Object} [options={}] Opciones
	 * @returns {void}
	 */
	codeQrImage: Codes.qrImage,

	/**
	 * Limpia el contenido de códigos generados.
	 * @param {string|HTMLElement} element Selector o elemento
	 * @returns {void}
	 */
	codeClear: Codes.clear,

	/* ── Moneda ── */

	/**
	 * Obtiene el símbolo de una moneda.
	 * @param {string} [currency="RD$"] Código o símbolo de moneda
	 * @returns {string} Símbolo de la moneda
	 */
	currencySymbol: Currency.getSymbol,

	/**
	 * Formatea un número como moneda con símbolo y decimales.
	 * @param {number} value Valor a formatear
	 * @param {string} [currency="RD$"] Símbolo o código de moneda
	 * @param {number} [decimals=2] Decimales
	 * @returns {string} Valor formateado
	 *
	 * @example
	 * App.currencyFormat(1500);       // "RD$ 1,500.00"
	 * App.currencyFormat(1500, "USD"); // "US$ 1,500.00"
	 */
	currencyFormat: Currency.format,

	/**
	 * Convierte un valor entre monedas usando una tasa de cambio.
	 * @param {number} value Valor a convertir
	 * @param {number} rate Tasa de cambio
	 * @param {number} [decimals=2] Decimales del resultado
	 * @returns {string} Valor convertido y formateado
	 */
	currencyConvert: Currency.convert,

	/* ── Drag & Drop ── */

	/**
	 * Activa arrastre en contenedores usando SortableJS.
	 * @param {string} key Identificador único del grupo drag
	 * @param {HTMLElement[]} containers Array de contenedores
	 * @param {Object} [options={}] Opciones de SortableJS
	 * @returns {Object[]} Instancias Sortable creadas
	 *
	 * @example
	 * App.dragCreate("kanban", [col1, col2, col3]);
	 */
	dragCreate: Drag.create,

	/**
	 * Obtiene las instancias Sortable de un grupo.
	 * @param {string} key Identificador del grupo
	 * @returns {Object[]|null}
	 */
	dragGet: Drag.get,

	/**
	 * Destruye un grupo drag liberando recursos.
	 * @param {string} key Identificador del grupo
	 * @returns {void}
	 */
	dragDestroy: Drag.destroy,

	/* ── Archivos ── */

	/**
	 * Formatea un tamaño de archivo en bytes a una unidad legible.
	 * @param {number} bytes Tamaño en bytes
	 * @param {number} [decimals=2] Decimales
	 * @returns {string} Tamaño formateado (ej. "1.5 MB")
	 */
	fileFormatSize: FileHelper.formatSize,

	/**
	 * Obtiene la extensión de un archivo.
	 * @param {string} filename Nombre del archivo
	 * @returns {string} Extensión (ej. "pdf", "jpg")
	 */
	fileExtension: FileHelper.getExtension,

	/**
	 * Verifica si un archivo no excede el tamaño máximo permitido.
	 * @param {File} file Objeto File del input
	 * @param {number} maxSizeMB Tamaño máximo en megabytes
	 * @returns {boolean}
	 */
	fileIsValidSize: FileHelper.isValidSize,

	/**
	 * Verifica si la extensión de un archivo está en la lista de permitidas.
	 * @param {File} file Objeto File
	 * @param {string[]} allowedExtensions Array de extensiones permitidas
	 * @returns {boolean}
	 */
	fileIsValidExtension: FileHelper.isValidExtension,

	/**
	 * Lee un archivo como data URL (base64).
	 * @param {File} file Objeto File
	 * @returns {Promise<string>} Data URL del archivo
	 */
	fileReadBase64: FileHelper.readAsBase64,

	/**
	 * Lee un archivo de texto como string.
	 * @param {File} file Objeto File
	 * @returns {Promise<string>} Contenido del archivo
	 */
	fileReadText: FileHelper.readAsText,

	/**
	 * Descarga contenido como archivo de texto.
	 * @param {string} content Contenido del archivo
	 * @param {string} filename Nombre del archivo
	 * @param {string} [mimeType="text/plain"] Tipo MIME
	 * @returns {void}
	 */
	fileDownloadText: FileHelper.downloadText,

	/**
	 * Descarga un archivo desde una URL.
	 * @param {string} url URL del archivo
	 * @param {string} [filename] Nombre sugerido para la descarga
	 * @returns {void}
	 */
	fileDownloadUrl: FileHelper.downloadUrl,

	/* ── Impresión ── */

	/**
	 * Imprime el contenido de un elemento específico.
	 * @param {string|HTMLElement} target Selector o elemento
	 * @param {Object} [options={}] Opciones de impresión
	 * @returns {void}
	 */
	printEl: Print.element,

	/**
	 * Imprime HTML personalizado.
	 * @param {string} html Contenido HTML a imprimir
	 * @param {string} [title] Título del documento impreso
	 * @returns {void}
	 */
	printHtml: Print.html,

	/**
	 * Imprime la página actual.
	 * @returns {void}
	 */
	printPage: Print.page,

	/* ── Humanización de texto ── */

	/**
	 * Convierte minutos a un texto legible de duración.
	 * @param {number} minutes Cantidad de minutos
	 * @param {Object} [options={}] Opciones de formato
	 * @returns {string} Texto de duración (ej. "2 horas, 30 minutos")
	 */
	humanizeDuration: Humanize.duration,

	/**
	 * Calcula el tiempo restante hasta una fecha como texto legible.
	 * @param {Date|string|number} endDate Fecha objetivo
	 * @returns {string} Tiempo restante (ej. "3 días, 5 horas")
	 */
	humanizeTimeRemaining: Humanize.timeRemaining,

	/**
	 * Calcula hace cuánto tiempo fue una fecha.
	 * @param {Date|string|number} pastDate Fecha pasada
	 * @returns {string} Texto (ej. "hace 2 días", "hace 3 horas")
	 */
	humanizeTimeAgo: Humanize.timeAgo,

	/* ── Select2 ── */

	/**
	 * Establece el valor de un Select2.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @param {string|string[]} value Valor o array de valores
	 * @param {boolean} [triggerChange=true] Dispara evento change
	 * @returns {void}
	 */
	select2Set: Select2.setValue,

	/**
	 * Limpia la selección de un Select2.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @returns {void}
	 */
	select2Clear: Select2.clear,

	/**
	 * Habilita un Select2.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @returns {void}
	 */
	select2Enable: Select2.enable,

	/**
	 * Deshabilita un Select2.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @returns {void}
	 */
	select2Disable: Select2.disable,

	/**
	 * Recarga las opciones de un Select2 desde la API.
	 * @param {string|HTMLElement} el Selector o elemento select
	 * @returns {Promise<void>}
	 */
	select2Reload: Select2.reload,

	/**
	 * Inicializa Select2 en todos los `<select class="select2">` del scope.
	 * @param {HTMLElement|Document} [scope=document] Scope de búsqueda
	 * @param {Object} [options={}] Opciones adicionales de Select2
	 * @returns {void}
	 */
	select2Init: Select2.init,

	/* ── Choices JS ── */

	/**
	 * Inicializa Choices en todos los `<select class="choices">` del scope.
	 * @param {HTMLElement|Document} [scope=document] Scope de búsqueda
	 * @param {Object} [options={}] Opciones adicionales de Choices
	 * @returns {void}
	 */
	choicesInit: ChoicesJS.init,

	/**
	 * Obtiene la instancia de Choices de un select.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @returns {Object|null} Instancia de Choices o null
	 */
	choicesGet: ChoicesJS.getInstance,

	/**
	 * Obtiene el valor actual de un Choices.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @param {boolean} [asString=true] true devuelve string, false devuelve array
	 * @returns {string|string[]|null}
	 */
	choicesGetValue: ChoicesJS.getValue,

	/**
	 * Establece el valor de un Choices.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @param {string|string[]|Object[]} value Valor o array de valores
	 * @param {boolean} [triggerChange=true] Dispara evento change
	 * @returns {void}
	 */
	choicesSet: ChoicesJS.setValue,

	/**
	 * Limpia la selección de un Choices.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @returns {void}
	 */
	choicesClear: ChoicesJS.clear,

	/**
	 * Habilita un Choices.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @returns {void}
	 */
	choicesEnable: ChoicesJS.enable,

	/**
	 * Deshabilita un Choices.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @returns {void}
	 */
	choicesDisable: ChoicesJS.disable,

	/**
	 * Destruye la instancia de Choices de un select.
	 * @param {string|HTMLElement} el Selector o elemento
	 * @returns {void}
	 */
	choicesDestroy: ChoicesJS.destroy,

	/* ── Custon ── */

	/**
	 * Carga opciones de un select desde una API.
	 * @param {string} name Nombre semántico (ej: "users" → busca select.slUsers)
	 * @param {string} url Endpoint de la API
	 * @param {Object} [param] Parámetros opcionales
	 * @returns {Promise<void>}
	 */
	getSelect: Custon.getSelect,

	/* ── Sidebar ── */

	/**
	 * Alterna la visibilidad de la barra lateral.
	 * @returns {void}
	 */
	sidebarToggle: Sidebar.toggle,

	/**
	 * Colapsa la barra lateral.
	 * @returns {void}
	 */
	sidebarCollapse: Sidebar.collapse,

	/**
	 * Expande la barra lateral.
	 * @returns {void}
	 */
	sidebarExpand: Sidebar.expand,

	/**
	 * Verifica si la barra lateral está colapsada.
	 * @returns {boolean}
	 */
	sidebarIsCollapsed: Sidebar.isCollapsed,

	/**
	 * Refresca el estado de la barra lateral.
	 * @returns {void}
	 */
	sidebarRefresh: Sidebar.refresh,

	/* ── Iframe / Pestañas ── */

	/**
	 * Abre una nueva pestaña con contenido iframe.
	 * @param {string} title Título de la pestaña
	 * @param {string} url URL del contenido
	 * @param {string} [icon] Clase del icono (opcional)
	 * @returns {void}
	 */
	iframeOpen: Iframe.open,

	/**
	 * Cierra una pestaña iframe específica.
	 * @param {string} key Identificador de la pestaña
	 * @returns {void}
	 */
	iframeClose: Iframe.close,

	/**
	 * Alterna el modo pantalla completa del iframe activo.
	 * @returns {void}
	 */
	iframeFullscreen: Iframe.toggleFullscreen,

	/**
	 * Refresca el iframe activo.
	 * @returns {void}
	 */
	iframeRefresh: Iframe.refresh,

	/**
	 * Cierra todas las pestañas excepto la activa.
	 * @returns {void}
	 */
	iframeCloseOthers: Iframe.closeOthers,

	/**
	 * Cierra todas las pestañas iframe.
	 * @returns {void}
	 */
	iframeCloseAll: Iframe.closeAll,

	/* ── Excel (SheetJS) ── */

	/**
	 * Exporta datos a un archivo Excel.
	 * @param {Object[]} data Array de objetos a exportar
	 * @param {string} [filename="export.xlsx"] Nombre del archivo
	 * @returns {void}
	 */
	excelExport: Excel.exportToExcel,

	/**
	 * Importa datos desde un archivo Excel (lectura).
	 * @param {File} file Objeto File del input
	 * @returns {Promise<Object[]>} Array de objetos con los datos
	 */
	excelImport: Excel.excelToJson,

	/**
	 * Convierte un array de objetos a Excel y descarga.
	 * @param {Object[]} data Array de objetos
	 * @param {string} [filename="export.xlsx"] Nombre del archivo
	 * @returns {void}
	 */
	jsonToExcel: Excel.jsonToExcel,

	/**
	 * Alias de {@link App.excelImport}.
	 * @param {File} file Objeto File
	 * @returns {Promise<Object[]>}
	 */
	excelToJson: Excel.excelToJson,

	/**
	 * Convierte un array de objetos a CSV y descarga.
	 * @param {Object[]} data Array de objetos
	 * @param {string} [filename="export.csv"] Nombre del archivo
	 * @returns {void}
	 */
	jsonToCsv: Excel.jsonToCsv,

	/**
	 * Importa múltiples hojas desde un archivo Excel.
	 * @param {File} file Objeto File
	 * @returns {Promise<Object<string, Object[]>>} Objeto con nombre de hoja como clave
	 */
	excelImportMultiple: Excel.excelToJsonMultiple,

	/**
	 * Exporta múltiples arrays a diferentes hojas en un Excel.
	 * @param {Object<string, Object[]>} sheets Objeto con nombre de hoja y datos
	 * @param {string} [filename="export.xlsx"] Nombre del archivo
	 * @returns {void}
	 */
	excelExportMultiple: Excel.jsonToExcelMultiple,

	/* ── Formularios ── */

	/**
	 * Valida un formulario usando HTML5 validation.
	 * @param {string|HTMLFormElement} form Selector o elemento form
	 * @returns {boolean} true si el formulario es válido
	 */
	isValidForm: Forms.isValidForm,

	/**
	 * Serializa un formulario a un objeto { name: value }.
	 * @param {string|HTMLFormElement} form Selector o elemento form
	 * @returns {Object} Datos del formulario
	 *
	 * @example
	 * const data = App.serializeForm("#myForm");
	 * await App.postApi("/api/usuarios", data);
	 */
	serializeForm: Forms.serialize,

	/**
	 * Limpia todos los campos de un formulario.
	 * @param {string|HTMLFormElement} form Selector o elemento form
	 * @returns {void}
	 */
	clearForm: Forms.clear,

	/**
	 * Llena un formulario con datos de un objeto.
	 * @param {string|HTMLFormElement} form Selector o elemento form
	 * @param {Object} data Objeto con { name: value }
	 * @returns {void}
	 *
	 * @example
	 * App.fillForm("#userForm", { name: "Juan", email: "juan@mail.com" });
	 */
	fillForm: Forms.fill,

	/**
	 * Envía un formulario vía AJAX.
	 * @param {string|HTMLFormElement} form Selector o elemento form
	 * @param {string} url URL del endpoint
	 * @param {Object} [options={}] Opciones (method, onSuccess, onError, reset, etc.)
	 * @returns {Promise<*>} Respuesta del servidor
	 */
	submitForm: Forms.submit,

	/**
	 * Alterna la visibilidad de un campo de contraseña.
	 * @param {string|HTMLElement} passwordInput Selector o input de contraseña
	 * @param {string|HTMLElement} [toggleButton] Botón que dispara la acción
	 * @returns {void}
	 */
	togglePassword: Forms.togglePassword,

	/* ── Validación ── */

	/**
	 * Verifica si un valor es null o empty.
	 * @param {*} value Valor a validar
	 * @returns {boolean}
	 */
	isNullOrEmpty: Validation.isNullOrEmpty,

	/**
	 * Verifica si un string está vacío (solo espacios).
	 * @param {string} value Texto a validar
	 * @returns {boolean}
	 */
	isEmpty: Validation.isEmpty,

	/**
	 * Valida un correo electrónico.
	 * @param {string} email Correo a validar
	 * @param {RegExp} [regex] Expresión regular personalizada
	 * @returns {boolean}
	 */
	isValidEmail: Validation.isValidEmail,

	/**
	 * Valida un número de teléfono dominicano.
	 * @param {string} phone Teléfono a validar
	 * @returns {boolean}
	 */
	isValidPhone: Validation.isValidPhone,

	/**
	 * Valida una cédula dominicana (formato y dígito verificador).
	 * @param {string} cedula Cédula a validar
	 * @returns {boolean}
	 *
	 * @example
	 * App.isValidCedula("001-1234567-8"); // true
	 */
	isValidCedula: Validation.isValidCedula,

	/**
	 * Valida un RNC dominicano (formato y dígito verificador).
	 * @param {string} rnc RNC a validar
	 * @returns {boolean}
	 */
	isValidRNC: Validation.isValidRNC,

	/**
	 * Valida una placa vehicular dominicana.
	 * @param {string} placa Placa a validar
	 * @returns {boolean}
	 */
	isValidPlaca: Validation.isValidPlaca,

	/**
	 * Verifica si un valor es un número válido.
	 * @param {*} value Valor a validar
	 * @returns {boolean}
	 */
	isNumber: Validation.isNumber,

	/**
	 * Verifica si un número está dentro de un rango.
	 * @param {number} value Valor a validar
	 * @param {number} min Límite inferior
	 * @param {number} max Límite superior
	 * @returns {boolean}
	 */
	isInRange: Validation.isInRange,

	/**
	 * Valida una URL.
	 * @param {string} url URL a validar
	 * @returns {boolean}
	 */
	isValidUrl: Validation.isValidUrl,

	/**
	 * Verifica si una fecha es posterior a otra.
	 * @param {Date|string|number} date Fecha a comparar
	 * @param {Date|string|number} [compareDate] Fecha de referencia (opcional)
	 * @returns {boolean}
	 */
	isAfter: Validation.isAfter,

	/**
	 * Verifica si una fecha es anterior a otra.
	 * @param {Date|string|number} date Fecha a comparar
	 * @param {Date|string|number} [compareDate] Fecha de referencia (opcional)
	 * @returns {boolean}
	 */
	isBefore: Validation.isBefore,

	/**
	 * Verifica si la extensión de un archivo está permitida.
	 * @param {File} file Objeto File
	 * @param {string[]} extensions Array de extensiones (ej. ["jpg", "png"])
	 * @returns {boolean}
	 */
	isAllowedExt: Validation.isAllowedExtension,

	/**
	 * Verifica si el tamaño de un archivo es válido.
	 * @param {File} file Objeto File
	 * @param {number} maxSizeMB Tamaño máximo en MB
	 * @returns {boolean}
	 */
	isValidFileSize: Validation.isValidFileSize,

	/* ── Asset (rutas de recursos) ── */

	/**
	 * Obtiene la URL del logo de la aplicación.
	 * @param {string} [variant="default"] Variante del logo (default, dark, light)
	 * @returns {string} URL del logo
	 */
	logo: Asset.logo,

	/**
	 * Obtiene la URL del avatar de un usuario.
	 * @param {string} [filename] Nombre del archivo de avatar
	 * @returns {string} URL del avatar
	 */
	avatar: Asset.avatar,

	/**
	 * Obtiene la URL de una imagen de fondo.
	 * @param {string} filename Nombre del archivo
	 * @returns {string} URL del fondo
	 */
	assetBg: Asset.bg,

	/**
	 * Obtiene la URL de la foto de un usuario.
	 * @param {number|string} id ID del usuario
	 * @returns {string} URL de la foto
	 */
	assetUser: Asset.user,

	/**
	 * Obtiene la URL de una imagen desde una ruta relativa.
	 * @param {string} path Ruta relativa dentro de assets
	 * @param {string} [filename] Nombre del archivo
	 * @returns {string} URL completa
	 */
	assetImg: Asset.img,

	/**
	 * Obtiene la URL de una imagen placeholder por tipo.
	 * @param {string} type Tipo de placeholder (user, product, etc.)
	 * @returns {string} URL del placeholder
	 */
	assetPlaceholder: Asset.placeholder,

	/* ── CRUD (AppResponse) ── */

	/**
	 * Construye una respuesta estándar AppResponse.
	 * @param {"S"|"D"|"W"|"I"} type Tipo: S=success, D=danger/error, W=warning, I=info
	 * @param {string} message Mensaje descriptivo
	 * @param {*} [data=null] Datos adicionales
	 * @returns {Object} { isError, type, Message, data }
	 *
	 * @example
	 * App.makeResponse("S", "Guardado exitoso", { id: 1 });
	 * // { isError: false, type: "S", Message: "Guardado exitoso", data: { id: 1 } }
	 */
	makeResponse: (type, message, data = null) => ({
		isError: type === "D" || type === "W",
		type,
		Message: message,
		data,
	}),

	/**
	 * Maneja una respuesta en formato AppResponse mostrando la notificación
	 * correspondiente según el tipo (S→success, D→error, W→warning, I→info).
	 * @param {Object} res Respuesta con { isError, type, Message, data }
	 * @param {Function} [onSuccess] Callback ejecutado con res.data si es exitoso
	 * @returns {Object} La misma respuesta
	 *
	 * @example
	 * const res = await App.postApi("/api/usuarios", data);
	 * App.handleApiResponse(res, (data) => App.refreshTbl("#tabla", data));
	 */
	handleApiResponse: (res, onSuccess) => {
		if (!res.isError) {
			if (res.type === "S") Alert.success(res.Message);
			else if (res.type === "I") Alert.info(res.Message);
			if (typeof onSuccess === "function") onSuccess(res.data);
		} else {
			if (res.type === "D") Alert.error(res.Message);
			else if (res.type === "W") Alert.warning(res.Message);
		}
		return res;
	},

	/**
	 * Abre un modal CRUD reseteando el formulario y llenándolo en modo edición.
	 * @param {string} modalSelector Selector del modal
	 * @param {string} formSelector Selector del formulario
	 * @param {"create"|"edit"} mode Modo: "create" o "edit"
	 * @param {Object} [data={}] Datos para llenar el formulario (solo en modo edit)
	 * @param {Object} [options={}] Opciones adicionales
	 * @param {string} [options.titleCreate="Nuevo Registro"] Título en modo create
	 * @param {string} [options.titleEdit="Editar Registro"] Título en modo edit
	 *
	 * @example
	 * App.openCrudModal("#userModal", "#userForm", "edit", user);
	 */
	openCrudModal: (modalSelector, formSelector, mode, data = {}, options = {}) => {
		const { titleCreate = "Nuevo Registro", titleEdit = "Editar Registro" } = options;

		Forms.clear(formSelector);
		const formEl = Forms.resolveForm(formSelector);
		if (formEl) {
			const idInput = formEl.querySelector('[name="id"]');
			if (idInput) idInput.value = "";
		}

		if (mode === "edit" && Object.keys(data).length) {
			Modal.setTitle(modalSelector, titleEdit);
			Forms.fill(formSelector, data);
		} else {
			Modal.setTitle(modalSelector, titleCreate);
		}

		Modal.open(modalSelector, data);
	},

	/**
	 * Ejecuta el flujo completo de guardado CRUD:
	 * valida formulario → serializa → confirma → ejecuta → maneja respuesta.
	 * @param {Object} options
	 * @param {string} options.form Selector del formulario
	 * @param {string} [options.modal] Selector del modal a cerrar tras éxito
	 * @param {string} [options.table] Selector de la tabla a refrescar
	 * @param {Object[]} [options.dataArray] Array de datos para refrescar la tabla
	 * @param {Function} options.onCreate Función asíncrona (payload) => AppResponse
	 * @param {Function} options.onUpdate Función asíncrona (id, payload) => AppResponse
	 *
	 * @example
	 * App.crudSave({
	 *   form: "#userForm",
	 *   modal: "#userModal",
	 *   table: "#usersTable",
	 *   dataArray: users,
	 *   onCreate: (p) => createUser(p),
	 *   onUpdate: (id, p) => updateUser(id, p),
	 * });
	 */
	crudSave: async (options) => {
		const { form, modal, table, dataArray, onCreate, onUpdate } = options;

		if (!Forms.isValid(form)) return;

		const payload = Forms.serialize(form);
		const id = parseInt(payload.id, 10);
		delete payload.id;

		const isUpdate = !isNaN(id) && id > 0;

		const confirmed = isUpdate ? await Alert.confirmUpdate() : await Alert.confirmInsert();
		if (!confirmed) return;

		Alert.loading(true);
		try {
			const res = isUpdate ? await onUpdate(id, payload) : await onCreate(payload);
			App.handleApiResponse(res, () => {
				if (table && dataArray) Table.refresh(table, dataArray);
				if (modal) Modal.close(modal);
			});
		} finally {
			Alert.loading(false);
		}
	},

	/**
	 * Ejecuta el flujo completo de eliminación CRUD:
	 * confirma → ejecuta → maneja respuesta.
	 * @param {Object} options
	 * @param {number|string} options.id ID del registro a eliminar
	 * @param {Function} options.onDelete Función asíncrona (id) => AppResponse
	 * @param {string} [options.name] Nombre del registro (para confirmación personalizada)
	 * @param {string} [options.table] Selector de la tabla a refrescar
	 * @param {Object[]} [options.dataArray] Array de datos para refrescar la tabla
	 *
	 * @example
	 * App.crudDelete({
	 *   id: 5,
	 *   name: "Juan Pérez",
	 *   onDelete: (id) => removeUser(id),
	 *   table: "#usersTable",
	 *   dataArray: users,
	 * });
	 */
	crudDelete: async (options) => {
		const { id, onDelete, name, table, dataArray } = options;

		const confirmed = name ? await Alert.confirmDeleteByName(name) : await Alert.confirmDelete();
		if (!confirmed) return;

		Alert.loading(true);
		try {
			const res = await onDelete(id);
			App.handleApiResponse(res, () => {
				if (table && dataArray) Table.refresh(table, dataArray);
			});
		} finally {
			Alert.loading(false);
		}
	},
};

/* ── Plugin system ── */

/**
 * Registra e instala un plugin en App.
 * @param {Object|Function} plugin Plugin con método `install(app)` o función
 * @returns {Object} App (para encadenamiento)
 *
 * @example
 * App.use({
 *   name: "MiPlugin",
 *   install(app) { app.saludar = () => "Hola"; },
 * });
 * App.saludar(); // "Hola"
 */
App.use = function (plugin) {
	installPlugin(App, plugin);
	return App;
};

/**
 * Verifica si un plugin está instalado por su nombre.
 * @type {Function}
 */
App.isInstalled = isInstalled;

/**
 * Lista de plugins instalados.
 * @type {Object[]}
 */
App.plugins = installedPlugins;

export default App;
