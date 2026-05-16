/**
 * @file crud.js
 * CAMBIOS v3:
 * - App.config.api.baseUrl  → App.config.api.baseURL  (con mayúscula L)
 * - $Api.fetch()            → App.getApi()  (no existe fetch en la librería)
 */

$(async () => {
	const events = await getEvents();
	console.log(events);
});

async function getEvents() {
	// config.api.baseURL — con mayúscula URL, no baseUrl
	const url = App.config.api.baseURL + "google-events";
	// App.getApi() — no existe $Api.fetch()
	const response = await App.getApi(url);
	return response;
}
