/**
 * @module config
 * @description
 * Configuración global del proyecto.
 * Centraliza ajustes de UI, validaciones, formatos, plugins y feature flags.
 * Este archivo es consumido por todos los helpers (HR, alerts, forms, validation, etc.).
 */

import es from "./spanish.js";

/**
 * Configuración global
 * @type {Object}
 */

const config = {
	/* =====================================================
		 MONEDAS
	===================================================== */

	/**
	 * Monedas soportadas en el sistema
	 * @type {{U: string, E: string, P: string}}
	 */
	monedas: {
		U: "USD$",
		E: "EUR€",
		P: "RD$",
	},

	/* =====================================================
		 ALERTAS
	===================================================== */

	/**
	 * Configuración de alertas del sistema
	 */
	alerts: {
		/**
		 * Motor de alertas
		 * @type {"sweetalert"|"notyf"|"toastify"|"bootstrap"}
		 */
		engine: "bootstrap",

		/**
		 * Iconos por tipo de alerta
		 * @type {{w: string, d: string, s: string, i: string, p: string}}
		 */
		icons: {
			w: "bi-exclamation-triangle-fill",
			d: "bi-bug-fill",
			s: "bi-hand-thumbs-up-fill",
			i: "bi-info-circle",
			p: "bi-envelope-at-fill",
		},

		/**
		 * Títulos por tipo de alerta
		 * @type {{w: string, d: string, s: string, i: string, p: string}}
		 */
		titles: {
			w: "Atención",
			d: "Error",
			s: "Realizado",
			i: "Información",
			p: "Mensaje",
		},

		/**
		 * Colores Bootstrap por tipo de alerta
		 * @type {{w: string, d: string, s: string, i: string, p: string}}
		 */
		colors: {
			w: "warning",
			d: "danger",
			s: "success",
			i: "info",
			p: "primary",
		},
	},

	/* =====================================================
		 SWEETALERT
	===================================================== */

	/**
	 * Configuración base de SweetAlert2
	 */
	swal: {
		backdrop: "rgba(13, 22, 44, 0.85)",
		clickOutside: false,
		escapeKey: false,
		background: "#FFFFFF",

		/**
		 * Textos de botones
		 */
		button: {
			confirm: `<i class="bi bi-check me-1"></i>Aceptar`,
			cancel: `<i class="bi bi-x me-1"></i>Cancelar`,
			deny: "No ahora",
		},

		/**
		 * Configuración de toast
		 */
		toast: {
			position: "top-end",
			timer: 4000,
		},
	},

	/* =====================================================
		 MÁSCARAS DE INPUT
	===================================================== */

	/**
	 * Configuración de máscaras de entrada
	 */
	masks: {
		phone: {
			mask: "999-999-9999",
			clearIncomplete: true,
		},
		cedula: {
			mask: "999-9999999-9",
			clearIncomplete: true,
		},
		rnc: {
			mask: "999999999",
		},
		date: {
			alias: "datetime",
			inputFormat: "dd/mm/yyyy",
			placeholder: "dd/mm/aaaa",
		},
		money: {
			alias: "money",
			groupSeparator: ",",
			autoGroup: true,
			digits: 2,
			prefix: "RD$ ",
			rightAlign: true,
		},
		ip: {
			mask: "i.i.i.i",
			definitions: {
				i: {
					/**
					 * Validador de segmento IP
					 * @param {string} ch
					 * @returns {boolean}
					 */
					validator: (ch) => /[0-9]/.test(ch),
				},
			},
		},
	},

	/* =====================================================
		 VALIDACIONES
	===================================================== */

	/**
	 * Configuración de validaciones por regex
	 */
	validation: {
		/**
		 * Regex para teléfono
		 * @type {RegExp}
		 */
		phoneRegex: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,

		/**
		 * Regex para correo electrónico
		 * @type {RegExp}
		 */
		emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	},

	/* =====================================================
		 SELECT2
	===================================================== */

	/**
	 * Configuración por defecto de Select2
	 */
	select2: {
		theme: "bootstrap-5",
		width: "100%",
		language: "es",
		placeholder: "Seleccione...",
		allowClear: true,
	},

	/* =====================================================
		 MENSAJES
	===================================================== */

	/**
	 * Mensajes globales del sistema
	 */
	messages: {
		required: "Este campo es obligatorio.",
		phone: "Número de teléfono no válido.",
		email: "Correo electrónico no válido.",
		default: "Mensaje no definido.",

		loading: {
			title: "Cargando",
			subtitle: "Por favor espere...",
		},
	},

	/* =====================================================
		 FORMATOS
	===================================================== */

	/**
	 * Formatos globales
	 */
	formats: {
		date: "DD/MM/YYYY",
		datetime: "DD/MM/YYYY HH:mm",
		locale: "es-DO",
	},

	/* =====================================================
		 DATATABLES
	===================================================== */

	/**
	 * Configuración base de DataTables
	 */
	// Configuración de la tabla
	datatables: {
		base: {
			language: es.datatables,
			destroy: true,
			ordering: false,
			responsive: true,
			lengthMenu: [
				[5, 10, 25, 50, 100, -1],
				[5, 10, 25, 50, 100, "Todos"],
			],
		},
		buttons: [
			{
				extend: "pageLength",
				text: `<span class="text-primary"><i class="bi bi-eye me-1"></i>Mostrar</span>`,
				titleAttr: "Mostrar ",
				className: "bg-white",
			},
			{
				extend: "copy",
				text: `<span class="text-dark"><i class="bi bi-copy me-1"></i>Copiar</span>`,
				titleAttr: "Copiar ",
				className: "bg-white",
			},
			{
				extend: "excel",
				text: `<span class="text-success"><i class="bi bi-file-excel me-1"></i>Excel</span>`,
				titleAttr: "Exportar a Excel",
				className: "bg-white",
			},
			{
				extend: "pdf",
				text: `<span class="text-danger"><i class="bi bi-file-pdf me-1"></i>Pdf</span>`,
				titleAttr: "Exportar a PDF",
				className: "bg-white shadow",
				orientation: "portrait",
				pageSize: "LETTER",
			},
		],
		icons: [
			{
				extend: "pageLength",
				text: `<i class="bi bi-eye text-white"></i>`,
				titleAttr: "Mostrar/Ocultar",
				className: "bg-primary",
			},
			{
				extend: "copy",
				text: `<i class="bi bi-copy text-white"></i>`,
				titleAttr: "Copiar ",
				className: "bg-dark",
			},
			{
				extend: "excel",
				text: `<i class="bi bi-file-excel text-white"></i>`,
				titleAttr: "Exportar a Excel",
				className: "bg-success",
			},
			{
				extend: "pdf",
				text: `<i class="bi bi-file-pdf text-white"></i>`,
				titleAttr: "Exportar a PDF",
				className: "bg-danger",
			},
			{
				extend: "print",
				text: `<i class="bi bi-printer text-white"></i>`,
				titleAttr: "Imprimir el resultado",
				className: "bg-navy",
			},
			{
				extend: "colvis",
				text: `<i class="bi bi-card-checklist text-white"></i>`,
				titleAttr: "Imprimir el resultado",
				className: "bg-navy",
			},
		],
	},

	/* =====================================================
		 CALENDARIO
	===================================================== */

	/**
	 * Configuración de calendario
	 */
	calendar: {
		themeSystem: "bootstrap5",
		firstDay: 1,
		height: "auto",
		nowIndicator: true,
		weekNumbers: false,
		buttonText: {
			today: "Hoy",
			month: "Mes",
			week: "Semana",
			day: "Día",
			list: "Lista",
		},
		locale: "es",
	},

	/* =====================================================
		 HUMANIZER
	===================================================== */

	/**
	 * Configuración para humanización de tiempo
	 */
	humanizer: {
		language: "es",
		round: true,
		largest: 2,
		units: ["y", "mo", "d", "h", "m"],
		conjunction: " y ",
		serialComma: false,
	},

	/* =====================================================
	 CODES
===================================================== */

	/**
	 * Configuración de códigos de barras y QR
	 */
	codes: {
		barcode: {
			engine: "jsbarcode",

			defaultFormat: "CODE128",

			supportedFormats: ["CODE128", "EAN13", "EAN8", "UPC", "CODE39"],

			defaults: {
				lineColor: "#000000",
				background: "#ffffff",
				width: 2,
				height: 40,
				displayValue: false,
				font: "monospace",
				fontSize: 12,
				textMargin: 2,
			},
		},

		qr: {
			engine: "qrcode",

			canvas: {
				errorCorrectionLevel: "M",
				width: 256,
				margin: 2,
				color: {
					dark: "#000000",
					light: "#ffffff",
				},
			},

			svg: {
				width: 256,
				height: 256,
				padding: 4,
				color: "#000000",
				background: "#ffffff",
			},
		},
	},

	/* =====================================================
		 FEATURE FLAGS
	===================================================== */

	/**
	 * Módulos activos del sistema
	 */
	modules: {
		academic: true,
		admin: true,
		finance: true,
		social: false,
	},

	/* =====================================================
		 API
	===================================================== */
	api: {
		baseURL: "/api",
		timeout: 15000,
	},

	// ==========================
	// PRINT
	// ==========================
	print: {
		// Excluir elementos de la impresión
		noPrintSelector: ".no-print",
		// Comportamiento base
		globalStyles: true,
		mediaPrint: true,
		printContainer: true,
		manuallyCopyFormValues: true,
		iframe: true,

		// Tiempos
		timeout: 750,

		// Opcionales
		title: null, // título del documento
		stylesheet: null, // css externo para impresión
	},
	/* =====================================================
	 CHARTS
===================================================== */

	charts: {
		base: {
			responsive: true,
			maintainAspectRatio: false,
		},
	},
	/* =====================================================
	 EDITOR (QUILL)
===================================================== */

	editor: {
		theme: "snow",
		base: {
			placeholder: "Escribe aquí...",
			modules: {
				toolbar: [
					["bold", "italic", "underline"],
					[{ header: 1 }, { header: 2 }],
					[{ list: "ordered" }, { list: "bullet" }],
					["link", "image"],
					["clean"],
				],
			},
		},
	},
	/* =====================================================
		 SIGNATURE
	===================================================== */

	signature: {
		base: {
			penColor: "#3a7fe7",
			backgroundColor: "rgba(255,255,255,0)",
		},
	},

	/* =====================================================
		 ICONS
	===================================================== */

	icons: {
		fa: "fa",           // FontAwesome
		bi: "bi",           // Bootstrap Icons
		feather: "feather", // Feather Icons
		default: "bi",      // librería por defecto
	},

	/* =====================================================
		 SIDEBAR
	===================================================== */

	sidebar: {
		sidebarSelector: "#sidebar",
		toggleSelector: "[data-toggle='sidebar']",
		simplebarSelector: "#sidebar-scroll",
		collapseClass: "collapsed",
	},

	dt_actions: {
		view: {
			icon: "bi-eye",
			class: "text-primary",
			title: "Ver",
			action: "view"
		},
		edit: {
			icon: "bi-pen",
			class: "text-primary",
			title: "Editar",
			action: "edit"
		},
		delete: {
			action: "delete",
			icon: "bi-trash",
			class: "text-danger",
			title: "Eliminar",
			confirm: {
				title: "¿Estás seguro?",
				text: "Esta acción no se puede deshacer"
			}
		},
		print: {
			icon: "bi-printer",
			class: "text-secondary",
			title: "Imprimir",
			action: "print"
		},
		duplicate: {
			icon: "bi-files",
			class: "text-info",
			title: "Duplicar",
			action: "duplicate"
		},
		download: {
			icon: "bi-download",
			class: "text-success",
			title: "Descargar",
			action: "download"
		},
		share: {
			icon: "bi-share",
			class: "text-primary",
			title: "Compartir",
			action: "share"
		},
		activate: {
			icon: "bi-check-circle",
			class: "text-success",
			title: "Activar",
			action: "activate"
		},
		deactivate: {
			icon: "bi-slash-circle",
			class: "text-warning",
			title: "Desactivar",
			action: "deactivate"
		},
		open: {
			icon: "bi-box-arrow-up-right",
			class: "text-primary",
			title: "Abrir",
			action: "open"
		},
		history: {
			icon: "bi-clock",
			class: "text-muted",
			title: "Historial",
			action: "history"
		},
		permissions: {
			icon: "bi-lock",
			class: "text-secondary",
			title: "Permisos",
			action: "permissions"
		},
		settings: {
			icon: "bi-gear",
			class: "text-dark",
			title: "Configuración",
			action: "settings"
		},
		invoice: {
			icon: "bi-file-earmark-text",
			class: "text-primary",
			title: "Factura",
			action: "invoice"
		},
		payment: {
			icon: "bi-credit-card",
			class: "text-success",
			title: "Registrar pago",
			action: "payment"
		},
		export: {
			icon: "bi-upload",
			class: "text-info",
			title: "Exportar",
			action: "export"
		}
	}
};

export default config;
