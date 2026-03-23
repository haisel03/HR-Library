/**
 * @module DateHelper
 * @description
 * Helper de fechas para HR Library.
 * Combina la capa nativa de V1 (Tiempo.js: operaciones, comparaciones,
 * startOfDay, endOfMonth, etc.) con las integraciones de V2
 * (flatpickr config helper, fullCalendar config helper, auto-init por data-*).
 *
 * @example
 * $Date.format("2026-03-08");                       // "08/03/2026"
 * $Date.addDays(new Date(), 7);                     // Date +7 días
 * $Date.diffDays("2026-01-01", "2026-12-31");       // 364
 * $Date.flatpickr({ type: "datetime" });            // opciones para flatpickr
 * $Date.flatpickr({ minDate: "today" });            // opciones fecha mínima
 * $Date.fullCalendar({ initialView: "listWeek" });  // opciones para FullCalendar
 *
 * @version 3.0.0
 */

import config from "../core/config.js";

/** @private */
const _locale = () => config.app?.locale ?? "es-DO";

/* ── Creación / Validación ─────────────────────────────────────────────────── */

const DateHelper = {

  /**
   * Retorna la fecha/hora actual.
   * @returns {Date}
   */
  now: () => new Date(),

  /**
   * Crea un objeto Date seguro desde cualquier valor.
   * @param {Date|string|number} value
   * @returns {Date|null}
   * @example $Date.create("2026-03-08"); // Date
   */
  create(value) {
    if (value instanceof Date) return isNaN(value.getTime()) ? null : new Date(value);
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  },

  /**
   * Verifica si un valor es una fecha válida.
   * @param {Date|string|number} value
   * @returns {boolean}
   */
  isValid: (value) => !isNaN(new Date(value).getTime()),

  /* ── Formato ─────────────────────────────────────────────────────────────── */

  /**
   * Formatea una fecha usando Intl.DateTimeFormat.
   * @param {Date|string|number} value
   * @param {"date"|"time"|"datetime"} [type="date"]
   * @param {string} [locale]  Por defecto usa config.app.locale.
   * @returns {string}
   * @example
   * $Date.format("2026-03-08");             // "08/03/2026"
   * $Date.format("2026-03-08","datetime");  // "08/03/2026, 12:00 a. m."
   */
  format(value, type = "date", locale = _locale()) {
    const d = DateHelper.create(value);
    if (!d) return "";
    const opts = {
      date:     { dateStyle: "short" },
      time:     { timeStyle: "short" },
      datetime: { dateStyle: "short", timeStyle: "short" },
    };
    return new Intl.DateTimeFormat(locale, opts[type] ?? opts.date).format(d);
  },

  /**
   * Retorna la fecha en formato ISO YYYY-MM-DD.
   * @param {Date|string|number} value
   * @returns {string}
   * @example $Date.toISODate(new Date()); // "2026-03-22"
   */
  toISODate(value) {
    const d = DateHelper.create(value);
    return d ? d.toISOString().split("T")[0] : "";
  },

  /**
   * Retorna la fecha en formato ISO completo.
   * @param {Date|string|number} value
   * @returns {string}
   */
  toISOString(value) {
    const d = DateHelper.create(value);
    return d ? d.toISOString() : "";
  },

  /* ── Normalización ───────────────────────────────────────────────────────── */

  /** @param {Date|string|number} value @returns {Date|null} */
  startOfDay(value) {
    const d = DateHelper.create(value);
    if (!d) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /** @param {Date|string|number} value @returns {Date|null} */
  endOfDay(value) {
    const d = DateHelper.create(value);
    if (!d) return null;
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /** @param {Date|string|number} value @returns {Date|null} */
  startOfMonth(value) {
    const d = DateHelper.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  },

  /** @param {Date|string|number} value @returns {Date|null} */
  endOfMonth(value) {
    const d = DateHelper.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  },

  /* ── Operaciones ─────────────────────────────────────────────────────────── */

  /**
   * Retorna una nueva fecha sumando N días (no muta el original).
   * @param {Date|string|number} value
   * @param {number} days
   * @returns {Date|null}
   * @example $Date.addDays("2026-03-01", 7); // 2026-03-08
   */
  addDays(value, days) {
    const d = DateHelper.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + Number(days));
  },

  /**
   * Retorna una nueva fecha sumando N meses.
   * @param {Date|string|number} value
   * @param {number} months
   * @returns {Date|null}
   */
  addMonths(value, months) {
    const d = DateHelper.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth() + Number(months), d.getDate());
  },

  /**
   * Retorna una nueva fecha sumando N años.
   * @param {Date|string|number} value
   * @param {number} years
   * @returns {Date|null}
   */
  addYears(value, years) {
    const d = DateHelper.create(value);
    if (!d) return null;
    return new Date(d.getFullYear() + Number(years), d.getMonth(), d.getDate());
  },

  /**
   * Diferencia en días entre dos fechas (end - start).
   * Positivo si end > start.
   * @param {Date|string|number} start
   * @param {Date|string|number} end
   * @returns {number|null}
   * @example $Date.diffDays("2026-01-01", "2026-12-31"); // 364
   */
  diffDays(start, end) {
    const a = DateHelper.startOfDay(start);
    const b = DateHelper.startOfDay(end);
    if (!a || !b) return null;
    return Math.round((b.getTime() - a.getTime()) / 86_400_000);
  },

  /* ── Comparaciones ───────────────────────────────────────────────────────── */

  /** @param {Date|string|number} value @returns {boolean} */
  isToday(value) {
    return DateHelper.startOfDay(value)?.getTime() ===
           DateHelper.startOfDay(new Date())?.getTime();
  },

  /** @param {Date|string|number} value @returns {boolean} */
  isPast(value) {
    const d = DateHelper.startOfDay(value);
    const t = DateHelper.startOfDay(new Date());
    return !!d && !!t && d < t;
  },

  /** @param {Date|string|number} value @returns {boolean} */
  isFuture(value) {
    const d = DateHelper.startOfDay(value);
    const t = DateHelper.startOfDay(new Date());
    return !!d && !!t && d > t;
  },

  /**
   * Verifica si una fecha está dentro de un rango inclusivo.
   * @param {Date|string|number} value
   * @param {Date|string|number} start
   * @param {Date|string|number} end
   * @returns {boolean}
   */
  between(value, start, end) {
    const d = DateHelper.create(value);
    const a = DateHelper.create(start);
    const b = DateHelper.create(end);
    return !!d && !!a && !!b && d >= a && d <= b;
  },

  /* ── Utilidades ──────────────────────────────────────────────────────────── */

  /**
   * Retorna el nombre del mes en el locale configurado.
   * @param {Date|string|number} value
   * @param {string} [locale]
   * @returns {string}
   * @example $Date.monthName("2026-03-08"); // "marzo"
   */
  monthName(value, locale = _locale()) {
    const d = DateHelper.create(value);
    if (!d) return "";
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(d);
  },

  /**
   * Retorna el nombre del día de la semana.
   * @param {Date|string|number} value
   * @param {string} [locale]
   * @returns {string}
   * @example $Date.dayName("2026-03-22"); // "domingo"
   */
  dayName(value, locale = _locale()) {
    const d = DateHelper.create(value);
    if (!d) return "";
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d);
  },

  /**
   * Retorna el número de días de un mes.
   * @param {number} year
   * @param {number} month  Base 0 (0=Enero, 11=Diciembre).
   * @returns {number}
   * @example $Date.daysInMonth(2026, 1); // 28
   */
  daysInMonth: (year, month) => new Date(year, month + 1, 0).getDate(),

  /* ── Integración Flatpickr ───────────────────────────────────────────────── */

  /**
   * Retorna un objeto de opciones para Flatpickr listo para usar,
   * fusionando la config base con el tipo y modificadores indicados.
   *
   * @param {Object} [overrides={}]
   * @param {"date"|"datetime"|"time"|"range"} [overrides.type="date"]
   *   Tipo de picker. Aplica la config de config.flatpickr.types[type].
   * @param {"min"|"max"} [overrides.modifier]
   *   Modificador rápido (minDate:"today" o maxDate:"today").
   * @param {*} [overrides.*]
   *   Cualquier otra opción Flatpickr se aplica directamente.
   * @returns {Object}  Objeto de opciones para pasar a flatpickr(el, options).
   *
   * @example
   * // Picker de fecha simple
   * flatpickr("#input", $Date.flatpickr());
   *
   * // Picker de datetime
   * flatpickr("#input", $Date.flatpickr({ type: "datetime" }));
   *
   * // Solo fechas futuras
   * flatpickr("#input", $Date.flatpickr({ minDate: "today" }));
   *
   * // Rango con fecha mínima hoy
   * flatpickr("#input", $Date.flatpickr({ type: "range", minDate: "today" }));
   *
   * // Con callback onChange
   * flatpickr("#input", $Date.flatpickr({
   *   type: "datetime",
   *   onChange: (dates) => console.log(dates),
   * }));
   */
  flatpickr(overrides = {}) {
    const { type = "date", modifier, ...rest } = overrides;

    const base     = config.flatpickr?.base     ?? { locale: "es", allowInput: true };
    const typeOpts = config.flatpickr?.types?.[type] ?? {};
    const modOpts  = modifier ? (config.flatpickr?.modifiers?.[modifier] ?? {}) : {};

    return { ...base, ...typeOpts, ...modOpts, ...rest };
  },

  /* ── Integración FullCalendar ────────────────────────────────────────────── */

  /**
   * Retorna un objeto de opciones base para FullCalendar listo para usar,
   * con locale español y vista inicial configurable.
   *
   * @param {Object} [overrides={}]  Opciones adicionales de FullCalendar.
   * @returns {Object}
   *
   * @example
   * const cal = new Calendar(el, $Date.fullCalendar({
   *   events: "/api/eventos",
   *   initialView: "timeGridWeek",
   * }));
   */
  fullCalendar(overrides = {}) {
    return {
      locale:      "es",
      initialView: "dayGridMonth",
      firstDay:    1,          // semana empieza el lunes
      buttonText: {
        today:  "Hoy",
        month:  "Mes",
        week:   "Semana",
        day:    "Día",
        list:   "Agenda",
      },
      ...overrides,
    };
  },

  /* ── Auto-init (data-flatpickr) ──────────────────────────────────────────── */

  /**
   * Auto-inicializa todos los elementos con `data-flatpickr` en un scope.
   *
   * Atributos data-* soportados:
   * - `data-flatpickr`          — cualquier valor activa el picker (ej: data-flatpickr="date")
   * - `data-flatpickr-type`     — "date" | "datetime" | "time" | "range"
   * - `data-flatpickr-min`      — minDate (ej: "today" o "2026-01-01")
   * - `data-flatpickr-max`      — maxDate
   * - `data-flatpickr-default`  — defaultDate
   *
   * @param {HTMLElement|Document} [scope=document]
   * @returns {void}
   *
   * @example
   * // HTML:
   * // <input data-flatpickr data-flatpickr-type="datetime" data-flatpickr-min="today">
   * $Date.init();
   */
  init(scope = document) {
    // Importación lazy para no romper si flatpickr no está cargado
    if (typeof flatpickr === "undefined") return;

    (scope === document ? document : scope)
      .querySelectorAll("[data-flatpickr]")
      .forEach((el) => {
        // No reinicializar
        if (el._flatpickr) return;

        const type    = el.dataset.flatpickrType     ?? "date";
        const min     = el.dataset.flatpickrMin      ?? undefined;
        const max     = el.dataset.flatpickrMax      ?? undefined;
        const def     = el.dataset.flatpickrDefault  ?? undefined;

        flatpickr(el, DateHelper.flatpickr({
          type,
          ...(min ? { minDate: min } : {}),
          ...(max ? { maxDate: max } : {}),
          ...(def ? { defaultDate: def } : {}),
        }));
      });
  },
};

export default Object.freeze(DateHelper);
