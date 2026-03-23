/**
 * @module IframeTab
 * @description
 * Helper para gestión de pestañas con iframes en Coffee Schools.
 * Navegación multi-página estilo AdminLTE sin jQuery.
 *
 * @author Haisel Ramirez
 * @copyright (c) 2026, Haisel Ramirez
 * @version 2.1.0
 *
 * @example
 * import IframeTab from "./IframeTab.js";
 *
 * IframeTab.open("Usuarios", "/usuarios");
 * IframeTab.close("usuarios");
 * IframeTab.closeAll();
 */

import Dom from "./Dom.js";

// ─────────────────────────────────────────────
// Estado interno
// ─────────────────────────────────────────────

/** @private */
const _state = {
  /** @type {Map<string, {tabId: string, iframeId: string}>} */
  instances: new Map(),

  config: {
    tabsContainer:    "#iframe-tabs",
    contentsContainer: "#iframe-contents",
    emptyIcon:        "bi-window-plus",
    emptyTitle:       "Coffee Schools",
    emptyMessage:     "Selecciona una página en el menú para abrir una pestaña.",
  },
};

// ─────────────────────────────────────────────
// Funciones privadas
// ─────────────────────────────────────────────

/**
 * Normaliza una URL a clave única (nombre del archivo sin query).
 * @private
 * @param {string} url
 * @returns {string}
 */
const _keyOf = (url) => url.split("/").pop().split("?")[0];

/**
 * Desactiva todas las pestañas e iframes visibles.
 * @private
 */
const _deactivateAll = () => {
  Dom.qa(`${_state.config.tabsContainer} .nav-link`)
    .forEach((btn) => btn.classList.remove("active"));
  Dom.qa(`${_state.config.contentsContainer} .tab-pane`)
    .forEach((pane) => pane.classList.remove("show", "active"));
};

/**
 * Activa una pestaña y su panel por clave.
 * @private
 * @param {string} key
 */
const _activate = (key) => {
  _deactivateAll();
  Dom.q(`#tab-li-${key} .nav-link`)?.classList.add("active");
  const pane = Dom.q(`#panel-${key}`);
  if (pane) pane.classList.add("show", "active");
};

/**
 * Muestra el placeholder de pestañas vacías.
 * @private
 */
const _showEmpty = () => {
  const { emptyIcon, emptyTitle, emptyMessage, contentsContainer } = _state.config;
  const container = Dom.q(contentsContainer);
  if (!container) return;
  container.innerHTML = `
    <div class="tab-empty d-flex align-items-center justify-content-center
                h-100 flex-column text-muted opacity-25">
      <i class="bi ${emptyIcon} display-1 mb-3"></i>
      <h4 class="fw-bold">${emptyTitle}</h4>
      <p>${emptyMessage}</p>
    </div>`;
};

// ─────────────────────────────────────────────
// IframeTab
// ─────────────────────────────────────────────

/**
 * @namespace IframeTab
 */
