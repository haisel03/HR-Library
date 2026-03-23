/**
 * @file events.js
 * @description Demo de Calendario Avanzado con eventos arrastrables.
 *
 * CAMBIOS v3:
 * - $Dom.el('calendar')         → $Dom.el('#calendar') — necesita # para selector
 * - $Calendar.draggable('external-events', ...) → $Calendar.draggable('#external-events', ...)
 * - $Calendar.init('calendar', ...) → $Calendar.init('#calendar', ...)
 * - flatpickr("#el", $Date.flatpickr({...})) — $Date.flatpickr() devuelve opciones
 *   type no es necesario cuando se pasan overrides directos (enableTime funciona directo)
 * - $HR.clearForm  → $Forms.clear
 * - $HR.val        → $Dom.val
 * - $HR.openModal  → $Modal.open
 * - $HR.closeModal → $Modal.close
 * - $HR.msgWarning → $Alert.warning
 * - $HR.msgConfirm → $Alert.confirm
 * - $HR.text       → $Dom.text
 * - $HR.humanizeTimeRemaining → $Humanize.timeRemaining
 */

$(async function () {
	const calendarEl = $Dom.el("#calendar");
	if (!calendarEl) return;

	// 1. Inicializar Draggable — necesita selector con # o ID
	$Calendar.draggable("#external-events", {
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
	const calendar = $Calendar.init("#calendar", {
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
			$Alert.toast.success(`Evento "${info.draggedEl.innerText}" agregado al calendario`);
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

	// 3. Setup Flatpickr — $Date.flatpickr() devuelve opciones, no inicializa por sí solo
	const startPicker = flatpickr("#eventStart", $Date.flatpickr({ type: "datetime" }));
	const endPicker   = flatpickr("#eventEnd",   $Date.flatpickr({ type: "datetime" }));

	// 4. Lógica del Modal
	function openEventModal(event = null, info = null) {
		$Forms.clear("#eventForm");
		$("#btn-delete-event").addClass("d-none");

		if (event) {
			$Dom.val("#eventId",    event.id);
			$Dom.val("#eventTitle", event.title);
			startPicker.setDate(event.start);
			endPicker.setDate(event.end);
			$Dom.val("#eventColor", event.backgroundColor);
			$("#btn-delete-event").removeClass("d-none");
		} else if (info) {
			startPicker.setDate(info.start);
			endPicker.setDate(info.end);
		}

		$Modal.open("#eventModal");
	}

	$("#btn-save-event").on("click", function () {
		const id        = $Dom.val("#eventId");
		const eventData = {
			title:           $Dom.val("#eventTitle"),
			start:           $Dom.val("#eventStart"),
			end:             $Dom.val("#eventEnd"),
			backgroundColor: $Dom.val("#eventColor"),
			borderColor:     $Dom.val("#eventColor"),
		};

		if (!eventData.title) return $Alert.warning("El título es obligatorio");

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

		$Modal.close("#eventModal");
		$Alert.toast.success(id ? "Evento actualizado" : "Evento creado");
		calculateNextEvent();
	});

	$("#btn-delete-event").on("click", function () {
		const id = $Dom.val("#eventId");
		$Alert.confirm("¿Eliminar evento?", "Esta acción no se puede deshacer.", () => {
			calendar.getEventById(id)?.remove();
			$Modal.close("#eventModal");
			$Alert.toast.info("Evento eliminado");
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

	// 6. Humanize — $Humanize.timeRemaining en lugar de $HR.humanizeTimeRemaining
	function calculateNextEvent() {
		setTimeout(() => {
			const now    = new Date();
			const events = calendar.getEvents()
				.filter((e) => e.start > now)
				.sort((a, b) => a.start - b.start);

			if (events.length > 0) {
				$("#no-events-info").addClass("d-none");
				$("#next-event-info").removeClass("d-none");
				$Dom.text("#next-event-title", events[0].title);
				$Dom.text("#next-event-time",  $Humanize.timeRemaining(events[0].start));
			} else {
				$("#no-events-info").removeClass("d-none");
				$("#next-event-info").addClass("d-none");
			}
		}, 100);
	}

	setTimeout(calculateNextEvent, 500);
});
