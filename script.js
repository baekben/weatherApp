async function weatherData(location, units) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=31e9c3eab4853f005e67fc274311227e&units=${units}
	`,
		{
			mode: 'cors',
		}
	);
	const data = await response.json();
	console.log(data);
	processData(data);
}

function processData(data) {
	let weather = [];
	data.weather.forEach((element) => weather.push(element.main));
	const temp = data.main.temp;
	let str = weather.join(', ');
	console.log(`Weather: ${str} \nTemperature: ${temp}`);
}

weatherData('Seattle,washington', 'imperial');
