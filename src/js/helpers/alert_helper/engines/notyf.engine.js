import { Notyf } from "notyf";
import config from "../../../core/config";

const notyf = new Notyf({
  duration: 4000,
  position: { x: "right", y: "top" },
});

/**
 * @param {string} text
 * @param {AlertType} type
 */
export const toast = (text, type) =>
  notyf.open({
    type: config.alerts.colors[type],
    message: text,
  });

export const alert = toast;

/**
 * Notyf no soporta confirm ni loading
 */
export const confirm = () =>
  console.warn("Notyf no soporta confirm");

export const loadingOpen = () =>
  console.warn("Notyf no soporta loading");

export const loadingClose = () => { };
