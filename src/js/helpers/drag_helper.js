import dragula from "dragula";
import "dragula/dist/dragula.css";

/**
 * @namespace drag
 * @description Helper para drag & drop usando Dragula
 */
const drag = (() => {
  /** @type {Map<string, any>} */
  const instances = new Map();

  /* =====================================================
     CORE
  ===================================================== */

  /**
   * Inicializa Dragula
   *
   * @param {string} key Identificador del grupo
   * @param {HTMLElement[]} containers
   * @param {Object} [options]
   * @returns {any}
   */
  const create = (key, containers = [], options = {}) => {
    if (instances.has(key)) return instances.get(key);

    const drake = dragula(containers, options);
    instances.set(key, drake);
    return drake;
  };

  /**
   * Retorna instancia Dragula
   *
   * @param {string} key
   */
  const get = (key) => instances.get(key) ?? null;

  /**
   * Destruye una instancia
   *
   * @param {string} key
   */
  const destroy = (key) => {
    const drake = instances.get(key);
    if (drake) {
      drake.destroy();
      instances.delete(key);
    }
  };

  return {
    create,
    get,
    destroy,
  };
})();

export default drag;
