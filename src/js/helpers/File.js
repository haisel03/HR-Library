/**
 * @module File
 * @description
 * Helper para manejo de archivos en HR Library.
 * Validación, metadata, lectura (Base64, texto, buffer) y descarga.
 *
 * @example
 * FileHelper.formatSize(1048576);           // "1 MB"
 * FileHelper.getExtension(archivo);         // "pdf"
 * FileHelper.getInfo(archivo);              // { name, extension, size, ... }
 * const data = await FileHelper.readAsBase64(archivo);
 * FileHelper.downloadText("Hola", "saludo.txt");
 *
 * @version 3.0.0
 */

/* ── Utilidades internas ── */

/**
 * Dispara descarga de un enlace temporal.
 * @private
 */
const _download = (href, filename) => {
  const a = document.createElement("a");
  a.href     = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Lee un archivo usando FileReader.
 * @private
 * @param {File} file
 * @param {"readAsDataURL"|"readAsText"|"readAsArrayBuffer"} method
 * @returns {Promise<string|ArrayBuffer>}
 */
const _readFile = (file, method) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File)) return reject(new Error("Archivo inválido."));
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader[method](file);
  });

/* ── FileHelper ── */

const FileHelper = {

  /* ── Utilidades ── */

  /**
   * Convierte bytes a tamaño legible (KB, MB, GB...).
   * @param {number} bytes @param {number} [decimals=2] @returns {string}
   * @example FileHelper.formatSize(1048576); // "1 MB"
   */
  formatSize(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(Math.max(0, decimals)))} ${sizes[i]}`;
  },

  /**
   * Retorna la extensión de un archivo en minúsculas.
   * @param {File|string} file @returns {string|null}
   * @example FileHelper.getExtension("foto.JPG"); // "jpg"
   */
  getExtension(file) {
    const name = typeof file === "string" ? file : file?.name;
    if (!name) return null;
    const ext = name.split(".").pop();
    return ext ? ext.toLowerCase() : null;
  },

  /**
   * Retorna el nombre del archivo sin extensión.
   * @param {File|string} file @returns {string|null}
   */
  getName(file) {
    const name = typeof file === "string" ? file : file?.name;
    if (!name) return null;
    return name.substring(0, name.lastIndexOf(".")) || name;
  },

  /**
   * Retorna metadata básica de un archivo.
   * @param {File} file @returns {Object|null}
   */
  getInfo(file) {
    if (!(file instanceof File)) return null;
    return {
      name:          file.name,
      extension:     this.getExtension(file),
      size:          file.size,
      sizeFormatted: this.formatSize(file.size),
      type:          file.type,
      lastModified:  file.lastModified,
    };
  },

  /* ── Validaciones ── */

  /**
   * Valida que el archivo no supere el tamaño máximo.
   * @param {File} file @param {number} maxSize  En bytes.
   * @returns {boolean}
   * @example FileHelper.isValidSize(file, 2 * 1024 * 1024); // 2 MB
   */
  isValidSize: (file, maxSize) => file instanceof File && file.size <= maxSize,

  /**
   * Valida que la extensión esté en la lista permitida.
   * @param {File} file @param {string[]} [allowed=[]] @returns {boolean}
   */
  isValidExtension(file, allowed = []) {
    if (!(file instanceof File)) return false;
    const ext = this.getExtension(file);
    return allowed.map((e) => e.toLowerCase()).includes(ext);
  },

  /**
   * Valida el tipo MIME del archivo.
   * @param {File} file @param {string[]} [mimes=[]] @returns {boolean}
   */
  isValidMime: (file, mimes = []) => file instanceof File && mimes.includes(file.type),

  /**
   * Validación completa: tamaño, extensión y MIME.
   * @param {File} file
   * @param {Object} [options={}]
   * @param {number}   [options.maxSize]
   * @param {string[]} [options.extensions]
   * @param {string[]} [options.mimes]
   * @returns {{ valid: boolean, error?: string }}
   */
  validateFile(file, { maxSize, extensions, mimes } = {}) {
    if (!(file instanceof File))                          return { valid: false, error: "Archivo inválido." };
    if (maxSize && !this.isValidSize(file, maxSize))      return { valid: false, error: `El archivo supera ${this.formatSize(maxSize)}.` };
    if (extensions && !this.isValidExtension(file, extensions)) return { valid: false, error: "Extensión no permitida." };
    if (mimes && !this.isValidMime(file, mimes))          return { valid: false, error: "Tipo de archivo no permitido." };
    return { valid: true };
  },

  /* ── Lectura ── */

  /** @param {File} file @returns {Promise<string>} Data URL (Base64) */
  readAsBase64:  (file) => _readFile(file, "readAsDataURL"),

  /** @param {File} file @returns {Promise<string>} Texto plano */
  readAsText:    (file) => _readFile(file, "readAsText"),

  /** @param {File} file @returns {Promise<ArrayBuffer>} */
  readAsBuffer:  (file) => _readFile(file, "readAsArrayBuffer"),

  /* ── Descarga ── */

  /**
   * Descarga contenido como archivo de texto.
   * @param {string} content @param {string} filename @param {string} [type="text/plain"]
   */
  downloadText(content, filename, type = "text/plain") {
    const url = URL.createObjectURL(new Blob([content], { type }));
    _download(url, filename);
    URL.revokeObjectURL(url);
  },

  /**
   * Descarga un archivo desde una URL.
   * @param {string} url @param {string} filename
   */
  downloadUrl(url, filename) {
    _download(url, filename);
  },

  /** @returns {void} */
  init() {},
};

export default Object.freeze(FileHelper);
