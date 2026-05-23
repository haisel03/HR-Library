import $ from "jquery";

const tabsContainer = "#iframe-tabs";
const contentsContainer = "#iframe-contents";
const instances = new Map();

const emptyStateHtml = `
    <div class="tab-empty d-flex align-items-center justify-content-center h-100 flex-column text-muted opacity-25">
        <i class="bi bi-window-plus display-1 mb-3"></i>
        <h4 class="fw-bold">HR-Panel v1.0</h4>
        <p>Selecciona una página en el menú lateral para abrir una pestaña.</p>
    </div>
`;

function cssEscape(value) {
    return value.replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~]/g, "\\$&");
}

function escapeHtml(str) {
    if (typeof str !== "string") return "";
    const map = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };
    return str.replace(/[&"'<>]/g, (ch) => map[ch]);
}

function hashKey(url) {
    const clean = url.split("?")[0].split("#")[0];
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
        const chr = clean.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return "k" + Math.abs(hash).toString(36);
}

function showEmptyState() {
    $(contentsContainer).empty().append(emptyStateHtml);
}

function hideEmptyState() {
    $(contentsContainer).find(".tab-empty").remove();
}

const Iframe = {
    open: (title, url, icon = "bi bi-file-earmark") => {
        const key = hashKey(url);

        if (instances.has(key)) {
            Iframe.focus(key);
            return;
        }

        const id = "iframe-" + Date.now();
        const tabId = "tab-" + id;
        const iframeId = "frame-" + id;

        const safeTitle = escapeHtml(title);
        const safeIcon = escapeHtml(icon);

        const tabHtml = `
            <li class="nav-item" role="presentation" id="li-${key}">
                <button class="nav-link d-flex align-items-center active" id="${tabId}" data-bs-toggle="pill"
                        data-bs-target="#panel-${key}" type="button" role="tab" aria-selected="true">
                    <i class="${safeIcon} me-2"></i>
                    <span class="tab-title">${safeTitle}</span>
                    <i class="bi bi-x ms-2 tab-close" data-key="${key}"></i>
                </button>
            </li>
        `;

        $(tabsContainer + " .nav-link").removeClass("active");
        $(contentsContainer + " .tab-pane").removeClass("show active");

        hideEmptyState();
        $(tabsContainer).append(tabHtml);

        const finalUrl = (url.includes("?") ? `${url}&iframe=1` : `${url}?iframe=1`).replace(/"/g, "%22");

        const contentHtml = `
            <div class="tab-pane fade show active h-100" id="panel-${key}" role="tabpanel">
                <iframe src="${finalUrl}" id="${iframeId}" class="w-100 h-100 border-0" allowfullscreen></iframe>
            </div>
        `;
        $(contentsContainer).append(contentHtml);

        instances.set(key, { tabId, iframeId });

        const escapedKey = cssEscape(key);
        $(`#li-${escapedKey} .tab-close`).on("click", function (e) {
            e.stopPropagation();
            Iframe.close(key);
        });
    },

    focus: (key) => {
        const inst = instances.get(key);
        if (inst) {
            $(`#${cssEscape(inst.tabId)}`).tab("show");
        }
    },

    close: (key) => {
        const inst = instances.get(key);
        if (!inst) return;

        const escapedKey = cssEscape(key);
        const $currentLi = $(`#li-${escapedKey}`);

        const $nextTab = $currentLi.next().find(".nav-link");
        const $prevTab = $currentLi.prev().find(".nav-link");

        $currentLi.remove();
        $(`#panel-${escapedKey}`).remove();
        instances.delete(key);

        if ($nextTab.length) $nextTab.tab("show");
        else if ($prevTab.length) $prevTab.tab("show");

        if (instances.size === 0) {
            showEmptyState();
        }
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
            activeIframe.src = activeIframe.src + "";
        }
    },

    closeOthers: () => {
        if (instances.size <= 1) return;

        const activeLi = $(tabsContainer + " .nav-link.active").closest("li");
        const activeKey = activeLi.attr("id")?.replace("li-", "");

        [...instances.keys()].forEach((key) => {
            if (key !== activeKey) {
                Iframe.close(key);
            }
        });
    },

    closeAll: () => {
        instances.clear();
        $(tabsContainer).empty();
        showEmptyState();
    },
};

export default Iframe;
