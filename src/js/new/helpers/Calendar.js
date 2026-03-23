import { Calendar as FC } from "@fullcalendar/core";
import { Draggable as FCDraggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

/**
 * @module Calendar
 * @description Helper para FullCalendar
 */

const instances = new Map();

const Calendar = {
	/**
	 * Inicializa un calendario
	 */
	init: (target, options = {}) => {
		const el = target instanceof HTMLElement ? target : document.getElementById(target);
		if (!el) return null;

		const calendar = new FC(el, {
			plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
			initialView: "dayGridMonth",
			selectable: true,
			editable: true,
			...options,
			locale: "es",
		});

		calendar.render();
		instances.set(el, calendar);
		return calendar;
	},

	/**
	 * Obtiene una instancia de calendario
	 */
	get: (target) => {
		const el = target instanceof HTMLElement ? target : document.getElementById(target);
		return instances.get(el) ?? null;
	},

	/**
	 * Crea una instancia de Draggable para eventos externos
	 */
	draggable: (container, options = {}) => {
		const el = container instanceof HTMLElement ? container : document.getElementById(container);
		if (!el) return null;

		return new FCDraggable(el, {
			itemSelector: ".fc-event",
			eventData: function (eventEl) {
				return {
					title: eventEl.innerText,
					backgroundColor: window.getComputedStyle(eventEl).backgroundColor,
					borderColor: window.getComputedStyle(eventEl).borderColor,
				};
			},
			...options,
		});
	},

	/**
	 * Agrega un evento
	 */
	addEvent: (target, event) => {
		const cal = Calendar.get(target);
		cal?.addEvent(event);
	},

	/**
	 * Elimina todos los eventos
	 */
	clearEvents: (target) => {
		const cal = Calendar.get(target);
		cal?.removeAllEvents();
	},
};

export default Calendar;
