import $ from "jquery";

/**
 * @module Iframe
 * @description Gestión de pestañas con iframes.
 */

const tabsContainer = "#iframe-tabs";
const contentsContainer = "#iframe-contents";
const instances = new Map(); // url -> { tabId, iframeId }

const Iframe = {
	/**
	 * Abre una página en una nueva pestaña (o enfoca la existente)
	 */
	open: (title, url, icon = "bi bi-file-earmark") => {
		const key = url.split("/").pop().split("?")[0];

		if (instances.has(key)) {
			Iframe.focus(key);
			return;
		}

		const id = "iframe-" + Date.now();
		const tabId = "tab-" + id;
		const iframeId = "frame-" + id;

		const tabHtml = `
			<li class="nav-item" role="presentation" id="li-${key}">
				<button class="nav-link d-flex align-items-center active" id="${tabId}" data-bs-toggle="pill"
						data-bs-target="#panel-${key}" type="button" role="tab" aria-selected="true">
					<i class="${icon} me-2"></i>
					<span class="tab-title">${title}</span>
					<i class="bi bi-x ms-2 tab-close" data-key="${key}"></i>
				</button>
			</li>
		`;

		$(tabsContainer + " .nav-link").removeClass("active");
		$(contentsContainer + " .tab-pane").removeClass("show active");
		$(tabsContainer).append(tabHtml);

		const finalUrl = url.includes("?") ? `${url}&iframe=1` : `${url}?iframe=1`;

		const contentHtml = `
			<div class="tab-pane fade show active h-100" id="panel-${key}" role="tabpanel">
				<iframe src="${finalUrl}" id="${iframeId}" class="w-100 h-100 border-0" allowfullscreen></iframe>
			</div>
		`;
		$(contentsContainer).append(contentHtml);

		instances.set(key, { tabId, iframeId });

		$(`#li-${key} .tab-close`).on("click", function (e) {
			e.stopPropagation();
			Iframe.close(key);
		});
	},

	focus: (key) => {
		const inst = instances.get(key);
		if (inst) {
			$(`#${inst.tabId}`).tab("show");
		}
	},

	close: (key) => {
		const inst = instances.get(key);
		if (!inst) return;

		const nextTab = $(`#li-${key}`).prev().find(".nav-link");
		const prevTab = $(`#li-${key}`).next().find(".nav-link");

		$(`#li-${key}`).remove();
		$(`#panel-${key}`).remove();
		instances.delete(key);

		if (nextTab.length) nextTab.tab("show");
		else if (prevTab.length) prevTab.tab("show");
	},

	toggleFullscreen: () => {
		const activePane = $(contentsContainer + " .tab-pane.active iframe")[0];
		if (activePane) {
			if (activePane.requestFullscreen) activePane.requestFullscreen();
			else if (activePane.webkitRequestFullscreen) activePane.webkitRequestFullscreen();
			else if (activePane.msRequestFullscreen) activePane.msRequestFullscreen();
		}
	},

	refresh: () => {
		const activeIframe = $(contentsContainer + " .tab-pane.active iframe")[0];
		if (activeIframe) {
			activeIframe.src = activeIframe.src;
		}
	},

	closeOthers: () => {
		const activeLi = $("#iframe-tabs .nav-link.active").closest("li");
		const activeKey = activeLi.attr("id")?.replace("li-", "");

		if (instances.size <= 1) return;

		$("#iframe-tabs li").each(function () {
			const key = $(this).attr("id")?.replace("li-", "");
			if (key && key !== activeKey) {
				Iframe.close(key);
			}
		});
	},

	closeAll: () => {
		instances.clear();
		$(tabsContainer).empty();
		$(contentsContainer).empty().append(`
            <div class="tab-empty d-flex align-items-center justify-content-center h-100 flex-column text-muted opacity-25">
                <i class="bi bi-window-plus display-1 mb-3"></i>
                <h4 class="fw-bold">HR-Panel v1.0</h4>
                <p>Selecciona una página en el menú lateral para abrir una pestaña.</p>
            </div>
        `);
	},
};

export default Iframe;
