import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import config from "../core/config";

/**
 * @module Codes
 * @description Helper para generación de códigos de barras y códigos QR.
 */

const Codes = {
	/**
	 * Genera un código de barras
	 */
	barcode: (el, value, options = {}) => {
		const element = typeof el === "string" ? document.querySelector(el) : el;
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
	},

	/**
	 * Genera un QR Code usando qrcode en un canvas
	 */
	qrCanvas: async (el, text, options = {}) => {
		const element = typeof el === "string" ? document.querySelector(el) : el;
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
	},

	/**
	 * Genera un QR Code como imagen
	 */
	qrImage: async (el, text, options = {}) => {
		const element = typeof el === "string" ? document.querySelector(el) : el;
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
	},

	/**
	 * Limpia el contenido del elemento
	 */
	clear: (el) => {
		const element = typeof el === "string" ? document.querySelector(el) : el;
		if (!element) return;

		if (element.tagName === "IMG") element.src = "";
		else element.innerHTML = "";
	},
};

export default Codes;
