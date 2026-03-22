/**
 * @module Alert
 * @description
 * Sistema de alertas y notificaciones basado exclusivamente en SweetAlert2.
 *
 * Expone una API limpia con métodos semánticos:
 * - Modales: `Alert.success()`, `Alert.error()`, `Alert.warning()`, `Alert.info()`
 * - Toasts:  `Alert.toast.success()`, `Alert.toast.error()`, etc.
 * - Utilidad: `Alert.confirm()`, `Alert.loading()`, `Alert.close()`
 *
 * Se accede desde HR como `HR.$Alert` o desde los demos directamente
 * si se importa: `import Alert from "./helpers/Alert"`.
 *
 * @example
 * // Desde un demo externo via HR:
 * HR.$Alert.success("Guardado correctamente");
 * HR.$Alert.toast.success("Cambios aplicados");
 * HR.$Alert.confirm("¿Eliminar?", "Esta acción no se puede deshacer").then(ok => { ... });
 *
 * @example
 * // Acceso directo (import):
 * import Alert from "./helpers/Alert";
 * Alert.error("Ocurrió un error inesperado");
 */

import Swal from "sweetalert2";
import config from "../core/config";

/* =====================================================
   INTERNOS
===================================================== */

/**
 * Mapeo de tipo semántico → clave de config.alerts
 * @private
 * @type {Object.<string, string>}
 */
const TYPE_MAP = {
	success: "s",
	error:   "d",
	warning: "w",
	info:    "i",
	primary: "p",
};

/**
 * Resuelve un tipo semántico ("success") o clave corta ("s") a su clave de config.
 * @param {string} type
 * @returns {string}
 * @private
 */
const resolveType = (type) => TYPE_MAP[type] ?? type;

/**
 * Construye opciones base de SweetAlert2 a partir de un tipo.
 * @param {string} key  Clave de config.alerts ("s", "d", "w", "i", "p")
 * @returns {Object}
 * @private
 */
const baseOptions = (key) => ({
	backdrop:    config.swal.backdrop,
	background:  config.swal.background,
	allowOutsideClick: config.swal.clickOutside,
	allowEscapeKey:    config.swal.escapeKey,
	customClass: {
		confirmButton: `btn btn-${config.alerts.colors[key]} px-4`,
		cancelButton:  `btn btn-outline-secondary px-4`,
		actions:       "gap-2",
	},
	buttonsStyling: false,
});

/* =====================================================
   MODAL
===================================================== */

/**
 * Muestra un modal de alerta con ícono y título configurados.
 *
 * @param {string} text   Mensaje a mostrar
 * @param {string} [type="info"]  Tipo semántico: "success" | "error" | "warning" | "info" | "primary"
 *                                o clave corta: "s" | "d" | "w" | "i" | "p"
 * @param {Function} [cb]  Callback ejecutado si el usuario confirma
 * @returns {Promise<boolean>}
 *
 * @example
 * Alert.show("Registro guardado", "success");
 * Alert.show("Falló la operación", "error", () => location.reload());
 */
const show = (text, type = "info", cb = null) => {
	const key = resolveType(type);
	const { icons, titles, colors } = config.alerts;

	const msg = !text || String(text).trim() === ""
		? config.messages.default
		: text;

	return Swal.fire({
		...baseOptions(key),
		html: `
			<div class="d-flex align-items-start gap-3 text-start">
				<i class="bi ${icons[key]} fs-2 text-${colors[key]} flex-shrink-0 mt-1"></i>
				<div>
					<strong class="d-block mb-1">${titles[key]}</strong>
					<span class="text-muted small">${msg}</span>
				</div>
			</div>
		`,
		confirmButtonText: config.swal.button.confirm,
	}).then((r) => {
		if (r.isConfirmed && typeof cb === "function") cb();
		return r.isConfirmed;
	});
};

/* =====================================================
   TOAST
===================================================== */

/**
 * Namespace de toasts no bloqueantes.
 * @namespace Alert.toast
 */
