import * as XLSX from "xlsx";

/**
 * @module Excel
 * @description Helper functions for Excel operations.
 */

const Excel = {
	/**
	 * Exporta datos JSON a Excel (una sola hoja)
	 */
	exportToExcel: (data, filename = "data.xlsx") => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, filename);
	},

	/**
	 * Convierte un archivo Excel (una hoja) a JSON
	 */
	excelToJson: (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				const json = XLSX.utils.sheet_to_json(worksheet);
				resolve(json);
			};
			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	},

	/**
	 * Convierte JSON a Excel (alias de exportToExcel)
	 */
	jsonToExcel: (data, filename = "data.xlsx") => {
		Excel.exportToExcel(data, filename);
	},

	/**
	 * Convierte JSON a CSV
	 */
	/**
	 * Convierte datos JSON a CSV y descarga el archivo.
	 * @param {Object[]} data
	 * @param {string} [filename="data.csv"]
	 */
	jsonToCsv: (data, filename = "data.csv") => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook  = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		// BUG corregido: el segundo arg debe ser el filename (string), no un objeto de opciones
		XLSX.writeFile(workbook, filename, { bookType: "csv" });
	},

	/**
	 * Convierte un archivo Excel con múltiples hojas a JSON
	 */
	excelToJsonMultiple: (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });
				const result = {};
				workbook.SheetNames.forEach((name) => {
					const sheet = workbook.Sheets[name];
					result[name] = XLSX.utils.sheet_to_json(sheet);
				});
				resolve(result);
			};
			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	},

	/**
	 * Convierte un objeto JSON con múltiples hojas a Excel
	 */
	jsonToExcelMultiple: (sheets, filename = "data.xlsx") => {
		const workbook = XLSX.utils.book_new();
		Object.entries(sheets).forEach(([name, data]) => {
			const ws = XLSX.utils.json_to_sheet(data);
			XLSX.utils.book_append_sheet(workbook, ws, name);
		});
		XLSX.writeFile(workbook, filename);
	},

	/**
	 * Inicializa botones con atributo `data-excel`
	 */
	init: () => {
		document.querySelectorAll("[data-excel]").forEach((el) => {
			el.addEventListener("click", () => {
				const data = JSON.parse(el.dataset.excel);
				const filename = el.dataset.filename || "data.xlsx";
				Excel.exportToExcel(data, filename);
			});
		});
	},
};

export default Excel;
