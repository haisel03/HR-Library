/**
 * @file crud.js
 * CAMBIOS v3:
 * - $HR.config.api.baseUrl  → $HR.config.api.baseURL  (con mayúscula L)
 * - $Api.fetch()            → $Api.get()  (no existe fetch en la librería)
 */

$(async () => {
	const events = await getEvents();
	console.log(events);
});

async function getEvents() {
	// config.api.baseURL — con mayúscula URL, no baseUrl
	const url = $HR.config.api.baseURL + "google-events";
	// $Api.get() — no existe $Api.fetch()
	const response = await $Api.get(url);
	return response;
}
