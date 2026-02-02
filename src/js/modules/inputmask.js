import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  Inputmask().mask(document.querySelectorAll("[data-mask]"));
});
