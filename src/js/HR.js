/**
 * @namespace $HR
 * @description
 * Fachada unificada de HR Library v3.0.
 *
 * Combina la arquitectura de V1 (plugin system, fluent API)
 * con la exposición global de V2 (window.$Helper por módulo).
 *
 * ---
 *
 * ### Niveles de acceso
 *
 * #### 1. Módulos directos vía window (acceso más directo)
 * ```js
 * $Alert.success("Guardado");
 * $Table.initTable("#tabla", options);
 * $Validation.isValidCedula("001-1234567-8");
 * $String.slug("Gestión Académica");
 * $Storage.setTtl("token", "abc123", 3600);
 * ```
 *
 * #### 2. API plana en $HR (compatibilidad y demos)
 * ```js
 * $HR.msgSuccess("Guardado");
 * $HR.getApi("/api/empleados");
 * $HR.isValidCedula("001-1234567-8");
 * $HR.createTbl("#tabla", options);
 * ```
 *
 * #### 3. Plugin system (extensibilidad)
 * ```js
 * $HR.use({
 *   name: "MiPlugin",
 *   install(hr) {
 *     hr.MiHelper = {};
 *   }
 * });
 * ```
 *
 * ---
 *
 * @version 3.0.0
 */

import { installPlugin, isInstalled, installedPlugins } from "./core/plugin-system.js";

import config from "./core/config.js";
import spanish from "./core/spanish.js";
import init from "./core/init.js";

import Alert from "./helpers/Alert.js";
import Api from "./helpers/Api.js";
import Asset from "./helpers/Asset.js";
import Calendar from "./helpers/Calendar.js";
import Charts from "./helpers/Charts.js";
import Codes from "./helpers/Codes.js";
import Currency from "./helpers/Currency.js";
import DateHelper from "./helpers/Date.js";
import Dom from "./helpers/Dom.js";
import Drag from "./helpers/Drag.js";
import Editor from "./helpers/Editor.js";
import Event from "./helpers/Event.js";
import Excel from "./helpers/Excel.js";
import ExportTbl from "./helpers/ExportTbl.js";
import FileHelper from "./helpers/File.js";
import Forms from "./helpers/Forms.js";
import Fullscreen from "./helpers/Fullscreen.js";
import Humanize from "./helpers/Humanize.js";
import Icons from "./helpers/Icons.js";
import Iframe from "./helpers/Iframe.js";
import Modal from "./helpers/Modal.js";
import NumberHelper from "./helpers/Number.js";
import Print from "./helpers/Print.js";
import Select2 from "./helpers/Select2.js";
import Sidebar from "./helpers/Sidebar.js";
import Signature from "./helpers/Signature.js";
import Storage from "./helpers/Storage.js";
import Strings from "./helpers/Strings.js";
import Table from "./helpers/Table.js";
import Validation from "./helpers/Validation.js";

/* ══════════════════════════════════════════════════════
	 API PLANA $HR — todos los métodos públicos de la librería
══════════════════════════════════════════════════════ */