const IframeTab = {

  // ── Core ──────────────────────────────────────────────────────────────

  /**
   * Abre una pestaña con iframe. Si ya existe, la enfoca.
   * @param {string} title - Título de la pestaña.
   * @param {string} url - URL a cargar en el iframe.
   * @param {string} [icon="bi bi-file-earmark"] - Clase de icono.
   * @returns {void}
   *
   * @example
   * IframeTab.open("Usuarios", "/usuarios", "bi bi-people");
   */
  open(title, url, icon = "bi bi-file-earmark") {
    const key = _keyOf(url);

    if (_state.instances.has(key)) {
      this.focus(key);
      return;
    }

    const uid       = Date.now();
    const tabId     = `tab-${uid}`;
    const iframeId  = `frame-${uid}`;
    const finalUrl  = url.includes("?") ? `${url}&iframe=1` : `${url}?iframe=1`;

    // ── Crear pestaña ──
    const tabsContainer = Dom.q(_state.config.tabsContainer);
    if (!tabsContainer) return;

    const li = Dom.createElement(`
      <li class="nav-item" role="presentation" id="tab-li-${key}">
        <button class="nav-link d-flex align-items-center active"
                id="${tabId}" type="button" role="tab" aria-selected="true">
          <i class="${icon} me-2"></i>
          <span class="tab-title">${title}</span>
          <i class="bi bi-x ms-2 tab-close" data-key="${key}"></i>
        </button>
      </li>`);

    _deactivateAll();
    tabsContainer.appendChild(li);

    // ── Crear panel con iframe ──
    const contentsContainer = Dom.q(_state.config.contentsContainer);
    if (!contentsContainer) return;

    // Eliminar placeholder si existe
    Dom.q(".tab-empty", contentsContainer)?.remove();

    const pane = Dom.createElement(`
      <div class="tab-pane fade show active h-100"
           id="panel-${key}" role="tabpanel">
        <iframe src="${finalUrl}" id="${iframeId}"
                class="w-100 h-100 border-0" allowfullscreen></iframe>
      </div>`);

    contentsContainer.appendChild(pane);
    _state.instances.set(key, { tabId, iframeId });

    // ── Evento cerrar ──
    li.querySelector(".tab-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close(key);
    });
  },

  /**
   * Enfoca una pestaña existente.
   * @param {string} key - Clave de la pestaña (nombre del archivo).
   * @returns {void}
   */
  focus(key) {
    if (!_state.instances.has(key)) return;
    _activate(key);
  },

  /**
   * Cierra una pestaña y activa la anterior o siguiente.
   * @param {string} key
   * @returns {void}
   *
   * @example
   * IframeTab.close("usuarios");
   */
  close(key) {
    if (!_state.instances.has(key)) return;

    const li = Dom.q(`#tab-li-${key}`);

    // Determinar qué pestaña activar al cerrar
    const prev = li?.previousElementSibling?.querySelector(".nav-link");
    const next = li?.nextElementSibling?.querySelector(".nav-link");

    li?.remove();
    Dom.q(`#panel-${key}`)?.remove();
    _state.instances.delete(key);

    if (_state.instances.size === 0) {
      _showEmpty();
      return;
    }

    // Activar pestaña adyacente
    const adjacentKey = (prev ?? next)
      ?.closest("li")?.id?.replace("tab-li-", "");
    if (adjacentKey) _activate(adjacentKey);
  },

  /**
   * Cierra todas las pestañas excepto la activa.
   * @returns {void}
   */
  closeOthers() {
    if (_state.instances.size <= 1) return;

    const activeBtn = Dom.q(`${_state.config.tabsContainer} .nav-link.active`);
    const activeKey = activeBtn?.closest("li")?.id?.replace("tab-li-", "");

    [..._state.instances.keys()]
      .filter((key) => key !== activeKey)
      .forEach((key) => this.close(key));
  },

  /**
   * Cierra todas las pestañas y muestra el placeholder.
   * @returns {void}
   */
  closeAll() {
    _state.instances.clear();
    const tabs     = Dom.q(_state.config.tabsContainer);
    const contents = Dom.q(_state.config.contentsContainer);
    if (tabs)     tabs.innerHTML = "";
    if (contents) contents.innerHTML = "";
    _showEmpty();
  },

  // ── Utilidades ────────────────────────────────────────────────────────

  /**
   * Recarga el iframe de la pestaña activa.
   * @returns {void}
   */
  refresh() {
    const activePane = Dom.q(
      `${_state.config.contentsContainer} .tab-pane.active iframe`
    );
    if (activePane) activePane.src = activePane.src;
  },

  /**
   * Abre el iframe activo en pantalla completa.
   * @returns {void}
   */
  toggleFullscreen() {
    const iframe = Dom.q(
      `${_state.config.contentsContainer} .tab-pane.active iframe`
    );
    if (!iframe) return;
    (iframe.requestFullscreen?.() ??
     iframe.webkitRequestFullscreen?.() ??
     iframe.msRequestFullscreen?.());
  },

  /**
   * Retorna la cantidad de pestañas abiertas.
   * @returns {number}
   */
  count: () => _state.instances.size,

  // ── Init ──────────────────────────────────────────────────────────────

  /**
   * Punto de entrada del helper.
   * @param {Object} [options={}] - Sobreescribe config por defecto.
   * @returns {void}
   */
  init(options = {}) {
    _state.config = { ..._state.config, ...options };
  },

};

export default Object.freeze(IframeTab);
