/**
 * @module jsbarcode
 * @description
 * Expone JsBarcode globalmente con defaults de Coffee Schools.
 */
import JsBarcode from "jsbarcode";

// ── Defaults ──────────────────────────────────────────────────

const _defaults = Object.freeze({
  format: "CODE128",
  width: 2,
  height: 60,
  displayValue: true,
  fontOptions: "",
  font: "Inter, sans-serif",
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 12,
  background: "#ffffff",
  lineColor: "#3d1d08",
  margin: 8,
});

window.JsBarcode = JsBarcode;
window.CS_BARCODE_DEFAULTS = _defaults;

export default JsBarcode;
export { _defaults as BARCODE_DEFAULTS };
