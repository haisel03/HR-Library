/**
 * @module init
 * @description
 * Inicializador global de HR Library.
 * Combina el orquestador detallado de V1 (logging, required flags, orden explícito)
 * con el modo iframe y scope dinámico de V2.
 *
 * Orden de inicialización:
 *  1.  Config       — base de todo
 *  2.  Alert        — depende de Config
 *  3.  Storage      — depende de Config
 *  4.  Api          — depende de Config, Alert, Storage
 *  5.  Dom          — sin dependencias
 *  6.  Event        — pub/sub, sin dependencias
 *  7.  Validation   — sin dependencias
 *  8.  Forms        — depende de Dom, Api, Alert, Validation
 *  9.  Select2      — depende de jQuery
 * 10.  Table        — depende de jQuery, Config
 * 11.  Modal        — depende de Bootstrap, Dom
 * 12.  Sidebar      — depende de SimpleBar, Dom
 * 13.  Iframe       — depende de Dom
 * 14.  Fullscreen   — depende de Dom
 * 15.  Editor       — depende de Quill
 * 16.  Signature    — depende de SignaturePad
 * 17.  Date         — sin dependencias externas
 * 18.  Charts       — depende de Chart.js
 * 19.  Codes        — depende de JsBarcode, QRCode
 * 20.  Humanize     — depende de humanize-duration
 * 21.  Icons        — depende de Feather Icons
 * 22.  Print        — sin dependencias externas
 * 23.  Excel        — depende de XLSX
 * 24.  Calendar     — depende de FullCalendar
 *
 * @version 3.0.0
 */

import config     from "./config.js";
import Dom        from "../helpers/Dom.js";
import Alert      from "../helpers/Alert.js";
import Storage    from "../helpers/Storage.js";
import Api        from "../helpers/Api.js";
import Event      from "../helpers/Event.js";
import Validation from "../helpers/Validation.js";
import Forms      from "../helpers/Forms.js";
import Select2    from "../helpers/Select2.js";
import Table      from "../helpers/Table.js";
import Modal      from "../helpers/Modal.js";
import Sidebar    from "../helpers/Sidebar.js";
import Iframe     from "../helpers/Iframe.js";
import Fullscreen from "../helpers/Fullscreen.js";
import Editor     from "../helpers/Editor.js";
import Signature  from "../helpers/Signature.js";
import DateHelper from "../helpers/Date.js";
import Charts     from "../helpers/Charts.js";
import Codes      from "../helpers/Codes.js";
import Humanize   from "../helpers/Humanize.js";
import Icons      from "../helpers/Icons.js";
import Print      from "../helpers/Print.js";
import Excel      from "../helpers/Excel.js";
import Calendar   from "../helpers/Calendar.js";

/* ── Registro de helpers ── */

/**
 * Helpers registrados en orden de inicialización.
 * - `required: true`  → error crítico si falla
 * - `required: false` → warning si falla (puede no estar disponible)
 * @private
 */
const _helpers = [
  { name: "Config",     helper: config,     required: true  },
  { name: "Alert",      helper: Alert,      required: true  },
  { name: "Storage",    helper: Storage,    required: true  },
  { name: "Api",        helper: Api,        required: true  },
  { name: "Dom",        helper: Dom,        required: true  },
  { name: "Event",      helper: Event,      required: false },
  { name: "Validation", helper: Validation, required: false },
  { name: "Forms",      helper: Forms,      required: false },
  { name: "Select2",    helper: Select2,    required: false },
  { name: "Table",      helper: Table,      required: false },
  { name: "Modal",      helper: Modal,      required: false },
  { name: "Sidebar",    helper: Sidebar,    required: false },
  { name: "Iframe",     helper: Iframe,     required: false },
  { name: "Fullscreen", helper: Fullscreen, required: false },
  { name: "Editor",     helper: Editor,     required: false },
  { name: "Signature",  helper: Signature,  required: false },
  { name: "Date",       helper: DateHelper, required: false },
  { name: "Charts",     helper: Charts,     required: false },
  { name: "Codes",      helper: Codes,      required: false },
  { name: "Humanize",   helper: Humanize,   required: false },
  { name: "Icons",      helper: Icons,      required: false },
  { name: "Print",      helper: Print,      required: false },
  { name: "Excel",      helper: Excel,      required: false },
  { name: "Calendar",   helper: Calendar,   required: false },
];

/* ── Función de arranque ── */

/**
 * Inicializa todos los helpers automáticos del framework.
 * @param {HTMLElement|Document|string} [scope=document]
 *   Scope para limitar la inicialización (útil en modales dinámicos).
 */
export default function init(scope = document) {
  const root    = scope === document ? document : Dom.el(scope);
  const isGlobal = scope === document;
  const dev     = config.isDev?.() ?? false;

  if (isGlobal) {
    if (dev) {
      console.groupCollapsed(
        `%c🚀 ${config.app.name} v${config.app.version} — Inicializando`,
        "color:#3a7fe7; font-weight:bold; font-size:13px;"
      );
    }

    let ok = 0, fail = 0, skip = 0;

    _helpers.forEach(({ name, helper, required }) => {
      if (typeof helper?.init !== "function") {
        skip++;
        if (dev) console.log(`  %c— ${name} (sin init)`, "color:#aaa;");
        return;
      }
      try {
        helper.init(root);
        ok++;
        if (dev) console.log(`  %c✔ ${name}`, "color:#4CAF50;");
      } catch (error) {
        fail++;
        console[required ? "error" : "warn"](`[Init] Error al inicializar ${name}:`, error);
        if (dev) console.log(`  %c✖ ${name}`, "color:#f44336;");
      }
    });

    if (dev) {
      console.log(`%c  ── ${ok} ok · ${fail} error · ${skip} sin init ──`, "color:#999; font-style:italic;");
      console.groupEnd();
    }

    // Detección de modo iframe (?iframe=1 en la URL)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iframe")) {
      document.body.classList.add("is-iframe-content");
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.style.display = "none";
      Dom.addClass(".wrapper", "p-0");
      Dom.addClass(".main", "w-100");
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.display = "none";
    }

  } else {
    // Reinicialización parcial en scope (modal recién abierto, contenido dinámico)
    const scoped = [Forms, Select2, Table, Editor, Signature, DateHelper, Icons, Codes];
    scoped.forEach(({ init: fn, constructor: { name } = {} }) => {
      if (typeof fn === "function") {
        try { fn(root); } catch (e) { console.warn(`[Init] Error parcial:`, e); }
      }
    });
  }
}
