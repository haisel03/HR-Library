import SignaturePad from "signature_pad";
import config from "../core/config";

/**
 * @namespace signature
 * @description Helper para firmas digitales
 */
const signature = (() => {
  /** @type {Map<HTMLCanvasElement, SignaturePad>} */
  const instances = new Map();

  /* =====================================================
     CORE
  ===================================================== */

  /**
   * Inicializa firmas
   *
   * @param {HTMLElement|Document} scope
   */
  const init = (scope = document) => {
    scope.querySelectorAll("canvas[data-signature]").forEach((canvas) => {
      create(canvas);
    });
  };

  /**
   * Crea una firma digital
   *
   * @param {HTMLCanvasElement|string} el
   * @param {Object} [options]
   * @returns {SignaturePad|null}
   */
  const create = (el, options = {}) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    if (!canvas || instances.has(canvas)) return null;

    resize(canvas);

    const pad = new SignaturePad(canvas, {
      ...config.signature.base,
      ...options,
    });

    instances.set(canvas, pad);
    return pad;
  };

  /**
   * Redimensiona el canvas
   *
   * @param {HTMLCanvasElement} canvas
   */
  const resize = (canvas) => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
  };

  /**
   * Limpia la firma
   *
   * @param {HTMLCanvasElement|string} el
   */
  const clear = (el) => {
    const pad = get(el);
    if (pad) pad.clear();
  };

  /**
   * Retorna la firma en base64
   *
   * @param {HTMLCanvasElement|string} el
   * @returns {string|null}
   */
  const toDataURL = (el) => {
    const pad = get(el);
    return pad && !pad.isEmpty() ? pad.toDataURL() : null;
  };

  /**
   * Retorna instancia SignaturePad
   *
   * @param {HTMLCanvasElement|string} el
   */
  const get = (el) => {
    const canvas =
      typeof el === "string" ? document.querySelector(el) : el;

    return instances.get(canvas) ?? null;
  };

  return {
    init,
    create,
    clear,
    toDataURL,
    get,
  };
})();

export default signature;
