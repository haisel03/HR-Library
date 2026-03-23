/**
 * @module Codes
 * @description
 * Helper para generación de códigos de barras (JsBarcode) y QR (qrcode).
 * No depende de config.codes — los defaults están aquí embebidos para evitar
 * referencias a una sección que no existe en config.js.
 *
 * @example
 * Codes.barcode("#svg", "123456789");
 * await Codes.qrCanvas("#canvas", "https://ejemplo.com");
 * await Codes.qrImage("#img", "Texto QR");
 * const url = await Codes.qrDataUrl("Texto QR");
 *
 * @version 3.0.0
 */

import JsBarcode from "jsbarcode";
import QRCode    from "qrcode";

/* ── Defaults internos ── */

const _BARCODE_FORMATS = Object.freeze([
  "CODE128", "CODE39", "EAN13", "EAN8", "UPC", "ITF14", "MSI", "pharmacode",
]);

const _BARCODE_DEFAULTS = Object.freeze({
  format:       "CODE128",
  width:        2,
  height:       60,
  displayValue: true,
  fontSize:     14,
  margin:       10,
});

const _QR_DEFAULTS = Object.freeze({
  width:  200,
  margin: 2,
  color:  { dark: "#000000", light: "#ffffff" },
});

/* ── Resolución de elemento ── */
const _el = (target) => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  return document.querySelector(target);
};

/* ── Codes ── */

const Codes = {

  /* ── Código de Barras ── */

  /**
   * Genera un código de barras en un SVG o canvas.
   * @param {string|HTMLElement} target
   * @param {string|number}      value
   * @param {Object}             [options={}]  Opciones de JsBarcode.
   * @returns {boolean}
   * @example Codes.barcode("#miSvg", "ABC-001", { format: "CODE39", height: 80 });
   */
  barcode(target, value, options = {}) {
    const el = _el(target);
    if (!el)                                   { console.warn("[Codes] Elemento no encontrado:", target); return false; }
    if (value === null || value === undefined || value === "") { console.warn("[Codes] Valor de barcode vacío."); return false; }

    const format = options.format ?? _BARCODE_DEFAULTS.format;
    if (!_BARCODE_FORMATS.includes(format)) {
      console.warn(`[Codes] Formato no soportado: "${format}". Válidos: ${_BARCODE_FORMATS.join(", ")}`);
      return false;
    }

    try {
      JsBarcode(el, String(value), { ..._BARCODE_DEFAULTS, ...options, format });
      return true;
    } catch (error) {
      console.error("[Codes] Error al generar barcode:", error.message);
      return false;
    }
  },

  /* ── QR Code ── */

  /**
   * Genera un QR Code en un canvas.
   * @param {string|HTMLCanvasElement} target
   * @param {string} text
   * @param {Object} [options={}]
   * @returns {Promise<boolean>}
   */
  async qrCanvas(target, text, options = {}) {
    const el = _el(target);
    if (!el || !text) { console.warn("[Codes] qrCanvas: elemento o texto inválido."); return false; }
    try {
      await QRCode.toCanvas(el, text, { ..._QR_DEFAULTS, ...options });
      return true;
    } catch (error) {
      console.error("[Codes] Error al generar QR canvas:", error.message);
      return false;
    }
  },

  /**
   * Genera un QR Code y lo asigna como src de un <img>.
   * @param {string|HTMLImageElement} target
   * @param {string} text
   * @param {Object} [options={}]
   * @returns {Promise<boolean>}
   */
  async qrImage(target, text, options = {}) {
    const el = _el(target);
    if (!el || !text) { console.warn("[Codes] qrImage: elemento o texto inválido."); return false; }
    try {
      const dataUrl = await QRCode.toDataURL(text, { ..._QR_DEFAULTS, ...options });
      el.src = dataUrl;
      return true;
    } catch (error) {
      console.error("[Codes] Error al generar QR imagen:", error.message);
      return false;
    }
  },

  /**
   * Genera un QR Code como Data URL sin necesidad de un elemento DOM.
   * @param {string} text @param {Object} [options={}]
   * @returns {Promise<string|null>}
   */
  async qrDataUrl(text, options = {}) {
    if (!text) return null;
    try {
      return await QRCode.toDataURL(text, { ..._QR_DEFAULTS, ...options });
    } catch (error) {
      console.error("[Codes] Error al generar QR Data URL:", error.message);
      return null;
    }
  },

  /* ── Utilidades ── */

  /**
   * Limpia el contenido de un elemento de código (SVG, canvas, img).
   * @param {string|HTMLElement} target
   */
  clear(target) {
    const el = _el(target);
    if (!el) return;
    const tag = el.tagName.toUpperCase();
    if (tag === "IMG")    { el.src = ""; return; }
    if (tag === "CANVAS") { el.getContext("2d")?.clearRect(0, 0, el.width, el.height); return; }
    el.innerHTML = "";
  },

  /** @returns {string[]} Formatos de barcode soportados */
  supportedFormats: () => [..._BARCODE_FORMATS],

  /** @returns {void} */
  init() {},
};

export default Object.freeze(Codes);
