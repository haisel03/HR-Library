// ============================
// Styles
// ============================
import "../scss/app.scss";

// ============================
// Bootstrap y jQuery
// ============================
import "./modules/jquery";
import "./modules/bootstrap";

// ============================
// Modulos y librerias
// ============================
import "./modules/swal";
import "./modules/select2";
import "./modules/inputmask";
import "./modules/datatables";
import "./modules/fullcalendar";
import "./modules/xlsx";
import "./modules/humanizer";
import "./modules/codes";

// ============================
// Modulos de la plantilla
// ============================
import "./modules/sidebar";
import "./modules/theme";
import "./modules/feather";

// ============================
// modulos de graficos
// ============================
import "./modules/chartjs";
import "./modules/vector-maps";

// ============================
// Iconos
// ============================
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ============================
// HR PLUGIN
// ============================
import HR from "./HR";
window.HR = HR;


// ============================
// Inicializador
// ============================
$(function () {
  HR.init();
});
