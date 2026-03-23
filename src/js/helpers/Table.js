/**
 * @module Table
 * @description
 * Helper para DataTables en HR Library.
 * Fusiona las columnas tipadas ricas de V1 (money, date, badge, boolean, status,
 * exportButtons, search) con la gestión de filas y el onAction integrado de V2
 * (que usa dt_actions de config para confirmar automáticamente antes de eliminar).
 *
 * @example
 * Table.initTable("#tblUsuarios", {
 *   serverSide: true,
 *   ajax:       config.apiUrl("/usuarios"),
 *   columns: [
 *     Table.index(),
 *     Table.col("nombre", "Nombre", { icon: "bi bi-person", truncate: 30 }),
 *     Table.money("monto",  "Monto"),
 *     Table.date("creado",  "Fecha"),
 *     Table.status("activo"),
 *     Table.actions(["view","edit","delete"]),
 *   ],
 * });
 *
 * Table.onAction("#tblUsuarios", ({ action, row }) => {
 *   if (action === "edit") Modal.open("#mdlEditar", row);
 * });
 *
 * @version 3.0.0
 */

import $ from "jquery";
import config from "../core/config.js";
import Alert from "./Alert.js";
import Icons from "./Icons.js";
import Strings from "./Strings.js";
import NumberHelper from "./Number.js";

/* ── Funciones privadas ── */

/** @private */
const _tbl = (el) => {
	if (!el) return $();
	if (el instanceof $) return el;
	if (el instanceof HTMLElement) return $(el);
	return $(el);
};

/** @private */
const _dt = (el) => {
	const $t = _tbl(el);
	return $.fn.DataTable?.isDataTable($t) ? $t.DataTable() : null;
};

/** @private */
const _title = (title, icon, iconClass = "text-muted") =>
	icon
		? `<span class="me-1"><i class="${icon} ${iconClass}"></i></span>${title}`
		: title;

/** @private Escapa caracteres para atributos HTML */
const _escAttr = (str) =>
	String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
		.replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── Table ── */

