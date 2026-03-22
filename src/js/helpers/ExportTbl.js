import $ from "jquery";
import Alert from "./Alert";

/**
 * @module ExportTbl
 * @description Exportaciones de tablas HTML y DataTables.
 */

const ExportTbl = {
	/**
	 * Normaliza a jQuery table
	 */
	_table: (el) => {
		if (!el) return $();
		if (el instanceof $) return el;
		if (el instanceof HTMLElement) return $(el);
		return $(el);
	},

	/**
	 * Obtiene instancia DataTable si existe
	 */
	_dt: (table) => ($.fn.DataTable.isDataTable(table) ? table.DataTable() : null),

	/**
	 * Exporta una tabla a Excel (requiere XLSX)
	 */
	excel: (el, filename = "tabla.xlsx") => {
		if (!window.XLSX) {
			Alert.error("XLSX no está disponible — asegúrate de importar el módulo xlsx");
			return;
		}

		const $table = ExportTbl._table(el);
		if (!$table.length) return;

		const dt = ExportTbl._dt($table);
		let headers = [];
		let rows = [];

		if (dt) {
			headers = dt
				.columns(":visible")
				.header()
				.toArray()
				.map((th) => th.innerText.trim());

			rows = dt.rows({ search: "applied" }).data().toArray();
		} else {
			headers = $table
				.find("thead th")
				.map((_, th) => th.innerText)
				.get();
			rows = $table
				.find("tbody tr")
				.map((_, tr) =>
					$(tr)
						.find("td")
						.map((_, td) => td.innerText)
						.get()
				)
				.get();
		}

		const data = rows.map((row) =>
			Array.isArray(row) ? row : headers.map((h) => row[h] ?? "")
		);

		const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
		const wb = XLSX.utils.book_new();

		XLSX.utils.book_append_sheet(wb, ws, "Datos");
		XLSX.writeFile(wb, filename);
	},

	/**
	 * Exporta DataTable a PDF
	 */
	pdf: (el, options = {}) => {
		const $table = ExportTbl._table(el);
		const dt = ExportTbl._dt($table);
		if (!dt) return;

		const cfg = {
			title: null,
			filename: "tabla.pdf",
			...options,
		};

		dt.button().add(0, {
			extend: "pdfHtml5",
			title: cfg.title,
			filename: cfg.filename,
		});

		dt.button(0).trigger();
		dt.buttons(0).remove();
	},

	/**
	 * Exporta DataTable a CSV
	 */
	csv: (el, filename = "tabla.csv") => {
		const $table = ExportTbl._table(el);
		const dt = ExportTbl._dt($table);
		if (!dt) return;

		dt.button().add(0, {
			extend: "csvHtml5",
			filename,
		});

		dt.button(0).trigger();
		dt.buttons(0).remove();
	},

	/**
	 * Retorna los datos visibles como JSON
	 */
	json: (el) => {
		const $table = ExportTbl._table(el);
		const dt = ExportTbl._dt($table);
		if (!dt) return [];

		return dt.rows({ search: "applied" }).data().toArray();
	},
};

export default ExportTbl;
