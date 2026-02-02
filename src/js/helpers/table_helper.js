// src/js/helpers/table_helper.js
import $ from "jquery";
import config from "../core/config";
import lang from "../core/spanish";

/**
 * @namespace table
 * @description Helper para inicializar y gestionar DataTables
 */
const table = {
	/* =====================================================
		 UTILIDADES
	===================================================== */

	/**
	 * Normaliza un elemento a jQuery table
	 * @param {string|HTMLElement|JQuery} el
	 * @returns {JQuery}
	 * @private
	 */
	_tbl(el) {
		if (!el) return $();
		if (el instanceof $) return el;
		if (el instanceof HTMLElement) return $(el);
		return $(el);
	},

	/**
	 * Obtiene instancia DataTable si existe
	 * @param {string|HTMLElement|JQuery} el
	 * @returns {DataTable|null}
	 * @private
	 */
	_dt(el) {
		const $t = this._tbl(el);
		return $.fn.DataTable.isDataTable($t) ? $t.DataTable() : null;
	},

	/* =====================================================
		 INIT
	===================================================== */

	/**
	 * Inicializa todas las tablas dentro de un scope
	 * @param {HTMLElement|Document} [scope=document]
	 */
	init(scope = document) {
		$(scope)
			.find('table[data-target="dt"]')
			.each((_, el) => {
				this.initTable(el);
			});
	},

	/**
	 * Inicializa una tabla DataTable
	 * @param {string|HTMLElement|JQuery} el
	 * @param {Object} [options={}]
	 * @returns {DataTable|null}
	 *
	 * @example
	 * HR.table.initTable("#tblUsers", {
	 *   ajax: "/api/users",
	 *   columns: [...]
	 * });
	 */
	initTable(el, options = {}) {
		const table = this._tbl(el);
		if (!table.length) return null;

		if ($.fn.DataTable.isDataTable(table)) {
			return table.DataTable();
		}

		return table.DataTable({
			language: config.datatables.base.language,
			...config.datatables.base,

			...options,
		});
	},

	/* =====================================================
		 CORE
	===================================================== */

	/**
	 * Destruye una DataTable
	 * @param {string|HTMLElement|JQuery} el
	 */
	destroy(el) {
		const dt = this._dt(el);
		if (dt) {
			dt.clear().destroy();
		}
	},

	/**
	 * Recarga una DataTable vía AJAX
	 * @param {string|HTMLElement|JQuery} el
	 * @param {boolean} [resetPaging=false]
	 */
	reload(el, resetPaging = false) {
		const dt = this._dt(el);
		if (dt && dt.ajax) {
			dt.ajax.reload(null, !resetPaging);
		}
	},

	/**
	 * Indica si una tabla está inicializada
	 * @param {string|HTMLElement|JQuery} el
	 * @returns {boolean}
	 */
	isInitialized(el) {
		return $.fn.DataTable.isDataTable(this._tbl(el));
	},

	/* =====================================================
		 COLUMN HELPERS
	===================================================== */

	/**
	 * Define una columna estándar
	 * @param {string|null} data
	 * @param {string} title
	 * @param {Function|null} [render=null]
	 * @returns {Object}
	 *
	 * @example
	 * HR.table.col("name", "Nombre")
	 */
	col(data, title, render = null) {
		return {
			data,
			title,
			...(render && { render }),
		};
	},

	/**
	 * Define una columna de acciones
	 * @param {Function} render
	 * @returns {Object}
	 *
	 * @example
	 * HR.table.actions((_, __, row) => `<button>Editar</button>`)
	 */
	actions(render) {
		return {
			data: null,
			title: "",
			orderable: false,
			searchable: false,
			render,
		};
	},

	/* =====================================================
		 BUTTONS
	===================================================== */

	/**
	 * Retorna botones base desde config
	 * @param {"buttons"|"icons"} [type="buttons"]
	 * @returns {Array}
	 */
	buttons(type = "buttons") {
		return config.datatables[type] || [];
	},

	/* =====================================================
		 STATE
	===================================================== */

	/**
	 * Retorna filas seleccionadas (plugin select)
	 * @param {string|HTMLElement|JQuery} el
	 * @returns {Array}
	 */
	selected(el) {
		const dt = this._dt(el);
		return dt ? dt.rows({ selected: true }).data().toArray() : [];
	},

	/**
	 * Limpia selección
	 * @param {string|HTMLElement|JQuery} el
	 */
	clearSelection(el) {
		const dt = this._dt(el);
		if (dt?.rows) dt.rows().deselect();
	},
};

export default table;
