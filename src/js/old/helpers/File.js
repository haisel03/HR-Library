/**
 * @module File
 * @description Helpers para manejo de archivos: validación, lectura, descarga y metadata.
 */

const FileHelper = {
	/**
	 * Convierte bytes a tamaño legible
	 */
	formatSize: (bytes, decimals = 2) => {
		if (!bytes || bytes === 0) return "0 Bytes";
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	},

	/**
	 * Obtiene la extensión de un archivo
	 */
	getExtension: (file) => {
		const name = typeof file === "string" ? file : file?.name;
		if (!name) return null;
		return name.split(".").pop().toLowerCase();
	},

	/**
	 * Valida tamaño máximo del archivo
	 */
	isValidSize: (file, maxSize) => file instanceof File && file.size <= maxSize,

	/**
	 * Valida extensión permitida
	 */
	isValidExtension: (file, allowed = []) => {
		if (!(file instanceof File)) return false;
		const ext = FileHelper.getExtension(file);
		return allowed.map((e) => e.toLowerCase()).includes(ext);
	},

	/**
	 * Valida tipo MIME
	 */
	isValidMime: (file, mimes = []) => file instanceof File && mimes.includes(file.type),

	/**
	 * Lee un archivo como Base64
	 */
	readAsBase64: (file) =>
		new Promise((resolve, reject) => {
			if (!(file instanceof File)) reject("Invalid file");
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		}),

	/**
	 * Lee un archivo como texto
	 */
	readAsText: (file) =>
		new Promise((resolve, reject) => {
			if (!(file instanceof File)) reject("Invalid file");
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsText(file);
		}),

	/**
	 * Descarga un archivo desde texto
	 */
	downloadText: (content, filename, type = "text/plain") => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	},

	/**
	 * Descarga un archivo desde una URL
	 */
	downloadUrl: (url, filename) => {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.target = "_blank";
		a.click();
	},
};

export default FileHelper;
