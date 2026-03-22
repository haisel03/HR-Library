import {
	Chart,
	BarController, BarElement,
	LineController, LineElement, PointElement,
	PieController, ArcElement,
	DoughnutController,
	CategoryScale, LinearScale, LogarithmicScale, TimeScale,
	Filler, Legend, Title, Tooltip,
} from "chart.js";
import config from "../core/config";

/**
 * @module Charts
 * @description
 * Helper para creación y manejo de gráficos usando Chart.js.
 * Solo registra los tipos detectados en el proyecto (bar, line, pie, doughnut)
 * para minimizar el bundle. Si necesitas radar, bubble, scatter o polarArea,
 * agrégalos aquí en Chart.register().
 */

// Registro selectivo — evita importar chart.js/auto que registra TODO
Chart.register(
	BarController, BarElement,
	LineController, LineElement, PointElement,
	PieController, ArcElement,
	DoughnutController,
	CategoryScale, LinearScale, LogarithmicScale, TimeScale,
	Filler, Legend, Title, Tooltip
);

// Defaults globales desde config
Chart.defaults.color       = window.theme?.["gray-600"] || "#6c757d";
Chart.defaults.font.family = "'Roboto', 'Helvetica Neue', sans-serif";

const instances = new Map();

const Charts = {

	/**
	 * Crea o reemplaza un gráfico en el canvas especificado.
	 * Si ya existe un gráfico en ese canvas, lo destruye primero.
	 *
	 * @param {string|HTMLCanvasElement} el  Selector o elemento canvas
	 * @param {Object} options               Configuración de Chart.js
	 * @returns {Chart|null}
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
	 * Destruye un gráfico y libera el canvas.
	 * @param {string|HTMLCanvasElement} el
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
	 * Actualiza los datos de un gráfico existente.
	 * @param {string|HTMLCanvasElement} el
	 * @param {Object} data  Nuevo objeto `data` de Chart.js
	 */
	updateData: (el, data) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		const chart  = instances.get(canvas);
		if (!chart) return;

		chart.data = data;
		chart.update();
	},

	/**
	 * Actualiza una sola opción sin destruir el gráfico.
	 * @param {string|HTMLCanvasElement} el
	 * @param {string} optionPath  Ruta con punto, ej: "plugins.legend.display"
	 * @param {*} value
	 */
	setOption: (el, optionPath, value) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		const chart  = instances.get(canvas);
		if (!chart) return;

		const parts = optionPath.split(".");
		let obj = chart.options;
		for (let i = 0; i < parts.length - 1; i++) {
			obj = obj[parts[i]] = obj[parts[i]] ?? {};
		}
		obj[parts[parts.length - 1]] = value;
		chart.update();
	},

	/**
	 * Retorna la instancia Chart de un canvas.
	 * @param {string|HTMLCanvasElement} el
	 * @returns {Chart|null}
	 */
	get: (el) => {
		const canvas = typeof el === "string" ? document.querySelector(el) : el;
		return instances.get(canvas) ?? null;
	},

	/**
	 * Destruye todos los gráficos registrados.
	 */
	destroyAll: () => {
		instances.forEach((chart) => chart.destroy());
		instances.clear();
	},
};

export default Charts;
