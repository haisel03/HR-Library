// Usage: https://www.chartjs.org/
import { Chart, registerables } from "chart.js";

// Registrar todos los componentes (OBLIGATORIO en v3+)
Chart.register(...registerables);

// Defaults globales
Chart.defaults.color = window.theme?.["gray-600"] || "#6c757d";
Chart.defaults.font.family =
  "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

// Exponer Chart globalmente (compatibilidad con plugins)
window.Chart = Chart;
