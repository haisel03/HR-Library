/**
 * @file app.js
 * @description Entry point de HR Library v4.0.
 * Importa estilos, módulos de terceros y la fachada App.
 *
 * @version 4.0.0
 */



// ── Estilos ──
import "../scss/app.scss";

// ── Módulos de terceros (side effects) ──
import "./modules/jquery.js";
import "./modules/axios.js";
import "./modules/bootstrap.js";
import "./modules/swal.js";
import "./modules/select2.js";
import "./modules/inputmask.js";
import "./modules/flatpickr.js";
import "./modules/validation.js";
import "./modules/datatables.js";
import "./modules/chartjs.js";
import "./modules/vector-maps.js";
import "./modules/fullcalendar.js";
import "./modules/dayjs.js";
import "./modules/quill.js";
import "./modules/signature_pad.js";
import "./modules/xlsx.js";
import "./modules/codes.js";
import "./modules/sortablejs.js";
import "./modules/simplebar.js";
import "./modules/humanizer.js";
import "./modules/feather.js";
import "./modules/theme.js";
import "./modules/access_control.js";

import App from "./core/App.js";

/* ── Exposición global ── */

if (typeof window !== "undefined") {
  window.App = App;
}

// ── Inicialización ──
$(function () {
  App.init();
});

export default App;

