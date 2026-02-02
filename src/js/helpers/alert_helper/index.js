/**
 * @module alert_helper
 * @description
 * Facade desacoplada para alertas (SweetAlert, Toastify, Notyf)
 */

import validation from "../validation_helper";
import config from "../../core/config";

import * as sweetalert from "./engines/sweetalert.engine";
import * as toastify from "./engines/toastify.engine";
import * as notyf from "./engines/notyf.engine";

/** @type {Record<AlertEngine, any>} */
const engines = {
  sweetalert,
  toastify,
  notyf,
};

/**
 * Retorna el engine activo
 * @returns {object}
 */
const engine = () => engines[config.alerts.engine] || sweetalert;

/**
 * Muestra alerta modal
 */
const alert = (text, type = "p", cb = null) => {
  text = validation.isNullOrEmpty(text)
    ? config.messages.default
    : text;

  return engine()
    .alert?.(text, type)
    ?.then?.((r) => {
      if (r && typeof cb === "function") cb();
      return r;
    });
};

/**
 * Muestra toast
 */
const toast = (text, type = "p") =>
  engine().toast?.(text, type);

/**
 * Confirmación
 */
const confirm = (title, question, cb, type = "w") =>
  engine()
    .confirm?.(title, question, type)
    ?.then?.((r) => {
      if (r && typeof cb === "function") cb();
      return r;
    });

/**
 * Loading
 */
const loadingOpen = () => engine().loadingOpen?.();
const loadingClose = () => engine().loadingClose?.();

export default {
  alert,
  toast,
  confirm,
  loadingOpen,
  loadingClose,
};
