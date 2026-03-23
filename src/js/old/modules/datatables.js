// src/js/modules/datatables.js
import $ from "jquery";

/* ===============================
   CSS
================================ */
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";

/* ===============================
   CORE REAL
================================ */
import DataTable from "datatables.net";

/* ===============================
   ADAPTERS
================================ */
import "datatables.net-bs5";
import "datatables.net-buttons";
import "datatables.net-buttons-bs5";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";

/* ===============================
   BOTONES
================================ */
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.colvis";

/* ===============================
   EXPORT FILES
================================ */
import JSZip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts;

/* ===============================
   GLOBALS (OBLIGATORIOS)
================================ */
window.$ = $;
window.jQuery = $;
window.JSZip = JSZip;
window.pdfMake = pdfMake;
window.DataTable = DataTable;

export default DataTable;