const $HR = {

	/* ── Meta ── */
	version: config.app.version,
	config,
	lang: spanish,

	/* ── Init ── */
	/** @param {HTMLElement|Document|string} [scope=document] */
	init: (scope) => init(scope),

	/* ── HTTP ── */
	/** Establece el token Bearer para autenticación. @param {string|null} token @memberof $HR */
	setToken: (t) => Api.setToken(t),
	/** Obtiene el token Bearer actual. @returns {string|null} @memberof $HR */
	getToken: () => Api.getToken(),
	/** Habilita/desactiva alertas automáticas de errores HTTP. @param {boolean} [value=true] @memberof $HR */
	setApiAlerts: (v) => Api.setAutoAlerts(v),
	/** Realiza petición GET. @param {string} url Endpoint. @param {Object} [params={}] @param {Object} [options] @returns {Promise<any>} @memberof $HR */
	getApi: (u, p, o) => Api.get(u, p, o),
	/** Realiza petición POST (crear). @param {string} url @param {Object|FormData} [data={}] @param {Object} [options] @returns {Promise<any>} @memberof $HR */
	postApi: (u, d, o) => Api.post(u, d, o),
	/** Realiza petición PUT (reemplazar). @param {string} url @param {Object|FormData} [data] @param {Object} [options] @returns {Promise<any>} @memberof $HR */
	putApi: (u, d, o) => Api.put(u, d, o),
	/** Realiza petición PATCH (actualizar parcial). @param {string} url @param {Object|FormData} [data] @param {Object} [options] @returns {Promise<any>} @memberof $HR */
	patchApi: (u, d, o) => Api.patch(u, d, o),
	/** Realiza petición DELETE. @param {string} url @param {Object} [options] @returns {Promise<any>} @memberof $HR */
	deleteApi: (u, o) => Api.delete(u, o),
	/** Sube archivo con progreso. @param {string} url @param {FormData} formData @param {Function} [onProgress] @returns {Promise<any>} @memberof $HR */
	uploadApi: (u, fd, p) => Api.upload(u, fd, p),
	/** Carga options en select desde API. @param {string|HTMLElement} el @param {string} url @param {Object} [params] @memberof $HR */
	getSelect: (e, u, p) => Api.getSelect(e, u, p),

	/* ── Alertas ── */
	/** Muestra alerta de éxito. @param {string} texto @param {Function} [callback] @memberof $HR */
	msgSuccess: (t, cb) => Alert.success(t, cb),
	/** Muestra alerta informativa. @param {string} texto @param {Function} [callback] @memberof $HR */
	msgInfo: (t, cb) => Alert.info(t, cb),
	/** Muestra alerta de advertencia. @param {string} texto @param {Function} [callback] @memberof $HR */
	msgWarning: (t, cb) => Alert.warning(t, cb),
	/** Muestra alerta de error. @param {string} texto @param {Function} [callback] @memberof $HR */
	msgError: (t, cb) => Alert.error(t, cb),
	/** Muestra alerta genérica. @param {string} texto @param {string} [type=\"info\"] @param {Function} [callback] @memberof $HR */
	alert: (t, type, cb) => Alert.show(t, type, cb),
	/** Modal de confirmación genérica. @param {string} título @param {string} pregunta @param {Function} [callback] @param {string} [type] @returns {Promise<boolean>} @memberof $HR */
	msgConfirm: (t, q, cb, type) => Alert.confirm(t, q, cb, type),
	/** Muestra/oculta loading bloqueante. @param {boolean} [open=true] @memberof $HR */
	msgLoading: (open = true) => Alert.loading(open),
	/** Cierra cualquier alerta activa. @memberof $HR */
	msgClose: () => Alert.close(),
	/** Confirmación predefinida para eliminar. @param {Function} [callback] @memberof $HR */
	confirmDelete: (cb) => Alert.confirmDelete(cb),
	/** Confirmación predefinida para insertar. @param {Function} [callback] @memberof $HR */
	confirmInsert: (cb) => Alert.confirmInsert(cb),
	/** Confirmación predefinida para actualizar. @param {Function} [callback] @memberof $HR */
	confirmUpdate: (cb) => Alert.confirmUpdate(cb),
	/** Confirmación de eliminar mostrando nombre. @param {string} name @param {Function} [callback] @memberof $HR */
	confirmDeleteByName: (name, cb) => Alert.confirmDeleteByName(name, cb),

	/* ── Toasts ── */
	/** Toast de éxito no bloqueante. @param {string} texto @memberof $HR */
	toastSuccess: (t) => Alert.toast.success(t),
	/** Toast informativo. @param {string} texto @memberof $HR */
	toastInfo: (t) => Alert.toast.info(t),
	/** Toast de advertencia. @param {string} texto @memberof $HR */
	toastWarning: (t) => Alert.toast.warning(t),
	/** Toast de error. @param {string} texto @memberof $HR */
	toastError: (t) => Alert.toast.error(t),
	/** Toast genérico. @param {string} texto @param {string} [type] @memberof $HR */
	toast: (t, type) => Alert.toast.show(t, type),

	/* ── Modales Bootstrap ── */
	/** Abre modal Bootstrap. @param {string} selector @param {Object} [data] @memberof $HR */
	openModal: (m, d) => Modal.open(m, d),
	/** Cierra modal. @param {string|HTMLElement} [modal] @memberof $HR */
	closeModal: (m) => Modal.close(m),
	/** Alterna modal (open/close). @param {string} selector @memberof $HR */
	toggleModal: (m) => Modal.toggle(m),
	/** Obtiene datos del modal (de data- attributes). @param {string|HTMLElement} modal @returns {Object} @memberof $HR */
	getModalData: (m) => Modal.getData(m),

	/* ── DataTables ── */
	/** Inicializa DataTable. @param {string|HTMLElement} tabla @param {Object} [options] @returns {DataTables.Api} @memberof $HR */
	createTbl: (t, o) => Table.initTable(t, o),
	/** Destruye DataTable. @param {string|HTMLElement} tabla @memberof $HR */
	destroyTbl: (t) => Table.destroy(t),
	/** Recarga datos de tabla. @param {string|HTMLElement} tabla @param {boolean} [resetPaging=false] @memberof $HR */
	reloadTbl: (t, r) => Table.reload(t, r),
	/** Columna estándar para DataTable. @param {string|null} data @param {string} title @param {Object} [render] @returns {Object} @memberof $HR */
	tblCol: (d, t, r) => Table.col(d, t, r),
	/** Columna de acciones CRUD. @param {Object|string[]} [acciones] @returns {Object} @memberof $HR */
	tblActionsCol: (r) => Table.actions(r),
	/** Botones de exportación. @param {string[]} [types] @returns {Object[]} @memberof $HR */
	tblButtons: (t) => Table.exportButtons(t),
	/** Filas seleccionadas. @param {string|HTMLElement} tabla @returns {Array} @memberof $HR */
	getSelectedRows: (t) => Table.selected(t),
	/** Limpia selección. @param {string|HTMLElement} tabla @memberof $HR */
	clearTblSelection: (t) => Table.clearSelection(t),
	/** Agrega fila. @param {string|HTMLElement} tabla @param {Object} row @memberof $HR */
	addTblRow: (t, r) => Table.addRow(t, r),
	/** Elimina fila. @param {string|HTMLElement} tabla @param {HTMLElement} button @memberof $HR */
	removeTblRow: (t, b) => Table.removeRow(t, b),
	/** Actualiza fila. @param {string|HTMLElement} tabla @param {HTMLElement} button @param {Object} data @memberof $HR */
	updateTblRow: (t, b, d) => Table.updateRow(t, b, d),
	/** Refresca tabla con nuevos datos. @param {string|HTMLElement} tabla @param {Array} [data] @memberof $HR */
	refreshTbl: (t, d) => Table.refresh(t, d),
	/** Evento de acciones en tabla (con confirm auto). @param {string|HTMLElement} tabla @param {Function} callback @memberof $HR */
	onTableAction: (t, cb) => Table.onAction(t, cb),

	/* ── Exportación ── */
	/** Exporta tabla a Excel. @param {string|HTMLElement} tabla @param {string} [filename] @memberof $HR */
	exportExcel: (t, f) => ExportTbl.excel(t, f),
	/** Exporta tabla a PDF. @param {string|HTMLElement} tabla @param {Object} [options] @memberof $HR */
	exportPdf: (t, o) => ExportTbl.pdf(t, o),
	/** Exporta tabla a CSV. @param {string|HTMLElement} tabla @param {string} [filename] @memberof $HR */
	exportCsv: (t, f) => ExportTbl.csv(t, f),
	/** Exporta datos de tabla a JSON. @param {string|HTMLElement} tabla @returns {string} @memberof $HR */
	exportJson: (t) => ExportTbl.json(t),

	/* ── Fechas ── */
	/** Fecha actual. @returns {Date} @memberof $HR */
	now: () => DateHelper.now(),
	/** Crea objeto Date desde valor. @param {string|number|Date} valor @returns {Date|null} @memberof $HR */
	createDate: (v) => DateHelper.create(v),
	/** Valida fecha. @param {*} valor @returns {boolean} @memberof $HR */
	isValidDate: (v) => DateHelper.isValid(v),
	/** Formatea fecha. @param {Date|string} valor @param {string} [formato] @param {string} [locale] @returns {string} @memberof $HR */
	formatDate: (v, t, l) => DateHelper.format(v, t, l),
	/** Convierte a ISO solo fecha (YYYY-MM-DD). @param {Date} fecha @returns {string} @memberof $HR */
	toISODate: (v) => DateHelper.toISODate(v),
	/** Convierte a ISO completo. @param {Date} fecha @returns {string} @memberof $HR */
	toISOString: (v) => DateHelper.toISOString(v),
	/** Suma días a fecha. @param {Date} fecha @param {number} días @returns {Date} @memberof $HR */
	addDays: (v, d) => DateHelper.addDays(v, d),
	/** Diferencia en días entre fechas. @param {Date} inicio @param {Date} fin @returns {number} @memberof $HR */
	diffDays: (s, e) => DateHelper.diffDays(s, e),

	/* ── Storage ── */
	/** Guarda en localStorage (JSON auto). @param {string} key @param {*} value @memberof $HR */
	setLocal: (k, v) => Storage.set(k, v),
	/** Lee de localStorage. @param {string} key @param {*} [default=null] @returns {*} @memberof $HR */
	getLocal: (k, d) => Storage.get(k, d),
	/** Verifica clave en localStorage. @param {string} key @returns {boolean} @memberof $HR */
	hasLocal: (k) => Storage.has(k),
	/** Elimina clave de localStorage. @param {string} key @memberof $HR */
	removeLocal: (k) => Storage.remove(k),
	/** Limpia namespace en localStorage. @memberof $HR */
	clearLocal: () => Storage.clear(),
	/** Guarda con TTL en localStorage. @param {string} key @param {*} value @param {number} segundos @memberof $HR */
	setLocalTtl: (k, v, s) => Storage.setTtl(k, v, s),
	/** Lee con TTL de localStorage. @param {string} key @param {*} [default=null] @returns {*} @memberof $HR */
	getLocalTtl: (k, d) => Storage.getTtl(k, d),
	/** Guarda en sessionStorage. @param {string} key @param {*} value @memberof $HR */
	setSession: (k, v) => Storage.setSession(k, v),
	/** Lee de sessionStorage. @param {string} key @param {*} [default=null] @returns {*} @memberof $HR */
	getSession: (k, d) => Storage.getSession(k, d),
	/** Verifica clave en sessionStorage. @param {string} key @returns {boolean} @memberof $HR */
	hasSession: (k) => Storage.hasSession(k),
	/** Elimina clave de sessionStorage. @param {string} key @memberof $HR */
	removeSession: (k) => Storage.removeSession(k),

	/* ── Charts ── */
	createChart: (t, o) => Charts.create(t, o),
	destroyChart: (t) => Charts.destroy(t),
	destroyAllCharts: () => Charts.destroyAll(),
	updateChartData: (t, d) => Charts.updateData(t, d),
	setChartOption: (t, p, v) => Charts.setOption(t, p, v),
	getChart: (t) => Charts.get(t),

	/* ── Editor Quill ── */
	createEditor: (t, o) => Editor.create(t, o),
	getEditor: (t) => Editor.get(t),
	getEditorHtml: (t) => Editor.getHtml(t),
	setEditorHtml: (t, h) => Editor.setHtml(t, h),
	destroyEditor: (t) => Editor.destroy(t),

	/* ── Firma digital ── */
	createSignature: (t, o) => Signature.create(t, o),
	clearSignature: (t) => Signature.clear(t),
	getSignatureData: (t) => Signature.toDataURL(t),
	getSignature: (t) => Signature.get(t),

	/* ── Calendario ── */
	initCalendar: (t, o) => Calendar.init(t, o),
	getCalendar: (t) => Calendar.get(t),
	addCalendarEvent: (t, e) => Calendar.addEvent(t, e),
	clearCalendarEvents: (t) => Calendar.clearEvents(t),
	calendarDraggable: (c, o) => Calendar.draggable(c, o),

	/* ── DOM ── */
	el: (t) => Dom.el(t),
	show: (t) => Dom.show(t),
	hide: (t) => Dom.hide(t),
	toggle: (t) => Dom.toggle(t),
	isVisible: (t) => Dom.isVisible(t),
	isHidden: (t) => Dom.isHidden(t),
	enable: (t) => Dom.enable(t),
	disable: (t) => Dom.disable(t),
	toggleDisabled: (t) => Dom.toggleDisabled(t),
	html: (t, v) => Dom.html(t, v),
	text: (t, v) => Dom.text(t, v),
	clear: (t) => Dom.clear(t),
	changeDiv: (t, h) => Dom.changeDiv(t, h),
	addClass: (t, c) => Dom.addClass(t, c),
	removeClass: (t, c) => Dom.removeClass(t, c),
	toggleClass: (t, c) => Dom.toggleClass(t, c),
	hasClass: (t, c) => Dom.hasClass(t, c),
	val: (t, v) => Dom.val(t, v),
	clearVal: (t) => Dom.clearVal(t),
	data: (t, k, v) => Dom.data(t, k, v),
	on: (t, e, c) => Dom.on(t, e, c),
	off: (t, e, c) => Dom.off(t, e, c),
	dispatch: (t, e, d) => Dom.dispatch(t, e, d),

	/* ── Eventos pub/sub ── */
	eventOn: (e, h) => Event.on(e, h),
	eventOff: (e, h) => Event.off(e, h),
	eventEmit: (e, d) => Event.emit(e, d),
	eventOnce: (e, h) => Event.once(e, h),

	/* ── Números ── */
	numFormat: (n, d, l) => NumberHelper.formatNumber(n, d, l),
	numRound: (n, d) => NumberHelper.round(n, d),
	numCeil: (n, d) => NumberHelper.ceil(n, d),
	numFloor: (n, d) => NumberHelper.floor(n, d),
	numToNum: (n, d) => NumberHelper.toNumber(n, d),
	numRandom: (m, x) => NumberHelper.randomInt(m, x),
	numClamp: (v, mn, mx) => NumberHelper.clamp(v, mn, mx),
	numPercent: (v, d, dec) => NumberHelper.percent(v, d, dec),
	numPercentOf: (p, t, d) => NumberHelper.percentOf(p, t, d),
	numSum: (a) => NumberHelper.sum(a),
	numAvg: (a) => NumberHelper.avg(a),
	numCurrency: (v, c, d) => NumberHelper.currency(v, c, d),

	/* ── Strings ── */
	strCapital: (s) => Strings.capitalize(s),
	strTitleCase: (s) => Strings.titleCase(s),
	strUpper: (s) => Strings.upper(s),
	strLower: (s) => Strings.lower(s),
	strTrim: (s) => Strings.trim(s),
	strCleanSpaces: (s) => Strings.cleanSpaces(s),
	strTruncate: (s, l, f) => Strings.truncate(s, l, f),
	strSlug: (s) => Strings.slug(s),
	strNormalize: (s) => Strings.normalize(s),
	strPadStart: (v, l, c) => Strings.padStart(v, l, c),
	strUid: (l) => Strings.uid(l),
	strContains: (t, s) => Strings.contains(t, s),
	strHighlight: (t, s) => Strings.highlight(t, s),
	strMask: (v, m) => Strings.mask(v, m),
	strPhone: (p) => Strings.formatPhone(p),
	strCedula: (c) => Strings.formatCedula(c),
	strRNC: (r) => Strings.formatRNC(r),
	strFormat: (t, d) => Strings.format(t, d),
	strEscapeHtml: (t) => Strings.escapeHtml(t),

	/* ── Fullscreen ── */
	toggleFullscreen: (t) => Fullscreen.toggle(t),
	requestFullscreen: (t) => Fullscreen.request(t),
	exitFullscreen: () => Fullscreen.exit(),

	/* ── Icons ── */
	setDefaultIcon: (l) => Icons.setDefault(l),
	icon: (n, l, o) => Icons.iconEl(n, l, o),
	fa: (n, o) => Icons.fa(n, o),
	bi: (n, o) => Icons.bi(n, o),
	feather: (n, o) => Icons.feather(n, o),

	/* ── Códigos ── */
	codeBarcode: (e, v, o) => Codes.barcode(e, v, o),
	codeQrCanvas: (e, t, o) => Codes.qrCanvas(e, t, o),
	codeQrImage: (e, t, o) => Codes.qrImage(e, t, o),
	codeClear: (e) => Codes.clear(e),

	/* ── Moneda ── */
	currencySymbol: (c) => Currency.getSymbol(c),
	currencyFormat: (v, c, d) => Currency.format(v, c, d),
	currencyConvert: (v, r, d) => Currency.convert(v, r, d),

	/* ── Drag ── */
	dragCreate: (k, c, o) => Drag.create(k, c, o),
	dragGet: (k) => Drag.get(k),
	dragDestroy: (k) => Drag.destroy(k),

	/* ── Archivos ── */
	fileFormatSize: (b, d) => FileHelper.formatSize(b, d),
	fileExtension: (f) => FileHelper.getExtension(f),
	fileIsValidSize: (f, s) => FileHelper.isValidSize(f, s),
	fileIsValidExtension: (f, a) => FileHelper.isValidExtension(f, a),
	fileReadBase64: (f) => FileHelper.readAsBase64(f),
	fileReadText: (f) => FileHelper.readAsText(f),
	fileDownloadText: (c, n, t) => FileHelper.downloadText(c, n, t),
	fileDownloadUrl: (u, n) => FileHelper.downloadUrl(u, n),

	/* ── Impresión ── */
	printEl: (t, o) => Print.print(t, o),
	printHtml: (h, t) => Print.html(h, t),
	printPage: () => Print.page(),

	/* ── Humanización ── */
	humanizeDuration: (m, o) => Humanize.duration(m, o),
	humanizeTimeRemaining: (t) => Humanize.timeRemaining(t),
	humanizeTimeAgo: (f) => Humanize.timeAgo(f),

	/* ── Select2 ── */
	select2Set: (e, v, t) => Select2.setValue(e, v, t),
	select2Clear: (e) => Select2.clear(e),
	select2Enable: (e) => Select2.enable(e),
	select2Disable: (e) => Select2.disable(e),
	select2Reload: (e) => Select2.reload(e),

	/* ── Sidebar ── */
	sidebarToggle: () => Sidebar.toggle(),
	sidebarCollapse: () => Sidebar.collapse(),
	sidebarExpand: () => Sidebar.expand(),
	sidebarIsCollapsed: () => Sidebar.isCollapsed(),
	sidebarRefresh: () => Sidebar.refresh(),

	/* ── Iframe / Pestañas ── */
	iframeOpen: (t, u, i) => Iframe.open(t, u, i),
	iframeClose: (k) => Iframe.close(k),
	iframeFullscreen: () => Iframe.toggleFullscreen(),
	iframeRefresh: () => Iframe.refresh(),
	iframeCloseOthers: () => Iframe.closeOthers(),
	iframeCloseAll: () => Iframe.closeAll(),

	/* ── Excel ── */
	excelExport: (d, f) => Excel.exportToExcel(d, f),
	excelImport: (f) => Excel.excelToJson(f),
	jsonToExcel: (d, f) => Excel.jsonToExcel(d, f),
	excelToJson: (f) => Excel.excelToJson(f),
	jsonToCsv: (d, f) => Excel.jsonToCsv(d, f),
	excelImportMultiple: (f) => Excel.excelToJsonMultiple(f),
	excelExportMultiple: (s, f) => Excel.jsonToExcelMultiple(s, f),

	/* ── Formularios ── */
	isValidForm: (f) => Forms.isValidForm(f),
	serializeForm: (f) => Forms.serialize(f),
	clearForm: (f) => Forms.clear(f),
	fillForm: (f, d) => Forms.fill(f, d),
	submitForm: (f, u, o) => Forms.submit(f, u, o),
	togglePassword: (p, b) => Forms.togglePassword(p, b),

	/* ── Validación ── */
	isNullOrEmpty: (v) => Validation.isNullOrEmpty(v),
	isEmpty: (v) => Validation.isEmpty(v),
	isValidEmail: (e) => Validation.isValidEmail(e),
	isValidPhone: (p) => Validation.isValidPhone(p),
	isValidCedula: (c) => Validation.isValidCedula(c),
	isValidRNC: (r) => Validation.isValidRNC(r),
	isValidPlaca: (p) => Validation.isValidPlaca(p),
	isNumber: (v) => Validation.isNumber(v),
	isInRange: (v, mn, mx) => Validation.isInRange(v, mn, mx),
	isValidUrl: (u) => Validation.isValidUrl(u),
	isAfter: (d, a) => Validation.isAfter(d, a),
	isBefore: (d, b) => Validation.isBefore(d, b),
	isAllowedExt: (f, a) => Validation.isAllowedExtension(f, a),
	isValidFileSize: (f, m) => Validation.isValidFileSize(f, m),

	/* ── Asset ── */
	logo: (v) => Asset.logo(v),
	avatar: (f) => Asset.avatar(f),
	assetBg: (f) => Asset.bg(f),
	assetUser: (id) => Asset.user(id),
	assetImg: (p, f) => Asset.img(p, f),
	assetPlaceholder: (t) => Asset.placeholder(t),
};

