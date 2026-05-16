import config from "../core/config.js";

const initAccessControl = () => {
	const modules = config.modules;

	if (!modules) return;

	Object.keys(modules).forEach((moduleName) => {
		const isEnabled = modules[moduleName];

		if (!isEnabled) {
			const elements = document.querySelectorAll(`[data-module="${moduleName}"]`);
			elements.forEach((el) => {
				el.style.display = "none";
			});
		}
	});
};

export default initAccessControl;
