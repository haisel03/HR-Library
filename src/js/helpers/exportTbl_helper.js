import $ from "jquery";

/**
 * @namespace exportTbl
 * @description Exportaciones de tablas HTML y DataTables
 */
const exportTbl = {
  /* =====================================================
     UTILIDADES
  ===================================================== */

  /**
   * Normaliza a jQuery table
   * @param {string|HTMLElement|JQuery} el
   * @returns {JQuery}
   * @private
   */
  _table(el) {
    if (!el) return $();
    if (el instanceof $) return el;
    if (el instanceof HTMLElement) return $(el);
    return $(el);
  },

  /**
   * Obtiene instancia DataTable si existe
   * @param {JQuery} table
   * @returns {DataTable|null}
   * @private
   */
  _dt(table) {
    return $.fn.DataTable.isDataTable(table) ? table.DataTable() : null;
  },

  /* =====================================================
     EXCEL (XLSX)
  ===================================================== */

  /**
   * Exporta una tabla a Excel
   * @param {string|HTMLElement|JQuery} el
   * @param {string} [filename="tabla.xlsx"]
   */
  excel(el, filename = "tabla.xlsx") {
    if (!window.XLSX) {
      console.error("XLSX no está disponible");
      return;
    }

    const table = this._table(el);
    if (!table.length) return;

    const dt = this._dt(table);

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
      headers = table
        .find("thead th")
        .map((_, th) => th.innerText)
        .get();
      rows = table
        .find("tbody tr")
        .map((_, tr) =>
          $(tr)
            .find("td")
            .map((_, td) => td.innerText)
            .get(),
        )
        .get();
    }

    const data = rows.map((row) =>
      Array.isArray(row) ? row : headers.map((h) => row[h] ?? ""),
    );

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, filename);
  },

  /* =====================================================
     PDF (DataTables Buttons)
  ===================================================== */

  /**
   * Exporta DataTable a PDF
   * @param {string|HTMLElement|JQuery} el
   * @param {Object} [options]
   * @param {string|null} [options.title=null]
   * @param {string} [options.filename="tabla.pdf"]
   */
  pdf(el, options = {}) {
    const table = this._table(el);
    const dt = this._dt(table);
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

  /* =====================================================
     CSV
  ===================================================== */

  /**
   * Exporta DataTable a CSV
   * @param {string|HTMLElement|JQuery} el
   * @param {string} [filename="tabla.csv"]
   */
  csv(el, filename = "tabla.csv") {
    const table = this._table(el);
    const dt = this._dt(table);
    if (!dt) return;

    dt.button().add(0, {
      extend: "csvHtml5",
      filename,
    });

    dt.button(0).trigger();
    dt.buttons(0).remove();
  },

  /* =====================================================
     JSON
  ===================================================== */

  /**
   * Retorna los datos visibles como JSON
   * @param {string|HTMLElement|JQuery} el
   * @returns {Array}
   */
  json(el) {
    const table = this._table(el);
    const dt = this._dt(table);
    if (!dt) return [];

    return dt.rows({ search: "applied" }).data().toArray();
  },
};

export default exportTbl;
