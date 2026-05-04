/**
 * @module plugin-system
 * @description
 * Sistema de registro e instalación de plugins para HR Library.
 * Garantiza que cada plugin se instale una sola vez.
 *
 * @version 3.0.0
 */

/**
 * @type {Set<Object|Function>}
 * @private
 */
const _installed = new Set();

/**
 * Instala un plugin en la instancia HR.
 * Si ya fue instalado, lo ignora silenciosamente.
 *
 * @param {Object} HR       - Instancia principal de HR Library.
 * @param {Object|Function} plugin
 * @param {string} [plugin.name]    - Nombre del plugin (recomendado).
 * @param {Function} [plugin.install] - Función de instalación.
 * @returns {void}
 *
 * @example
 * installPlugin(HR, {
 *   name: "MiPlugin",
 *   install(hr) { hr.MiHelper = MiHelper; }
 * });
 */
export function installPlugin(HR, plugin) {
  if (_installed.has(plugin)) return;

  if (typeof plugin?.install === "function") {
    plugin.install(HR);
  } else if (typeof plugin === "function") {
    plugin(HR);
  } else {
    console.warn("[HR] Plugin inválido — debe tener install() o ser una función:", plugin);
    return;
  }

  _installed.add(plugin);

  if (HR.config?.isDev?.()) {
    console.info(`[HR] Plugin instalado: ${plugin.name ?? "anónimo"}`);
  }
}

/** @param {Object|Function} plugin @returns {boolean} */
export const isInstalled = (plugin) => _installed.has(plugin);

/** @returns {string[]} Nombres de plugins instalados */
export const installedPlugins = () => [..._installed].map((p) => p.name ?? "anónimo");
