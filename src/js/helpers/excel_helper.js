/**
 * @fileoverview Helper functions for Excel operations
 * @module excel_helper
 * @requires xlsx
 */

import * as XLSX from "xlsx";

/* =====================================================
   EXPORT SIMPLE HOJA
===================================================== */

/**
 * Exporta datos JSON a Excel (una sola hoja)
 * @param {Array} data - Array de objetos
 * @param {string} filename - Nombre del archivo
 */
export function exportToExcel(data, filename = "data.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}

/**
 * Convierte un archivo Excel (una hoja) a JSON
 * @param {File} file - Archivo Excel
 * @returns {Promise<Array>} - Datos en JSON
 */
export function excelToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);
      resolve(json);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convierte JSON a Excel (una hoja)
 * @param {Array} data - Array de objetos
 * @param {string} filename - Nombre del archivo
 */
export function jsonToExcel(data, filename = "data.xlsx") {
  exportToExcel(data, filename);
}

/**
 * Convierte JSON a CSV
 * @param {Array} data - Array de objetos
 * @param {string} filename - Nombre del archivo
 */
export function jsonToCsv(data, filename = "data.csv") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, { bookType: "csv", bookSST: false, type: "string" });
}

/* =====================================================
   SOPORTE MULTIPLES HOJAS
===================================================== */

/**
 * Convierte un archivo Excel con múltiples hojas a JSON
 * @param {File} file - Archivo Excel
 * @returns {Promise<Object>} - Objeto { hojaNombre: [...datos] }
 */
export function excelToJsonMultiple(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const result = {};
      workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name];
        result[name] = XLSX.utils.sheet_to_json(sheet);
      });
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convierte un objeto JSON con múltiples hojas a Excel
 * @param {Object} sheets - { hoja1: [...], hoja2: [...] }
 * @param {string} filename - Nombre del archivo
 */
export function jsonToExcelMultiple(sheets, filename = "data.xlsx") {
  const workbook = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, data]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, name);
  });
  XLSX.writeFile(workbook, filename);
}

/* =====================================================
   INIT (botones con data-excel)
===================================================== */

/**
 * Inicializa botones con atributo `data-excel` para exportar
 */
export function init() {
  document.querySelectorAll("[data-excel]").forEach((el) => {
    el.addEventListener("click", () => {
      const data = JSON.parse(el.dataset.excel);
      const filename = el.dataset.filename || "data.xlsx";
      exportToExcel(data, filename);
    });
  });
}

/* =====================================================
   EXPORT DEFAULT
===================================================== */

export default {
  exportToExcel,
  excelToJson,
  jsonToExcel,
  jsonToCsv,
  excelToJsonMultiple,
  jsonToExcelMultiple,
  init,
};
