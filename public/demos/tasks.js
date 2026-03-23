/**
 * @file tasks.js
 * @description Demo de Tablero Kanban con datos JSON y humanización de tiempos.
 *
 * CAMBIOS v3:
 * - $HR.msgLoading()              → $Alert.loading()
 * - $HR.msgLoading(true)          → $Alert.loading(false)
 * - $HR.msgError                  → $Alert.error
 * - $HR.msgWarning                → $Alert.warning
 * - $HR.msgConfirm                → $Alert.confirm
 * - $HR.getApi                    → $Api.get
 * - $HR.clearForm                 → $Forms.clear
 * - $HR.text                      → $Dom.text  (no usado aquí)
 * - $HR.openModal / closeModal    → $Modal.open / $Modal.close
 * - $HR.serializeForm             → $Forms.serialize
 * - $HR.formatDate(date)          → $Date.format(date)
 * - $HR.now()                     → $Date.now()
 * - $HR.humanizeTimeAgo           → $Humanize.timeAgo
 * - $HR.humanizeTimeRemaining     → $Humanize.timeRemaining
 */

$(async function () {
	// 1. Inicializar Dragula
	const containers = [
		document.getElementById("tasks-pending"),
		document.getElementById("tasks-progress"),
		document.getElementById("tasks-completed"),
	];

	const drake = $Drag.create("kanban", containers, {
		moves:   () => true,
		accepts: () => true,
	});

	// 2. Eventos de Dragula
	drake.on("drop", function (el, target, source, sibling) {
		const status = target.dataset.status;
		updateCardColor(el, status);
		updateCounts();

		const isCompleted = status === "completed";
		$(el).find(".task-check").prop("checked", isCompleted);
		refreshCardTime(el, status);

		$Alert.toast.info(`Tarea movida a ${$(target).closest(".card").find(".card-title").text()}`);
	});

	// 3. Cargar Tareas desde JSON
	$Alert.loading();
	try {
		const tasks = await $Api.get("json/tasks.json");
		tasks.forEach((t) => $(`#tasks-${t.status}`).append(createTaskCard(t)));
		updateCounts();
		$Alert.loading(false);
	} catch (e) {
		$Alert.loading(false);
		$Alert.error("No se pudieron cargar las tareas.");
	}

	// 4. Crear Tarea
	$("#btnNewTask").on("click", function () {
		$Forms.clear("#taskForm");
		$Dom.text("#taskModalTitle", "Crear Nueva Tarea");
		$Modal.open("#taskModal");
	});

	$("#taskForm").on("submit", function (e) {
		e.preventDefault();

		const data = $Forms.serialize("#taskForm");
		if (!data.title) return $Alert.warning("Por favor ingresa un título");

		const t = {
			id:          "task-" + Date.now(),
			title:       data.title,
			description: data.description,
			priority:    data.priority,
			responsible: data.responsible,
			start_date:  data.start_date,
			end_date:    data.end_date,
			status:      "pending",
		};

		$("#tasks-pending").append(createTaskCard(t));
		$Modal.close("#taskModal");
		$Alert.toast.success("Tarea agregada correctamente");
		updateCounts();
	});

	// 5. Checkbox
	$(document).on("change", ".task-check", function () {
		const card   = $(this).closest(".task-card");
		const status = this.checked ? "completed" : "pending";
		$(`#tasks-${status}`).append(card);
		updateCardColor(card[0], status);
		refreshCardTime(card[0], status);
		updateCounts();
	});

	// 6. Eliminar Tarea
	$(document).on("click", ".btn-delete-task", function () {
		const card = $(this).closest(".task-card");
		$Alert.confirm("¿Eliminar tarea?", "¿Estás seguro?", () => {
			card.fadeOut(300, function () { $(this).remove(); updateCounts(); });
		});
	});

	/* ── Helpers locales ── */

	function createTaskCard(t) {
		const borderClass   = getBorderClass(t.status);
		const priorityBadge = getPriorityBadge(t.priority);
		const isChecked     = t.status === "completed" ? "checked" : "";
		const timeHtml      = getTimeHtml(t);

		return `
			<div class="card mb-3 task-card shadow-sm border-start border-4 ${borderClass}" id="${t.id}"
			     data-start="${t.start_date}" data-end="${t.end_date}" data-completed="${t.completed_at || ""}">
				<div class="card-body p-3">
					<div class="d-flex justify-content-between align-items-start mb-2">
						<div class="form-check m-0">
							<input class="form-check-input task-check" type="checkbox" ${isChecked}>
						</div>
						<button class="btn btn-link btn-sm p-0 border-0 text-muted btn-delete-task">
							<i class="bi bi-x-lg"></i>
						</button>
					</div>
					<h6 class="card-title fw-bold mb-1">${t.title}</h6>
					<p class="card-text small text-muted mb-2">${t.description || "Sin descripción"}</p>
					<div class="d-flex align-items-center mb-3">
						<div class="avatar-info">
							<small class="fw-bold d-block text-dark">${t.responsible}</small>
							<small class="text-muted time-info" style="font-size:.75rem;">${timeHtml}</small>
						</div>
					</div>
					<div class="d-flex justify-content-between align-items-center">
						${priorityBadge}
						<small class="text-muted" style="font-size:.7rem;">
							<i class="bi bi-calendar-event me-1"></i>${$Date.format(t.end_date)}
						</small>
					</div>
				</div>
			</div>`;
	}

	function getTimeHtml(t) {
		if (t.status === "completed") {
			const date = t.completed_at || $Date.now();
			return `<i class="bi bi-check2-all text-success me-1"></i>Finalizado hace ${$Humanize.timeAgo(date)}`;
		}
		return `<i class="bi bi-hourglass-split text-warning me-1"></i>Faltan ${$Humanize.timeRemaining(t.end_date)}`;
	}

	function refreshCardTime(el, status) {
		const card = $(el);
		const t    = { status, end_date: card.data("end"), completed_at: status === "completed" ? $Date.now() : null };
		card.find(".time-info").html(getTimeHtml(t));
	}

	function getBorderClass(status) {
		return { pending: "border-primary", progress: "border-warning", completed: "border-success" }[status] || "border-light";
	}

	function getPriorityBadge(priority) {
		const map = {
			low:    { class: "bg-light text-dark", text: "Baja" },
			medium: { class: "bg-info text-white",  text: "Media" },
			high:   { class: "bg-danger text-white", text: "Alta" },
		};
		const conf = map[priority] || map.medium;
		return `<span class="badge ${conf.class} small" style="font-size:.65rem;">${conf.text}</span>`;
	}

	function updateCardColor(el, status) {
		$(el).removeClass("border-primary border-warning border-success").addClass(getBorderClass(status));
	}

	function updateCounts() {
		$(".drag-container").each(function () {
			$(this).closest(".card").find(".badge-count").text($(this).find(".task-card").length);
		});
	}
});
