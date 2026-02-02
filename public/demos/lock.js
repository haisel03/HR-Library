document.addEventListener("DOMContentLoaded", function () {
    $('#lockForm').on('submit', function (e) {
        e.preventDefault();

        if (HR.isValidForm(this)) {
            HR.msgLoading();
            setTimeout(() => {
                HR.msgLoading(true);
                HR.toastSuccess('Sesión recuperada');
                // window.location.href = 'index.html';
            }, 1000);
        }
    });
});
