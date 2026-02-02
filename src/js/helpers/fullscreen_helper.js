/**
 * @module fullscreen
 * @description
 * Helper para manejar el modo de pantalla completa.
 */

import dom from "./dom_helper";

/**
 * Solicita entrar en modo pantalla completa
 * @param {HTMLElement|string} [target=document.documentElement]
 */
const request = (target = document.documentElement) => {
	const element = dom.el(target);
	if (!element) return;

	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		/* Safari */
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		/* IE11 */
		element.msRequestFullscreen();
	}
};

/**
 * Sale del modo pantalla completa
 */
const exit = () => {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen();
	}
};

/**
 * Alterna el modo pantalla completa
 * @param {HTMLElement|string} [target=document.documentElement]
 */
const toggle = (target = document.documentElement) => {
	if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		request(target);
	} else {
		exit();
	}
};

/**
 * Inicializa el binding automático para elementos con data-widget="fullscreen"
 */
const init = () => {
	// Binding de click
	dom.on(document, "click", (e) => {
		const btn = e.target.closest('[data-widget="fullscreen"]');
		if (btn) {
			e.preventDefault();
			toggle();
		}
	});

	// Detección de cambio de estado para actualizar iconos
	const updateIcons = () => {
		const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
		const buttons = document.querySelectorAll('[data-widget="fullscreen"]');

		buttons.forEach(btn => {
			const icon = btn.querySelector('i');
			if (icon) {
				if (isFS) {
					icon.classList.remove('fa-expand');
					icon.classList.add('fa-compress');
				} else {
					icon.classList.remove('fa-compress');
					icon.classList.add('fa-expand');
				}
			}
		});
	};

	dom.on(document, "fullscreenchange", updateIcons);
	dom.on(document, "webkitfullscreenchange", updateIcons);
	dom.on(document, "msfullscreenchange", updateIcons);
};

export default {
	request,
	exit,
	toggle,
	init,
};
