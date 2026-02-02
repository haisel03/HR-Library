/**
 * @file iframe_helper.js
 * @description Gestión de pestañas con iframes similar a AdminLTE v3.
 */

const iframeHelper = (() => {
	const tabsContainer = '#iframe-tabs';
	const contentsContainer = '#iframe-contents';
	const instances = new Map(); // url -> { tabId, iframeId }

	/**
	 * Abre una página en una nueva pestaña (o enfoca la existente)
	 * @param {string} title Título de la pestaña
	 * @param {string} url URL de la página
	 * @param {string} icon Icono (opcional)
	 */
	const open = (title, url, icon = 'bi bi-file-earmark') => {
		// Normalizar URL (quitar .html si viene completo)
		const key = url.split('/').pop().split('?')[0];

		if (instances.has(key)) {
			focus(key);
			return;
		}

		const id = 'iframe-' + Date.now();
		const tabId = 'tab-' + id;
		const iframeId = 'frame-' + id;

		// 1. Agregar Tab
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

		// Desactivar otros
		$(tabsContainer + ' .nav-link').removeClass('active');
		$(contentsContainer + ' .tab-pane').removeClass('show active');

		$(tabsContainer).append(tabHtml);

		// 2. Agregar Iframe
		// Agregar parámetro iframe=true para que la página sepa que está en modo pure
		const finalUrl = url.includes('?') ? `${url}&iframe=1` : `${url}?iframe=1`;

		const contentHtml = `
			<div class="tab-pane fade show active h-100" id="panel-${key}" role="tabpanel">
				<iframe src="${finalUrl}" id="${iframeId}" class="w-100 h-100 border-0" allowfullscreen></iframe>
			</div>
		`;
		$(contentsContainer).append(contentHtml);

		instances.set(key, { tabId, iframeId });

		// Evento cerrar
		$(`#li-${key} .tab-close`).on('click', function (e) {
			e.stopPropagation();
			close(key);
		});
	};

	const focus = (key) => {
		const inst = instances.get(key);
		if (inst) {
			$(`#${inst.tabId}`).tab('show');
		}
	};

	const close = (key) => {
		const inst = instances.get(key);
		if (!inst) return;

		const nextTab = $(`#li-${key}`).prev().find('.nav-link');
		const prevTab = $(`#li-${key}`).next().find('.nav-link');

		$(`#li-${key}`).remove();
		$(`#panel-${key}`).remove();
		instances.delete(key);

		if (nextTab.length) nextTab.tab('show');
		else if (prevTab.length) prevTab.tab('show');
	};

	const toggleFullscreen = () => {
		const activePane = $(contentsContainer + ' .tab-pane.active iframe')[0];
		if (activePane) {
			if (activePane.requestFullscreen) activePane.requestFullscreen();
			else if (activePane.webkitRequestFullscreen) activePane.webkitRequestFullscreen();
			else if (activePane.msRequestFullscreen) activePane.msRequestFullscreen();
		}
	};

	const refresh = () => {
		const activeIframe = $(contentsContainer + ' .tab-pane.active iframe')[0];
		if (activeIframe) {
			activeIframe.src = activeIframe.src;
		}
	};

	const closeOthers = () => {
		const activeLi = $('#iframe-tabs .nav-link.active').closest('li');
		const activeKey = activeLi.attr('id')?.replace('li-', '');
		//confirmar que hay al menos una pestaña abierta
		if (instances.size === 1) {
			return;
		}
		//si solo hay una pestaña abierta, no hacer nada y no mostrar la opcion de cerrar otras
		if (instances.size === 1) {
			return;
		}



		// Cerrar todas excepto la activa
		$('#iframe-tabs li').each(function () {
			const key = $(this).attr('id')?.replace('li-', '');
			if (key && key !== activeKey) {
				close(key);
			}
		});
	};

	const closeAll = () => {
		instances.clear();
		$(tabsContainer).empty();
		$(contentsContainer).empty().append(`
            <div class="tab-empty d-flex align-items-center justify-content-center h-100 flex-column text-muted opacity-25">
                <i class="bi bi-window-plus display-1 mb-3"></i>
                <h4 class="fw-bold">HR-Panel v1.0</h4>
                <p>Selecciona una página en el menú lateral para abrir una pestaña.</p>
            </div>
        `);
	};

	return {
		open,
		close,
		focus,
		toggleFullscreen,
		refresh,
		closeOthers,
		closeAll
	};
})();

export default iframeHelper;
