/**
 * @module theme
 * @description
 * 1) Exporta colores del tema activo a `window.theme` (para Chart.js, mapas, etc.)
 * 2) Theme Switcher: maneja light / dark / auto (sistema) usando data-bs-theme.
 *    Persiste la preferencia en localStorage.
 *
 * Uso en HTML: ver `navbar.hbs` → dropdown #themeDropdown con [data-theme].
 */

// ── Chart / Map color palette ─────────────────────────────────────────────────

const themeColors = {
	primary: "#003876",
	secondary: "#6c757d",
	success: "#198754",
	info: "#0dcaf0",
	warning: "#ffc107",
	danger: "#CE1126",
	white: "#fff",
	black: "#000",
};

window.theme = themeColors;

// ── Theme Switcher ────────────────────────────────────────────────────────────

const STORAGE_KEY = "hr-theme";

const ICON_MAP = {
	light: "bi-sun-fill",
	dark: "bi-moon-stars-fill",
	auto: "bi-circle-half",
};

/**
 * Resuelve el tema efectivo: si es "auto", consulta prefers-color-scheme.
 * @param {string} pref - "light" | "dark" | "auto"
 * @returns {string} "light" | "dark"
 */
function resolveTheme(pref) {
	if (pref === "auto") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return pref;
}

/**
 * Aplica el tema al DOM y actualiza el ícono / estado activo del dropdown.
 * @param {string} pref - "light" | "dark" | "auto"
 */
function applyTheme(pref) {
	const effective = resolveTheme(pref);

	document.documentElement.setAttribute("data-bs-theme", effective);
	document.body.classList.toggle("dark-mode", effective === "dark");

	// Ícono en el topbar
	const icon = document.getElementById("themeIcon");
	if (icon) {
		icon.className = `bi ${ICON_MAP[pref] || ICON_MAP.auto} align-middle`;
	}

	// Marcar activo en el dropdown
	document.querySelectorAll("#themeDropdown [data-theme]").forEach((el) => {
		el.classList.toggle("active", el.dataset.theme === pref);
	});
}

/**
 * Establece y persiste la preferencia de tema.
 * @param {string} pref - "light" | "dark" | "auto"
 */
function setTheme(pref) {
	localStorage.setItem(STORAGE_KEY, pref);
	applyTheme(pref);
}

/** @returns {string} Preferencia guardada o "light" por defecto */
function getPreference() {
	return localStorage.getItem(STORAGE_KEY) || "light";
}

// ── Inicialización ────────────────────────────────────────────────────────────

// Aplicar tema ASAP (antes de DOMContentLoaded para evitar flash)
applyTheme(getPreference());

document.addEventListener("DOMContentLoaded", () => {
	// Conectar clicks del dropdown
	document.querySelectorAll("#themeDropdown [data-theme]").forEach((item) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			setTheme(item.dataset.theme);
		});
	});

	// Re-aplicar para sincronizar ícono que pudo no existir antes del DOM
	applyTheme(getPreference());
});

// Reaccionar a cambios del sistema (solo si la preferencia es "auto")
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", () => {
		if (getPreference() === "auto") {
			applyTheme("auto");
		}
	});

window.setTheme = setTheme;
