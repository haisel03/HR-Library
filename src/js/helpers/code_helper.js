import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import config from "../core/config";

/**
 * @namespace codes
 * @description
 * Helper para generación de códigos de barras y códigos QR
 * Soporta JsBarcode, qrcode (canvas/img)
 */
const codes = {};

/* =====================================================
   BARCODE (JsBarcode)
===================================================== */

/**
 * Genera un código de barras
 *
 * @param {HTMLElement|string} el Elemento DOM o selector
 * @param {string|number} value Valor a codificar
 * @param {Object} [options={}] Opciones personalizadas
 * @param {string} [options.format] Formato del barcode
 * @returns {boolean} true si se genera correctamente
 *
 * @example
 * codes.barcode("#barcode", "123456789")
 */
codes.barcode = (el, value, options = {}) => {
  const element =
    typeof el === "string" ? document.querySelector(el) : el;

  if (!element || value === undefined || value === null) return false;

  const cfg = config.codes.barcode;

  const format = options.format || cfg.defaultFormat;

  if (!cfg.supportedFormats.includes(format)) {
    console.warn(`Barcode format no soportado: ${format}`);
    return false;
  }

  JsBarcode(element, String(value), {
    format,
    ...cfg.defaults,
    ...options,
  });

  return true;
};

/* =====================================================
   QR CODE (Canvas / IMG)
===================================================== */

/**
 * Genera un QR Code usando qrcode (canvas o img)
 *
 * @param {HTMLElement|string} el Elemento destino (canvas o img)
 * @param {string} text Texto a codificar
 * @param {Object} [options={}] Opciones adicionales
 * @returns {Promise<boolean>}
 *
 * @example
 * codes.qrCanvas("#qr", "https://example.com")
 */
codes.qrCanvas = async (el, text, options = {}) => {
  const element =
    typeof el === "string" ? document.querySelector(el) : el;

  if (!element || !text) return false;

  const cfg = config.codes.qr.canvas;

  try {
    await QRCode.toCanvas(element, text, {
      ...cfg,
      ...options,
    });

    return true;
  } catch (err) {
    console.error("Error generando QR canvas:", err);
    return false;
  }
};

/**
 * Genera un QR Code como imagen (img)
 *
 * @param {HTMLElement|string} el Elemento img o selector
 * @param {string} text Texto a codificar
 * @param {Object} [options={}] Opciones adicionales
 * @returns {Promise<boolean>}
 *
 * @example
 * codes.qrImage("#qrImg", "Texto QR")
 */
codes.qrImage = async (el, text, options = {}) => {
  const element =
    typeof el === "string" ? document.querySelector(el) : el;

  if (!element || !text) return false;

  const cfg = config.codes.qr.canvas;

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      ...cfg,
      ...options,
    });

    element.src = dataUrl;
    return true;
  } catch (err) {
    console.error("Error generando QR image:", err);
    return false;
  }
};


/* =====================================================
   UTILIDADES
===================================================== */

/**
 * Limpia el contenido del elemento
 *
 * @param {HTMLElement|string} el Elemento o selector
 */
codes.clear = (el) => {
  const element =
    typeof el === "string" ? document.querySelector(el) : el;

  if (!element) return;

  if (element.tagName === "IMG") element.src = "";
  else element.innerHTML = "";
};

/* =====================================================
   EXPORT
===================================================== */

export default codes;
