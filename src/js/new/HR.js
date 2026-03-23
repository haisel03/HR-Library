/**
 * @namespace HR
 * @description
 * Fachada unificada de HR Library v3.0.
 *
 * Combina la arquitectura de V1 (plugin system, fluent $HR.method())
 * con la exposición global de V2 (window.$Helper para cada módulo).
 *
 * Tres niveles de acceso:
 *
 * **1. Módulos directos via window (acceso más directo):**
 * ```js
 * $Alert.success("Guardado");
 * $Table.initTable("#tabla", options);
 * $Validation.isValidCedula("001-1234567-8");
 * $String.slug("Gestión Académica");
 * $Storage.setTtl("token", "abc123", 3600);
 * ```
 *
 * **2. API plana en $HR (compatibilidad y demos):**
 * ```js
 * $HR.msgSuccess("Guardado");
 * $HR.getApi("/api/empleados");
 * $HR.isValidCedula("001-1234567-8");
 * $HR.createTbl("#tabla", options);
 * ```
 *
 * **3. Plugin system (extensibilidad):**
 * ```js
 * $HR.use({ name: "MiPlugin", install(hr) { hr.MiHelper = {}; } });
 * ```
 *
 * @version 3.0.0
 */

import { installPlugin, isInstalled, installedPlugins } from "./core/plugin-system.js";

import config     from "./core/config.js";
import spanish    from "./core/spanish.js";
import init       from "./core/init.js";

