import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jquery,
        Chart: "readonly",
        flatpickr: "readonly",
        Quill: "readonly",
        jsVectorMap: "readonly",
        SimpleBar: "readonly",
        dragula: "readonly",
        feather: "readonly",
        moment: "readonly",
        Inputmask: "readonly",
        SignaturePad: "readonly",
        jsPDF: "readonly",
        XLSX: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
];
