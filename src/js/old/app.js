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
import "./modules/flatpickr";     // CORREGIDO: faltaba en el import original
import "./modules/datatables";
import "./modules/fullcalendar";
import "./modules/xlsx";
import "./modules/humanizer";
import "./modules/codes";
import "./modules/feather";
import "./modules/axios";
import "./modules/dayjs";
import "./modules/quill";
import "./modules/signature_pad";
import "./modules/dragula";
import "./modules/validation";
import "./modules/simplebar";
import "./modules/notyf";
import "./modules/toastify";

// ============================
// Modulos de la plantilla
// ============================
import "./modules/sidebar";
import "./modules/theme";

// ============================
// Modulos de graficos
// ============================
import "./modules/chartjs";
import "./modules/vector-maps";

// ============================
// Iconos
// ============================
// Bootstrap Icons: viene del SCSS (app.scss → bootstrap-icons)
// Font Awesome: se mantiene aquí como CSS (no duplicar en _fontawesome.scss)
import "@fortawesome/fontawesome-free/css/all.min.css";

// ============================
// Control de acceso (inicializado despues de jQuery)
// ============================
import "./modules/access_control";

// ============================
// HR PLUGIN
// ============================
import $HR from "./HR";
window.$HR = $HR;

// ============================
// Inicializador
// ============================
$(function () {
	$HR.init();
});
