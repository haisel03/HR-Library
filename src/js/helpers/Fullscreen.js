import Dom from "./Dom";

/**
 * @module Fullscreen
 * @description Helper para manejar el modo de pantalla completa.
 */

const Fullscreen = {
	/**
	 * Solicita entrar en modo pantalla completa
	 */
	request: (target = document.documentElement) => {
		const element = Dom.el(target);
		if (!element) return;

		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},

	/**
	 * Sale del modo pantalla completa
	 */
	exit: () => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	},

	/**
	 * Alterna el modo pantalla completa
	 */
	toggle: (target = document.documentElement) => {
		if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			Fullscreen.request(target);
		} else {
			Fullscreen.exit();
		}
	},

	/**
	 * Inicializa el binding automático
	 */
	init: () => {
		Dom.on(document, "click", (e) => {
			const btn = e.target.closest('[data-widget="fullscreen"]');
			if (btn) {
				e.preventDefault();
				Fullscreen.toggle();
			}
		});

		const updateIcons = () => {
			const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
			const buttons = document.querySelectorAll('[data-widget="fullscreen"]');

			buttons.forEach((btn) => {
				const icon = btn.querySelector("i");
				if (icon) {
					if (isFS) {
						icon.classList.remove("bi-fullscreen");
						icon.classList.add("bi-fullscreen-exit");
					} else {
						icon.classList.remove("bi-fullscreen-exit");
						icon.classList.add("bi-fullscreen");
					}
				}
			});
		};

		Dom.on(document, "fullscreenchange", updateIcons);
		Dom.on(document, "webkitfullscreenchange", updateIcons);
		Dom.on(document, "msfullscreenchange", updateIcons);
	},
};

export default Fullscreen;
