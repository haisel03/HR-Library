document.addEventListener("DOMContentLoaded", function () {
  // Line Chart
  new Chart(document.getElementById("chartjs-dashboard-line"), {
    type: "line",
    data: {
      labels: $HR.lang.short_months,
      datasets: [
        {
          label: "Ventas ($)",
          fill: true,
          backgroundColor: "transparent",
          borderColor: window.theme.primary,
          data: [
            2115, 1562, 1584, 1892, 1487, 2223, 2966, 2448, 2905, 3838, 2917,
            3327,
          ],
        },
        {
          label: "Órdenes",
          fill: true,
          backgroundColor: "transparent",
          borderColor: "#adb5bd",
          borderDash: [4, 4],
          data: [
            958, 724, 629, 883, 915, 1214, 1476, 1212, 1554, 2128, 1466, 1642,
          ],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        intersect: false,
      },
      hover: {
        intersect: true,
      },
      plugins: {
        filler: {
          propagate: false,
        },
      },
      scales: {
        x: {
          reverse: true,
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },
        y: {
          ticks: {
            stepSize: 500,
          },
          display: true,
          borderDash: [5, 5],
          grid: {
            color: "rgba(0,0,0,0)",
            fontColor: "#fff",
          },
        },
      },
    },
  });

  // Pie Chart
  new Chart(document.getElementById("chartjs-dashboard-pie"), {
    type: "pie",
    data: {
      labels: ["Primaria", "Secundaria", "Inicial"],
      datasets: [
        {
          data: [4306, 3801, 1689],
          backgroundColor: [
            window.theme.primary,
            window.theme.warning,
            window.theme.danger,
          ],
          borderWidth: 5,
        },
      ],
    },
    options: {
      responsive: !window.MSInputMethodContext,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      cutoutPercentage: 75,
    },
  });

  // Bar Chart
  new Chart(document.getElementById("chartjs-dashboard-bar"), {
    type: "bar",
    data: {
      labels: $HR.lang.short_months,
      datasets: [
        {
          label: "Este año",
          backgroundColor: window.theme.primary,
          borderColor: window.theme.primary,
          hoverBackgroundColor: window.theme.primary,
          hoverBorderColor: window.theme.primary,
          data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
          barPercentage: 0.75,
          categoryPercentage: 0.5,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        y: {
          grid: {
            display: false,
          },
          stacked: false,
          ticks: {
            stepSize: 20,
          },
        },
        x: {
          stacked: false,
          grid: {
            color: "transparent",
          },
        },
      },
    },
  });

  // Map

  const map = new jsVectorMap({
    map: "world",
    selector: "#world_map",
    zoomButtons: true,
    selectedRegions: ["US", "SA", "DE", "FR", "CN", "AU", "BR", "IN", "GB"],
    regionStyle: {
      initial: {
        fill: "#e4e4e4",
        "fill-opacity": 0.9,
        stroke: "none",
        "stroke-width": 0,
        "stroke-opacity": 0,
      },
      selected: {
        fill: window.theme.primary,
      },
    },
    zoomOnScroll: false,
  });

  // Calendar
  const dateEl = document.getElementById("datetimepicker-dashboard");
  if (dateEl) {
    flatpickr(dateEl, $Date.flatpickr({
      inline: true,
      prevArrow: '<span title="Mes anterior">&laquo;</span>',
      nextArrow: '<span title="Mes siguiente">&raquo;</span>',
    }));
  }
});
