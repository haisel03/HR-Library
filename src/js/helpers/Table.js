import $ from "jquery";
import config from "../core/config";
import Alert from "./Alert";

/**
 * @module Table
 * @description Helper avanzado para DataTables con utilidades, acciones, modales y plugins.
 */

const Table = {
	_plugins: [],

	/**
	 * Registra un plugin
	 */
	use: (plugin) => {
		if (typeof plugin === "function") {
			plugin(Table);
			Table._plugins.push(plugin);
		}
	},

	/**
	 * Normaliza cualquier input a jQuery
	 */
	_tbl: (el) => {
		if (!el) return $();
		if (el instanceof $) return el;
		if (el instanceof HTMLElement) return $(el);
		return $(el);
	},

	/**
	 * Obtiene instancia DataTable si existe
	 */
	_dt: (el) => {
		const $t = Table._tbl(el);
		return $.fn.DataTable.isDataTable($t) ? $t.DataTable() : null;
	},

	/**
	 * Inicializa todas las tablas dentro de un scope
	 */
	init: (scope = document) => {
		$(scope)
			.find('table[data-target="dt"]')
			.each((_, el) => Table.initTable(el));
	},

	/**
	 * Inicializa una tabla DataTable
	 */
	initTable: (el, options = {}) => {
		const $table = Table._tbl(el);
		if (!$table.length) return null;

		if ($.fn.DataTable.isDataTable($table)) {
			return $table.DataTable();
		}

		return $table.DataTable({
			language: config.datatables.base.language,
			...config.datatables.base,
			drawCallback: function () {
				if (window.feather) feather.replace();
			},
			...options,
		});
	},

	/**
	 * Destruye una DataTable
	 */
	destroy: (el) => {
		const dt = Table._dt(el);
		if (dt) dt.clear().destroy();
	},

	/**
	 * Recarga datos vía AJAX
	 */
	reload: (el, resetPaging = false) => {
		const dt = Table._dt(el);
		if (dt?.ajax) dt.ajax.reload(null, !resetPaging);
	},

	/**
	 * Verifica si una tabla está inicializada
	 */
	isInitialized: (el) => $.fn.DataTable.isDataTable(Table._tbl(el)),

	/**
	 * Crea una columna estándar
	 */
	col: (data, title = "", options = {}) => {
		const {
			render,
			icon,
			iconClass = "",
			className = "",
			orderable = true,
			width,
			tooltip,
			autoIcon = true
		} = options;

		const defaultIcons = {
			name: "bi bi-person",
			email: "bi bi-envelope",
			date: "bi bi-calendar"
		};

		const finalIcon = icon || (autoIcon ? defaultIcons[data] : null);
		let finalTitle = title;

		if (finalIcon) {
			finalTitle = `
				<span class="dt-title ${iconClass}" ${tooltip ? `title="${tooltip}"` : ""}>
					<i class="${finalIcon}"></i>
					<span>${title}</span>
				</span>
			`;
		}

		const column = { data, title: finalTitle, orderable };
		if (className) column.className = className;
		if (width) column.width = width;
		if (typeof render === "function") column.render = render;

		return column;
	},

	/**
	 * Columna de selección
	 */
	checkbox: () => ({
		data: null,
		orderable: false,
		className: "text-center",
		width: "30px",
		render: () => `<input type="checkbox" class="dt-check">`
	}),

	/**
	 * Crea columna de acciones
	 */
	actions: (options = {}) => {
		const cfg = Array.isArray(options) ? { actions: options } : options;
		const {
			actions = cfg.actionsDefault || ["view", "edit", "delete"],
			className = "text-center",
			width = "120px",
			renderActions,
			title = "Acciones",
			icon = "bi bi-gear"
		} = cfg;

		return Table.col(null, title, {
			icon,
			className,
			width,
			orderable: false,
			autoIcon: false,
			render: (data, type, row) => {
				if (typeof renderActions === "function") return renderActions(data, type, row);

				const list = typeof actions === "function" ? actions(row) : actions;

				return `
					<div class="table-actions">
						${list.map((key) => {
							const btn = typeof key === "string" ? config.dt_actions[key] : key;
							if (!btn) return "";
							return `
								<a href="#"
								   data-action="${btn.action}"
								   class="${btn.class} text-decoration-none fs-4"
								   title="${btn.title}">
									<i class="bi ${btn.icon} align-middle"></i>
								</a>
							`;
						}).join("")}
					</div>
				`;
			}
		});
	},

	/**
	 * Obtiene los datos de una fila
	 */
	row: (el) => {
		let $tr = $(el).closest("tr");
		if ($tr.hasClass("child")) $tr = $tr.prev();
		const dt = Table._dt($tr.closest("table"));
		return dt ? dt.row($tr).data() : null;
	},

	/**
	 * Maneja eventos de acciones
	 */
	onAction: (el, callback) => {
		const $table = Table._tbl(el);
		$table.off("click.tableActions")
			.on("click.tableActions", "[data-action]", async (e) => {
				e.preventDefault();
				const btn = e.currentTarget;
				const action = $(btn).data("action");
				const row = Table.row(btn);
				const cfg = config.dt_actions[action];

				if (cfg?.confirm) {
					const ok = await Alert.confirm(cfg.confirm.title, cfg.confirm.text);
					if (!ok) return;
				}
				callback({ action, row, button: btn });
			});
	},

	/**
	 * Bulk Actions
	 */
	getChecked: (el) => {
		const dt = Table._dt(el);
		const rows = [];
		if (!dt) return rows;
		dt.rows().every(function () {
			const $node = $(this.node());
			if ($node.find(".dt-check").prop("checked")) rows.push(this.data());
		});
		return rows;
	},

	/**
	 * Modales integrados
	 */
	modal: {
		open: (id, data = {}) => {
			const $modal = $(`#${id}`);
			Object.entries(data).forEach(([key, value]) => {
				$modal.find(`[name="${key}"]`).val(value);
			});
			$modal.modal("show");
		},
		close: (id) => $(`#${id}`).modal("hide"),
	},

	/**
	 * Row Management
	 */
	addRow: (el, row) => {
		const dt = Table._dt(el);
		if (dt) dt.row.add(row).draw(false);
	},
	removeRow: (el, trigger) => {
		const dt = Table._dt(el);
		const $tr = $(trigger).closest("tr");
		if (dt) dt.row($tr).remove().draw(false);
	},
	updateRow: (el, trigger, data) => {
		const dt = Table._dt(el);
		const $tr = $(trigger).closest("tr");
		if (dt) dt.row($tr).data(data).draw(false);
	},
	refresh: (el, data = []) => {
		const dt = Table._dt(el);
		if (!dt) return;
		dt.clear().rows.add(data).draw();
	},

	/**
	 * State & UI
	 */
	selected: (el) => {
		const dt = Table._dt(el);
		return dt ? dt.rows({ selected: true }).data().toArray() : [];
	},
	clearSelection: (el) => {
		const dt = Table._dt(el);
		if (dt?.rows) dt.rows().deselect();
	},
	toggleLoading: (el, state = true) => {
		Table._tbl(el).closest(".dataTables_wrapper").toggleClass("dt-loading", state);
	},
	buttons: (type = "buttons") => config.datatables[type] || [],
};

export default Table;
