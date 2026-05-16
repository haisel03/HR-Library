/**
 * @file crud.js
 * $/
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

