/**
 * @namespace $HR
 * @description
 * Fachada descentralizada del framework HR Library.
 *
 * Los helpers se exponen globalmente como $Dom, $Alert, $Table, etc.
 * $HR queda reservado para inicialización y funciones personalizadas.
 */

import config  from "./core/config";
import spanish from "./core/spanish";
import init    from "./core/init";

import Dom          from "./helpers/Dom";
import Alert        from "./helpers/Alert";
import Api          from "./helpers/Api";
import Calendar     from "./helpers/Calendar";
import Charts       from "./helpers/Charts";
import Codes        from "./helpers/Codes";
import Currency     from "./helpers/Currency";
import DateHelper   from "./helpers/Date";
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
import StringHelper from "./helpers/Strings";
import Table        from "./helpers/Table";
import Validation   from "./helpers/Validation";

const $HR = {
	config,
	lang: spanish,

	/* ── Init ── */
	init: (scope) => init(scope),

	/* ── HTTP ── */
	setToken:        (t)       => Api.setToken(t),
	getToken:        ()        => Api.getToken(),
	setApiAlerts:    (v)       => Api.setAutoAlerts(v),
	getApi:          (u, p, o) => Api.get(u, p, o),
	postApi:         (u, d, o) => Api.post(u, d, o),
	putApi:          (u, d, o) => Api.put(u, d, o),
	patchApi:        (u, d, o) => Api.patch(u, d, o),
	deleteApi:       (u, o)    => Api.delete(u, o),
	fetch:	        (u, o)    => Api.fetch(u, o),

	/* ── Modales Bootstrap ── */
	openModal:       (m, d)    => Modal.open(m, d),
	closeModal:      (m)       => Modal.close(m),
	toggleModal:     (m)       => Modal.toggle(m),
	getModalData:    (m)       => Modal.data(m),

	/* ── Alertas ── */
	msgSuccess:      (t)       => Alert.success(t),
	msgInfo:         (t)       => Alert.info(t),
	msgWarning:      (t)       => Alert.warning(t),
	msgError:        (t)       => Alert.error(t),
	alert:           (t, type, cb) => Alert.show(t, type, cb),
	msgConfirm:      (t, q, cb, type) => Alert.confirm(t, q, cb, type),
	msgLoading:      (close = false) => close ? Alert.close() : Alert.loading(),

	/* ── Toasts ── */
	toastSuccess:    (t)       => Alert.toast.success(t),
	toastInfo:       (t)       => Alert.toast.info(t),
	toastWarning:    (t)       => Alert.toast.warning(t),
	toastError:      (t)       => Alert.toast.error(t),
	toast:           (t, type) => Alert.toast.show(t, type),

	/* ── DataTables ── */
	createTbl:       (t, o)    => Table.initTable(t, o),
	destroyTbl:      (t)       => Table.destroy(t),
	reloadTbl:       (t, r)    => Table.reload(t, r),
	tblCol:          (d, t, r) => Table.col(d, t, r),
	tblActionsCol:   (r)       => Table.actions(r),
	tblButtons:      (t)       => Table.buttons(t),
	getSelectedRows: (t)       => Table.selected(t),
	clearTblSelection:(t)      => Table.clearSelection(t),
	addTblRow:       (t, r)    => Table.addRow(t, r),
	removeTblRow:    (t, b)    => Table.removeRow(t, b),
	updateTblRow:    (t, b, d) => Table.updateRow(t, b, d),
	refreshTbl:      (t, d)    => Table.refresh(t, d),

	/* ── Exportación ── */
	exportExcel:     (t, f)    => ExportTbl.excel(t, f),
	exportPdf:       (t, o)    => ExportTbl.pdf(t, o),
	exportCsv:       (t, f)    => ExportTbl.csv(t, f),
	exportJson:      (t)       => ExportTbl.json(t),

	/* ── Fechas ── */
	now:             ()        => DateHelper.now(),
	createDate:      (v)       => DateHelper.create(v),
	isValidDate:     (v)       => DateHelper.isValid(v),
	formatDate:      (v, t, l) => DateHelper.format(v, t, l),
	toISODate:       (v)       => DateHelper.toISODate(v),
	toISOString:     (v)       => DateHelper.toISOString(v),
	addDays:         (v, d)    => DateHelper.addDays(v, d),
	diffDays:        (s, e)    => DateHelper.diffDays(s, e),
	flatpickrConfig: (o)       => DateHelper.flatpickr(o),
	fullCalendarConfig:(o)     => DateHelper.fullCalendar(o),

	/* ── Storage ── */
	setLocal:        (k, v)    => Storage.set(k, v),
	getLocal:        (k, d)    => Storage.get(k, d),
	removeLocal:     (k)       => Storage.remove(k),
	clearLocal:      ()        => Storage.clear(),
	setSession:      (k, v)    => Storage.setSession(k, v),
	getSession:      (k, d)    => Storage.getSession(k, d),
	removeSession:   (k)       => Storage.removeSession(k),

	/* ── Charts ── */
	createChart:     (t, o)    => Charts.create(t, o),
	destroyChart:    (t)       => Charts.destroy(t),
	updateChartData: (t, d)    => Charts.updateData(t, d),
	getChart:        (t)       => Charts.get(t),

	/* ── Editor Quill ── */
	createEditor:    (t, o)    => Editor.create(t, o),
	getEditor:       (t)       => Editor.get(t),
	getEditorHtml:   (t)       => Editor.getHtml(t),
	setEditorHtml:   (t, h)    => Editor.setHtml(t, h),
	destroyEditor:   (t)       => Editor.destroy(t),

	/* ── Firma digital ── */
	createSignature: (t, o)    => Signature.create(t, o),
	clearSignature:  (t)       => Signature.clear(t),
	getSignatureData:(t)       => Signature.toDataURL(t),
	getSignature:    (t)       => Signature.get(t),

	/* ── Calendario ── */
	initCalendar:    (t, o)    => Calendar.init(t, o),
	getCalendar:     (t)       => Calendar.get(t),
	addCalendarEvent:(t, e)    => Calendar.addEvent(t, e),
	clearCalendarEvents:(t)    => Calendar.clearEvents(t),
	calendarDraggable:(c, o)   => Calendar.draggable(c, o),

	/* ── DOM ── */
	el:              (t)       => Dom.el(t),
	show:            (t)       => Dom.show(t),
	hide:            (t)       => Dom.hide(t),
	toggle:          (t)       => Dom.toggle(t),
	isVisible:       (t)       => Dom.isVisible(t),
	isHidden:        (t)       => Dom.isHidden(t),
	enable:          (t)       => Dom.enable(t),
	disable:         (t)       => Dom.disable(t),
	toggleDisabled:  (t)       => Dom.toggleDisabled(t),
	html:            (t, v)    => Dom.html(t, v),
	text:            (t, v)    => Dom.text(t, v),
	clear:           (t)       => Dom.clear(t),
	changeDiv:       (t, h)    => Dom.changeDiv(t, h),
	addClass:        (t, c)    => Dom.addClass(t, c),
	removeClass:     (t, c)    => Dom.removeClass(t, c),
	toggleClass:     (t, c)    => Dom.toggleClass(t, c),
	hasClass:        (t, c)    => Dom.hasClass(t, c),
	val:             (t, v)    => Dom.val(t, v),
	clearVal:        (t)       => Dom.clearVal(t),
	data:            (t, k, v) => Dom.data(t, k, v),
	on:              (t, e, c) => Dom.on(t, e, c),
	off:             (t, e, c) => Dom.off(t, e, c),

	/* ── Números & Strings ── */
	numFormat:       (n, d, l) => NumberHelper.formatNumber(n, d, l),
	numRound:        (n, d)    => NumberHelper.round(n, d),
	numToNum:        (n, d)    => NumberHelper.toNumber(n, d),
	numRandom:       (m, x)    => NumberHelper.randomInt(m, x),
	strCapital:      (s)       => StringHelper.capitalize(s),
	strUpper:        (s)       => StringHelper.upper(s),
	strLower:        (s)       => StringHelper.lower(s),
	strTrim:         (s)       => StringHelper.trim(s),
	strCleanSpaces:  (s)       => StringHelper.cleanSpaces(s),
	strTruncate:     (s, l, f) => StringHelper.truncate(s, l, f),
	strSlug:         (s)       => StringHelper.slug(s),
	strNormalize:    (s)       => StringHelper.normalize(s),

	/* ── Fullscreen ── */
	toggleFullscreen:  (t)     => Fullscreen.toggle(t),
	requestFullscreen: (t)     => Fullscreen.request(t),
	exitFullscreen:    ()      => Fullscreen.exit(),

	/* ── Icons ── */
	setDefaultIcon:  (l)       => Icons.setDefault(l),
	icon:            (n, l, o) => Icons.iconEl(n, l, o),
	fa:              (n, o)    => Icons.fa(n, o),
	bi:              (n, o)    => Icons.bi(n, o),
	feather:         (n, o)    => Icons.feather(n, o),

	/* ── Códigos ── */
	codeBarcode:     (e, v, o) => Codes.barcode(e, v, o),
	codeQrCanvas:    (e, t, o) => Codes.qrCanvas(e, t, o),
	codeQrImage:     (e, t, o) => Codes.qrImage(e, t, o),
	codeClear:       (e)       => Codes.clear(e),

	/* ── Monedas ── */
	currencySymbol:  (c)       => Currency.getSymbol(c),
	currencyFormat:  (v, c, d) => Currency.format(v, c, d),
	currencyConvert: (v, r, d) => Currency.convert(v, r, d),

	/* ── Drag ── */
	dragCreate:      (k, c, o) => Drag.create(k, c, o),
	dragGet:         (k)       => Drag.get(k),
	dragDestroy:     (k)       => Drag.destroy(k),

	/* ── Archivos ── */
	fileFormatSize:        (b, d)    => FileHelper.formatSize(b, d),
	fileExtension:         (f)       => FileHelper.getExtension(f),
	fileIsValidSize:       (f, s)    => FileHelper.isValidSize(f, s),
	fileIsValidExtension:  (f, a)    => FileHelper.isValidExtension(f, a),
	fileIsValidMime:       (f, m)    => FileHelper.isValidMime(f, m),
	fileReadBase64:        (f)       => FileHelper.readAsBase64(f),
	fileReadText:          (f)       => FileHelper.readAsText(f),
	fileDownloadText:      (c, n, t) => FileHelper.downloadText(c, n, t),
	fileDownloadUrl:       (u, n)    => FileHelper.downloadUrl(u, n),

	/* ── Impresión ── */
	printEl:         (t, o)    => Print.print(t, o),

	/* ── Humanización ── */
	humanizeDuration:       (m, o) => Humanize.duration(m, o),
	humanizeTimeRemaining:  (t)    => Humanize.timeRemaining(t),
	humanizeTimeAgo:        (f)    => Humanize.timeAgo(f),

	/* ── Select2 ── */
	select2Set:      (e, v, t) => Select2.setValue(e, v, t),
	select2Clear:    (e)       => Select2.clear(e),
	select2Enable:   (e)       => Select2.enable(e),
	select2Disable:  (e)       => Select2.disable(e),
	select2Reload:   (e)       => Select2.reload(e),

	/* ── Sidebar ── */
	sidebarToggle:      ()     => Sidebar.toggle(),
	sidebarCollapse:    ()     => Sidebar.collapse(),
	sidebarExpand:      ()     => Sidebar.expand(),
	sidebarIsCollapsed: ()     => Sidebar.isCollapsed(),
	sidebarRefresh:     ()     => Sidebar.refresh(),

	/* ── Iframe / Pestañas ── */
	iframeOpen:         (t, u, i) => Iframe.open(t, u, i),
	iframeClose:        (k)       => Iframe.close(k),
	iframeFullscreen:   ()        => Iframe.toggleFullscreen(),
	iframeRefresh:      ()        => Iframe.refresh(),
	iframeCloseOthers:  ()        => Iframe.closeOthers(),
	iframeCloseAll:     ()        => Iframe.closeAll(),

	/* ── Excel ── */
	excelExport:         (d, f) => Excel.exportToExcel(d, f),
	excelImport:         (f)    => Excel.excelToJson(f),
	jsonToExcel:         (d, f) => Excel.jsonToExcel(d, f),
	excelToJson:         (f)    => Excel.excelToJson(f),
	jsonToCsv:           (d, f) => Excel.jsonToCsv(d, f),
	excelImportMultiple: (f)    => Excel.excelToJsonMultiple(f),
	excelExportMultiple: (s, f) => Excel.jsonToExcelMultiple(s, f),

	/* ── Validación ── */
	isValidForm:     (f)       => Forms.isValidForm(f),
	serializeForm:   (f)       => Forms.serializeForm(f),
	clearForm:       (f)       => Forms.clearForm(f),
	isNullOrEmpty:   (v)       => Validation.isNullOrEmpty(v),
	isEmpty:         (v)       => Validation.isEmpty(v),
	isValidEmail:    (e)       => Validation.isValidEmail(e),
	isValidPhone:    (p)       => Validation.isValidPhone(p),
	isValidCedula:   (c)       => Validation.isValidCedula(c),
};

// Exposición global
window.$Alert      = Alert;
window.$Api        = Api;
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
window.$String     = StringHelper;
window.$Table      = Table;
window.$Validation = Validation;
window.$HR         = $HR;

export default $HR;
