import Swal from "sweetalert2";
import config from "../../../core/config";

/**
 * @param {string} text
 * @param {AlertType} type
 * @returns {Promise<boolean>}
 */
export const alert = (text, type) => {
  const { icons, titles, colors } = config.alerts;

  return Swal.fire({
    html: `
      <div class="d-flex gap-3">
        <i class="bi ${icons[type]} fs-2"></i>
        <div>
          <strong>${titles[type]}</strong>
          <div class="small">${text}</div>
        </div>
      </div>
    `,
    confirmButtonText: config.swal.button.confirm,
    customClass: {
      confirmButton: `btn btn-${colors[type]}`,
    },
  }).then((r) => r.isConfirmed);
};

export const toast = (text, type) =>
  Swal.fire({
    toast: true,
    html: text,
    timer: config.swal.toast.timer,
    position: config.swal.toast.position,
    showConfirmButton: false,
    customClass: {
      popup: `bg-${config.alerts.colors[type]} text-white`,
    },
  });

export const confirm = (title, question, type) =>
  Swal.fire({
    title,
    text: question,
    showCancelButton: true,
    confirmButtonText: config.swal.button.confirm,
    cancelButtonText: config.swal.button.cancel,
    customClass: {
      confirmButton: `btn btn-${config.alerts.colors[type]}`,
    },
  }).then((r) => r.isConfirmed);

export const loadingOpen = () => Swal.showLoading();
export const loadingClose = () => Swal.close();
