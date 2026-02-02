import Chart from "chart.js/auto";
import config from "../core/config";

/**
 * @namespace charts
 * @description Helper para creación y manejo de gráficos usando Chart.js
 */
const charts = (() => {
  /** @type {Map<string, Chart>} */
  const instances = new Map();

  /* =====================================================
     CORE
  ===================================================== */

  /**
   * Crea o reemplaza un gráfico
   *
   * @param {HTMLCanvasElement|string} el Canvas o selector
   * @param {Object} options Configuración del gráfico
   * @returns {Chart|null}
   *
   * @example
   * charts.create("#salesChart", {
   *   type: "bar",
   *   data: {...},
   * })
   */
  const create = (el, options) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    if (!canvas) return null;

    destroy(canvas);

    const chart = new Chart(canvas, {
      ...config.charts.base,
      ...options,
    });

    instances.set(canvas, chart);
    return chart;
  };

  /**
   * Destruye un gráfico
   *
   * @param {HTMLCanvasElement|string} el
   */
  const destroy = (el) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    if (!canvas) return;

    const chart = instances.get(canvas);
    if (chart) {
      chart.destroy();
      instances.delete(canvas);
    }
  };

  /**
   * Actualiza los datos de un gráfico
   *
   * @param {HTMLCanvasElement|string} el
   * @param {Object} data Nuevos datos
   */
  const updateData = (el, data) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    const chart = instances.get(canvas);
    if (!chart) return;

    chart.data = data;
    chart.update();
  };

  /**
   * Retorna una instancia Chart
   *
   * @param {HTMLCanvasElement|string} el
   * @returns {Chart|null}
   */
  const get = (el) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    return instances.get(canvas) ?? null;
  };

  return {
    create,
    destroy,
    updateData,
    get,
  };
})();

export default charts;
