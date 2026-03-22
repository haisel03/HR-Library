$(async () => {
	const events = await getEvents();
	console.log(events);
});

// Esto ahora funciona porque window.$Api = Api
async function getEvents() {
	const url = $HR.config.api.baseUrl + "google-events";
	const response = await $Api.fetch(url);
	return response;
}
