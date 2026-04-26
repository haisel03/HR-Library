/**
 * @module Humanize
 * @description
 * Helper para presentación legible de duraciones, fechas relativas y tamaños.
 * Combina la riqueza de V1 (relativeDay, fileSize, percent) con V2 (timeAgo limpio).
 *
 * @example
 * Humanize.duration(3600000);           // "1 hora"
 * Humanize.duration(90000);             // "1 minuto, 30 segundos"
 * Humanize.timeAgo("2026-03-01");       // "hace 7 días"
 * Humanize.timeRemaining("2026-12-31"); // "en 9 meses, 23 días"
 * Humanize.relativeDay(new Date());     // "Hoy"
 * Humanize.fileSize(1048576);           // "1 MB"
 *
 * @version 3.0.0
 */

import humanizeDuration from "humanize-duration";
import DateHelper from "./utils/Date.js";

/** Opciones base para humanize-duration. @private */
const _DEFAULTS = Object.freeze({
  language:  "es",
  delimiter: ", ",
  round:     true,
  largest:   2,
});

const Humanize = {

  /* ── Duraciones ── */

  /**
   * Humaniza una duración en milisegundos.
   * @param {number}  ms
   * @param {Object}  [options={}]  Opciones de humanize-duration.
   * @returns {string}
   * @example Humanize.duration(90000, { largest: 1 }); // "2 minutos"
   */
  duration(ms, options = {}) {
    if (typeof ms !== "number" || ms < 0) return "";
    return humanizeDuration(ms, { ..._DEFAULTS, ...options });
  },

  /**
   * Tiempo transcurrido desde una fecha hasta ahora.
   * @param {Date|string|number} fromDate
   * @param {Object} [options={}]
   * @returns {string}
   * @example Humanize.timeAgo("2026-03-01"); // "hace 7 días"
   */
  timeAgo(fromDate, options = {}) {
    const from = DateHelper.create(fromDate);
    if (!from) return "";
    const diff = Date.now() - from.getTime();
    if (diff <= 0) return "Ahora mismo";
    return `hace ${this.duration(diff, options)}`;
  },

  /**
   * Tiempo restante desde ahora hasta una fecha futura.
   * @param {Date|string|number} targetDate
   * @param {Object} [options={}]
   * @returns {string}
   * @example Humanize.timeRemaining("2026-12-31"); // "en 9 meses, 23 días"
   */
  timeRemaining(targetDate, options = {}) {
    const target = DateHelper.create(targetDate);
    if (!target) return "";
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return "Tiempo agotado";
    return `en ${this.duration(diff, options)}`;
  },

  /* ── Fechas relativas ── */

  /**
   * Descripción relativa del día: "Hoy", "Ayer", "Mañana" o fecha formateada.
   * @param {Date|string|number} value
   * @returns {string}
   */
  relativeDay(value) {
    if (DateHelper.isToday(value)) return "Hoy";
    const diff = DateHelper.diffDays(new Date(), value);
    if (diff === -1) return "Ayer";
    if (diff ===  1) return "Mañana";
    return DateHelper.format(value);
  },

  /* ── Tamaños ── */

  /**
   * Formatea bytes a tamaño legible (KB, MB, GB...).
   * @param {number} bytes
   * @returns {string}
   * @example Humanize.fileSize(1048576); // "1 MB"
   */
  fileSize(bytes) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Formatea un porcentaje.
   * @param {number} value  Valor entre 0 y 100.
   * @param {number} [decimals=1]
   * @returns {string}
   * @example Humanize.percent(75.5); // "75.5%"
   */
  percent: (value, decimals = 1) =>
    `${Math.round(value * 10 ** decimals) / 10 ** decimals}%`,

  /** Invocado por init.js */
  init() {},
};

export default Object.freeze(Humanize);
