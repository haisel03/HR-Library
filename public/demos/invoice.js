$(document).on("click", "#printInvoice", function (e) {
	e.preventDefault();
	$Print.print("#invoice", {
		noPrintSelector: ".no-print",
	});
});

