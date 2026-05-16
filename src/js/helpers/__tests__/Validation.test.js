import { describe, it, expect } from "vitest";

// Mock config before importing Validation
vi.mock("../../core/config.js", () => ({
  default: {
    validation: {
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phoneRegex: /^\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4}$/,
    },
  },
}));

const { default: Validation } = await import("../Validation.js");

describe("Validation", () => {
  describe("isNullOrEmpty", () => {
    it("retorna true para null", () => {
      expect(Validation.isNullOrEmpty(null)).toBe(true);
    });
    it("retorna true para undefined", () => {
      expect(Validation.isNullOrEmpty(undefined)).toBe(true);
    });
    it("retorna true para string vacío", () => {
      expect(Validation.isNullOrEmpty("")).toBe(true);
    });
    it("retorna true para string solo espacios", () => {
      expect(Validation.isNullOrEmpty("   ")).toBe(true);
    });
    it("retorna false para string con texto", () => {
      expect(Validation.isNullOrEmpty("hola")).toBe(false);
    });
    it("retorna false para número 0", () => {
      expect(Validation.isNullOrEmpty(0)).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("retorna true para null/undefined", () => {
      expect(Validation.isEmpty(null)).toBe(true);
      expect(Validation.isEmpty(undefined)).toBe(true);
    });
    it("retorna true para string vacío", () => {
      expect(Validation.isEmpty("")).toBe(true);
    });
    it("retorna true para array vacío", () => {
      expect(Validation.isEmpty([])).toBe(true);
    });
    it("retorna true para objeto vacío", () => {
      expect(Validation.isEmpty({})).toBe(true);
    });
    it("retorna false para array con elementos", () => {
      expect(Validation.isEmpty([1])).toBe(false);
    });
    it("retorna false para objeto con propiedades", () => {
      expect(Validation.isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("retorna true para números", () => {
      expect(Validation.isNumber(42)).toBe(true);
      expect(Validation.isNumber("42")).toBe(true);
      expect(Validation.isNumber(0)).toBe(true);
    });
    it("retorna false para NaN", () => {
      expect(Validation.isNumber(NaN)).toBe(false);
    });
    it("retorna false para string no numérico", () => {
      expect(Validation.isNumber("abc")).toBe(false);
    });
  });

  describe("isInteger", () => {
    it("retorna true para enteros", () => {
      expect(Validation.isInteger(42)).toBe(true);
      expect(Validation.isInteger("42")).toBe(true);
    });
    it("retorna false para decimales", () => {
      expect(Validation.isInteger(3.14)).toBe(false);
    });
  });

  describe("isPositive / isNegative", () => {
    it("isPositive retorna true para números > 0", () => {
      expect(Validation.isPositive(5)).toBe(true);
    });
    it("isPositive retorna false para 0 o negativos", () => {
      expect(Validation.isPositive(0)).toBe(false);
      expect(Validation.isPositive(-5)).toBe(false);
    });
    it("isNegative retorna true para números < 0", () => {
      expect(Validation.isNegative(-5)).toBe(true);
    });
    it("isNegative retorna false para 0 o positivos", () => {
      expect(Validation.isNegative(0)).toBe(false);
      expect(Validation.isNegative(5)).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("retorna true para emails válidos", () => {
      expect(Validation.isValidEmail("user@example.com")).toBe(true);
      expect(Validation.isValidEmail("a@b.co")).toBe(true);
    });
    it("retorna false para emails inválidos", () => {
      expect(Validation.isValidEmail("not-email")).toBe(false);
      expect(Validation.isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("retorna true para teléfonos dominicanos", () => {
      expect(Validation.isValidPhone("8095551234")).toBe(true);
    });
  });

  describe("isValidCedula", () => {
    it("retorna false para cédula inválida (checksum incorrecto)", () => {
      expect(Validation.isValidCedula("00102345670")).toBe(false);
    });
    it("retorna false para formato incorrecto", () => {
      expect(Validation.isValidCedula("abc")).toBe(false);
    });
  });

  describe("isValidRNC", () => {
    it("retorna true para RNC de 9 dígitos", () => {
      expect(Validation.isValidRNC("123456789")).toBe(true);
    });
    it("retorna false para RNC inválido", () => {
      expect(Validation.isValidRNC("12345")).toBe(false);
    });
  });

  describe("isValidPlaca", () => {
    it("retorna true para placa dominicana", () => {
      expect(Validation.isValidPlaca("A123456")).toBe(true);
    });
    it("retorna false para placa inválida", () => {
      expect(Validation.isValidPlaca("123")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("retorna true para URLs http/https", () => {
      expect(Validation.isValidUrl("https://example.com")).toBe(true);
    });
    it("retorna false para URLs inválidas", () => {
      expect(Validation.isValidUrl("not-a-url")).toBe(false);
    });
  });

  describe("isValidDate", () => {
    it("retorna true para fechas válidas", () => {
      expect(Validation.isValidDate("2026-03-08")).toBe(true);
      expect(Validation.isValidDate(new Date())).toBe(true);
    });
    it("retorna false para fechas inválidas", () => {
      expect(Validation.isValidDate("not-a-date")).toBe(false);
    });
  });

  describe("isInRange", () => {
    it("retorna true si el valor está en el rango", () => {
      expect(Validation.isInRange(5, 1, 10)).toBe(true);
    });
    it("retorna false si está fuera del rango", () => {
      expect(Validation.isInRange(15, 1, 10)).toBe(false);
    });
  });

  describe("isTime", () => {
    it("retorna true para formato HH:MM", () => {
      expect(Validation.isTime("14:30")).toBe(true);
    });
    it("retorna false para formato inválido", () => {
      expect(Validation.isTime("25:00")).toBe(false);
    });
  });

  describe("isCurrency", () => {
    it("retorna true para montos válidos", () => {
      expect(Validation.isCurrency("1,500.00")).toBe(true);
      expect(Validation.isCurrency("1000")).toBe(true);
    });
    it("retorna false para montos inválidos", () => {
      expect(Validation.isCurrency("abc")).toBe(false);
    });
  });

  describe("isArray / isObject", () => {
    it("isArray detecta arrays", () => {
      expect(Validation.isArray([1, 2])).toBe(true);
      expect(Validation.isArray("string")).toBe(false);
    });
    it("isObject detecta objetos", () => {
      expect(Validation.isObject({})).toBe(true);
      expect(Validation.isObject(null)).toBe(false);
      expect(Validation.isObject([])).toBe(false);
    });
  });

  describe("equals / oneOf", () => {
    it("equals compara valores", () => {
      expect(Validation.equals(1, 1)).toBe(true);
      expect(Validation.equals(1, 2)).toBe(false);
    });
    it("oneOf verifica pertenencia", () => {
      expect(Validation.oneOf("a", ["a", "b"])).toBe(true);
      expect(Validation.oneOf("c", ["a", "b"])).toBe(false);
    });
  });
});
