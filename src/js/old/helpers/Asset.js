import config from "../core/config";

/**
 * @module Asset
 * @description
 * Helper para la gestión de recursos estáticos: logos, avatares, fondos e imágenes.
 * Todas las rutas se resuelven desde `config.assets` en core/config.js.
 *
 * @example
 * $Asset.logo("sidebar");           // → "img/logos/logo-sidebar.svg"
 * $Asset.avatar("avatar-3.jpg");    // → "img/avatars/avatar-3.jpg"
 * $Asset.placeholder("user");       // → "img/placeholders/user.png"
 */

const Asset = {

	/**
	 * Devuelve la ruta base de imágenes configurada.
	 * @returns {string}  Ej: "img"
	 */
	basePath: () => config.assets?.basePath ?? "img",

	/**
	 * Devuelve la URL de una variante del logo.
	 * Variantes: default · horizontal · compact · sidebar · sidebar-collapsed
	 *            login · login-dark · symbol · symbol-dark · symbol-on-dark
	 *
	 * @param {string} [variant="default"]
	 * @returns {string}
	 * @example $Asset.logo("sidebar");   // "img/logos/logo-sidebar.svg"
	 */
	logo: (variant = "default") => {
		const cfg      = config.assets?.logos ?? {};
		const path     = cfg.path ?? "/logos";
		// BUG corregido: config usa logos.variants{}, no logos[variant] directamente
		const map      = cfg.variants ?? {};
		const fileName = map[variant] ?? map.default ?? "logo-horizontal.svg";
		return `${Asset.basePath()}${path}/${fileName}`;
	},

	/**
	 * Devuelve la URL de un archivo de avatar.
	 * Sin argumento devuelve el avatar por defecto del config.
	 *
	 * @param {string} [fileName]
	 * @returns {string}
	 * @example $Asset.avatar("avatar-3.jpg");  // "img/avatars/avatar-3.jpg"
	 */
	avatar: (fileName) => {
		const cfg  = config.assets?.avatars ?? {};
		const path = cfg.path ?? "/avatars";
		const file = fileName ?? cfg.default ?? "avatar.jpg";
		return `${Asset.basePath()}${path}/${file}`;
	},

	/**
	 * Devuelve la URL de una imagen de fondo.
	 * @param {string} fileName
	 * @returns {string}
	 */
	bg: (fileName) => {
		const cfg  = config.assets?.backgrounds ?? {};
		const path = cfg.path ?? "/bg";
		return `${Asset.basePath()}${path}/${fileName}`;
	},

	/**
	 * Devuelve la URL de la foto de un empleado/usuario.
	 * Acepta ID numérico (→ `{id}.png`) o nombre de archivo.
	 *
	 * @param {string|number} id
	 * @returns {string}
	 * @example $Asset.user(5);            // "img/employees/5.png"
	 */
	user: (id) => {
		const cfg      = config.assets?.employees ?? {};
		const path     = cfg.path ?? "/employees";
		// BUG corregido: id=0 es válido, usar ?? en lugar de ||
		const fileName = typeof id === "number"
			? `${id}.png`
			: (id ?? cfg.default ?? "default.png");
		return `${Asset.basePath()}${path}/${fileName}`;
	},

	/**
	 * Devuelve la URL de cualquier imagen por ruta relativa.
	 * @param {string} subPath  Subdirectorio dentro de la carpeta base
	 * @param {string} fileName
	 * @returns {string}
	 */
	img: (subPath, fileName) =>
		`${Asset.basePath()}/${subPath}/${fileName}`,

	/**
	 * Devuelve la URL del placeholder para imágenes faltantes o rotas.
	 * @param {"user"|"image"|"logo"} [type="image"]
	 * @returns {string}
	 */
	placeholder: (type = "image") => {
		const cfg  = config.assets?.placeholders ?? {};
		const file = cfg[type] ?? "image.png";
		return `${Asset.basePath()}/placeholders/${file}`;
	},

	/**
	 * Handler para `<img onerror>` — reemplaza src con placeholder.
	 * Evita loop infinito si el placeholder también falla.
	 *
	 * @param {HTMLImageElement} imgEl
	 * @param {"user"|"image"} [type="user"]
	 *
	 * @example
	 * // En HBS:
	 * <img src="{{avatar}}" onerror="$Asset.onError(this, 'user')">
	 */
	onError: (imgEl, type = "user") => {
		imgEl.onerror = null; // evitar loop infinito
		imgEl.src = Asset.placeholder(type);
	},
};

export default Asset;
