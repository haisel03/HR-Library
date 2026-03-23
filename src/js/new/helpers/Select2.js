import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";
import "select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css";
import config from "../core/config";

/**
 * @module Select2
 * @description Helper para inicializar y controlar Select2 con Bootstrap 5.
 */

const Select2 = {
	/**
	 * Verifica si un select ya está inicializado
	 */
	isInit: ($el) => $el.hasClass("select2-hidden-accessible"),

	/**
	 * Destruye Select2 si está inicializado
	 */
	destroy: ($el) => {
		if (Select2.isInit($el)) {
			$el.select2("destroy");
		}
	},

	/**
	 * Inicializa Select2 en el scope
	 */
	init: (scope = document, options = {}) => {
		$(scope)
			.find("select.select2")
			.each(function () {
				const $select = $(this);
				Select2.destroy($select);

				const parentModal = $select.closest(".modal");

				$select.select2({
					theme: config.select2.theme,
					width: config.select2.width,
					language: config.select2.language,
					placeholder: $select.data("placeholder") || config.select2.placeholder,
					allowClear: config.select2.allowClear,
					dropdownParent: parentModal.length ? parentModal : $(document.body),
					...options,
				});
			});
	},

	/**
	 * Establece el valor de un Select2
	 */
	setValue: (el, value, trigger = true) => {
		const $el = $(el);
		if (!$el.length) return;
		$el.val(value);
		if (trigger) $el.trigger("change");
	},

	/**
	 * Limpia el valor del Select2
	 */
	clear: (el) => Select2.setValue(el, null),

	/**
	 * Habilita un Select2
	 */
	enable: (el) => $(el).prop("disabled", false),

	/**
	 * Deshabilita un Select2
	 */
	disable: (el) => $(el).prop("disabled", true),

	/**
	 * Recarga el Select2
	 */
	reload: (el) => $(el).trigger("change"),
};

export default Select2;
