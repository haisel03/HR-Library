/**
 * @file panel-login.js
 * @description Demo de inicio de sesión para el modo panel multi-pestaña.
 */

$(function () {
    document.getElementById('panelLoginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        App.loading("Validando credenciales...");
        setTimeout(() => {
            window.location.href = "panel.html";
        }, 1000);
    });
});