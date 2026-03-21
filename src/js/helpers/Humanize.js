import humanizeDuration from "humanize-duration";
import config from "../core/config";

/**
 * @module Humanize
 * @description Helper para humanización de tiempos y duraciones.
 */

const Humanize = {
	/**
	 * Humaniza una duración en milisegundos
	 */
	duration: (ms, options = {}) => {
		return humanizeDuration(ms, {
			...config.humanizer,
			...options,
		});
	},

	/**
	 * Calcula el tiempo faltante hacia una fecha
	 */
	timeRemaining: (targetDate) => {
		const now = new Date();
		const target = new Date(targetDate);
		const diff = target - now;

		if (diff <= 0) return "Tiempo agotado";

		return Humanize.duration(diff);
	},

	/**
	 * Calcula el tiempo transcurrido desde una fecha
	 */
	timeAgo: (fromDate) => {
		const now = new Date();
		const from = new Date(fromDate);
		const diff = now - from;

		if (diff <= 0) return "Recién hecho";

		return Humanize.duration(diff);
	},
};

export default Humanize;
