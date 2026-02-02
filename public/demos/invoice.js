$(document).on("click", "#printInvoice", function (e) {
	e.preventDefault();
	HR.printEl("#invoice", {
		noPrintSelector: ".no-print",
	});
});

