/**
 * @file App.js
 * @description Facade unificada de HR Library v4.0.
 * Todos los métodos son referencias directas a las implementaciones
 * reales, sin funciones wrapper ni delegación.
 *
 * @example
 * App.success("Guardado");
 * App.getApi("/api/usuarios");
 * App.initTable("#tabla", options);
 *
 * @version 4.0.0
 */

import { installPlugin, isInstalled, installedPlugins } from "./plugin-system.js";
import config     from "./config.js";
import spanish    from "./spanish.js";
import init       from "./init.js";

import Alert        from "../helpers/Alert.js";
import Api          from "../helpers/Api.js";
import Asset        from "../helpers/Asset.js";
import Calendar     from "../helpers/Calendar.js";
import Charts       from "../helpers/Charts.js";
import Codes        from "../helpers/Codes.js";
import Currency     from "../helpers/Currency.js";
import DateHelper   from "../helpers/Date.js";
import Dom          from "../helpers/Dom.js";
import Drag         from "../helpers/Drag.js";
import Editor       from "../helpers/Editor.js";
import Event        from "../helpers/Event.js";
import Excel        from "../helpers/Excel.js";
import ExportTbl    from "../helpers/ExportTbl.js";
import FileHelper   from "../helpers/File.js";
import Forms        from "../helpers/Forms.js";
import Fullscreen   from "../helpers/Fullscreen.js";
import Humanize     from "../helpers/Humanize.js";
import Icons        from "../helpers/Icons.js";
import Iframe       from "../helpers/Iframe.js";
import Modal        from "../helpers/Modal.js";
import NumberHelper from "../helpers/Number.js";
import Print        from "../helpers/Print.js";
import Select2      from "../helpers/Select2.js";
import Sidebar      from "../helpers/Sidebar.js";
import Signature    from "../helpers/Signature.js";
import Storage      from "../helpers/Storage.js";
import Strings      from "../helpers/Strings.js";
import Table        from "../helpers/Table.js";
import Validation   from "../helpers/Validation.js";

