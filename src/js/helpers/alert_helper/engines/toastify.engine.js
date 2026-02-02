import Toastify from "toastify-js";
import config from "../../../core/config";

/**
 * Toastify solo soporta toast
 */
export const toast = (text, type) =>
  Toastify({
    text,
    duration: 4000,
    gravity: "top",
    position: "right",
    className: `bg-${config.alerts.colors[type]}`,
    stopOnFocus: true,
  }).showToast();

/**
 * No soportados
 */
export const alert = () =>
  console.warn("Toastify no soporta alert modal");

export const confirm = () =>
  console.warn("Toastify no soporta confirm");

export const loadingOpen = () =>
  console.warn("Toastify no soporta loading");

export const loadingClose = () => { };
