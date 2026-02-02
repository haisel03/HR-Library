document.addEventListener("DOMContentLoaded", function () {
    $('#resetForm').on('submit', function (e) {
        e.preventDefault();

        if (HR.isValidForm(this)) {
            HR.msgLoading();
            setTimeout(() => {
                HR.msgLoading(true);
                HR.msgSuccess('Correo enviado con éxito. Revisa tu bandeja de entrada.');
                // window.location.href = 'login.html';
            }, 2000);
        }
    });
});
