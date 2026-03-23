// Usage: https://www.chartjs.org/
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  DoughnutController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

// Registrar solo los tipos detectados en el proyecto:
// bar, line, pie, doughnut — más helpers comunes de escala/tooltip/leyenda
Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  PieController, ArcElement,
  DoughnutController,
  CategoryScale, LinearScale, LogarithmicScale, TimeScale,
  Filler, Legend, Title, Tooltip
);

// Si en el futuro necesitas radar, bubble, scatter o polarArea:
// importarlos e incluirlos en Chart.register() arriba.

Chart.defaults.color = window.theme?.["gray-600"] || "#6c757d";
Chart.defaults.font.family =
  "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

window.Chart = Chart;
