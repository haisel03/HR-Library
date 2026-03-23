/**
 * @file invoice.js
 * CAMBIOS v3:
 * - $Print.print(selector, options) → $Print.element(selector, title)
 *   La API de Print tiene element(selector, title) no print(selector, options)
 *   noPrintSelector no es un parámetro soportado — si se necesita ocultar
 *   elementos antes de imprimir, usar CSS @media print o Dom.hide() antes.
 */

$(document).on("click", "#printInvoice", function (e) {
	e.preventDefault();
	// $Print.element(selector, título)
	$Print.element("#invoice", "Factura");
});