import Alert        from "./helpers/Alert.js";
import Api          from "./helpers/Api.js";
import Asset        from "./helpers/Asset.js";
import Calendar     from "./helpers/Calendar.js";
import Charts       from "./helpers/Charts.js";
import Codes        from "./helpers/Codes.js";
import Currency     from "./helpers/Currency.js";
import DateHelper   from "./helpers/Date.js";
import Dom          from "./helpers/Dom.js";
import Drag         from "./helpers/Drag.js";
import Editor       from "./helpers/Editor.js";
import Event        from "./helpers/Event.js";
import Excel        from "./helpers/Excel.js";
import ExportTbl    from "./helpers/ExportTbl.js";
import FileHelper   from "./helpers/File.js";
import Forms        from "./helpers/Forms.js";
import Fullscreen   from "./helpers/Fullscreen.js";
import Humanize     from "./helpers/Humanize.js";
import Icons        from "./helpers/Icons.js";
import Iframe       from "./helpers/Iframe.js";
import Modal        from "./helpers/Modal.js";
import NumberHelper from "./helpers/Number.js";
import Print        from "./helpers/Print.js";
import Select2      from "./helpers/Select2.js";
import Sidebar      from "./helpers/Sidebar.js";
import Signature    from "./helpers/Signature.js";
import Storage      from "./helpers/Storage.js";
import Strings      from "./helpers/Strings.js";
import Table        from "./helpers/Table.js";
import Validation   from "./helpers/Validation.js";

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
  setToken:       (t)       => Api.setToken(t),
  getToken:       ()        => Api.getToken(),
  setApiAlerts:   (v)       => Api.setAutoAlerts(v),
  getApi:         (u, p, o) => Api.get(u, p, o),
  postApi:        (u, d, o) => Api.post(u, d, o),
  putApi:         (u, d, o) => Api.put(u, d, o),
  patchApi:       (u, d, o) => Api.patch(u, d, o),
  deleteApi:      (u, o)    => Api.delete(u, o),
  uploadApi:      (u, fd, p)=> Api.upload(u, fd, p),
  getSelect:      (e, u, p) => Api.getSelect(e, u, p),

  /* ── Alertas ── */
  msgSuccess:     (t, cb)   => Alert.success(t, cb),
  msgInfo:        (t, cb)   => Alert.info(t, cb),
  msgWarning:     (t, cb)   => Alert.warning(t, cb),
  msgError:       (t, cb)   => Alert.error(t, cb),
  alert:          (t, type, cb) => Alert.show(t, type, cb),
  msgConfirm:     (t, q, cb, type) => Alert.confirm(t, q, cb, type),
  msgLoading:     (open = true) => Alert.loading(open),
  msgClose:       ()        => Alert.close(),
  confirmDelete:  (cb)      => Alert.confirmDelete(cb),
  confirmInsert:  (cb)      => Alert.confirmInsert(cb),
  confirmUpdate:  (cb)      => Alert.confirmUpdate(cb),
  confirmDeleteByName: (name, cb) => Alert.confirmDeleteByName(name, cb),

  /* ── Toasts ── */
  toastSuccess:   (t)       => Alert.toast.success(t),
  toastInfo:      (t)       => Alert.toast.info(t),
  toastWarning:   (t)       => Alert.toast.warning(t),
  toastError:     (t)       => Alert.toast.error(t),
  toast:          (t, type) => Alert.toast.show(t, type),

  /* ── Modales Bootstrap ── */
  openModal:      (m, d)    => Modal.open(m, d),
  closeModal:     (m)       => Modal.close(m),
  toggleModal:    (m)       => Modal.toggle(m),
  getModalData:   (m)       => Modal.getData(m),

  /* ── DataTables ── */
  createTbl:          (t, o)    => Table.initTable(t, o),
  destroyTbl:         (t)       => Table.destroy(t),
  reloadTbl:          (t, r)    => Table.reload(t, r),
  tblCol:             (d, t, r) => Table.col(d, t, r),
  tblActionsCol:      (r)       => Table.actions(r),
  tblButtons:         (t)       => Table.exportButtons(t),
  getSelectedRows:    (t)       => Table.selected(t),
  clearTblSelection:  (t)       => Table.clearSelection(t),
  addTblRow:          (t, r)    => Table.addRow(t, r),
  removeTblRow:       (t, b)    => Table.removeRow(t, b),
  updateTblRow:       (t, b, d) => Table.updateRow(t, b, d),
  refreshTbl:         (t, d)    => Table.refresh(t, d),
  onTableAction:      (t, cb)   => Table.onAction(t, cb),

  /* ── Exportación ── */
  exportExcel:    (t, f)    => ExportTbl.excel(t, f),
  exportPdf:      (t, o)    => ExportTbl.pdf(t, o),
  exportCsv:      (t, f)    => ExportTbl.csv(t, f),
  exportJson:     (t)       => ExportTbl.json(t),

  /* ── Fechas ── */
  now:            ()        => DateHelper.now(),
  createDate:     (v)       => DateHelper.create(v),
  isValidDate:    (v)       => DateHelper.isValid(v),
  formatDate:     (v, t, l) => DateHelper.format(v, t, l),
  toISODate:      (v)       => DateHelper.toISODate(v),
  toISOString:    (v)       => DateHelper.toISOString(v),
  addDays:        (v, d)    => DateHelper.addDays(v, d),
  diffDays:       (s, e)    => DateHelper.diffDays(s, e),

  /* ── Storage ── */
  setLocal:       (k, v)    => Storage.set(k, v),
  getLocal:       (k, d)    => Storage.get(k, d),
  hasLocal:       (k)       => Storage.has(k),
  removeLocal:    (k)       => Storage.remove(k),
  clearLocal:     ()        => Storage.clear(),
  setLocalTtl:    (k, v, s) => Storage.setTtl(k, v, s),
  getLocalTtl:    (k, d)    => Storage.getTtl(k, d),
  setSession:     (k, v)    => Storage.setSession(k, v),
  getSession:     (k, d)    => Storage.getSession(k, d),
  hasSession:     (k)       => Storage.hasSession(k),
  removeSession:  (k)       => Storage.removeSession(k),

  /* ── Charts ── */
  createChart:      (t, o)  => Charts.create(t, o),
  destroyChart:     (t)     => Charts.destroy(t),
  destroyAllCharts: ()      => Charts.destroyAll(),
  updateChartData:  (t, d)  => Charts.updateData(t, d),
  setChartOption:   (t, p, v) => Charts.setOption(t, p, v),
  getChart:         (t)     => Charts.get(t),

  /* ── Editor Quill ── */
  createEditor:   (t, o)    => Editor.create(t, o),
  getEditor:      (t)       => Editor.get(t),
  getEditorHtml:  (t)       => Editor.getHtml(t),
  setEditorHtml:  (t, h)    => Editor.setHtml(t, h),
  destroyEditor:  (t)       => Editor.destroy(t),

  /* ── Firma digital ── */
  createSignature:  (t, o)  => Signature.create(t, o),
  clearSignature:   (t)     => Signature.clear(t),
  getSignatureData: (t)     => Signature.toDataURL(t),
  getSignature:     (t)     => Signature.get(t),

  /* ── Calendario ── */
  initCalendar:       (t, o)  => Calendar.init(t, o),
  getCalendar:        (t)     => Calendar.get(t),
  addCalendarEvent:   (t, e)  => Calendar.addEvent(t, e),
  clearCalendarEvents:(t)     => Calendar.clearEvents(t),
  calendarDraggable:  (c, o)  => Calendar.draggable(c, o),

  /* ── DOM ── */
  el:             (t)       => Dom.el(t),
  show:           (t)       => Dom.show(t),
  hide:           (t)       => Dom.hide(t),
  toggle:         (t)       => Dom.toggle(t),
  isVisible:      (t)       => Dom.isVisible(t),
  isHidden:       (t)       => Dom.isHidden(t),
  enable:         (t)       => Dom.enable(t),
  disable:        (t)       => Dom.disable(t),
  toggleDisabled: (t)       => Dom.toggleDisabled(t),
  html:           (t, v)    => Dom.html(t, v),
  text:           (t, v)    => Dom.text(t, v),
  clear:          (t)       => Dom.clear(t),
  changeDiv:      (t, h)    => Dom.changeDiv(t, h),
  addClass:       (t, c)    => Dom.addClass(t, c),
  removeClass:    (t, c)    => Dom.removeClass(t, c),
  toggleClass:    (t, c)    => Dom.toggleClass(t, c),
  hasClass:       (t, c)    => Dom.hasClass(t, c),
  val:            (t, v)    => Dom.val(t, v),
  clearVal:       (t)       => Dom.clearVal(t),
  data:           (t, k, v) => Dom.data(t, k, v),
  on:             (t, e, c) => Dom.on(t, e, c),
  off:            (t, e, c) => Dom.off(t, e, c),
  dispatch:       (t, e, d) => Dom.dispatch(t, e, d),

  /* ── Eventos pub/sub ── */
  eventOn:    (e, h)  => Event.on(e, h),
  eventOff:   (e, h)  => Event.off(e, h),
  eventEmit:  (e, d)  => Event.emit(e, d),
  eventOnce:  (e, h)  => Event.once(e, h),

  /* ── Números ── */
  numFormat:      (n, d, l) => NumberHelper.formatNumber(n, d, l),
  numRound:       (n, d)    => NumberHelper.round(n, d),
  numCeil:        (n, d)    => NumberHelper.ceil(n, d),
  numFloor:       (n, d)    => NumberHelper.floor(n, d),
  numToNum:       (n, d)    => NumberHelper.toNumber(n, d),
  numRandom:      (m, x)    => NumberHelper.randomInt(m, x),
  numClamp:       (v, mn, mx) => NumberHelper.clamp(v, mn, mx),
  numPercent:     (v, d, dec) => NumberHelper.percent(v, d, dec),
  numPercentOf:   (p, t, d) => NumberHelper.percentOf(p, t, d),
  numSum:         (a)       => NumberHelper.sum(a),
  numAvg:         (a)       => NumberHelper.avg(a),
  numCurrency:    (v, c, d) => NumberHelper.currency(v, c, d),

  /* ── Strings ── */
  strCapital:     (s)       => Strings.capitalize(s),
  strTitleCase:   (s)       => Strings.titleCase(s),
  strUpper:       (s)       => Strings.upper(s),
  strLower:       (s)       => Strings.lower(s),
  strTrim:        (s)       => Strings.trim(s),
  strCleanSpaces: (s)       => Strings.cleanSpaces(s),
  strTruncate:    (s, l, f) => Strings.truncate(s, l, f),
  strSlug:        (s)       => Strings.slug(s),
  strNormalize:   (s)       => Strings.normalize(s),
  strPadStart:    (v, l, c) => Strings.padStart(v, l, c),
  strUid:         (l)       => Strings.uid(l),
  strContains:    (t, s)    => Strings.contains(t, s),
  strHighlight:   (t, s)    => Strings.highlight(t, s),
  strMask:        (v, m)    => Strings.mask(v, m),
  strPhone:       (p)       => Strings.formatPhone(p),
  strCedula:      (c)       => Strings.formatCedula(c),
  strRNC:         (r)       => Strings.formatRNC(r),
  strFormat:      (t, d)    => Strings.format(t, d),
  strEscapeHtml:  (t)       => Strings.escapeHtml(t),

  /* ── Fullscreen ── */
  toggleFullscreen:   (t)   => Fullscreen.toggle(t),
  requestFullscreen:  (t)   => Fullscreen.request(t),
  exitFullscreen:     ()    => Fullscreen.exit(),

  /* ── Icons ── */
  setDefaultIcon: (l)       => Icons.setDefault(l),
  icon:           (n, l, o) => Icons.iconEl(n, l, o),
  fa:             (n, o)    => Icons.fa(n, o),
  bi:             (n, o)    => Icons.bi(n, o),
  feather:        (n, o)    => Icons.feather(n, o),

  /* ── Códigos ── */
  codeBarcode:    (e, v, o) => Codes.barcode(e, v, o),
  codeQrCanvas:   (e, t, o) => Codes.qrCanvas(e, t, o),
  codeQrImage:    (e, t, o) => Codes.qrImage(e, t, o),
  codeClear:      (e)       => Codes.clear(e),

  /* ── Moneda ── */
  currencySymbol: (c)       => Currency.getSymbol(c),
  currencyFormat: (v, c, d) => Currency.format(v, c, d),
  currencyConvert:(v, r, d) => Currency.convert(v, r, d),

  /* ── Drag ── */
  dragCreate:     (k, c, o) => Drag.create(k, c, o),
  dragGet:        (k)       => Drag.get(k),
  dragDestroy:    (k)       => Drag.destroy(k),

  /* ── Archivos ── */
  fileFormatSize:       (b, d)  => FileHelper.formatSize(b, d),
  fileExtension:        (f)     => FileHelper.getExtension(f),
  fileIsValidSize:      (f, s)  => FileHelper.isValidSize(f, s),
  fileIsValidExtension: (f, a)  => FileHelper.isValidExtension(f, a),
  fileReadBase64:       (f)     => FileHelper.readAsBase64(f),
  fileReadText:         (f)     => FileHelper.readAsText(f),
  fileDownloadText:     (c, n, t) => FileHelper.downloadText(c, n, t),
  fileDownloadUrl:      (u, n)  => FileHelper.downloadUrl(u, n),

  /* ── Impresión ── */
  printEl:        (t, o)    => Print.print(t, o),
  printHtml:      (h, t)    => Print.html(h, t),
  printPage:      ()        => Print.page(),

  /* ── Humanización ── */
  humanizeDuration:      (m, o) => Humanize.duration(m, o),
  humanizeTimeRemaining: (t)    => Humanize.timeRemaining(t),
  humanizeTimeAgo:       (f)    => Humanize.timeAgo(f),

  /* ── Select2 ── */
  select2Set:     (e, v, t) => Select2.setValue(e, v, t),
  select2Clear:   (e)       => Select2.clear(e),
  select2Enable:  (e)       => Select2.enable(e),
  select2Disable: (e)       => Select2.disable(e),
  select2Reload:  (e)       => Select2.reload(e),

  /* ── Sidebar ── */
  sidebarToggle:      ()    => Sidebar.toggle(),
  sidebarCollapse:    ()    => Sidebar.collapse(),
  sidebarExpand:      ()    => Sidebar.expand(),
  sidebarIsCollapsed: ()    => Sidebar.isCollapsed(),
  sidebarRefresh:     ()    => Sidebar.refresh(),

  /* ── Iframe / Pestañas ── */
  iframeOpen:        (t, u, i) => Iframe.open(t, u, i),
  iframeClose:       (k)       => Iframe.close(k),
  iframeFullscreen:  ()        => Iframe.toggleFullscreen(),
  iframeRefresh:     ()        => Iframe.refresh(),
  iframeCloseOthers: ()        => Iframe.closeOthers(),
  iframeCloseAll:    ()        => Iframe.closeAll(),

  /* ── Excel ── */
  excelExport:         (d, f) => Excel.exportToExcel(d, f),
  excelImport:         (f)    => Excel.excelToJson(f),
  jsonToExcel:         (d, f) => Excel.jsonToExcel(d, f),
  excelToJson:         (f)    => Excel.excelToJson(f),
  jsonToCsv:           (d, f) => Excel.jsonToCsv(d, f),
  excelImportMultiple: (f)    => Excel.excelToJsonMultiple(f),
  excelExportMultiple: (s, f) => Excel.jsonToExcelMultiple(s, f),

  /* ── Formularios ── */
  isValidForm:    (f)       => Forms.isValidForm(f),
  serializeForm:  (f)       => Forms.serialize(f),
  clearForm:      (f)       => Forms.clear(f),
  fillForm:       (f, d)    => Forms.fill(f, d),
  submitForm:     (f, u, o) => Forms.submit(f, u, o),
  togglePassword: (p, b)    => Forms.togglePassword(p, b),

  /* ── Validación ── */
  isNullOrEmpty:  (v)       => Validation.isNullOrEmpty(v),
  isEmpty:        (v)       => Validation.isEmpty(v),
  isValidEmail:   (e)       => Validation.isValidEmail(e),
  isValidPhone:   (p)       => Validation.isValidPhone(p),
  isValidCedula:  (c)       => Validation.isValidCedula(c),
  isValidRNC:     (r)       => Validation.isValidRNC(r),
  isValidPlaca:   (p)       => Validation.isValidPlaca(p),
  isNumber:       (v)       => Validation.isNumber(v),
  isInRange:      (v, mn, mx) => Validation.isInRange(v, mn, mx),
  isValidUrl:     (u)       => Validation.isValidUrl(u),
  isAfter:        (d, a)    => Validation.isAfter(d, a),
  isBefore:       (d, b)    => Validation.isBefore(d, b),
  isAllowedExt:   (f, a)    => Validation.isAllowedExtension(f, a),
  isValidFileSize:(f, m)    => Validation.isValidFileSize(f, m),

  /* ── Asset ── */
  logo:            (v)      => Asset.logo(v),
  avatar:          (f)      => Asset.avatar(f),
  assetBg:         (f)      => Asset.bg(f),
  assetUser:       (id)     => Asset.user(id),
  assetImg:        (p, f)   => Asset.img(p, f),
  assetPlaceholder:(t)      => Asset.placeholder(t),
};