const Table = {

	/** @type {Function[]} Plugins registrados */
	_plugins: [],

	/**
	 * Registra un plugin de tabla.
	 * @param {Function} plugin
	 */
	use: (plugin) => {
		if (typeof plugin === "function") { plugin(Table); Table._plugins.push(plugin); }
	},

	/* ── Inicialización ── */

	/**
	 * Auto-inicializa tablas con `data-target="dt"` en un scope.
	 * @param {HTMLElement|Document} [scope=document]
	 */
	init: (scope = document) => {
		$(_dt ? scope : document).find('table[data-target="dt"]').each((_, el) => Table.initTable(el));
		$(scope).find('table[data-target="dt"]').each((_, el) => Table.initTable(el));
	},

	/**
	 * Inicializa una DataTable. Si ya existe, retorna la instancia.
	 * @param {string|HTMLElement} el
	 * @param {Object} [options={}]
	 * @returns {Object|null}
	 */
	initTable(el, options = {}) {
		const $table = _tbl(el);
		if (!$table.length) { console.warn("[Table] Elemento no encontrado:", el); return null; }
		if ($.fn.DataTable?.isDataTable($table)) return $table.DataTable();

		const hasButtons = Array.isArray(options.buttons) && options.buttons.length;
		const dom = options.dom ?? (hasButtons ? config.datatables.domButtons : config.datatables.base.dom);
		const select = options.select === true ? { style: "multi", selector: "td:first-child" } : (options.select ?? false);

		return $table.DataTable({
			...config.datatables.base,
			...options,
			dom,
			select,
			drawCallback: function () {
				Icons.init();
				if (typeof options.drawCallback === "function") options.drawCallback.call(this);
			},
		});
	},

	/* ── Core ── */

	/** Destruye una DataTable liberando memoria. */
	destroy: (el) => { const dt = _dt(el); if (dt) dt.clear().destroy(); },

	/**
	 * Recarga datos vía AJAX.
	 * @param {string|HTMLElement} el
	 * @param {boolean} [resetPaging=false]
	 */
	reload: (el, resetPaging = false) => {
		const dt = _dt(el);
		if (dt?.ajax) dt.ajax.reload(null, !resetPaging);
	},

	isInit: (el) => $.fn.DataTable?.isDataTable(_tbl(el)) ?? false,
	isInitialized: (el) => Table.isInit(el),
	get: (el) => _dt(el),

	/* ── Columnas ── */

	/**
	 * Columna estándar configurable.
	 * @param {string|null} data @param {string} title @param {Object} [options={}]
	 */
	col(data, title, options = {}) {
		const {
			render, className = "", orderable = true, searchable = true,
			width, icon, iconClass = "text-white", truncate = null, tooltip = false, autoIcon = false,
		} = options;

		const defaultIcons = { nombre: "bi bi-person", email: "bi bi-envelope", fecha: "bi bi-calendar" };
		const finalIcon = icon || (autoIcon ? defaultIcons[data] : null);
		const finalTitle = _title(title, finalIcon, iconClass);

		const column = { data, title: finalTitle, orderable, searchable };
		if (className) column.className = className;
		if (width != null) column.width = width;

		const hasCustomRender = typeof render === "function";
		const hasTruncate = NumberHelper.isValid(truncate) && truncate > 0;

		if (hasCustomRender || hasTruncate) {
			column.render = (val, type, row) => {
				if (type === "sort" || type === "filter") {
					return (val === null || val === undefined) ? "" : String(val);
				}
				const raw = (val === null || val === undefined) ? "" : String(val);
				const processed = hasCustomRender ? render(val, type, row) : raw;
				if (!hasTruncate || type !== "display") return processed;
				const isCut = raw.length > truncate;
				const tipAttr = tooltip && isCut ? ` title="${_escAttr(raw)}"` : "";
				if (hasCustomRender) {
					return tooltip && isCut ? `<span${tipAttr}>${processed}</span>` : processed;
				}
				return `<span${tipAttr}>${Strings.truncate(raw, truncate)}</span>`;
			};
		}
		return column;
	},

	/** Columna de índice (número de fila, 1-based). */
	index: (title = "#") => ({
		data: null, title, orderable: false, searchable: false,
		className: "text-center", width: 40,
		render: (_, __, ___, meta) => meta.row + 1,
	}),

	/** Columna de checkbox para selección múltiple. */
	checkbox: () => ({
		data: null,
		title: '<input type="checkbox" class="form-check-input dt-select-all">',
		orderable: false, searchable: false,
		className: "text-center dt-checkboxes-cell", width: 40,
		render: () => '<input type="checkbox" class="form-check-input dt-check">',
		defaultContent: "",
	}),

	/** Columna de estado Activo / Inactivo. */
	status: (data, title = "Estado") =>
		Table.col(data, title, {
			className: "text-center",
			render: (val) => val
				? '<span class="badge bg-success">Activo</span>'
				: '<span class="badge bg-secondary">Inactivo</span>',
		}),

	/** Columna boolean Sí / No. */
	boolean: (data, title = "") =>
		Table.col(data, title, {
			className: "text-center",
			render: (val) => val
				? '<span class="badge bg-success"><i class="bi bi-check-lg me-1"></i>Sí</span>'
				: '<span class="badge bg-secondary"><i class="bi bi-x-lg me-1"></i>No</span>',
		}),

	/**
	 * Columna badge con mapa de valores.
	 * @param {string} data @param {string} title
	 * @param {Object} map  `{ valor: { color: "success", label: "Texto" } }`
	 */
	badge: (data, title, map = {}) =>
		Table.col(data, title, {
			className: "text-center",
			render: (val) => {
				const item = map[val];
				return item
					? `<span class="badge bg-${item.color}">${item.label}</span>`
					: `<span class="badge bg-secondary">${val ?? ""}</span>`;
			},
		}),

	/**
	 * Columna de fecha formateada.
	 * @param {string} data @param {string} [title="Fecha"] @param {"date"|"datetime"|"time"} [type="date"]
	 */
	date: (data, title = "Fecha", type = "date") =>
		Table.col(data, title, {
			render: (val) => {
				if (!val) return "";
				const d = new Date(val);
				if (isNaN(d)) return val;
				const opts = {
					date: { dateStyle: "short" },
					datetime: { dateStyle: "short", timeStyle: "short" },
					time: { timeStyle: "short" },
				};
				return new Intl.DateTimeFormat(config.formats.locale, opts[type] ?? opts.date).format(d);
			},
		}),

	/**
	 * Columna monetaria.
	 * @param {string} data @param {string} [title="Monto"] @param {string} [moneda="P"]
	 */
	money: (data, title = "Monto", moneda = "P") =>
		Table.col(data, title, {
			className: "text-end",
			render: (val) => val != null ? NumberHelper.currency(val, moneda) : "",
		}),

	/**
	 * Columna numérica formateada.
	 * @param {string} data @param {string} [title=""] @param {number} [decimals=2]
	 */
	number: (data, title = "", decimals = 2) =>
		Table.col(data, title, {
			className: "text-end",
			render: (val) => val != null ? NumberHelper.formatNumber(val, decimals) : "",
		}),

	/* ── Acciones ── */

	/**
	 * Columna de acciones CRUD.
	 * Usa config.dt_actions para los iconos y confirmar eliminación automáticamente.
	 * @param {string[]|Object} [optionsOrActions={}]
	 */
	actions(optionsOrActions = {}) {
		const isArray = Array.isArray(optionsOrActions);

		const {
			actions = isArray ? optionsOrActions : ["view", "edit", "delete"],
			title = "Acciones",
			width = "120px",
			className = "text-center",
			renderActions,
			icon = "bi bi-gear",
		} = isArray ? { actions: optionsOrActions } : optionsOrActions;

		return Table.col(null, title, {
			icon,
			className,
			width,
			orderable: false,
			searchable: false,
			autoIcon: false,
			render: (data, type, row) => {
				if (typeof renderActions === "function") {
					return renderActions(data, type, row);
				}

				const list = typeof actions === "function" ? actions(row) : actions;
				const resolved = list
					.map((key) => (typeof key === "string" ? config.dt_actions[key] : key))
					.filter(Boolean);

				// 🔹 Caso 1: 3 o menos → inline
				if (resolved.length <= 3) {
					return `
					<div class="table-actions d-flex gap-2 justify-content-center align-items-center">
						${resolved.map((btn) => `
							<a href="javascript:void(0)"
							   data-action="${btn.action}"
							   class="${btn.class ?? "text-primary"} text-decoration-none fs-5"
							   title="${btn.title ?? ""}">
								<i class="bi ${btn.icon ?? "bi-circle"}"></i>
							</a>
						`).join("")}
					</div>
				`;
				}

				// 🔹 Caso 2: más de 3 → dropdown
				return `
				<div class="btn-group">
					<button class="btn btn-light btn-sm dropdown-toggle"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false">
						<i class="bi ${icon.replace("bi ", "")}"></i>
					</button>
					<ul class="dropdown-menu dropdown-menu-end">
						${resolved.map((btn) => `
							<li>
								<a href="javascript:void(0)"
								   class="dropdown-item d-flex align-items-center gap-2"
								   data-action="${btn.action}">
									<i class="bi ${btn.icon ?? "bi-circle"}"></i>
									<span>${btn.title ?? btn.action}</span>
								</a>
							</li>
						`).join("")}
					</ul>
				</div>
			`;
			},
		});
	},

	/* ── Evento de acción integrado ── */

	/**
	 * Maneja clics en acciones de la tabla con confirmación automática (config.dt_actions).
	 * @param {string|HTMLElement} el
	 * @param {Function} callback  `({ action, row, button }) => void`
	 * @example
	 * Table.onAction("#tblUsuarios", ({ action, row }) => {
	 *   if (action === "edit") Modal.open("#mdlEditar", row);
	 * });
	 */
	onAction: (el, callback) => {
		const $table = _tbl(el);
		$table.off("click.hrActions").on("click.hrActions", "[data-action]", async (e) => {
			e.preventDefault();
			const btn = e.currentTarget;
			const action = $(btn).data("action");
			const row = Table.row(btn);
			const cfg = config.dt_actions[action];
			if (cfg?.confirm) {
				const ok = await Alert.confirm(cfg.confirm.title, cfg.confirm.text);
				if (!ok) return;
			}
			if (typeof callback === "function") callback({ action, row, button: btn });
		});
	},

	/* ── Gestión de filas ── */

	/** Obtiene los datos de la fila a la que pertenece un elemento. */
	row: (el) => {
		let $tr = $(el).closest("tr");
		if ($tr.hasClass("child")) $tr = $tr.prev();
		const dt = _dt($tr.closest("table"));
		return dt ? dt.row($tr).data() : null;
	},

	addRow: (el, row) => { const dt = _dt(el); if (dt) dt.row.add(row).draw(false); },
	removeRow: (el, trigger) => { const dt = _dt(el); if (dt) dt.row($(trigger).closest("tr")).remove().draw(false); },
	updateRow: (el, trigger, d) => { const dt = _dt(el); if (dt) dt.row($(trigger).closest("tr")).data(d).draw(false); },
	refresh: (el, data = []) => { const dt = _dt(el); if (dt) dt.clear().rows.add(data).draw(); },

	/* ── Selección ── */

	selected: (el) => { const dt = _dt(el); return dt ? dt.rows({ selected: true }).data().toArray() : []; },
	selectedCount: (el) => _dt(el)?.rows({ selected: true }).count() ?? 0,
	selectAll: (el) => _dt(el)?.rows().select(),
	clearSelection: (el) => { const dt = _dt(el); if (dt?.rows) dt.rows().deselect(); },
	onSelect: (el, cb) => {
		const dt = _dt(el);
		if (!dt || typeof cb !== "function") return;
		dt.on("select deselect", () => cb(dt.rows({ selected: true }).data().toArray()));
	},

	/** Obtiene filas marcadas con checkbox .dt-check */
	getChecked: (el) => {
		const dt = _dt(el);
		const rows = [];
		if (!dt) return rows;
		dt.rows().every(function () {
			if ($(this.node()).find(".dt-check").prop("checked")) rows.push(this.data());
		});
		return rows;
	},

	/* ── Búsqueda ── */

	search: (el, query) => _dt(el)?.search(query).draw(),
	searchColumn: (el, colIndex, query) => _dt(el)?.column(colIndex).search(query).draw(),
	clearSearch: (el) => _dt(el)?.search("").columns().search("").draw(),

	/* ── Botones de exportación ── */

	/**
	 * Genera config de botones para DataTables Buttons.
	 * @param {Array<"excel"|"pdf"|"print"|"copy"|"csv">} [types=["excel","pdf","print"]]
	 * @returns {Object[]}
	 */
	exportButtons: (types = ["excel", "pdf", "print"]) => {
		const map = {
			excel: { extend: "excelHtml5", text: '<i class="bi bi-file-earmark-excel me-1"></i>Excel', className: "btn btn-sm btn-success" },
			pdf: { extend: "pdfHtml5", text: '<i class="bi bi-file-earmark-pdf me-1"></i>PDF', className: "btn btn-sm btn-danger" },
			print: { extend: "print", text: '<i class="bi bi-printer me-1"></i>Imprimir', className: "btn btn-sm btn-secondary" },
			copy: { extend: "copy", text: '<i class="bi bi-clipboard me-1"></i>Copiar', className: "btn btn-sm btn-info" },
			csv: { extend: "csv", text: '<i class="bi bi-filetype-csv me-1"></i>CSV', className: "btn btn-sm btn-warning" },
		};
		return types.map((t) => map[t]).filter(Boolean);
	},

	/** Alias de exportButtons */
	buttons: (type = "base") => config.datatables[type] || [],

	/* ── UI ── */

	toggleLoading: (el, state = true) => {
		_tbl(el).closest(".dataTables_wrapper").toggleClass("dt-loading", state);
	},

	/** Muestra mensaje de error en el contenedor de la tabla. */
	renderError: (tbl) => {
		_tbl(tbl).html(`<div class="alert alert-danger">Error al cargar datos.</div>`);
	},
};

export default Table;
