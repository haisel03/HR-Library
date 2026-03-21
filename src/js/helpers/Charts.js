import Chart from "chart.js/auto";
import config from "../core/config";

/**
 * @module Charts
 * @description Helper para creación y manejo de gráficos usando Chart.js
 */

const instances = new Map();

const Charts = {
	/**
	 * Crea o reemplaza un gráfico
	 */
	create: (el, options) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		if (!canvas) return null;

		Charts.destroy(canvas);

		const chart = new Chart(canvas, {
			...config.charts.base,
			...options,
		});

		instances.set(canvas, chart);
		return chart;
	},

	/**
	 * Destruye un gráfico
	 */
	destroy: (el) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		if (!canvas) return;

		const chart = instances.get(canvas);
		if (chart) {
			chart.destroy();
			instances.delete(canvas);
		}
	},

	/**
	 * Actualiza los datos de un gráfico
	 */
	updateData: (el, data) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		const chart = instances.get(canvas);
		if (!chart) return;

		chart.data = data;
		chart.update();
	},

	/**
	 * Retorna una instancia Chart
	 */
	get: (el) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		return instances.get(canvas) ?? null;
	},
};

export default Charts;