/* ══════════════════════════════════════════════════════
	 SISTEMA DE PLUGINS (V1 approach)
══════════════════════════════════════════════════════ */

/* Plugins */

/**
 * @param {Object|Function} plugin
 * @returns {$HR}
 */
$HR.use = function (plugin) {
	installPlugin($HR, plugin);
	return $HR;
};

$HR.isInstalled = isInstalled;
$HR.plugins = installedPlugins;

/* ══════════════════════════════════════════════════════
	 EXPOSICIÓN GLOBAL (window.$Helper por módulo)
══════════════════════════════════════════════════════ */

if (typeof window !== "undefined") {
	window.$HR = $HR;
	window.$Alert = Alert;
	window.$Api = Api;
	window.$Asset = Asset;
	window.$Calendar = Calendar;
	window.$Charts = Charts;
	window.$Codes = Codes;
	window.$Currency = Currency;
	window.$Date = DateHelper;
	window.$Dom = Dom;
	window.$Drag = Drag;
	window.$Editor = Editor;
	window.$Event = Event;
	window.$Excel = Excel;
	window.$ExportTbl = ExportTbl;
	window.$File = FileHelper;
	window.$Forms = Forms;
	window.$Fullscreen = Fullscreen;
	window.$Humanize = Humanize;
	window.$Icons = Icons;
	window.$Iframe = Iframe;
	window.$Modal = Modal;
	window.$Number = NumberHelper;
	window.$Print = Print;
	window.$Select2 = Select2;
	window.$Sidebar = Sidebar;
	window.$Signature = Signature;
	window.$Storage = Storage;
	window.$String = Strings;
	window.$Table = Table;
	window.$Validation = Validation;
}

export default $HR;
