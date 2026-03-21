import config from "../core/config";

/**
 * @module Date
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
	format: (value, type = "date", locale = config.formats.locale) => {
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
};

export default DateHelper;
