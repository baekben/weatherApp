async function weatherData(location) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=31e9c3eab4853f005e67fc274311227e
	`,
		{
			mode: 'cors',
		}
	);
	const data = await response.json();
	console.log(data);
}

weatherData('Seattle,washington');
