/**
 * @module Event
 * @description
 * Bus de eventos pub/sub para HR-Library.
 * Permite comunicación desacoplada entre helpers y módulos
 * sin imports circulares ni callbacks anidados.
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 1.0.0
 *
 * @example
 * import Event from "./Event.js";
 *
 * // Suscribirse
 * Event.on("usuario:guardado", (data) => {
 *   Table.reload("#tblUsuarios");
 *   Alert.success("Usuario guardado");
 * });
 *
 * // Publicar
 * Event.emit("usuario:guardado", { id: 5, nombre: "Juan" });
 *
 * // Una sola vez
 * Event.once("app:lista", () => console.log("Sistema listo"));
 *
 * // Desuscribirse
 * const handler = (data) => console.log(data);
 * Event.on("test", handler);
 * Event.off("test", handler);
 */

// ─────────────────────────────────────────────
// Estado interno
// ─────────────────────────────────────────────

/**
 * Mapa interno de evento → array de handlers.
 * @private
 * @type {Map<string, Function[]>}
 */
const _bus = new Map();

// ─────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────

/**
 * @namespace Event
 */
const Event = {

	// ── Suscripción ───────────────────────────────────────────────────────

	/**
	 * Suscribe un handler a un evento.
	 * Si el mismo handler ya está suscrito al mismo evento, no se duplica.
	 *
	 * @param {string}   event   - Nombre del evento. Convención: "modulo:accion".
	 * @param {Function} handler - Función a ejecutar cuando se emita el evento.
	 * @returns {void}
	 *
	 * @example
	 * Event.on("usuario:guardado", (data) => Table.reload("#tblUsuarios"));
	 * Event.on("form:limpiado",    ()     => console.log("Formulario limpio"));
	 */
	on(event, handler) {
		if (typeof handler !== "function") {
			console.warn(`[Event] Handler inválido para "${event}"`);
			return;
		}

		if (!_bus.has(event)) _bus.set(event, []);

		// Evitar duplicados del mismo handler en el mismo evento
		const handlers = _bus.get(event);
		if (!handlers.includes(handler)) {
			handlers.push(handler);
		}
	},

	/**
	 * Suscribe un handler que se ejecuta una sola vez.
	 * Se elimina automáticamente tras la primera ejecución.
	 *
	 * @param {string}   event
	 * @param {Function} handler
	 * @returns {void}
	 *
	 * @example
	 * Event.once("app:lista", () => console.log("Sistema listo"));
	 */
	once(event, handler) {
		if (typeof handler !== "function") {
			console.warn(`[Event] Handler inválido para "${event}"`);
			return;
		}

		const wrapper = (data) => {
			handler(data);
			this.off(event, wrapper);
		};

		// Guardar referencia al original para poder desuscribir manualmente
		wrapper._original = handler;

		this.on(event, wrapper);
	},

	/**
	 * Desuscribe un handler de un evento.
	 * Soporta handlers registrados con `once()`.
	 *
	 * @param {string}   event
	 * @param {Function} handler - La misma referencia usada en `on()` u `once()`.
	 * @returns {void}
	 *
	 * @example
	 * const handler = (data) => console.log(data);
	 * Event.on("test", handler);
	 * Event.off("test", handler);
	 */
	off(event, handler) {
		if (!_bus.has(event)) return;

		const filtered = _bus
			.get(event)
			.filter((h) => h !== handler && h._original !== handler);

		filtered.length
			? _bus.set(event, filtered)
			: _bus.delete(event);
	},

	// ── Publicación ───────────────────────────────────────────────────────

	/**
	 * Publica un evento ejecutando todos los handlers suscritos.
	 * Los handlers se ejecutan de forma síncrona en orden de suscripción.
	 * Los errores individuales se capturan para no interrumpir la cadena.
	 *
	 * @param {string} event      - Nombre del evento.
	 * @param {*}      [data]     - Datos a pasar a los handlers.
	 * @returns {void}
	 *
	 * @example
	 * Event.emit("usuario:guardado", { id: 5, nombre: "Juan" });
	 * Event.emit("tabla:recargada");
	 * Event.emit("modal:cerrado", { modalId: "#mdlUsuario" });
	 */
	emit(event, data) {
		if (!_bus.has(event)) return;

		// Copiar array antes de iterar — un handler podría llamar off() durante emit()
		[..._bus.get(event)].forEach((handler) => {
			try {
				handler(data);
			} catch (error) {
				console.error(`[Event] Error en handler de "${event}":`, error);
			}
		});
	},

	// ── Limpieza ──────────────────────────────────────────────────────────

	/**
	 * Elimina todos los handlers de un evento específico.
	 *
	 * @param {string} event
	 * @returns {void}
	 *
	 * @example
	 * Event.clear("usuario:guardado");
	 */
	clear(event) {
		_bus.delete(event);
	},

	/**
	 * Elimina todos los eventos y handlers registrados.
	 * Útil al destruir una vista o en tests.
	 *
	 * @returns {void}
	 *
	 * @example
	 * Event.clearAll();
	 */
	clearAll() {
		_bus.clear();
	},

	// ── Inspección ────────────────────────────────────────────────────────

	/**
	 * Lista los nombres de todos los eventos registrados.
	 * @returns {string[]}
	 *
	 * @example
	 * Event.events(); // ["usuario:guardado", "app:lista"]
	 */
	events: () => [..._bus.keys()],

	/**
	 * Retorna la cantidad de handlers registrados para un evento.
	 * @param {string} event
	 * @returns {number}
	 *
	 * @example
	 * Event.count("usuario:guardado"); // 2
	 */
	count: (event) => _bus.get(event)?.length ?? 0,

	/**
	 * Verifica si un evento tiene al menos un handler suscrito.
	 * @param {string} event
	 * @returns {boolean}
	 *
	 * @example
	 * if (Event.has("usuario:guardado")) { ... }
	 */
	has: (event) => _bus.has(event) && _bus.get(event).length > 0,

	// ── Init ──────────────────────────────────────────────────────────────

	/**
	 * Punto de entrada del helper. Reservado para Init.js.
	 * @returns {void}
	 */
	init() { },

};

export default Object.freeze(Event);
