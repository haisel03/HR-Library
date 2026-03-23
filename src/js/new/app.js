/**
 * @file app.js
 * @description Entry point de HR Library.
 * Importa todos los módulos de terceros en orden correcto,
 * inicializa $HR y expone globalmente.
 *
 * @version 3.0.0
 */

// ── Estilos ──────────────────────────────────────────
// import "../scss/app.scss"; // Manejar via Vite/webpack

// ── Base ─────────────────────────────────────────────
import "./modules/jquery.js";        // 1. jQuery primero (base de Select2, DataTables)
import "./modules/axios.js";         // 2. Axios con interceptores
import "./modules/bootstrap.js";     // 3. Bootstrap componentes

// ── Notificaciones ────────────────────────────────────
import "./modules/swal.js";          // 4. SweetAlert2
import "./modules/notyf.js";         // 5. Notyf (alternativa toast)
import "./modules/toastify.js";      // 6. Toastify (alternativa toast)

// ── Formularios ───────────────────────────────────────
import "./modules/select2.js";       // 7. Select2 (requiere jQuery)
import "./modules/inputmask.js";     // 8. Inputmask con aliases RD
import "./modules/flatpickr.js";     // 9. Flatpickr con locale ES
import "./modules/validation.js";    // 10. Validación nativa

// ── Tablas ────────────────────────────────────────────
import "./modules/datatables.js";    // 11. DataTables con plugins

// ── Gráficos ──────────────────────────────────────────
import "./modules/chartjs.js";       // 12. Chart.js
import "./modules/vector-maps.js";   // 13. Mapas vectoriales

// ── Calendarios ───────────────────────────────────────
import "./modules/fullcalendar.js";  // 14. FullCalendar con plugins
import "./modules/dayjs.js";         // 15. Day.js para fechas

// ── Editores ──────────────────────────────────────────
import "./modules/quill.js";         // 16. Quill WYSIWYG
import "./modules/signature_pad.js"; // 17. Firma digital

// ── Archivos / Exportación ────────────────────────────
import "./modules/xlsx.js";          // 18. SheetJS Excel

// ── Códigos ───────────────────────────────────────────
import "./modules/codes.js";         // 19. JsBarcode + QRCode

// ── Utilidades ───────────────────────────────────────
import "./modules/dragula.js";       // 20. Dragula drag & drop
import "./modules/simplebar.js";     // 21. SimpleBar scroll personalizado
import "./modules/humanizer.js";     // 22. Humanize duration
import "./modules/feather.js";       // 23. Feather Icons

// ── UI / Template ─────────────────────────────────────
import "./modules/sidebar.js";       // 24. Sidebar template
import "./modules/theme.js";         // 25. Tema / dark mode
import "./modules/access_control.js";// 26. Control de acceso

// ── Iconos ────────────────────────────────────────────
// Bootstrap Icons: via SCSS
// Font Awesome: importar si se usa FA
// import "@fortawesome/fontawesome-free/css/all.min.css";

// ── HR Library ────────────────────────────────────────
import $HR from "./HR.js";

// ── Inicialización ────────────────────────────────────
$(function () {
  $HR.init();
});

export default $HR;
