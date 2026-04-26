/**
 * @module Validation
 * @description Validaciones puras sin DOM. Tree-shakeable + DO-specific.
 * @version 3.0.0
 * @example
 * Validation.isValidCedula("001-1234567-8");
 * Validation.isValidRNC("130912587");
 */

import config from "../../core/config.js";

const Validation = {
  /**
   * Cédula dominicana (11 dígitos con guión).
   * @param {string} cedula
   * @returns {boolean}
   */
  isValidCedula(cedula) {
    const clean = cedula.replace(/[-\s]/g, "");
    if (!/^\d{11}$/.test(clean)) return false;

    const [province, year, serial] = clean.split("").map(Number);
    const verifier = Number(clean.slice(-1));

    // Algoritmo oficial JCE
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      let digit = Number(clean[i]);
      sum += (i % 2 === 0) ? digit * 2 : digit;
    }
    const check = 10 - (sum % 10);
    return verifier === (check === 10 ? 0 : check);
  },

  /**
   * RNC dominicana (9-11 dígitos).
   * @param {string} rnc
   * @returns {boolean}
   */
  isValidRNC(rnc) {
    const clean = rnc.replace(/[-\s]/g, "");
    if (!/^\d{9,11}$/.test(clean)) return false;

    const verifier = Number(clean.slice(-1));
    let sum = 0;
    const multipliers = [7, 6, 5, 4, 3, 2, 1, 7, 6, 5];

    for (let i = 0; i < 9; i++) {
      sum += Number(clean[i]) * multipliers[i];
    }
    const check = (11 - (sum % 11)) % 11;
    return verifier === check;
  },

  isValidPlaca(placa) {
    return /^[A-Z]{3}\s?\d{4,6}$/.test(placa.replace(/\s/g, ""));
  },

  isValidEmail(email) {
    return config.validation.emailRegex.test(email);
  },

  isValidPhone(phone) {
    return config.validation.phoneRegex.test(phone);
  },

  isNullOrEmpty(value) {
    return value === null || value === undefined || value === "";
  },

  isEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : String(value).trim() === "";
  },

  isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  },

  isInRange(value, min, max) {
    return this.isNumber(value) && value >= min && value <= max;
  },

  isValidUrl(url) {
    return config.validation.urlRegex.test(url);
  },

  isAfter(date, afterDate) {
    return new Date(date) > new Date(afterDate);
  },

  isBefore(date, beforeDate) {
    return new Date(date) < new Date(beforeDate);
  },

  isAllowedExtension(filename, allowed) {
    const ext = filename.split(".").pop().toLowerCase();
    return allowed.includes(ext);
  },

  isValidFileSize(file, maxBytes) {
    return file.size <= maxBytes;
  },
};

export default Object.freeze(Validation);

