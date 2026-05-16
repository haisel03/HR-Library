import { describe, it, expect } from "vitest";

vi.mock("../../core/config.js", () => ({
	default: {
		formats: { locale: "es-DO" },
		monedas: { P: "RD$", U: "USD$", E: "EUR€" },
	},
}));

const { default: NumberHelper } = await import("../Number.js");

describe("NumberHelper", () => {
	describe("toNumber", () => {
		it("convierte string numérico a número", () => {
			expect(NumberHelper.toNumber("1,200.50")).toBe(1200.5);
		});
		it("retorna default para null/undefined", () => {
			expect(NumberHelper.toNumber(null)).toBeNull();
			expect(NumberHelper.toNumber(undefined)).toBeNull();
		});
		it("retorna default para valores no numéricos", () => {
			expect(NumberHelper.toNumber("abc")).toBeNull();
		});
		it("usa defaultValue personalizado", () => {
			expect(NumberHelper.toNumber("abc", 0)).toBe(0);
		});
	});

	describe("round / floor / ceil", () => {
		it("round redondea", () => {
			expect(NumberHelper.round(3.14159, 2)).toBe(3.14);
		});
		it("floor redondea hacia abajo", () => {
			expect(NumberHelper.floor(3.9)).toBe(3);
		});
		it("ceil redondea hacia arriba", () => {
			expect(NumberHelper.ceil(3.1)).toBe(4);
		});
	});

	describe("clamp", () => {
		it("limita valor al rango", () => {
			expect(NumberHelper.clamp(15, 0, 10)).toBe(10);
			expect(NumberHelper.clamp(-5, 0, 10)).toBe(0);
			expect(NumberHelper.clamp(5, 0, 10)).toBe(5);
		});
	});

	describe("sum / avg", () => {
		it("suma valores del array", () => {
			expect(NumberHelper.sum([1, 2, 3])).toBe(6);
		});
		it("promedia valores", () => {
			expect(NumberHelper.avg([10, 20, 30])).toBe(20);
		});
		it("avg retorna null para array vacío", () => {
			expect(NumberHelper.avg([])).toBeNull();
		});
	});

	describe("percent / percentOf", () => {
		it("percent formatea porcentaje", () => {
			expect(NumberHelper.percent(0.754)).toBe("75.4%");
		});
		it("percentOf calcula qué porcentaje representa", () => {
			expect(NumberHelper.percentOf(25, 200)).toBe(12.5);
		});
	});

	describe("formatNumber / currency", () => {
		it("formatNumber formatea con locale", () => {
			const result = NumberHelper.formatNumber(1234567.89);
			expect(typeof result).toBe("string");
			expect(result.length).toBeGreaterThan(0);
		});
		it("currency formatea moneda", () => {
			const result = NumberHelper.currency(50000);
			expect(result).toContain("RD$");
		});
	});
});