const App = {

  /* ── Meta ── */
  version: config.app.version,
  config,
  lang: spanish,

  /* ── Init ── */
  init: (scope) => init(scope),

  /* ── HTTP ── */
  setToken:       Api.setToken,
  getToken:       Api.getToken,
  setApiAlerts:   Api.setAutoAlerts,
  getApi:         Api.get,
  postApi:        Api.post,
  putApi:         Api.put,
  patchApi:       Api.patch,
  deleteApi:      Api.delete,
  uploadApi:      Api.upload,
  getSelect:      Api.getSelect,
  rawAxios:       Api.raw,

  /* ── Alertas ── */
  success:        Alert.success,
  info:           Alert.info,
  warning:        Alert.warning,
  error:          Alert.error,
  confirm:        Alert.confirm,
  loading:        Alert.loading,
  close:          Alert.close,
  confirmDelete:  Alert.confirmDelete,
  confirmInsert:  Alert.confirmInsert,
  confirmUpdate:  Alert.confirmUpdate,
  confirmDeleteByName: Alert.confirmDeleteByName,

  msgSuccess:     Alert.success,
  msgInfo:        Alert.info,
  msgWarning:     Alert.warning,
  msgError:       Alert.error,
  alert:          Alert.show,
  msgConfirm:     Alert.confirm,
  msgLoading:     Alert.loading,
  msgClose:       Alert.close,

  /* ── Toasts (aplanados desde Alert.toast) ── */
  toastSuccess:   Alert.toast.success,
  toastInfo:      Alert.toast.info,
  toastWarning:   Alert.toast.warning,
  toastError:     Alert.toast.error,
  toast:          Alert.toast.show,

  /* ── Modales Bootstrap (aplanados desde Modal) ── */
  modalOpen:      Modal.open,
  modalClose:     Modal.close,
  modalToggle:    Modal.toggle,
  modalGetData:   Modal.getData,
  modalSetTitle:  Modal.setTitle,
  modalSetBody:   Modal.setBody,
  modalSetContent: Modal.setContent.bind(Modal),
  modalOnClose:   Modal.onClose,
  modalOnOpen:    Modal.onOpen,
  modalDestroy:   Modal.destroy,

  openModal:      Modal.open,
  closeModal:     Modal.close,
  toggleModal:    Modal.toggle,
  getModalData:   Modal.getData,

  /* ── DataTables ── */
  initTable:      Table.initTable,
  destroyTable:   Table.destroy,
  reloadTable:    Table.reload,
  tblCol:         Table.col,
  tblIndex:       Table.index,
  tblCheckbox:    Table.checkbox,
  tblStatus:      Table.status,
  tblBoolean:     Table.boolean,
  tblBadge:       Table.badge,
  tblDate:        Table.date,
  tblMoney:       Table.money,
  tblNumber:      Table.number,
  tblActionsCol:  Table.actions,
  tblButtons:     Table.exportButtons,
  getSelectedRows: Table.selected,
  clearTblSelection: Table.clearSelection,
  addTblRow:      Table.addRow,
  removeTblRow:   Table.removeRow,
  updateTblRow:   Table.updateRow,
  refreshTbl:     Table.refresh,
  onTableAction:  Table.onAction,

  createTbl:      Table.initTable,
  destroyTbl:     Table.destroy,
  reloadTbl:      Table.reload,

  /* ── Exportación ── */
  exportExcel:    ExportTbl.excel,
  exportPdf:      ExportTbl.pdf,
  exportCsv:      ExportTbl.csv,
  exportJson:     ExportTbl.json,

  /* ── Fechas ── */
  now:            DateHelper.now,
  createDate:     DateHelper.create,
  isValidDate:    DateHelper.isValid,
  formatDate:     DateHelper.format,
  toISODate:      DateHelper.toISODate,
  toISOString:    DateHelper.toISOString,
  addDays:        DateHelper.addDays,
  diffDays:       DateHelper.diffDays,

  /* ── Storage ── */
  setLocal:       Storage.set,
  getLocal:       Storage.get,
  hasLocal:       Storage.has,
  removeLocal:    Storage.remove,
  clearLocal:     Storage.clear,
  setLocalTtl:    Storage.setTtl,
  getLocalTtl:    Storage.getTtl,
  setSession:     Storage.setSession,
  getSession:     Storage.getSession,
  hasSession:     Storage.hasSession,
  removeSession:  Storage.removeSession,
  clearSession:   Storage.clearSession,

  /* ── Charts ── */
  createChart:      Charts.create,
  destroyChart:     Charts.destroy,
  destroyAllCharts: Charts.destroyAll,
  updateChartData:  Charts.updateData,
  setChartOption:   Charts.setOption,
  getChart:         Charts.get,

  /* ── Editor Quill ── */
  createEditor:   Editor.create,
  getEditor:      Editor.get,
  getEditorHtml:  Editor.getHtml,
  setEditorHtml:  Editor.setHtml,
  destroyEditor:  Editor.destroy,

  /* ── Firma digital ── */
  createSignature:  Signature.create,
  clearSignature:   Signature.clear,
  getSignatureData: Signature.toDataURL,
  getSignature:     Signature.get,

  /* ── Calendario ── */
  initCalendar:       Calendar.init,
  getCalendar:        Calendar.get,
  addCalendarEvent:   Calendar.addEvent,
  clearCalendarEvents: Calendar.clearEvents,
  calendarDraggable:  Calendar.draggable,

  /* ── DOM ── */
  el:             Dom.el,
  q:              Dom.q,
  qa:             Dom.qa,
  show:           Dom.show,
  hide:           Dom.hide,
  toggle:         Dom.toggle,
  isVisible:      Dom.isVisible,
  isHidden:       Dom.isHidden,
  enable:         Dom.enable,
  disable:        Dom.disable,
  toggleDisabled: Dom.toggleDisabled,
  isDisabled:     Dom.isDisabled,
  html:           Dom.html,
  text:           Dom.text,
  clear:          Dom.clear,
  changeDiv:      Dom.changeDiv,
  addClass:       Dom.addClass,
  removeClass:    Dom.removeClass,
  toggleClass:    Dom.toggleClass,
  hasClass:       Dom.hasClass,
  val:            Dom.val,
  clearVal:       Dom.clearVal,
  data:           Dom.data,
  on:             Dom.on,
  off:            Dom.off,
  dispatch:       Dom.dispatch,
  find:           Dom.find,
  findOne:        Dom.findOne,
  parent:         Dom.parent,
  is:             Dom.is,
  createElement:  Dom.createElement,
  createAll:      Dom.createAll,
  ready:          Dom.ready,

  /* ── Eventos pub/sub ── */
  eventOn:    Event.on,
  eventOff:   Event.off,
  eventEmit:  Event.emit,
  eventOnce:  Event.once,

  /* ── Números ── */
  numFormat:      NumberHelper.formatNumber,
  numRound:       NumberHelper.round,
  numCeil:        NumberHelper.ceil,
  numFloor:       NumberHelper.floor,
  numToNum:       NumberHelper.toNumber,
  numRandom:      NumberHelper.randomInt,
  numClamp:       NumberHelper.clamp,
  numPercent:     NumberHelper.percent,
  numPercentOf:   NumberHelper.percentOf,
  numSum:         NumberHelper.sum,
  numAvg:         NumberHelper.avg,
  numCurrency:    NumberHelper.currency,

  /* ── Strings ── */
  strCapital:     Strings.capitalize,
  strTitleCase:   Strings.titleCase,
  strUpper:       Strings.upper,
  strLower:       Strings.lower,
  strTrim:        Strings.trim,
  strReverse:     Strings.reverse,
  strCleanSpaces: Strings.cleanSpaces,
  strTruncate:    Strings.truncate,
  strSlug:        Strings.slug,
  strNormalize:   Strings.normalize,
  strPadStart:    Strings.padStart,
  strPadEnd:      Strings.padEnd,
  strUid:         Strings.uid,
  strContains:    Strings.contains,
  strStartsWith:  Strings.startsWith,
  strEndsWith:    Strings.endsWith,
  strHighlight:   Strings.highlight,
  strMask:        Strings.mask,
  strPhone:       Strings.formatPhone,
  strCedula:      Strings.formatCedula,
  strRNC:         Strings.formatRNC,
  strFormat:      Strings.format,
  strEscapeHtml:  Strings.escapeHtml,
  strStripHtml:   Strings.stripHtml,
  strCount:       Strings.countOccurrences,
  strReplaceAll:  Strings.replaceAll,

  /* ── Fullscreen ── */
  toggleFullscreen:  Fullscreen.toggle,
  requestFullscreen: Fullscreen.request,
  exitFullscreen:    Fullscreen.exit,

  /* ── Iconos ── */
  setDefaultIcon: Icons.setDefault,
  icon:           Icons.iconEl,
  fa:             Icons.fa,
  bi:             Icons.bi,
  feather:        Icons.feather,

  /* ── Códigos ── */
  codeBarcode:    Codes.barcode,
  codeQrCanvas:   Codes.qrCanvas,
  codeQrImage:    Codes.qrImage,
  codeClear:      Codes.clear,

  /* ── Moneda ── */
  currencySymbol: Currency.getSymbol,
  currencyFormat: Currency.format,
  currencyConvert: Currency.convert,

  /* ── Drag ── */
  dragCreate:     Drag.create,
  dragGet:        Drag.get,
  dragDestroy:    Drag.destroy,

  /* ── Archivos ── */
  fileFormatSize:       FileHelper.formatSize,
  fileExtension:        FileHelper.getExtension,
  fileIsValidSize:      FileHelper.isValidSize,
  fileIsValidExtension: FileHelper.isValidExtension,
  fileReadBase64:       FileHelper.readAsBase64,
  fileReadText:         FileHelper.readAsText,
  fileDownloadText:     FileHelper.downloadText,
  fileDownloadUrl:      FileHelper.downloadUrl,

  /* ── Impresión ── */
  printEl:        Print.element,
  printHtml:      Print.html,
  printPage:      Print.page,

  /* ── Humanización ── */
  humanizeDuration:      Humanize.duration,
  humanizeTimeRemaining: Humanize.timeRemaining,
  humanizeTimeAgo:       Humanize.timeAgo,

  /* ── Select2 ── */
  select2Set:     Select2.setValue,
  select2Clear:   Select2.clear,
  select2Enable:  Select2.enable,
  select2Disable: Select2.disable,
  select2Reload:  Select2.reload,

  /* ── Sidebar ── */
  sidebarToggle:      Sidebar.toggle,
  sidebarCollapse:    Sidebar.collapse,
  sidebarExpand:      Sidebar.expand,
  sidebarIsCollapsed: Sidebar.isCollapsed,
  sidebarRefresh:     Sidebar.refresh,

  /* ── Iframe / Pestañas ── */
  iframeOpen:        Iframe.open,
  iframeClose:       Iframe.close,
  iframeFullscreen:  Iframe.toggleFullscreen,
  iframeRefresh:     Iframe.refresh,
  iframeCloseOthers: Iframe.closeOthers,
  iframeCloseAll:    Iframe.closeAll,

  /* ── Excel ── */
  excelExport:         Excel.exportToExcel,
  excelImport:         Excel.excelToJson,
  jsonToExcel:         Excel.jsonToExcel,
  excelToJson:         Excel.excelToJson,
  jsonToCsv:           Excel.jsonToCsv,
  excelImportMultiple: Excel.excelToJsonMultiple,
  excelExportMultiple: Excel.jsonToExcelMultiple,

  /* ── Formularios ── */
  isValidForm:    Forms.isValidForm,
  serializeForm:  Forms.serialize,
  clearForm:      Forms.clear,
  fillForm:       Forms.fill,
  submitForm:     Forms.submit,
  togglePassword: Forms.togglePassword,

  /* ── Validación ── */
  isNullOrEmpty:  Validation.isNullOrEmpty,
  isEmpty:        Validation.isEmpty,
  isValidEmail:   Validation.isValidEmail,
  isValidPhone:   Validation.isValidPhone,
  isValidCedula:  Validation.isValidCedula,
  isValidRNC:     Validation.isValidRNC,
  isValidPlaca:   Validation.isValidPlaca,
  isNumber:       Validation.isNumber,
  isInRange:      Validation.isInRange,
  isValidUrl:     Validation.isValidUrl,
  isAfter:        Validation.isAfter,
  isBefore:       Validation.isBefore,
  isAllowedExt:   Validation.isAllowedExtension,
  isValidFileSize: Validation.isValidFileSize,

  /* ── Asset ── */
  logo:            Asset.logo,
  avatar:          Asset.avatar,
  assetBg:         Asset.bg,
  assetUser:       Asset.user,
  assetImg:        Asset.img,
  assetPlaceholder: Asset.placeholder,
};

/* ── Plugin system ── */

App.use = function (plugin) {
  installPlugin(App, plugin);
  return App;
};

App.isInstalled  = isInstalled;
App.plugins      = installedPlugins;

export default App;
