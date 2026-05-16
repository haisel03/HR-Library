import { describe, it, expect, vi } from "vitest";

const { default: App } = await import("../App.js");

describe("App", () => {
  it("expone versión", () => {
    expect(typeof App.version).toBe("string");
  });

  it("expone config como objeto", () => {
    expect(App.config).toBeDefined();
    expect(typeof App.config).toBe("object");
  });

  it("expone lang como objeto", () => {
    expect(App.lang).toBeDefined();
    expect(typeof App.lang).toBe("object");
  });

  it("expone init como función", () => {
    expect(typeof App.init).toBe("function");
  });

  it("expone métodos HTTP", () => {
    expect(typeof App.getApi).toBe("function");
    expect(typeof App.postApi).toBe("function");
    expect(typeof App.putApi).toBe("function");
    expect(typeof App.deleteApi).toBe("function");
    expect(typeof App.setToken).toBe("function");
    expect(typeof App.getToken).toBe("function");
    expect(typeof App.setApiAlerts).toBe("function");
  });

  it("expone métodos de alerta", () => {
    expect(typeof App.success).toBe("function");
    expect(typeof App.error).toBe("function");
    expect(typeof App.warning).toBe("function");
    expect(typeof App.info).toBe("function");
    expect(typeof App.loading).toBe("function");
  });

  it("expone métodos de utilidad", () => {
    expect(typeof App.serializeForm).toBe("function");
    expect(typeof App.fillForm).toBe("function");
    expect(typeof App.clearForm).toBe("function");
    expect(typeof App.initTable).toBe("function");
  });

  it("config tiene propiedades esperadas", () => {
    expect(App.config.app).toBeDefined();
    expect(App.config.app.version).toBeDefined();
  });

  it("version coincide con config", () => {
    expect(App.version).toBe(App.config.app.version);
  });
});
