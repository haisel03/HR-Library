/**
 * @module Calendar
 * @description
 * Helper para FullCalendar en HR Library.
 * Gestiona instancias, eventos, navegación y calendarios arrastrables.
 *
 * @example
 * const cal = Calendar.create("#divCal", {
 *   events: "/api/eventos",
 *   onEventClick: (info) => Modal.open("#mdlEvento"),
 * });
 * Calendar.addEvent("#divCal", { title: "Reunión", start: "2026-04-01" });
 * Calendar.goTo("#divCal", "2026-06-01");
 * Calendar.setView("#divCal", "timeGridWeek");
 *
 * @version 4.0.0
 */

import { Calendar as FC } from "@fullcalendar/core";
import { Draggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import config from "../core/config.js";

/** Mapa de instancias activas: HTMLElement → FC. @private */
const _instances = new Map();

/**
 * @param {string|HTMLElement} target
 * @returns {HTMLElement|null}
 * @private
 */
const _el = (target) => {
	if (!target) return null;
	if (target instanceof HTMLElement) return target;
	if (typeof target === "string") return document.querySelector(target) ?? document.getElementById(target);
	return null;
};

const Calendar = {
	/* ── Inicialización (sistema) ── */

	/**
	 * Inicializa los calendarios del scope.
	 * Busca elementos con data-calendar y los instancia con opciones del data-atributo.
	 * Llamado automáticamente por init.js.
	 *
	 * @param {HTMLElement|Document} [scope=document]
	 */
	init(scope = document) {
		const root = scope === document ? document : _el(scope);
		if (!root) return;

		const els = root.querySelectorAll("[data-calendar]");
		els.forEach((el) => {
			let opts = {};
			try {
				opts = JSON.parse(el.dataset.calendarOptions || "{}");
			} catch {
				/* ignore */
			}
			this.create(el, opts);
		});
	},

	/* ── Creación de calendario ── */

	/**
	 * Crea e inicializa un calendario FullCalendar en un elemento.
	 * Si ya existe una instancia en ese elemento, la retorna sin crear otra.
	 *
	 * @param {string|HTMLElement} target
	 * @param {Object} [options={}]
	 * @param {string}   [options.initialView]
	 * @param {boolean}  [options.editable]
	 * @param {boolean}  [options.selectable]
	 * @param {Array|string} [options.events]  Array o URL AJAX.
	 * @param {Function} [options.onEventClick]
	 * @param {Function} [options.onDateClick]
	 * @param {Function} [options.onEventDrop]
	 * @param {Function} [options.onSelect]
	 * @returns {FC|null}
	 */
	create(target, options = {}) {
		const el = _el(target);
		if (!el) {
			console.warn("[Calendar] Elemento no encontrado:", target);
			return null;
		}
		if (_instances.has(el)) return _instances.get(el);

		const cfg = config.fullcalendar || {};
		const calendar = new FC(el, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			locale: esLocale,
			initialView: options.initialView ?? cfg.initialView ?? "dayGridMonth",
			editable: options.editable ?? cfg.editable ?? true,
			selectable: options.selectable ?? cfg.selectable ?? true,
			firstDay: cfg.firstDay ?? 1,
			buttonText: cfg.buttonText ?? {
				today: "Hoy", month: "Mes", week: "Semana", day: "Día", list: "Agenda",
			},
			headerToolbar: cfg.headerToolbar ?? {
				left: "prev,next today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
			},
			events: options.events ?? [],
			eventClick: options.onEventClick ? (i) => options.onEventClick(i) : undefined,
			dateClick: options.onDateClick ? (i) => options.onDateClick(i) : undefined,
			eventDrop: options.onEventDrop ? (i) => options.onEventDrop(i) : undefined,
			select: options.onSelect ? (i) => options.onSelect(i) : undefined,
			eventAdd: options.onEventAdd ? (i) => options.onEventAdd(i) : undefined,
			eventRemove: options.onEventRemove ? (i) => options.onEventRemove(i) : undefined,
			// Permite sobreescribir cualquier opción
			...Object.fromEntries(
				Object.entries(options).filter(
					([k]) =>
						![
							"initialView",
							"editable",
							"selectable",
							"events",
							"onEventClick",
							"onDateClick",
							"onEventDrop",
							"onSelect",
							"onEventAdd",
							"onEventRemove",
						].includes(k),
				),
			),
		});

		calendar.render();
		_instances.set(el, calendar);
		return calendar;
	},

	/**
	 * Retorna la instancia FC de un elemento.
	 * @param {string|HTMLElement} target
	 * @returns {FC|null}
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
		if (cal) {
			cal.destroy();
			_instances.delete(el);
		}
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
	 * @param {string|HTMLElement} target
	 * @param {string|number} eventId
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
	 * @param {string|HTMLElement} target
	 * @param {Date|string} date
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
	 * @param {string|HTMLElement} container
	 * @param {Object} [options={}]
	 * @returns {Draggable|null}
	 */
	draggable(container, options = {}) {
		const el = _el(container);
		if (!el) {
			console.warn("[Calendar] Contenedor draggable no encontrado:", container);
			return null;
		}
		return new Draggable(el, {
			itemSelector: ".fc-event",
			eventData(eventEl) {
				const style = window.getComputedStyle(eventEl);
				return {
					title: eventEl.innerText.trim(),
					backgroundColor: style.backgroundColor,
					borderColor: style.borderColor,
				};
			},
			...options,
		});
	},
};

export default Calendar;
