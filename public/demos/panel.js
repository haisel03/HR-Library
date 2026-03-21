/**
 * @file iframe-mode.js
 * @description Demo del modo Iframe (AdminLTE style)
 */

$(function () {
    // 1. Interceptar clicks del sidebar
    $(document).on('click', '#sidebar .sidebar-link', function (e) {
        const href = $(this).attr('href');

        // Si es un dropdown o no tiene href válido, pasar
        if (!href || href === '#' || $(this).data('bs-toggle') === 'collapse') return;

        e.preventDefault();

        const title = $(this).find('span').text() || $(this).text();
        const icon = $(this).find('i').attr('class') || 'bi bi-file-earmark';

        $Iframe.open(title, href, icon);
        $('.tab-empty').addClass('d-none');
    });

    // 2. Botones de Control
    $('#btnIframeFullscreen').on('click', function () {
        $Iframe.toggleFullscreen();
    });

    $('#btnIframeRefresh').on('click', function () {
        $Iframe.refresh();
    });

    $('#btnCloseOthers').on('click', function (e) {
        e.preventDefault();
        $HR.msgConfirm("¿Cerrar las demás pestañas?", "Se cerrarán todas las pestañas excepto la actual.", () => {
            $Iframe.closeOthers();
            $Alert.toast.info("Pestañas cerradas");
        });
    });

    $('#btnCloseAll').on('click', function (e) {
        e.preventDefault();
        $HR.msgConfirm("¿Cerrar todas las pestañas?", "Se cerrarán todas las ventanas abiertas.", () => {
            $Iframe.closeAll();
            $Alert.toast.info("Todas las pestañas cerradas");
        });
    });

    // Cargar inicio opcional
    // $Iframe.open('Dashboard', 'dashboard.html', 'bi bi-speedometer2');
});
