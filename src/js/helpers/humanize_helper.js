import humanizeDuration from "humanize-duration";
import config from "../core/config";

/**
 * @namespace humanize
 * @description Helper para humanización de tiempos y duraciones
 */
const humanize = {
    /**
     * Humaniza una duración en milisegundos
     * @param {number} ms
     * @param {Object} [options]
     * @returns {string}
     */
    duration: (ms, options = {}) => {
        return humanizeDuration(ms, {
            ...config.humanizer,
            ...options
        });
    },

    /**
     * Calcula el tiempo faltante hacia una fecha
     * @param {Date|string|number} targetDate
     * @returns {string}
     */
    timeRemaining: (targetDate) => {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target - now;

        if (diff <= 0) return "Tiempo agotado";

        return humanize.duration(diff);
    },

    /**
     * Calcula el tiempo transcurrido desde una fecha
     * @param {Date|string|number} fromDate
     * @returns {string}
     */
    timeAgo: (fromDate) => {
        const now = new Date();
        const from = new Date(fromDate);
        const diff = now - from;

        if (diff <= 0) return "Recién hecho";

        return humanize.duration(diff);
    }
};

export default humanize;
