import { describe, it, expect } from "vitest";

const { default: Strings } = await import("../Strings.js");

describe("Strings", () => {
	describe("capitalize", () => {
		it("capitaliza la primera letra", () => {
			expect(Strings.capitalize("hola")).toBe("Hola");
		});
		it("retorna vacío para string vacío", () => {
			expect(Strings.capitalize("")).toBe("");
		});
		it("retorna vacío para no-string", () => {
			expect(Strings.capitalize(123)).toBe("");
		});
	});

	describe("titleCase", () => {
		it("convierte a title case", () => {
			expect(Strings.titleCase("juan pablo duarte")).toBe("Juan Pablo Duarte");
		});
	});

	describe("upper / lower / trim", () => {
		it("upper convierte a mayúsculas", () => {
			expect(Strings.upper("hola")).toBe("HOLA");
		});
		it("lower convierte a minúsculas", () => {
			expect(Strings.lower("HOLA")).toBe("hola");
		});
		it("trim elimina espacios", () => {
			expect(Strings.trim("  hola  ")).toBe("hola");
		});
	});

	describe("reverse", () => {
		it("invierte la cadena", () => {
			expect(Strings.reverse("hola")).toBe("aloh");
		});
	});

	describe("normalize", () => {
		it("elimina acentos", () => {
			expect(Strings.normalize("María García")).toBe("Maria Garcia");
		});
	});

	describe("cleanSpaces", () => {
		it("limpia espacios múltiples", () => {
			expect(Strings.cleanSpaces("  hola    mundo  ")).toBe("hola mundo");
		});
	});

	describe("truncate", () => {
		it("trunca texto con sufijo", () => {
			expect(Strings.truncate("Hola mundo", 4)).toBe("Hola...");
		});
		it("no trunca si es más corto", () => {
			expect(Strings.truncate("Hola", 10)).toBe("Hola");
		});
	});

	describe("padStart / padEnd", () => {
		it("padStart rellena a la izquierda", () => {
			expect(Strings.padStart(5, 4)).toBe("0005");
		});
		it("padEnd rellena a la derecha", () => {
			expect(Strings.padEnd(5, 4)).toBe("5   ");
		});
	});

	describe("slug", () => {
		it("convierte texto a slug", () => {
			expect(Strings.slug("Gestión Académica 2024")).toBe("gestion-academica-2024");
		});
	});

	describe("uid", () => {
		it("genera ID de longitud correcta", () => {
			expect(Strings.uid().length).toBe(8);
			expect(Strings.uid(12).length).toBeGreaterThanOrEqual(8);
		});
		it("genera IDs diferentes", () => {
			expect(Strings.uid()).not.toBe(Strings.uid());
		});
	});

	describe("contains", () => {
		it("encuentra texto sin importar acentos/case", () => {
			expect(Strings.contains("María García", "garcia")).toBe(true);
			expect(Strings.contains("José", "pepe")).toBe(false);
		});
	});

	describe("countOccurrences", () => {
		it("cuenta ocurrencias", () => {
			expect(Strings.countOccurrences("banana", "a")).toBe(3);
			expect(Strings.countOccurrences("test", "x")).toBe(0);
		});
	});

	describe("format", () => {
		it("interpola variables", () => {
			expect(Strings.format("Hola {nombre}", { nombre: "Ana" })).toBe("Hola Ana");
		});
		it("deja intactas claves no encontradas", () => {
			expect(Strings.format("Hola {nombre}", {})).toBe("Hola {nombre}");
		});
	});

	describe("mask", () => {
		it("aplica máscara de teléfono", () => {
			expect(Strings.mask("8095551234", "###-###-####")).toBe("809-555-1234");
		});
	});

	describe("formatPhone / formatCedula / formatRNC", () => {
		it("formatea teléfono", () => {
			expect(Strings.formatPhone("8095551234")).toBe("809-555-1234");
		});
		it("formatea cédula", () => {
			expect(Strings.formatCedula("00102345678")).toBe("001-0234567-8");
		});
		it("formatea RNC", () => {
			expect(Strings.formatRNC("123456789")).toBe("123-45678-9");
		});
	});

	describe("escapeHtml", () => {
		it("escapa caracteres HTML", () => {
			expect(Strings.escapeHtml('<script>alert("xss")</script>')).toBe(
				"&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
			);
		});
	});

	describe("highlight", () => {
		it("resalta coincidencias con <mark>", () => {
			expect(Strings.highlight("María García", "García")).toBe("María <mark>García</mark>");
		});
	});

	describe("stripHtml", () => {
		it("elimina etiquetas HTML", () => {
			expect(Strings.stripHtml("<p>Hola <b>mundo</b></p>")).toBe("Hola mundo");
		});
	});
});
