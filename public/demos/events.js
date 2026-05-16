/**
 * @file events.js
 * @description Demo de Calendario Avanzado con eventos arrastrables.
 *
 * $/
 */

$(async function () {
	const calendarEl = App.el("#calendar");
	if (!calendarEl) return;

	// 1. Inicializar Draggable — necesita selector con # o ID
	App.calendarDraggable("#external-events", {
		itemSelector: ".fc-event",
		eventData: function (eventEl) {
			return {
				title:           eventEl.innerText,
				backgroundColor: window.getComputedStyle(eventEl).backgroundColor,
				borderColor:     window.getComputedStyle(eventEl).borderColor,
			};
		},
	});

	// 2. Inicializar Calendario
	const calendar = App.initCalendar("#calendar", {
		themeSystem: "bootstrap5",
		headerToolbar: {
			left:   "prev,next today",
			center: "title",
			right:  "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
		},
		events:    "json/events.json",
		droppable: true,
		drop: function (info) {
			if ($("#drop-remove").is(":checked")) {
				info.draggedEl.parentNode.removeChild(info.draggedEl);
			}
			App.toastSuccess(`Evento "${info.draggedEl.innerText}" agregado al calendario`);
			calculateNextEvent();
		},
		select: function (info) {
			openEventModal(null, info);
		},
		eventClick: function (info) {
			openEventModal(info.event);
		},
		eventDrop:   () => calculateNextEvent(),
		eventResize: () => calculateNextEvent(),
	});

	// 3. Setup Flatpickr — App.flatpickrOptions() devuelve opciones, no inicializa por sí solo
	const startPicker = flatpickr("#eventStart", App.flatpickrOptions({ type: "datetime" }));
	const endPicker   = flatpickr("#eventEnd",   App.flatpickrOptions({ type: "datetime" }));

	// 4. Lógica del Modal
	function openEventModal(event = null, info = null) {
		App.clearForm("#eventForm");
		$("#btn-delete-event").addClass("d-none");

		if (event) {
			App.val("#eventId",    event.id);
			App.val("#eventTitle", event.title);
			startPicker.setDate(event.start);
			endPicker.setDate(event.end);
			App.val("#eventColor", event.backgroundColor);
			$("#btn-delete-event").removeClass("d-none");
		} else if (info) {
			startPicker.setDate(info.start);
			endPicker.setDate(info.end);
		}

		App.modalOpen("#eventModal");
	}

	$("#btn-save-event").on("click", function () {
		const id        = App.val("#eventId");
		const eventData = {
			title:           App.val("#eventTitle"),
			start:           App.val("#eventStart"),
			end:             App.val("#eventEnd"),
			backgroundColor: App.val("#eventColor"),
			borderColor:     App.val("#eventColor"),
		};

		if (!eventData.title) return App.warning("El título es obligatorio");

		if (id) {
			const existing = calendar.getEventById(id);
			if (existing) {
				existing.setProp("title",           eventData.title);
				existing.setStart(eventData.start);
				existing.setEnd(eventData.end);
				existing.setProp("backgroundColor", eventData.backgroundColor);
				existing.setProp("borderColor",     eventData.borderColor);
			}
		} else {
			calendar.addEvent({ ...eventData, id: String(Date.now()) });
		}

		App.modalClose("#eventModal");
		App.toastSuccess(id ? "Evento actualizado" : "Evento creado");
		calculateNextEvent();
	});

	$("#btn-delete-event").on("click", function () {
		const id = App.val("#eventId");
		App.confirm("¿Eliminar evento?", "Esta acción no se puede deshacer.", () => {
			calendar.getEventById(id)?.remove();
			App.modalClose("#eventModal");
			App.toastInfo("Evento eliminado");
			calculateNextEvent();
		});
	});

	// 5. Creador de Eventos Externos
	let currColor = "#007bff";
	$("#color-chooser a").on("click", function (e) {
		e.preventDefault();
		currColor = $(this).css("color");
		$("#add-new-event").css({ "background-color": currColor, "border-color": currColor });
	});

	$("#add-new-event").on("click", function (e) {
		e.preventDefault();
		const val = $("#new-event-title").val();
		if (!val.length) return;
		const eventHtml = $(`<div class="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-2 p-2 rounded cursor-pointer"
			style="background-color: ${currColor}; border-color: ${currColor};">${val}</div>`);
		$("#external-events").prepend(eventHtml);
		$("#new-event-title").val("");
	});

	// 6. Humanize — $Humanize.timeRemaining en lugar de App.humanizeTimeRemaining
	function calculateNextEvent() {
		setTimeout(() => {
			const now    = new Date();
			const events = calendar.getEvents()
				.filter((e) => e.start > now)
				.sort((a, b) => a.start - b.start);

			if (events.length > 0) {
				$("#no-events-info").addClass("d-none");
				$("#next-event-info").removeClass("d-none");
				App.text("#next-event-title", events[0].title);
				App.text("#next-event-time",  App.humanizeTimeRemaining(events[0].start));
			} else {
				$("#no-events-info").removeClass("d-none");
				$("#next-event-info").addClass("d-none");
			}
		}, 100);
	}

	setTimeout(calculateNextEvent, 500);
});

