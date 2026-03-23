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
			// Formato no soportado — retornar false es suficiente señal para el caller
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
			// Error silenciado — caller debe manejar el false de retorno
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
			// Error silenciado — caller debe manejar el false de retorno
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
