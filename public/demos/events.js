/**
 * @file events.js
 * @description Demo de Calendario Avanzado con eventos arrastrables (AdminLTE style)
 */

$(async function () {
	const calendarEl = HR.el('calendar');
	if (!calendarEl) return;

	// 1. Inicializar Draggable
	HR.calendarDraggable('external-events', {
		itemSelector: '.fc-event',
		eventData: function (eventEl) {
			return {
				title: eventEl.innerText,
				backgroundColor: window.getComputedStyle(eventEl).backgroundColor,
				borderColor: window.getComputedStyle(eventEl).borderColor
			};
		}
	});

	// 2. Inicializar Calendario
	const calendar = HR.initCalendar('calendar', {
		themeSystem: 'bootstrap5',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
		},
		buttonText: {
			today: 'Hoy',
			month: 'Mes',
			week: 'Semana',
			day: 'Día',
			list: 'Agenda'
		},
		events: 'json/events.json',
		droppable: true,
		drop: function (info) {
			if ($('#drop-remove').is(':checked')) {
				info.draggedEl.parentNode.removeChild(info.draggedEl);
			}
			HR.toastSuccess(`Evento "${info.draggedEl.innerText}" agregado al calendario`);
			calculateNextEvent();
		},
		select: function (info) {
			openEventModal(null, info);
		},
		eventClick: function (info) {
			openEventModal(info.event);
		},
		eventDrop: () => calculateNextEvent(),
		eventResize: () => calculateNextEvent()
	});

	// 3. Setup Flatpickr
	const startPicker = flatpickr("#eventStart", HR.flatpickrConfig({ enableTime: true }));
	const endPicker = flatpickr("#eventEnd", HR.flatpickrConfig({ enableTime: true }));

	// 4. Lógica del Modal
	function openEventModal(event = null, info = null) {
		HR.clearForm('#eventForm');
		$('#btn-delete-event').addClass('d-none');

		if (event) {
			HR.val('#eventId', event.id);
			HR.val('#eventTitle', event.title);
			startPicker.setDate(event.start);
			endPicker.setDate(event.end);
			HR.val('#eventColor', event.backgroundColor);
			$('#btn-delete-event').removeClass('d-none');
		} else if (info) {
			startPicker.setDate(info.start);
			endPicker.setDate(info.end);
		}

		HR.openModal('eventModal');
	}

	$('#btn-save-event').on('click', function () {
		const id = HR.val('#eventId');
		const eventData = {
			title: HR.val('#eventTitle'),
			start: HR.val('#eventStart'),
			end: HR.val('#eventEnd'),
			backgroundColor: HR.val('#eventColor'),
			borderColor: HR.val('#eventColor')
		};

		if (!eventData.title) return HR.msgWarning("El título es obligatorio");

		if (id) {
			const existing = calendar.getEventById(id);
			if (existing) {
				existing.setProp('title', eventData.title);
				existing.setStart(eventData.start);
				existing.setEnd(eventData.end);
				existing.setProp('backgroundColor', eventData.backgroundColor);
				existing.setProp('borderColor', eventData.borderColor);
			}
		} else {
			calendar.addEvent({ ...eventData, id: String(Date.now()) });
		}

		HR.closeModal('eventModal');
		HR.toastSuccess(id ? "Evento actualizado" : "Evento creado");
		calculateNextEvent();
	});

	$('#btn-delete-event').on('click', function () {
		const id = HR.val('#eventId');
		HR.msgConfirm("¿Eliminar evento?", "Esta acción no se puede deshacer.", () => {
			calendar.getEventById(id)?.remove();
			HR.closeModal('eventModal');
			HR.toastInfo("Evento eliminado");
			calculateNextEvent();
		});
	});

	// 5. Creador de Eventos Externos
	let currColor = '#007bff';
	$('#color-chooser a').on('click', function (e) {
		e.preventDefault();
		currColor = $(this).css('color');
		$('#add-new-event').css({
			'background-color': currColor,
			'border-color': currColor
		});
	});

	$('#add-new-event').on('click', function (e) {
		e.preventDefault();
		const val = $('#new-event-title').val();
		if (val.length == 0) return;

		const eventHtml = $(`<div class="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-2 p-2 rounded cursor-pointer" style="background-color: ${currColor}; border-color: ${currColor};">${val}</div>`);
		$('#external-events').prepend(eventHtml);
		$('#new-event-title').val('');
	});

	// 6. Humanize Integration
	function calculateNextEvent() {
		setTimeout(() => {
			const now = new Date();
			const events = calendar.getEvents().filter(e => e.start > now).sort((a, b) => a.start - b.start);

			if (events.length > 0) {
				$('#no-events-info').addClass('d-none');
				$('#next-event-info').removeClass('d-none');
				HR.text('#next-event-title', events[0].title);
				HR.text('#next-event-time', HR.humanizeTimeRemaining(events[0].start));
			} else {
				$('#no-events-info').removeClass('d-none');
				$('#next-event-info').addClass('d-none');
			}
		}, 100);
	}

	// Inicial
	setTimeout(calculateNextEvent, 500);
});
