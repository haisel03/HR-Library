/**
 * @namespace $HR
 * @description
 * Fachada unificada del framework HR Library.
 *
 * Dos niveles de acceso:
 *
 * **1. Módulos directos via window (recomendado):**
 * Cada helper está disponible globalmente con prefijo `$`.
 * ```js
 * $Alert.success("Guardado");
 * $Table.initTable("#tabla", options);
 * $Validation.isValidCedula("001-1234567-8");
 * $String.slug("Gestión Académica");
 * $Storage.setTtl("token", "abc123", 3600);
 * ```
 *
 * **2. API plana en $HR (compatibilidad con demos existentes):**
 * ```js
 * $HR.msgSuccess("Guardado");
 * $HR.getApi("/api/empleados");
 * $HR.isValidCedula("001-1234567-8");
 * ```
 */

import config     from "./core/config";
import spanish    from "./core/spanish";
import init       from "./core/init";

import Alert        from "./helpers/Alert";
import Api          from "./helpers/Api";
import Asset        from "./helpers/Asset";
import Calendar     from "./helpers/Calendar";
import Charts       from "./helpers/Charts";
import Codes        from "./helpers/Codes";
import Currency     from "./helpers/Currency";
import DateHelper   from "./helpers/Date";
import Dom          from "./helpers/Dom";
import Drag         from "./helpers/Drag";
import Editor       from "./helpers/Editor";
import Excel        from "./helpers/Excel";
import ExportTbl    from "./helpers/ExportTbl";
import FileHelper   from "./helpers/File";
import Forms        from "./helpers/Forms";
import Fullscreen   from "./helpers/Fullscreen";
import Humanize     from "./helpers/Humanize";
import Icons        from "./helpers/Icons";
import Iframe       from "./helpers/Iframe";
import Modal        from "./helpers/Modal";
import NumberHelper from "./helpers/Number";
import Print        from "./helpers/Print";
import Select2      from "./helpers/Select2";
import Sidebar      from "./helpers/Sidebar";
import Signature    from "./helpers/Signature";
import Storage      from "./helpers/Storage";
import Strings      from "./helpers/Strings";
import Table        from "./helpers/Table";
import Validation   from "./helpers/Validation";

