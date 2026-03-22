import $Config from "../core/config";

/**
 * @module DateHelper
 * @description Helper de fechas como capa de normalización.
 */

const DateHelper = {
	/**
	 * Devuelve la fecha actual
	 */
	now: () => new Date(),

	/**
	 * Crea un objeto Date seguro
	 */
	create: (value) => {
		const d = new Date(value);
		return isNaN(d.getTime()) ? null : d;
	},

	/**
	 * Verifica si un valor es una fecha válida
	 */
	isValid: (value) => {
		const d = new Date(value);
		return !isNaN(d.getTime());
	},

	/**
	 * Formatea una fecha usando Intl.DateTimeFormat
	 */
	format: (value, type = "date", locale = $Config.formats.locale) => {
		const d = DateHelper.create(value);
		if (!d) return "";

		const options =
			type === "datetime"
				? { dateStyle: "short", timeStyle: "short" }
				: { dateStyle: "short" };

		return new Intl.DateTimeFormat(locale, options).format(d);
	},

	/**
	 * Convierte una fecha a ISO Date (YYYY-MM-DD)
	 */
	toISODate: (value) => {
		const d = DateHelper.create(value);
		return d ? d.toISOString().split("T")[0] : "";
	},

	/**
	 * Convierte una fecha a ISO Datetime completo
	 */
	toISOString: (value) => {
		const d = DateHelper.create(value);
		return d ? d.toISOString() : "";
	},

	/**
	 * Suma o resta días a una fecha
	 */
	addDays: (value, days) => {
		const d = DateHelper.create(value);
		if (!d) return null;
		d.setDate(d.getDate() + Number(days));
		return d;
	},

	/**
	 * Calcula diferencia en días entre dos fechas
	 */
	diffDays: (start, end) => {
		const a = DateHelper.create(start);
		const b = DateHelper.create(end);
		if (!a || !b) return null;

		const diff = b.getTime() - a.getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24));
	},

	/**
	 * Devuelve configuración base para Flatpickr
	 */
	flatpickr: (overrides = {}) => ({
		dateFormat: "Y-m-d",
		locale: "es",
		allowInput: true,
		...overrides,
	}),

	/**
	 * Devuelve configuración base para FullCalendar
	 */
	fullCalendar: (overrides = {}) => ({
		locale: "es",
		firstDay: 1,
		height: "auto",
		nowIndicator: true,
		...overrides,
	}),
	 buildConfig(el) {
  const { base = {}, types = {}, modifiers = {} } = $Config.flatpickr || {};

  let cfg = { ...base };

  // Tipos
  Object.keys(types).forEach((key) => {
    if (el.classList.contains(key)) {
      cfg = { ...cfg, ...types[key] };
    }
  });

  // Modificadores
  Object.keys(modifiers).forEach((key) => {
    if (el.classList.contains(key)) {
      cfg = { ...cfg, ...modifiers[key] };
    }
  });

  if (el.dataset.minDate) cfg.minDate = el.dataset.minDate;
  if (el.dataset.maxDate) cfg.maxDate = el.dataset.maxDate;
  if (el.dataset.dateFormat) cfg.dateFormat = el.dataset.dateFormat;
  if (el.dataset.enableTime) cfg.enableTime = el.dataset.enableTime === "true";
  return cfg;
},

	init(scope = document) {
		// Inicializa flatpickr en todos los inputs con data-flatpickr
    const root = scope instanceof HTMLElement ? scope : document;
    root.querySelectorAll("input").forEach((el) => {
      if (el._flatpickr) return;
      const config = this.buildConfig(el);
      if (Object.keys(config).length > 1) {
        flatpickr(el, config);
      }
    });
  },
};

export default DateHelper;
