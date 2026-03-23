import $ from "jquery";
import config from "../core/config.js";

const initAccessControl = () => {
    const modules = config.modules;

    if (!modules) return;

    // Recorrer configuración y ocultar módulos desactivados
    Object.keys(modules).forEach(moduleName => {
        const isEnabled = modules[moduleName];

        if (!isEnabled) {
            // Buscar elementos con data-module="nombre" y ocultarlos
            const elements = document.querySelectorAll(`[data-module="${moduleName}"]`);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        }
    });
};

// Ejecutar al inicio
$(function () {
    initAccessControl();
});

export default initAccessControl;