const $HR = {
	config,
	lang: spanish,

	/* ── Init ── */
	init: (scope) => init(scope),

	/* ── HTTP ── */
	setToken:         (t)       => Api.setToken(t),
	getToken:         ()        => Api.getToken(),
	setApiAlerts:     (v)       => Api.setAutoAlerts(v),
	getApi:           (u, p, o) => Api.get(u, p, o),
	postApi:          (u, d, o) => Api.post(u, d, o),
	putApi:           (u, d, o) => Api.put(u, d, o),
	patchApi:         (u, d, o) => Api.patch(u, d, o),
	deleteApi:        (u, o)    => Api.delete(u, o),
	getSelect:        (e, u, p) => Api.getSelect(e, u, p),

	/* ── Modales Bootstrap ── */
	openModal:        (m, d)    => Modal.open(m, d),
	closeModal:       (m)       => Modal.close(m),
	toggleModal:      (m)       => Modal.toggle(m),
	getModalData:     (m)       => Modal.data(m),

	/* ── Alertas ── */
	msgSuccess:       (t, cb)   => Alert.success(t, cb),
	msgInfo:          (t, cb)   => Alert.info(t, cb),
	msgWarning:       (t, cb)   => Alert.warning(t, cb),
	msgError:         (t, cb)   => Alert.error(t, cb),
	alert:            (t, type, cb) => Alert.show(t, type, cb),
	msgConfirm:       (t, q, cb, type) => Alert.confirm(t, q, cb, type),
	msgLoading:       (close = false) => close ? Alert.close() : Alert.loading(),

	/* ── Toasts ── */
	toastSuccess:     (t)       => Alert.toast.success(t),
	toastInfo:        (t)       => Alert.toast.info(t),
	toastWarning:     (t)       => Alert.toast.warning(t),
	toastError:       (t)       => Alert.toast.error(t),
	toast:            (t, type) => Alert.toast.show(t, type),

	/* ── DataTables ── */
	createTbl:        (t, o)    => Table.initTable(t, o),
	destroyTbl:       (t)       => Table.destroy(t),
	reloadTbl:        (t, r)    => Table.reload(t, r),
	tblCol:           (d, t, r) => Table.col(d, t, r),
	tblActionsCol:    (r)       => Table.actions(r),
	tblButtons:       (t)       => Table.buttons(t),
	getSelectedRows:  (t)       => Table.selected(t),
	clearTblSelection:(t)       => Table.clearSelection(t),
	addTblRow:        (t, r)    => Table.addRow(t, r),
	removeTblRow:     (t, b)    => Table.removeRow(t, b),
	updateTblRow:     (t, b, d) => Table.updateRow(t, b, d),
	refreshTbl:       (t, d)    => Table.refresh(t, d),
	onTableAction:    (t, cb)   => Table.onAction(t, cb),

	/* ── Exportación ── */
	exportExcel:      (t, f)    => ExportTbl.excel(t, f),
	exportPdf:        (t, o)    => ExportTbl.pdf(t, o),
	exportCsv:        (t, f)    => ExportTbl.csv(t, f),
	exportJson:       (t)       => ExportTbl.json(t),

	/* ── Fechas ── */
	now:              ()        => DateHelper.now(),
	createDate:       (v)       => DateHelper.create(v),
	isValidDate:      (v)       => DateHelper.isValid(v),
	formatDate:       (v, t, l) => DateHelper.format(v, t, l),
	toISODate:        (v)       => DateHelper.toISODate(v),
	toISOString:      (v)       => DateHelper.toISOString(v),
	addDays:          (v, d)    => DateHelper.addDays(v, d),
	diffDays:         (s, e)    => DateHelper.diffDays(s, e),
	flatpickrConfig:  (o)       => DateHelper.flatpickr(o),
	fullCalendarConfig:(o)      => DateHelper.fullCalendar(o),

	/* ── Storage ── */
	setLocal:         (k, v)    => Storage.set(k, v),
	getLocal:         (k, d)    => Storage.get(k, d),
	hasLocal:         (k)       => Storage.has(k),
	removeLocal:      (k)       => Storage.remove(k),
	clearLocal:       ()        => Storage.clear(),
	setLocalTtl:      (k, v, s) => Storage.setTtl(k, v, s),
	getLocalTtl:      (k, d)    => Storage.getTtl(k, d),
	setSession:       (k, v)    => Storage.setSession(k, v),
	getSession:       (k, d)    => Storage.getSession(k, d),
	hasSession:       (k)       => Storage.hasSession(k),
	removeSession:    (k)       => Storage.removeSession(k),

	/* ── Charts ── */
	createChart:      (t, o)    => Charts.create(t, o),
	destroyChart:     (t)       => Charts.destroy(t),
	destroyAllCharts: ()        => Charts.destroyAll(),
	updateChartData:  (t, d)    => Charts.updateData(t, d),
	setChartOption:   (t, p, v) => Charts.setOption(t, p, v),
	getChart:         (t)       => Charts.get(t),

	/* ── Editor Quill ── */
	createEditor:     (t, o)    => Editor.create(t, o),
	getEditor:        (t)       => Editor.get(t),
	getEditorHtml:    (t)       => Editor.getHtml(t),
	setEditorHtml:    (t, h)    => Editor.setHtml(t, h),
	destroyEditor:    (t)       => Editor.destroy(t),

	/* ── Firma digital ── */
	createSignature:  (t, o)    => Signature.create(t, o),
	clearSignature:   (t)       => Signature.clear(t),
	getSignatureData: (t)       => Signature.toDataURL(t),
	getSignature:     (t)       => Signature.get(t),

	/* ── Calendario ── */
	initCalendar:     (t, o)    => Calendar.init(t, o),
	getCalendar:      (t)       => Calendar.get(t),
	addCalendarEvent: (t, e)    => Calendar.addEvent(t, e),
	clearCalendarEvents:(t)     => Calendar.clearEvents(t),
	calendarDraggable:(c, o)    => Calendar.draggable(c, o),

	/* ── DOM ── */
	el:               (t)       => Dom.el(t),
	show:             (t)       => Dom.show(t),
	hide:             (t)       => Dom.hide(t),
	toggle:           (t)       => Dom.toggle(t),
	isVisible:        (t)       => Dom.isVisible(t),
	isHidden:         (t)       => Dom.isHidden(t),
	enable:           (t)       => Dom.enable(t),
	disable:          (t)       => Dom.disable(t),
	toggleDisabled:   (t)       => Dom.toggleDisabled(t),
	html:             (t, v)    => Dom.html(t, v),
	text:             (t, v)    => Dom.text(t, v),
	clear:            (t)       => Dom.clear(t),
	changeDiv:        (t, h)    => Dom.changeDiv(t, h),
	addClass:         (t, c)    => Dom.addClass(t, c),
	removeClass:      (t, c)    => Dom.removeClass(t, c),
	toggleClass:      (t, c)    => Dom.toggleClass(t, c),
	hasClass:         (t, c)    => Dom.hasClass(t, c),
	val:              (t, v)    => Dom.val(t, v),
	clearVal:         (t)       => Dom.clearVal(t),
	data:             (t, k, v) => Dom.data(t, k, v),
	on:               (t, e, c) => Dom.on(t, e, c),
	off:              (t, e, c) => Dom.off(t, e, c),

	/* ── Números ── */
	numFormat:        (n, d, l) => NumberHelper.formatNumber(n, d, l),
	numRound:         (n, d)    => NumberHelper.round(n, d),
	numCeil:          (n, d)    => NumberHelper.ceil(n, d),
	numFloor:         (n, d)    => NumberHelper.floor(n, d),
	numToNum:         (n, d)    => NumberHelper.toNumber(n, d),
	numRandom:        (m, x)    => NumberHelper.randomInt(m, x),
	numClamp:         (v, mn, mx) => NumberHelper.clamp(v, mn, mx),
	numPercent:       (v, d, dec) => NumberHelper.percent(v, d, dec),
	numPercentOf:     (p, t, d) => NumberHelper.percentOf(p, t, d),
	numSum:           (a)       => NumberHelper.sum(a),
	numAvg:           (a)       => NumberHelper.avg(a),
	numCurrency:      (v, c, d) => NumberHelper.currency(v, c, d),

	/* ── Strings ── */
	strCapital:       (s)       => Strings.capitalize(s),
	strTitleCase:     (s)       => Strings.titleCase(s),
	strUpper:         (s)       => Strings.upper(s),
	strLower:         (s)       => Strings.lower(s),
	strTrim:          (s)       => Strings.trim(s),
	strCleanSpaces:   (s)       => Strings.cleanSpaces(s),
	strTruncate:      (s, l, f) => Strings.truncate(s, l, f),
	strSlug:          (s)       => Strings.slug(s),
	strNormalize:     (s)       => Strings.normalize(s),
	strPadStart:      (v, l, c) => Strings.padStart(v, l, c),
	strUid:           (l)       => Strings.uid(l),
	strContains:      (t, s)    => Strings.contains(t, s),
	strHighlight:     (t, s)    => Strings.highlight(t, s),
	strMask:          (v, m)    => Strings.mask(v, m),
	strPhone:         (p)       => Strings.formatPhone(p),
	strCedula:        (c)       => Strings.formatCedula(c),
	strRNC:           (r)       => Strings.formatRNC(r),

	/* ── Fullscreen ── */
	toggleFullscreen:   (t)     => Fullscreen.toggle(t),
	requestFullscreen:  (t)     => Fullscreen.request(t),
	exitFullscreen:     ()      => Fullscreen.exit(),

	/* ── Icons ── */
	setDefaultIcon:   (l)       => Icons.setDefault(l),
	icon:             (n, l, o) => Icons.iconEl(n, l, o),
	fa:               (n, o)    => Icons.fa(n, o),
	bi:               (n, o)    => Icons.bi(n, o),
	feather:          (n, o)    => Icons.feather(n, o),

	/* ── Códigos ── */
	codeBarcode:      (e, v, o) => Codes.barcode(e, v, o),
	codeQrCanvas:     (e, t, o) => Codes.qrCanvas(e, t, o),
	codeQrImage:      (e, t, o) => Codes.qrImage(e, t, o),
	codeClear:        (e)       => Codes.clear(e),

	/* ── Monedas ── */
	currencySymbol:   (c)       => Currency.getSymbol(c),
	currencyFormat:   (v, c, d) => Currency.format(v, c, d),
	currencyConvert:  (v, r, d) => Currency.convert(v, r, d),

	/* ── Drag ── */
	dragCreate:       (k, c, o) => Drag.create(k, c, o),
	dragGet:          (k)       => Drag.get(k),
	dragDestroy:      (k)       => Drag.destroy(k),

	/* ── Archivos ── */
	fileFormatSize:         (b, d)    => FileHelper.formatSize(b, d),
	fileExtension:          (f)       => FileHelper.getExtension(f),
	fileIsValidSize:        (f, s)    => FileHelper.isValidSize(f, s),
	fileIsValidExtension:   (f, a)    => FileHelper.isValidExtension(f, a),
	fileIsValidMime:        (f, m)    => FileHelper.isValidMime(f, m),
	fileReadBase64:         (f)       => FileHelper.readAsBase64(f),
	fileReadText:           (f)       => FileHelper.readAsText(f),
	fileDownloadText:       (c, n, t) => FileHelper.downloadText(c, n, t),
	fileDownloadUrl:        (u, n)    => FileHelper.downloadUrl(u, n),

	/* ── Impresión ── */
	printEl:          (t, o)    => Print.print(t, o),

	/* ── Humanización ── */
	humanizeDuration:       (m, o) => Humanize.duration(m, o),
	humanizeTimeRemaining:  (t)    => Humanize.timeRemaining(t),
	humanizeTimeAgo:        (f)    => Humanize.timeAgo(f),

	/* ── Select2 ── */
	select2Set:       (e, v, t) => Select2.setValue(e, v, t),
	select2Clear:     (e)       => Select2.clear(e),
	select2Enable:    (e)       => Select2.enable(e),
	select2Disable:   (e)       => Select2.disable(e),
	select2Reload:    (e)       => Select2.reload(e),

	/* ── Sidebar ── */
	sidebarToggle:      ()      => Sidebar.toggle(),
	sidebarCollapse:    ()      => Sidebar.collapse(),
	sidebarExpand:      ()      => Sidebar.expand(),
	sidebarIsCollapsed: ()      => Sidebar.isCollapsed(),
	sidebarRefresh:     ()      => Sidebar.refresh(),

	/* ── Iframe / Pestañas ── */
	iframeOpen:         (t, u, i) => Iframe.open(t, u, i),
	iframeClose:        (k)       => Iframe.close(k),
	iframeFullscreen:   ()        => Iframe.toggleFullscreen(),
	iframeRefresh:      ()        => Iframe.refresh(),
	iframeCloseOthers:  ()        => Iframe.closeOthers(),
	iframeCloseAll:     ()        => Iframe.closeAll(),

	/* ── Excel ── */
	excelExport:          (d, f) => Excel.exportToExcel(d, f),
	excelImport:          (f)    => Excel.excelToJson(f),
	jsonToExcel:          (d, f) => Excel.jsonToExcel(d, f),
	excelToJson:          (f)    => Excel.excelToJson(f),
	jsonToCsv:            (d, f) => Excel.jsonToCsv(d, f),
	excelImportMultiple:  (f)    => Excel.excelToJsonMultiple(f),
	excelExportMultiple:  (s, f) => Excel.jsonToExcelMultiple(s, f),

	/* ── Validación ── */
	isValidForm:      (f)       => Forms.isValidForm(f),
	serializeForm:    (f)       => Forms.serializeForm(f),
	clearForm:        (f)       => Forms.clearForm(f),
	togglePassword:   (p, b)    => Forms.togglePassword(p, b),
	isNullOrEmpty:    (v)       => Validation.isNullOrEmpty(v),
	isEmpty:          (v)       => Validation.isEmpty(v),
	isValidEmail:     (e)       => Validation.isValidEmail(e),
	isValidPhone:     (p)       => Validation.isValidPhone(p),
	isValidCedula:    (c)       => Validation.isValidCedula(c),
	isValidRNC:       (r)       => Validation.isValidRNC(r),
	isNumber:         (v)       => Validation.isNumber(v),
	isInRange:        (v, mn, mx) => Validation.isInRange(v, mn, mx),
	isValidUrl:       (u)       => Validation.isValidUrl(u),
	isAfter:          (d, a)    => Validation.isAfter(d, a),
	isBefore:         (d, b)    => Validation.isBefore(d, b),
	isAllowedExt:     (f, a)    => Validation.isAllowedExtension(f, a),
	isValidFileSize:  (f, m)    => Validation.isValidFileSize(f, m),

	/* ── Asset ── */
	logo:             (v)       => Asset.logo(v),
	avatar:           (f)       => Asset.avatar(f),
	assetBg:          (f)       => Asset.bg(f),
	assetUser:        (id)      => Asset.user(id),
	assetImg:         (p, f)    => Asset.img(p, f),
	assetPlaceholder: (t)       => Asset.placeholder(t),
};

/* ── Exposición global ── */
window.$Alert      = Alert;
window.$Api        = Api;
window.$Asset      = Asset;
window.$Calendar   = Calendar;
window.$Charts     = Charts;
window.$Codes      = Codes;
window.$Currency   = Currency;
window.$Date       = DateHelper;
window.$Dom        = Dom;
window.$Drag       = Drag;
window.$Editor     = Editor;
window.$Excel      = Excel;
window.$ExportTbl  = ExportTbl;
window.$File       = FileHelper;
window.$Forms      = Forms;
window.$Fullscreen = Fullscreen;
window.$Humanize   = Humanize;
window.$Icons      = Icons;
window.$Iframe     = Iframe;
window.$Modal      = Modal;
window.$Number     = NumberHelper;
window.$Print      = Print;
window.$Select2    = Select2;
window.$Sidebar    = Sidebar;
window.$Signature  = Signature;
window.$Storage    = Storage;
window.$String     = Strings;
window.$Table      = Table;
window.$Validation = Validation;
window.$HR         = $HR;

export default $HR;
