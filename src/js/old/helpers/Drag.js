import dragula from "dragula";
import "dragula/dist/dragula.css";

/**
 * @module Drag
 * @description Helper para drag & drop usando Dragula.
 */

const instances = new Map();

const Drag = {
	/**
	 * Inicializa Dragula
	 */
	create: (key, containers = [], options = {}) => {
		if (instances.has(key)) return instances.get(key);

		const drake = dragula(containers, options);
		instances.set(key, drake);
		return drake;
	},

	/**
	 * Retorna instancia Dragula
	 */
	get: (key) => instances.get(key) ?? null,

	/**
	 * Destruye una instancia
	 */
	destroy: (key) => {
		const drake = instances.get(key);
		if (drake) {
			drake.destroy();
			instances.delete(key);
		}
	},
};

export default Drag;
