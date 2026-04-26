/**
 * @module Calendar
 * @description
 * Helper para FullCalendar en HR Library.
 * Gestiona instancias, eventos, navegación y calendarios arrastrables.
 * Usa locale español y la configuración de $Date.fullCalendar() como base.
 *
 * @example
 * const cal = Calendar.init("#divCal", {
 *   events: "/api/eventos",
 *   onEventClick: (info) => Modal.open("#mdlEvento"),
 * });
 * Calendar.addEvent("#divCal", { title: "Reunión", start: "2026-04-01" });
 * Calendar.goTo("#divCal", "2026-06-01");
 * Calendar.setView("#divCal", "timeGridWeek");
 *
 * @version 3.0.0
 */

import { Calendar as FC }   from "@fullcalendar/core";
import { Draggable }         from "@fullcalendar/interaction";
import dayGridPlugin          from "@fullcalendar/daygrid";
import timeGridPlugin         from "@fullcalendar/timegrid";
import listPlugin             from "@fullcalendar/list";
import interactionPlugin      from "@fullcalendar/interaction";
import esLocale               from "@fullcalendar/core/locales/es";

/** Mapa de instancias activas: HTMLElement → FC. @private */
const _instances = new Map();

/** @param {string|HTMLElement} target @returns {HTMLElement|null} @private */
const _el = (target) => {
  if (!target)                       return null;
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string")    return document.querySelector(target) ?? document.getElementById(target);
  return null;
};

const Calendar = {

  /* ── Inicialización ── */

  /**
   * Crea e inicializa un calendario FullCalendar.
   * Si ya existe una instancia en ese elemento, la retorna sin crear otra.
   *
   * @param {string|HTMLElement} target
   * @param {Object} [options={}]
   * @param {string}   [options.initialView="dayGridMonth"]
   * @param {boolean}  [options.editable=true]
   * @param {boolean}  [options.selectable=true]
   * @param {Array|string} [options.events]  Array o URL AJAX.
   * @param {Function} [options.onEventClick]
   * @param {Function} [options.onDateClick]
   * @param {Function} [options.onEventDrop]
   * @param {Function} [options.onSelect]
   * @returns {FC|null}
   */
  init(target, options = {}) {
    const el = _el(target);
    if (!el) { console.warn("[Calendar] Elemento no encontrado:", target); return null; }
    if (_instances.has(el)) return _instances.get(el);

    const calendar = new FC(el, {
      plugins:     [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      locale:      esLocale,
      initialView: options.initialView ?? "dayGridMonth",
      editable:    options.editable    ?? true,
      selectable:  options.selectable  ?? true,
      firstDay:    1,
      buttonText:  { today: "Hoy", month: "Mes", week: "Semana", day: "Día", list: "Agenda" },
      events:      options.events ?? [],
      eventClick:  options.onEventClick  ? (i) => options.onEventClick(i)  : undefined,
      dateClick:   options.onDateClick   ? (i) => options.onDateClick(i)   : undefined,
      eventDrop:   options.onEventDrop   ? (i) => options.onEventDrop(i)   : undefined,
      select:      options.onSelect      ? (i) => options.onSelect(i)      : undefined,
      eventAdd:    options.onEventAdd    ? (i) => options.onEventAdd(i)    : undefined,
      eventRemove: options.onEventRemove ? (i) => options.onEventRemove(i) : undefined,
      // Permite sobreescribir cualquier opción
      ...Object.fromEntries(
        Object.entries(options).filter(([k]) =>
          !["initialView","editable","selectable","events","onEventClick",
            "onDateClick","onEventDrop","onSelect","onEventAdd","onEventRemove"].includes(k)
        )
      ),
    });

    calendar.render();
    _instances.set(el, calendar);
    return calendar;
  },

  /**
   * Retorna la instancia FC de un elemento.
   * @param {string|HTMLElement} target @returns {FC|null}
   */
  get(target) {
    const el = _el(target);
    return _instances.get(el) ?? null;
  },

  /**
   * Destruye el calendario y limpia la instancia.
   * @param {string|HTMLElement} target
   */
  destroy(target) {
    const el = _el(target);
    if (!el) return;
    const cal = _instances.get(el);
    if (cal) { cal.destroy(); _instances.delete(el); }
  },

  /* ── Eventos ── */

  /**
   * Agrega un evento al calendario.
   * @param {string|HTMLElement} target
   * @param {Object} event  Objeto de evento FullCalendar.
   */
  addEvent(target, event) {
    this.get(target)?.addEvent(event);
  },

  /**
   * Elimina un evento por su ID.
   * @param {string|HTMLElement} target @param {string|number} eventId
   */
  removeEvent(target, eventId) {
    const cal = this.get(target);
    if (!cal) return;
    cal.getEventById(String(eventId))?.remove();
  },

  /** Elimina todos los eventos. @param {string|HTMLElement} target */
  clearEvents(target) {
    this.get(target)?.removeAllEvents();
  },

  /** Recarga eventos desde la fuente AJAX. @param {string|HTMLElement} target */
  refetchEvents(target) {
    this.get(target)?.refetchEvents();
  },

  /* ── Navegación ── */

  /**
   * Navega a una fecha específica.
   * @param {string|HTMLElement} target @param {Date|string} date
   */
  goTo(target, date) {
    this.get(target)?.gotoDate(date);
  },

  /**
   * Cambia la vista del calendario.
   * @param {string|HTMLElement} target
   * @param {"dayGridMonth"|"timeGridWeek"|"timeGridDay"|"listWeek"} view
   */
  setView(target, view) {
    this.get(target)?.changeView(view);
  },

  /* ── Draggable ── */

  /**
   * Configura un contenedor como fuente de eventos arrastrables.
   * @param {string|HTMLElement} container @param {Object} [options={}]
   * @returns {Draggable|null}
   */
  draggable(container, options = {}) {
    const el = _el(container);
    if (!el) { console.warn("[Calendar] Contenedor draggable no encontrado:", container); return null; }
    return new Draggable(el, {
      itemSelector: ".fc-event",
      eventData(eventEl) {
        const style = window.getComputedStyle(eventEl);
        return {
          title:           eventEl.innerText.trim(),
          backgroundColor: style.backgroundColor,
          borderColor:     style.borderColor,
        };
      },
      ...options,
    });
  },

  /** @returns {void} */
  /** Reservado para init.js — no hace nada en Calendar. @returns {void} */
  initBoot() {},
};

export default Calendar;

/* ── Alias boot-safe ── */
// El init.js llama Calendar.init(scope). Cuando scope=document, el _el() retorna null
// y la función retorna null silenciosamente. Es seguro.