/* ══════════════════════════════════════════════════════
   SISTEMA DE PLUGINS (V1 approach)
══════════════════════════════════════════════════════ */

/**
 * Registra e instala un plugin en $HR.
 * @param {Object|Function} plugin
 * @returns {typeof $HR}
 * @example
 * $HR.use({ name: "MiPlugin", install(hr) { hr.MiHelper = { saludar: () => "Hola" }; } });
 * $HR.MiHelper.saludar(); // "Hola"
 */
$HR.use = function (plugin) {
  installPlugin($HR, plugin);
  return $HR;
};

$HR.isInstalled  = isInstalled;
$HR.plugins      = installedPlugins;

/* ══════════════════════════════════════════════════════
   EXPOSICIÓN GLOBAL (window.$Helper por módulo)
══════════════════════════════════════════════════════ */

if (typeof window !== "undefined") {
  window.$HR          = $HR;
  window.$Alert       = Alert;
  window.$Api         = Api;
  window.$Asset       = Asset;
  window.$Calendar    = Calendar;
  window.$Charts      = Charts;
  window.$Codes       = Codes;
  window.$Currency    = Currency;
  window.$Date        = DateHelper;
  window.$Dom         = Dom;
  window.$Drag        = Drag;
  window.$Editor      = Editor;
  window.$Event       = Event;
  window.$Excel       = Excel;
  window.$ExportTbl   = ExportTbl;
  window.$File        = FileHelper;
  window.$Forms       = Forms;
  window.$Fullscreen  = Fullscreen;
  window.$Humanize    = Humanize;
  window.$Icons       = Icons;
  window.$Iframe      = Iframe;
  window.$Modal       = Modal;
  window.$Number      = NumberHelper;
  window.$Print       = Print;
  window.$Select2     = Select2;
  window.$Sidebar     = Sidebar;
  window.$Signature   = Signature;
  window.$Storage     = Storage;
  window.$String      = Strings;
  window.$Table       = Table;
  window.$Validation  = Validation;
}

export default $HR;