const toast = {
	/**
	 * Muestra un toast genérico.
	 *
	 * @param {string} text
	 * @param {string} [type="info"]
	 * @returns {Promise}
	 *
	 * @example
	 * Alert.toast.show("Archivo subido", "success");
	 */
	show: (text, type = "info") => {
		const key = resolveType(type);
		const { icons, colors } = config.alerts;

		return Swal.fire({
			toast: true,
			position: config.swal.toast.position,
			timer: config.swal.toast.timer,
			timerProgressBar: true,
			showConfirmButton: false,
			html: `
				<div class="d-flex align-items-center gap-2">
					<i class="bi ${icons[key]} text-${colors[key]}"></i>
					<span>${text}</span>
				</div>
			`,
			didOpen: (popup) => {
				popup.addEventListener("mouseenter", Swal.stopTimer);
				popup.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});
	},

	/**
	 * Toast de éxito.
	 * @param {string} text
	 * @returns {Promise}
	 * @example Alert.toast.success("Guardado");
	 */
	success: (text) => toast.show(text, "success"),

	/**
	 * Toast de error.
	 * @param {string} text
	 * @returns {Promise}
	 * @example Alert.toast.error("Error al procesar");
	 */
	error: (text) => toast.show(text, "error"),

	/**
	 * Toast de advertencia.
	 * @param {string} text
	 * @returns {Promise}
	 * @example Alert.toast.warning("Campos incompletos");
	 */
	warning: (text) => toast.show(text, "warning"),

	/**
	 * Toast de información.
	 * @param {string} text
	 * @returns {Promise}
	 * @example Alert.toast.info("Recuerda guardar");
	 */
	info: (text) => toast.show(text, "info"),
};

/* =====================================================
   API PRINCIPAL
===================================================== */

/**
 * @namespace Alert
 */
const Alert = {

	alert: (text, type = "info", cb = null) => show(text, type, cb),

	/* ---- Modales semánticos ---- */

	/**
	 * Modal de éxito.
	 * @param {string} text
	 * @param {Function} [cb]
	 * @returns {Promise<boolean>}
	 * @example Alert.success("Registro creado exitosamente");
	 */
	success: (text, cb) => show(text, "success", cb),

	/**
	 * Modal de error / peligro.
	 * @param {string} text
	 * @param {Function} [cb]
	 * @returns {Promise<boolean>}
	 * @example Alert.error("No se pudo procesar la solicitud");
	 */
	error: (text, cb) => show(text, "error", cb),

	/**
	 * Modal de advertencia.
	 * @param {string} text
	 * @param {Function} [cb]
	 * @returns {Promise<boolean>}
	 * @example Alert.warning("Revisa los datos antes de continuar");
	 */
	warning: (text, cb) => show(text, "warning", cb),

	/**
	 * Modal de información.
	 * @param {string} text
	 * @param {Function} [cb]
	 * @returns {Promise<boolean>}
	 * @example Alert.info("Tu sesión expirará en 5 minutos");
	 */
	info: (text, cb) => show(text, "info", cb),

	/**
	 * Modal genérico con tipo explícito (clave corta o semántica).
	 * @param {string} text
	 * @param {string} [type="info"]
	 * @param {Function} [cb]
	 * @returns {Promise<boolean>}
	 */
	show,

	/* ---- Toasts ---- */

	/** @type {Object} Namespace de toasts no bloqueantes */
	toast,

	/* ---- Confirmación ---- */

	/**
	 * Muestra un diálogo de confirmación con botones Aceptar / Cancelar.
	 *
	 * @param {string} title    Título del diálogo
	 * @param {string} question Pregunta o descripción
	 * @param {Function} [cb]  Callback ejecutado si el usuario confirma
	 * @param {string} [type="warning"]  Tipo del botón de confirmación
	 * @returns {Promise<boolean>}
	 *
	 * @example
	 * Alert.confirm("¿Eliminar registro?", "Esta acción no se puede deshacer", () => {
	 *   $HR.deleteApi("/users/1");
	 * });
	 *
	 * @example
	 * const ok = await Alert.confirm("¿Continuar?", "Se enviará el formulario");
	 * if (ok) submitForm();
	 */
	confirm: (title, question, cb = null, type = "warning") => {
		const key = resolveType(type);

		return Swal.fire({
			...baseOptions(key),
			title,
			text: question,
			showCancelButton: true,
			confirmButtonText: config.swal.button.confirm,
			cancelButtonText:  config.swal.button.cancel,
		}).then((r) => {
			if (r.isConfirmed && typeof cb === "function") cb();
			return r.isConfirmed;
		});
	},

	/* ---- Loading ---- */

	/**
	 * Muestra un indicador de carga bloqueante.
	 *
	 * @example
	 * Alert.loading();
	 * await $HR.postApi("/save", data);
	 * Alert.close();
	 */
	loading: () => {
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

	/**
	 * Cierra cualquier alerta o loading activo.
	 *
	 * @example
	 * Alert.close();
	 */
	close: () => Swal.close(),
};

export default Alert;
