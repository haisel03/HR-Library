/**
 * @module qrcode
 * @description
 * Expone QRCode.js globalmente con defaults de HR-Library.
 */
import QRCode from "qrcode";

// ── Defaults ──────────────────────────────────────────────────

const _defaults = Object.freeze({
	errorCorrectionLevel: "M",
	type: "image/png",
	quality: 0.92,
	margin: 2,
	color: {
		dark: "#3d1d08",
		light: "#ffffff",
	},
	width: 200,
});

window.QRCode = QRCode;
window.CS_QR_DEFAULTS = _defaults;

export default QRCode;
export { _defaults as QR_DEFAULTS };
