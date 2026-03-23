import SignaturePad from "signature_pad";
import config from "../core/config.js";

/**
 * @module Signature
 * @description Helper para firmas digitales
 */

const instances = new Map();

const Signature = {
	/**
	 * Inicializa firmas
	 */
	init: (scope = document) => {
		scope.querySelectorAll("canvas[data-signature]").forEach((canvas) => {
			Signature.create(canvas);
		});
	},

	/**
	 * Crea una firma digital
	 */
	create: (el, options = {}) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		if (!canvas || instances.has(canvas)) return null;

		Signature.resize(canvas);

		const pad = new SignaturePad(canvas, {
			...config.signature.base,
			...options,
		});

		instances.set(canvas, pad);
		return pad;
	},

	/**
	 * Redimensiona el canvas
	 */
	resize: (canvas) => {
		const ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext("2d").scale(ratio, ratio);
	},

	/**
	 * Limpia la firma
	 */
	clear: (el) => {
		const pad = Signature.get(el);
		if (pad) pad.clear();
	},

	/**
	 * Retorna la firma en base64
	 */
	toDataURL: (el) => {
		const pad = Signature.get(el);
		return pad && !pad.isEmpty() ? pad.toDataURL() : null;
	},

	/**
	 * Retorna instancia SignaturePad
	 */
	get: (el) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		return instances.get(canvas) ?? null;
	},
};

export default Signature;
