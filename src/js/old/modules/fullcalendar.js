// src/js/modules/fullcalendar.js
import { Calendar } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

import esLocale from "@fullcalendar/core/locales/es";

// Exponer global si quieres
window.FullCalendar = {
  Calendar,
  plugins: {
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin,
    bootstrap5Plugin,
  },
  locales: {
    es: esLocale,
  },
};
