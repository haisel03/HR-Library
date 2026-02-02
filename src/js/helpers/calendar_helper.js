import { Calendar } from "@fullcalendar/core";
import { Draggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

/**
 * @namespace calendar
 * @description Helper para FullCalendar
 */

const instances = new Map();

/**
 * Inicializa un calendario
 * @param {string|HTMLElement} target
 * @param {Object} options
 * @returns {Calendar|null}
 */
const init = (target, options = {}) => {
	const el =
		target instanceof HTMLElement
			? target
			: document.getElementById(target);

	if (!el) return null;

	const calendar = new Calendar(el, {
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
};

/**
 * Obtiene una instancia de calendario
 * @param {string|HTMLElement} target
 * @returns {Calendar|null}
 */
const get = (target) => {
	const el =
		target instanceof HTMLElement
			? target
			: document.getElementById(target);

	return instances.get(el) ?? null;
};

/**
 * Crea una instancia de Draggable para eventos externos
 * @param {string|HTMLElement} container
 * @param {Object} [options]
 * @returns {Draggable}
 */
const draggable = (container, options = {}) => {
	const el =
		container instanceof HTMLElement
			? container
			: document.getElementById(container);

	if (!el) return null;

	return new Draggable(el, {
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
};

/**
 * Agrega un evento
 * @param {string|HTMLElement} target
 * @param {Object} event
 */
const addEvent = (target, event) => {
	const cal = get(target);
	cal?.addEvent(event);
};

/**
 * Elimina todos los eventos
 * @param {string|HTMLElement} target
 */
const clearEvents = (target) => {
	const cal = get(target);
	cal?.removeAllEvents();
};

export default {
	init,
	get,
	addEvent,
	clearEvents,
	draggable,
};
