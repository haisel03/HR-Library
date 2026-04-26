/**
 * @module Pass
 * @description Helper tipo Data API para toggle de passwords
 * @author Haisel
 */

const Pass = (() => {
	let _initialized = false;

	const DEFAULTS = {
		iconShow: "bi-eye",
		iconHide: "bi-eye-slash",
		container: "[data-password-container]",
	};

	let config = { ...DEFAULTS };

	// 🔹 Toggle principal
	const toggle = (input, toggler) => {
		const isHidden = input.type === "password";

		const icon = toggler.querySelector("i");

		const showIcon = toggler.dataset.iconShow || config.iconShow;
		const hideIcon = toggler.dataset.iconHide || config.iconHide;

		input.type = isHidden ? "text" : "password";

		if (icon) {
			icon.classList.toggle(showIcon, isHidden);
			icon.classList.toggle(hideIcon, !isHidden);
		}

		toggler.setAttribute("aria-pressed", isHidden);
	};

	// 🔹 Buscar input relacionado
	const resolveTarget = (toggler) => {
		const selector = toggler.getAttribute("data-target");
		if (!selector) return null;

		const container = toggler.closest(config.container) || document;
		return container.querySelector(selector);
	};

	// 🔹 Event delegation (Data API)
	const handleClick = (e) => {
		const toggler = e.target.closest('[data-toggle="password"]');
		if (!toggler) return;

		const input = resolveTarget(toggler);
		if (!input) return;

		toggle(input, toggler);
	};

	// 🔹 Init automático
	const init = (options = {}) => {
		if (_initialized) return;

		config = { ...config, ...options };

		document.addEventListener("click", handleClick);

		_initialized = true;
	};

	// 🔹 Auto-init (como Bootstrap)
	document.addEventListener("DOMContentLoaded", () => {
		init();
	});

	return {
		init,
		toggle, // opcional (API manual)
		config: (options) => {
			config = { ...config, ...options };
		},
	};
})();

export default Pass;
