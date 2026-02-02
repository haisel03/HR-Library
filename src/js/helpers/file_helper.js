/**
 * @namespace file
 * @description
 * Helpers para manejo de archivos: validación, lectura, descarga y metadata.
 */

import validation from "./validation_helper";

/* =====================================================
   UTILIDADES
===================================================== */

/**
 * Convierte bytes a tamaño legible
 * @param {number} bytes
 * @param {number} [decimals=2]
 * @returns {string}
 *
 * @example file.formatSize(1024) // "1 KB"
 */
const formatSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Obtiene la extensión de un archivo
 * @param {File|string} file
 * @returns {string|null}
 *
 * @example file.getExtension("foto.jpg") // "jpg"
 */
const getExtension = (file) => {
  const name = typeof file === "string" ? file : file?.name;
  if (!name) return null;
  return name.split(".").pop().toLowerCase();
};

/* =====================================================
   VALIDACIONES
===================================================== */

/**
 * Valida tamaño máximo del archivo
 * @param {File} file
 * @param {number} maxSize Tamaño máximo en bytes
 * @returns {boolean}
 *
 * @example file.isValidSize(file, 2 * 1024 * 1024)
 */
const isValidSize = (file, maxSize) =>
  file instanceof File && file.size <= maxSize;

/**
 * Valida extensión permitida
 * @param {File} file
 * @param {string[]} allowed Extensiones permitidas
 * @returns {boolean}
 *
 * @example file.isValidExtension(file, ["jpg","png"])
 */
const isValidExtension = (file, allowed = []) => {
  if (!(file instanceof File)) return false;
  const ext = getExtension(file);
  return allowed.map((e) => e.toLowerCase()).includes(ext);
};

/**
 * Valida tipo MIME
 * @param {File} file
 * @param {string[]} mimes
 * @returns {boolean}
 *
 * @example file.isValidMime(file, ["image/png"])
 */
const isValidMime = (file, mimes = []) =>
  file instanceof File && mimes.includes(file.type);

/* =====================================================
   LECTURA DE ARCHIVOS
===================================================== */

/**
 * Lee un archivo como Base64
 * @param {File} file
 * @returns {Promise<string>}
 *
 * @example file.readAsBase64(file).then(console.log)
 */
const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File)) reject("Invalid file");

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Lee un archivo como texto
 * @param {File} file
 * @returns {Promise<string>}
 */
const readAsText = (file) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File)) reject("Invalid file");

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });

/* =====================================================
   DESCARGAS
===================================================== */

/**
 * Descarga un archivo desde texto
 * @param {string} content
 * @param {string} filename
 * @param {string} [type="text/plain"]
 *
 * @example file.downloadText("Hola", "saludo.txt")
 */
const downloadText = (content, filename, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

/**
 * Descarga un archivo desde una URL
 * @param {string} url
 * @param {string} filename
 *
 * @example file.downloadUrl("/files/report.pdf", "reporte.pdf")
 */
const downloadUrl = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.click();
};

/* =====================================================
   API PÚBLICA
===================================================== */

export default {
  // Utils
  formatSize,
  getExtension,

  // Validaciones
  isValidSize,
  isValidExtension,
  isValidMime,

  // Lectura
  readAsBase64,
  readAsText,

  // Descarga
  downloadText,
  downloadUrl,
};
