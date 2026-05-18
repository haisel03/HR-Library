
import $ from "jquery";
import Dom from "./Dom.js";
import Strings  from "./Strings.js";
import Validation from "./Validation.js";
import Api from "./Api.js";
import config from "../core/config.js";

/**
 * Helper de funciones personalizadas específicas de la aplicación.
 *
 * @version 1.0.0
 */

const H = {

	/**
	 * Carga opciones de un select desde una API.
	 * El select debe tener la clase "sl{Name}" (ej: slDepartment para "department").
	 * El endpoint debe devolver un array de objetos con {id, name}.
	 * Si el resultado es exitoso, se llena el select con las opciones; si no, se deja vacío.
	 * Si el resultado es muy grande se pone la clase select2 al select para mejorar la usabilidad.
	 * @param {*} name Nombre semántico del select (ej: "department")
	 * @param {*} url Endpoint de la API para obtener las opciones
	 * @param {*} param Parámetros opcionales para la consulta (ej: { active: true })
	 * @returns {Promise<void>}
	 * @example H.getSelect("department", "/api/departments", { active: true });
	 */
	getSelect: (name, url, param) => {
		if(Validation.isNullOrEmpty(name) || Validation.isNullOrEmpty(url)) return null;
		const sl = Dom.q(`select.sl${Strings.capitalize(name)}`);
		if(!sl) return null;
		return Api.get(url, { params: param })
			.then((res) => {
				const data = Array.isArray(res.data) ? res.data : res.data?.data;
				const isWarning = res.data?.type === "w" && res.data?.data === null;

				if(isWarning || !data || data.length === 0) {
					sl.innerHTML = `<option value="">Seleccione...</option>`;
					return;
				}

				sl.innerHTML = `<option value="">Seleccione...</option>` + data.map(item => `<option value="${item.codigo ?? item.id}">${item.descripcion ?? item.name}</option>`).join("");
				if(data.length > 5) {
					if ($(sl).data("select2")) $(sl).select2("destroy");
					const $sl = $(sl);
					const parentModal = $sl.closest(".modal");
					$sl.select2({
						...config.select2,
						dropdownParent: parentModal.length ? parentModal : $(document.body),
					});
				}
			})
			.catch((err) => {
				console.error(`Error al cargar ${name}:`, err);
			});
	},
}
export default H;
