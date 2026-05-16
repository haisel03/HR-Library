/**
 * HR-Library Theme Switcher
 * Handles light, dark, and auto (system) themes using data-bs-theme attribute.
 * Persists user preference in localStorage.
 *
 * Themes:
 *   "light" — Modo claro (default)
 *   "dark"  — Modo oscuro
 *   "auto"  — Sigue la preferencia del sistema operativo
 */

const STORAGE_KEY = "hr-theme";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP = {
	light: "bi-sun-fill",
	dark: "bi-moon-stars-fill",
	auto: "bi-circle-half",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resuelve el tema efectivo: si es "auto", consulta prefers-color-scheme.
 * @param {string} preference - "light" | "dark" | "auto"
 * @returns {string} "light" | "dark"
 */
function resolveTheme(preference) {
	if (preference === "auto") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return preference;
}

/**
 * Aplica el tema efectivo al DOM y actualiza el ícono del navbar.
 * @param {string} preference - "light" | "dark" | "auto"
 */
function applyTheme(preference) {
	const effective = resolveTheme(preference);

	// Atributo Bootstrap 5.3+
	document.documentElement.setAttribute("data-bs-theme", effective);

	// Clase legacy
	document.body.classList.toggle("dark-mode", effective === "dark");

	// Actualizar ícono del botón en el topbar
	const icon = document.getElementById("themeIcon");
	if (icon) {
		icon.className = `bi ${ICON_MAP[preference] || ICON_MAP.auto} align-middle`;
	}

	// Marcar item activo en el dropdown
	document.querySelectorAll("#themeDropdown [data-theme]").forEach((item) => {
		item.classList.toggle("active", item.dataset.theme === preference);
	});
}

/**
 * Establece y persiste la preferencia de tema.
 * @param {string} preference - "light" | "dark" | "auto"
 */
function setTheme(preference) {
	localStorage.setItem(STORAGE_KEY, preference);
	applyTheme(preference);
}

/**
 * Lee la preferencia guardada o devuelve "light" por defecto.
 * @returns {string}
 */
function getPreference() {
	return localStorage.getItem(STORAGE_KEY) || "light";
}

// ── Init ──────────────────────────────────────────────────────────────────────

// Aplicar tema lo antes posible (antes de DOMContentLoaded para evitar FOUC)
applyTheme(getPreference());

// Cuando el DOM esté listo, conectar los listeners del dropdown
document.addEventListener("DOMContentLoaded", () => {
	// Clicks en las opciones del dropdown
	document.querySelectorAll("#themeDropdown [data-theme]").forEach((item) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			setTheme(item.dataset.theme);
		});
	});

	// Re-aplicar ícono/estado activo (puede que el DOM no estuviera listo antes)
	applyTheme(getPreference());
});

// Escuchar cambios en preferencia del sistema (solo afecta si es "auto")
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", () => {
		if (getPreference() === "auto") {
			applyTheme("auto");
		}
	});

// Exportar para uso externo
window.setTheme = setTheme;
