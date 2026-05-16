/**
 * @file invoice.js
 * $/
 */

$(document).on("click", "#printInvoice", function (e) {
	e.preventDefault();
	// App.printEl(selector, título)
	App.printEl("#invoice", "Factura");
});

