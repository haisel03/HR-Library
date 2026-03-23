/**
 * @module Tiempo
 * @description
 * Helper de fechas para Coffee Schools.
 * Capa de normalización sobre el objeto Date nativo.
 * No reemplaza Flatpickr ni FullCalendar; centraliza
 * formatos, conversiones, operaciones y comparaciones.
 *
 * Nota: Se llama `Tiempo` para evitar colisión con el
 * built-in `Date` de JavaScript.
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 2.1.0
 *
 * @example
 * import Tiempo from "./Tiempo.js";
 *
 * Tiempo.format(new Date());          // "08/03/2026"
 * Tiempo.addDays(new Date(), 7);      // Date +7 días
 * Tiempo.diffDays("2026-01-01", "2026-12-31"); // 364
 */

import Config from "./Config.js";

// ─────────────────────────────────────────────
// Tiempo
// ─────────────────────────────────────────────

/**
 * @namespace Tiempo
 */
const Tiempo = {

  // ── Básicos ───────────────────────────────────────────────────────────

  /**
   * Retorna la fecha/hora actual.
   * @returns {Date}
   */
  now: () => new Date(),

  /**
   * Crea un objeto Date seguro desde cualquier valor.
   * @param {Date|string|number} value
   * @returns {Date|null} Date válido o null si el valor es inválido.
   *
   * @example
   * Tiempo.create("2026-03-08"); // Date
   * Tiempo.create("abc");        // null
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
  isValid: (value) => {
    const d = new Date(value);
    return !isNaN(d.getTime());
  },

  // ── Formato ───────────────────────────────────────────────────────────

  /**
   * Formatea una fecha usando Intl.DateTimeFormat.
   * @param {Date|string|number} value
   * @param {"date"|"time"|"datetime"} [type="date"]
   * @param {string} [locale] - Por defecto usa Config.app.locale.
   * @returns {string}
   *
   * @example
   * Tiempo.format("2026-03-08");              // "08/03/2026"
   * Tiempo.format("2026-03-08", "datetime");  // "08/03/2026, 12:00 a.m."
   */
  format(value, type = "date", locale = Config.app.locale) {
    const d = Tiempo.create(value);
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
   *
   * @example
   * Tiempo.toISODate(new Date()); // "2026-03-08"
   */
  toISODate(value) {
    const d = Tiempo.create(value);
    return d ? d.toISOString().split("T")[0] : "";
  },

  /**
   * Retorna la fecha en formato ISO completo.
   * @param {Date|string|number} value
   * @returns {string}
   */
  toISOString(value) {
    const d = Tiempo.create(value);
    return d ? d.toISOString() : "";
  },

  // ── Normalización ─────────────────────────────────────────────────────

  /**
   * Retorna una nueva fecha al inicio del día (00:00:00.000).
   * No muta el objeto original.
   * @param {Date|string|number} value
   * @returns {Date|null}
   */
  startOfDay(value) {
    const d = Tiempo.create(value);
    if (!d) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Retorna una nueva fecha al final del día (23:59:59.999).
   * No muta el objeto original.
   * @param {Date|string|number} value
   * @returns {Date|null}
   */
  endOfDay(value) {
    const d = Tiempo.create(value);
    if (!d) return null;
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Retorna el primer día del mes de la fecha indicada.
   * @param {Date|string|number} value
   * @returns {Date|null}
   */
  startOfMonth(value) {
    const d = Tiempo.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  },

  /**
   * Retorna el último día del mes de la fecha indicada.
   * @param {Date|string|number} value
   * @returns {Date|null}
   */
  endOfMonth(value) {
    const d = Tiempo.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  },

  // ── Operaciones ───────────────────────────────────────────────────────

  /**
   * Retorna una nueva fecha sumando N días.
   * No muta el objeto original.
   * @param {Date|string|number} value
   * @param {number} days
   * @returns {Date|null}
   *
   * @example
   * Tiempo.addDays("2026-03-01", 7); // Date → 2026-03-08
   */
  addDays(value, days) {
    const d = Tiempo.create(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + Number(days));
  },

  /**
   * Retorna una nueva fecha sumando N meses.
   * No muta el objeto original.
   * @param {Date|string|number} value
   * @param {number} months
   * @returns {Date|null}
   *
   * @example
   * Tiempo.addMonths("2026-01-31", 1); // Date → 2026-02-28
   */
  addMonths(value, months) {
    const d = Tiempo.create(value);
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
    const d = Tiempo.create(value);
    if (!d) return null;
    return new Date(d.getFullYear() + Number(years), d.getMonth(), d.getDate());
  },

  /**
   * Diferencia en días entre dos fechas (end - start).
   * Valor positivo si end > start, negativo si end < start.
   *
   * @param {Date|string|number} start
   * @param {Date|string|number} end
   * @returns {number|null} Días de diferencia o null si alguna fecha es inválida.
   *
   * @example
   * Tiempo.diffDays("2026-01-01", "2026-12-31"); // 364
   */
  diffDays(start, end) {
    const a = Tiempo.startOfDay(start);
    const b = Tiempo.startOfDay(end);
    if (!a || !b) return null;
    return Math.round((b.getTime() - a.getTime()) / 86_400_000);
  },

  // ── Comparaciones ─────────────────────────────────────────────────────

  /**
   * Verifica si una fecha es hoy.
   * @param {Date|string|number} value
   * @returns {boolean}
   */
  isToday(value) {
    return (
      Tiempo.startOfDay(value)?.getTime() ===
      Tiempo.startOfDay(new Date())?.getTime()
    );
  },

  /**
   * Verifica si una fecha es anterior a hoy.
   * @param {Date|string|number} value
   * @returns {boolean}
   */
  isPast(value) {
    const d     = Tiempo.startOfDay(value);
    const today = Tiempo.startOfDay(new Date());
    return !!d && !!today && d < today;
  },

  /**
   * Verifica si una fecha es posterior a hoy.
   * @param {Date|string|number} value
   * @returns {boolean}
   */
  isFuture(value) {
    const d     = Tiempo.startOfDay(value);
    const today = Tiempo.startOfDay(new Date());
    return !!d && !!today && d > today;
  },

  /**
   * Verifica si una fecha está dentro de un rango inclusivo.
   * @param {Date|string|number} value
   * @param {Date|string|number} start
   * @param {Date|string|number} end
   * @returns {boolean}
   *
   * @example
   * Tiempo.between("2026-06-15", "2026-01-01", "2026-12-31"); // true
   */
  between(value, start, end) {
    const d = Tiempo.create(value);
    const a = Tiempo.create(start);
    const b = Tiempo.create(end);
    return !!d && !!a && !!b && d >= a && d <= b;
  },

  // ── Utilidades ────────────────────────────────────────────────────────

  /**
   * Retorna el nombre del mes en el locale configurado.
   * @param {Date|string|number} value
   * @param {string} [locale]
   * @returns {string}
   *
   * @example
   * Tiempo.monthName("2026-03-08"); // "marzo"
   */
  monthName(value, locale = Config.app.locale) {
    const d = Tiempo.create(value);
    if (!d) return "";
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(d);
  },

  /**
   * Retorna el nombre del día de la semana.
   * @param {Date|string|number} value
   * @param {string} [locale]
   * @returns {string}
   *
   * @example
   * Tiempo.dayName("2026-03-08"); // "domingo"
   */
  dayName(value, locale = Config.app.locale) {
    const d = Tiempo.create(value);
    if (!d) return "";
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d);
  },

  /**
   * Retorna el número de días de un mes.
   * @param {number} year
   * @param {number} month - Base 0 (0=Enero, 11=Diciembre).
   * @returns {number}
   *
   * @example
   * Tiempo.daysInMonth(2026, 1); // 28 (febrero 2026)
   */
  daysInMonth: (year, month) => new Date(year, month + 1, 0).getDate(),

  // ── Init ──────────────────────────────────────────────────────────────

  /**
   * Punto de entrada del helper. Reservado para Init.js.
   * @returns {void}
   */
  init() {},

};

export default Object.freeze(Tiempo);
