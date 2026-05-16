import { describe, it, expect } from "vitest";

vi.mock("../../core/config.js", () => ({
  default: {
    app: { locale: "es-DO" },
    flatpickr: {
      base: { locale: "es", allowInput: true },
      types: {
        date: { enableTime: false },
        datetime: { enableTime: true },
        time: { noCalendar: true, enableTime: true },
        range: { mode: "range" },
      },
      modifiers: {
        min: { minDate: "today" },
        max: { maxDate: "today" },
      },
    },
  },
}));

const { default: DateHelper } = await import("../Date.js");

describe("DateHelper", () => {
  describe("now", () => {
    it("retorna un Date", () => {
      expect(DateHelper.now()).toBeInstanceOf(Date);
    });
  });

  describe("create", () => {
    it("crea Date desde string ISO", () => {
      const d = DateHelper.create("2026-03-08");
      expect(d).toBeInstanceOf(Date);
      expect(d?.getFullYear()).toBe(2026);
    });
    it("retorna null para fecha inválida", () => {
      expect(DateHelper.create("not-a-date")).toBeNull();
    });
    it("copia un Date sin mutar el original", () => {
      const original = new Date(2026, 2, 8);
      const copy = DateHelper.create(original);
      expect(copy?.getTime()).toBe(original.getTime());
    });
  });

  describe("isValid", () => {
    it("retorna true para fechas válidas", () => {
      expect(DateHelper.isValid("2026-03-08")).toBe(true);
    });
    it("retorna false para fechas inválidas", () => {
      expect(DateHelper.isValid("not-a-date")).toBe(false);
    });
  });

  describe("format", () => {
    it("formatea fecha por defecto", () => {
      const d = DateHelper.format("2026-03-08");
      expect(typeof d).toBe("string");
      expect(d.length).toBeGreaterThan(0);
    });
    it("retorna vacío para undefined", () => {
      expect(DateHelper.format(undefined)).toBe("");
    });
  });

  describe("toISODate", () => {
    it("retorna YYYY-MM-DD", () => {
      expect(DateHelper.toISODate("2026-03-08")).toBe("2026-03-08");
    });
    it("retorna vacío para undefined", () => {
      expect(DateHelper.toISODate(undefined)).toBe("");
    });
  });

  describe("startOfDay / endOfDay", () => {
    it("startOfDay pone la hora a 00:00:00", () => {
      const d = DateHelper.startOfDay("2026-03-08");
      expect(d?.getHours()).toBe(0);
      expect(d?.getMinutes()).toBe(0);
    });
    it("endOfDay pone la hora a 23:59:59.999", () => {
      const d = DateHelper.endOfDay("2026-03-08");
      expect(d?.getHours()).toBe(23);
      expect(d?.getMinutes()).toBe(59);
    });
  });

  describe("startOfMonth / endOfMonth", () => {
    it("startOfMonth retorna el primer día", () => {
      const d = DateHelper.startOfMonth("2026-03-15");
      expect(d?.getDate()).toBe(1);
    });
    it("endOfMonth retorna el último día", () => {
      const d = DateHelper.endOfMonth("2026-03-15");
      expect(d?.getDate()).toBe(31);
    });
  });

  describe("addDays / addMonths / addYears", () => {
    it("addDays suma días", () => {
      const d = DateHelper.addDays("2026-03-01", 7);
      expect(DateHelper.toISODate(d)).toBe("2026-03-08");
    });
    it("addMonths suma meses", () => {
      const d = DateHelper.addMonths("2026-01-01", 2);
      expect(DateHelper.toISODate(d)).toBe("2026-03-01");
    });
    it("addYears suma años", () => {
      const d = DateHelper.addYears("2026-01-01", 1);
      expect(DateHelper.toISODate(d)).toBe("2027-01-01");
    });
  });

  describe("diffDays", () => {
    it("calcula diferencia en días", () => {
      expect(DateHelper.diffDays("2026-01-01", "2026-12-31")).toBe(364);
    });
    it("retorna null para una fecha inválida", () => {
      expect(DateHelper.diffDays("not-a-date", "2026-12-31")).toBeNull();
    });
  });

  describe("isToday / isPast / isFuture", () => {
    it("isToday", () => {
      expect(DateHelper.isToday(new Date())).toBe(true);
    });
  });

  describe("between", () => {
    it("retorna true si la fecha está entre dos fechas", () => {
      expect(DateHelper.between("2026-06-15", "2026-01-01", "2026-12-31")).toBe(true);
    });
    it("retorna false si está fuera del rango", () => {
      expect(DateHelper.between("2025-01-01", "2026-01-01", "2026-12-31")).toBe(false);
    });
  });

  describe("monthName / dayName", () => {
    it("monthName retorna nombre del mes", () => {
      expect(DateHelper.monthName("2026-03-08", "es")).toBe("marzo");
    });
    it("dayName retorna nombre del día", () => {
      expect(DateHelper.dayName("2026-03-22", "es")).toBe("domingo");
    });
  });

  describe("daysInMonth", () => {
    it("retorna días del mes", () => {
      expect(DateHelper.daysInMonth(2026, 1)).toBe(28);
      expect(DateHelper.daysInMonth(2026, 0)).toBe(31);
    });
  });

  describe("flatpickr", () => {
    it("retorna objeto de opciones", () => {
      const opts = DateHelper.flatpickr();
      expect(opts).toBeDefined();
      expect(opts.locale).toBe("es");
    });
    it("sobreescribe opciones", () => {
      const opts = DateHelper.flatpickr({ enableTime: true });
      expect(opts.enableTime).toBe(true);
    });
  });

  describe("fullCalendar", () => {
    it("retorna opciones base", () => {
      const opts = DateHelper.fullCalendar();
      expect(opts.locale).toBe("es");
      expect(opts.firstDay).toBe(1);
    });
  });
});
