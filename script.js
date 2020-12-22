const submit = document.getElementById('submitBtn');
submit.addEventListener('click', submitLocation);
function submitLocation() {
	let location = document.getElementById('location').value;
	let units = document.getElementById('units').value;
	weatherData(location, units);
}

async function weatherData(location, unit) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=31e9c3eab4853f005e67fc274311227e&units=${unit}
	`,
		{
			mode: 'cors',
		}
	);
	const data = await response.json();
	console.log(data);
	const weatherStatus = processData(data);
	displayWeather(weatherStatus, unit);
}

function processData(data) {
	let weather = [];
	data.weather.forEach((e) => weather.push(e.main));
	const temp = data.main.temp;
	let strWeather = weather.join(', ');
	console.log(`Weather: ${strWeather} \nTemperature: ${temp}`);
	const newData = {
		weatherState: strWeather,
		temperature: temp,
	};
	return newData;
}

function displayWeather(processedData, unit) {
	let weather = processedData.weatherState;
	let temp = processedData.temperature;
	unit = unit === 'Imperial' ? '&#8457' : '&#8451';
	document.getElementById('weather').innerHTML = `Weather: ${weather}`;
	document.getElementById('temperature').innerHTML = `Temperature: ${temp}${unit}`;
}
