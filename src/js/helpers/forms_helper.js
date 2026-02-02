import Inputmask from "inputmask";
import validation from "./validation_helper";

/**
 * @module forms
 * @description
 * Helper de formularios.
 *
 * Proporciona utilidades para:
 * - Resolución de formularios
 * - Inicialización de máscaras
 * - Validación visual de formularios
 * - Limpieza y serialización de datos
 *
 * Este módulo **depende de validation_helper** para reglas de validación,
 * pero no define validaciones propias.
 */
const forms = {
  /* =====================================================
     RESOLUCIÓN
  ===================================================== */

  /**
   * Normaliza un formulario en un elemento HTMLFormElement
   *
   * @param {string|HTMLElement|null} form
   * ID del formulario o elemento HTML
   *
   * @returns {HTMLFormElement|null}
   */
  resolveForm: (form) => {
    if (!form) return null;
    if (typeof form === "string") return document.getElementById(form);
    if (form instanceof HTMLElement) return form;
    return null;
  },

  /* =====================================================
     VALIDACIÓN VISUAL
  ===================================================== */

  /**
   * Limpia los estilos y mensajes de validación de un formulario
   *
   * @param {HTMLFormElement} form
   * @returns {void}
   */
  clearValidation: (form) => {
    if (!form) return;

    form
      .querySelectorAll(".is-invalid, .is-valid")
      .forEach((el) => el.classList.remove("is-invalid", "is-valid"));

    form.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
  },

  /* =====================================================
     INPUTMASK
  ===================================================== */

  /**
   * Inicializa las máscaras de entrada dentro de un scope
   *
   * Requiere que los inputs tengan el atributo:
   * `data-mask-config`
   *
   * @param {Document|HTMLElement} [scope=document]
   * @returns {void}
   */
  init: (scope = document) => {
    scope.querySelectorAll("[data-mask]").forEach((el) => {
      const mask = el.dataset.maskConfig ?? null;
      if (mask && !el.inputmask) {
        Inputmask(mask).mask(el);
      }
    });
  },

  /* =====================================================
     VALIDACIÓN DE FORMULARIOS
  ===================================================== */

  /**
   * Valida un formulario completo aplicando:
   * - Campos requeridos
   * - Emails
   * - Teléfonos
   * - Máscaras incompletas
   *
   * Agrega clases Bootstrap (`is-valid`, `is-invalid`)
   * y enfoca el primer campo inválido.
   *
   * @param {string|HTMLElement} form
   * @returns {boolean} `true` si el formulario es válido
   */
  isValidForm: (form) => {
    const f = forms.resolveForm(form);
    if (!f) return false;

    forms.clearValidation(f);
    let valid = true;

    /* ---------- Required ---------- */
    f.querySelectorAll("label.required").forEach((label) => {
      const input = f.querySelector(`#${label.getAttribute("for")}`);
      if (!input) return;

      input.nextElementSibling?.remove();

      if (validation.isEmpty(input.value)) {
        valid = false;
        input.classList.add("is-invalid");

        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.textContent = "Campo requerido";
        input.insertAdjacentElement("afterend", div);
      } else {
        input.classList.add("is-valid");
      }
    });

    /* ---------- Email ---------- */
    f.querySelectorAll("input.email").forEach((input) => {
      if (validation.isEmpty(input.value)) return;

      if (!validation.isValidEmail(input.value)) {
        valid = false;
        input.classList.add("is-invalid");

        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.textContent = "Email inválido";
        input.insertAdjacentElement("afterend", div);
      } else {
        input.classList.add("is-valid");
      }
    });

    /* ---------- Phone ---------- */
    f.querySelectorAll("input.phone").forEach((input) => {
      if (validation.isEmpty(input.value)) return;

      if (!validation.isValidPhone(input.value)) {
        valid = false;
        input.classList.add("is-invalid");

        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.textContent = "Teléfono inválido";
        input.insertAdjacentElement("afterend", div);
      } else {
        input.classList.add("is-valid");
      }
    });

    /* ---------- Masks ---------- */
    f.querySelectorAll("[data-mask]").forEach((input) => {
      if (!input.inputmask?.isComplete()) {
        valid = false;
        input.classList.add("is-invalid");

        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.textContent = "Campo incompleto";
        input.insertAdjacentElement("afterend", div);
      }
    });

    if (!valid) f.querySelector(".is-invalid")?.focus();
    return valid;
  },

  /* =====================================================
     UTILIDADES DE FORMULARIO
  ===================================================== */

  /**
   * Limpia y resetea un formulario
   *
   * @param {string|HTMLElement} form
   * @returns {void}
   */
  clearForm: (form) => {
    const f = forms.resolveForm(form);
    if (!f) return;

    f.reset();
    forms.clearValidation(f);
  },

  /**
   * Serializa un formulario en un objeto plano
   *
   * @param {string|HTMLElement} form
   * @returns {Object<string, any>}
   */
  serializeForm: (form) => {
    const f = forms.resolveForm(form);
    if (!f) return {};

    const data = {};
    new FormData(f).forEach((value, key) => {
      data[key] = value;
    });

    return data;
  },

  /**
   * Obtiene el valor sin máscara de un input
   *
   * @param {string} selector
   * @returns {string|null}
   */
  unmask: (selector) =>
    document.querySelector(selector)?.inputmask?.unmaskedvalue() ?? null,

  /**
   * Verifica si una máscara está completa
   *
   * @param {string} selector
   * @returns {boolean}
   */
  isMaskComplete: (selector) =>
    document.querySelector(selector)?.inputmask?.isComplete() ?? false,
};

export default forms;
