/**
 * @module Alert
 * @description
 * Sistema de alertas y notificaciones para HR Library.
 * Combina la API limpia de V2 (toast namespace, TYPE_MAP) con los
 * métodos semánticos de confirmación de V1 (confirmDelete, confirmInsert, confirmDeleteByName).
 *
 * @example
 * Alert.success("Guardado correctamente");
 * Alert.toast.success("Cambios aplicados");
 * Alert.confirm("¿Eliminar?", "No se puede deshacer", () => eliminar(id));
 * Alert.confirmDelete(() => eliminar(id));
 * Alert.loading(); ... Alert.close();
 *
 * @version 3.0.0
 */

import Swal   from "sweetalert2";
import config from "../../core/config.js";

/* ── Internos ── */

/** Mapeo de tipo semántico → clave de config.alerts */
const TYPE_MAP = { success: "s", error: "d", danger: "d", warning: "w", info: "i", primary: "p" };

/** @private */
const resolveType = (type) => TYPE_MAP[type] ?? type;

/** @private */
const baseOptions = (key) => ({
  backdrop:          config.swal.backdrop,
  background:        config.swal.background,
  allowOutsideClick: config.swal.clickOutside,
  allowEscapeKey:    config.swal.escapeKey,
  customClass: {
    confirmButton: `btn btn-${config.alerts.colors[key] ?? "primary"} px-4`,
    cancelButton:  `btn btn-outline-secondary px-4`,
    actions:       "gap-2",
  },
  buttonsStyling: false,
});

/* ── Modal principal ── */

/**
 * Muestra un modal de alerta.
 * @param {string}   text
 * @param {string}   [type="info"]  "success"|"error"|"warning"|"info"|"primary" o clave corta
 * @param {Function} [cb]
 * @returns {Promise<boolean>}
 */
const show = (text, type = "info", cb = null) => {
  const key = resolveType(type);
  const { icons, titles, colors } = config.alerts;
  const msg = !text || String(text).trim() === "" ? config.messages.default : text;

  return Swal.fire({
    ...baseOptions(key),
    html: `
      <div class="d-flex align-items-start gap-3 text-start">
        <i class="bi ${icons[key] ?? "bi-info-circle-fill"} fs-2 text-${colors[key] ?? "info"} flex-shrink-0 mt-1"></i>
        <div>
          <strong class="d-block mb-1">${titles[key] ?? "Aviso"}</strong>
          <span class="text-muted small">${msg}</span>
        </div>
      </div>`,
    confirmButtonText: config.swal.button.confirm,
  }).then((r) => {
    if (r.isConfirmed && typeof cb === "function") cb();
    return r.isConfirmed;
  });
};

/* ── Toasts ── */

/**
 * @namespace Alert.toast
 */
const toast = {
  /**
   * @param {string} text
   * @param {string} [type="info"]
   * @returns {Promise}
   */
  show: (text, type = "info") => {
    const key = resolveType(type);
    const { icons, colors } = config.alerts;
    return Swal.fire({
      toast:             true,
      position:          config.swal.toast.position,
      timer:             config.swal.toast.timer,
      timerProgressBar:  true,
      showConfirmButton: false,
      html: `
        <div class="d-flex align-items-center gap-2">
          <i class="bi ${icons[key] ?? "bi-info-circle-fill"} text-${colors[key] ?? "info"}"></i>
          <span>${text}</span>
        </div>`,
      didOpen: (popup) => {
        popup.addEventListener("mouseenter", Swal.stopTimer);
        popup.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  },
  success: (text) => toast.show(text, "success"),
  error:   (text) => toast.show(text, "error"),
  warning: (text) => toast.show(text, "warning"),
  info:    (text) => toast.show(text, "info"),
};

/* ── API principal ── */

const Alert = {

  show,
  alert: (text, type = "info", cb = null) => show(text, type, cb),

  /* ── Modales semánticos ── */
  success: (text, cb) => show(text, "success", cb),
  error:   (text, cb) => show(text, "error",   cb),
  warning: (text, cb) => show(text, "warning", cb),
  info:    (text, cb) => show(text, "info",    cb),

  /** Namespace de toasts no bloqueantes */
  toast,

  /* ── Shortcuts de toast (compatibilidad V1) ── */
  toastSuccess: (msg) => toast.success(msg),
  toastError:   (msg) => toast.error(msg),
  toastInfo:    (msg) => toast.info(msg),
  toastWarning: (msg) => toast.warning(msg),

  /* ── Confirmación ── */

  /**
   * Modal de confirmación genérico.
   * Soporta callback Y await.
   * @param {string}   title
   * @param {string}   [question=""]
   * @param {Function} [cb]
   * @param {string}   [type="warning"]
   * @returns {Promise<boolean>}
   * @example
   * const ok = await Alert.confirm("¿Eliminar?", "No se puede deshacer");
   * if (ok) eliminar();
   */
  confirm(title, question = "", cb = null, type = "warning") {
    const key = resolveType(type);
    return Swal.fire({
      ...baseOptions(key),
      title,
      text:              question || undefined,
      showCancelButton:  true,
      confirmButtonText: config.swal.button.confirm,
      cancelButtonText:  config.swal.button.cancel,
    }).then((r) => {
      if (r.isConfirmed && typeof cb === "function") cb();
      return r.isConfirmed;
    });
  },

  /** Confirmación pre-definida de inserción */
  confirmInsert: (cb = null) =>
    Alert.confirm("Confirmar guardado", config.lang?.alert?.questionSave ?? "¿Está seguro de guardar este registro?", cb),

  /** Confirmación pre-definida de actualización */
  confirmUpdate: (cb = null) =>
    Alert.confirm("Confirmar actualización", config.lang?.alert?.questionUpdate ?? "¿Está seguro de actualizar este registro?", cb),

  /** Confirmación pre-definida de eliminación */
  confirmDelete: (cb = null) =>
    Alert.confirm(config.lang?.alert?.deleteTitle ?? "Eliminar registro", config.lang?.alert?.questionDelete ?? "¿Está seguro de eliminar este registro?", cb),

  /**
   * Confirmación de eliminación mostrando el nombre del registro.
   * @param {string} name
   * @param {Function} [cb]
   */
  confirmDeleteByName: (name = "", cb = null) =>
    Alert.confirm(
      config.lang?.alert?.deleteTitle ?? "Eliminar registro",
      `¿Seguro que desea eliminar <b>${String(name).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]))}</b>?`,
      cb
    ),

  /* ── Loading ── */

  /** Muestra indicador de carga bloqueante */
  loading: (open = true) => {
    if (!open) { if (Swal.isVisible()) Swal.close(); return; }
    Swal.fire({
      title:             config.messages.loading.title,
      html:              `<span class="text-muted small">${config.messages.loading.subtitle}</span>`,
      allowOutsideClick: false,
      allowEscapeKey:    false,
      showConfirmButton: false,
      backdrop:          config.swal.backdrop,
      didOpen:           () => Swal.showLoading(),
    });
  },

  /** Cierra cualquier alerta o loading activo */
  close: () => Swal.close(),

  /** Alias para compatibilidad */
  loadingOpen:  () => Alert.loading(true),
  loadingClose: () => Alert.loading(false),

  /** @returns {void} */
  init() {
    if (typeof Swal === "undefined") {
      console.warn("[Alert] SweetAlert2 no está disponible.");
    }
  },
};

export default Object.freeze(Alert);
