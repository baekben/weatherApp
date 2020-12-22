var apiKey = config.API_Key;
const submit = document.getElementById('submitBtn');
submit.addEventListener('click', submitLocation);
const loader = document.getElementById('loader');
const weatherDisplay = document.getElementById('weatherDisplay');
function submitLocation(e) {
	e.preventDefault();
	let location = document.getElementById('location').value;
	let units = document.getElementById('units').value;
	loader.style.display = 'block';
	weatherDisplay.style.display = 'none';
	weatherData(location, units);
}

async function weatherData(location, unit) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}
	`,
		{
			mode: 'cors',
		}
	);
	if (response.status === 400) {
		window.alert('Error');
		return;
	} else {
		const data = await response.json();
		console.log(data);
		const weatherStatus = processData(data);
		setTimeout(displayWeather(weatherStatus, unit), 300);
	}
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
	loader.style.display = 'none';
	weatherDisplay.style.display = 'block';
	let weather = processedData.weatherState;
	let temp = processedData.temperature;
	unit = unit === 'Imperial' ? '&#8457' : '&#8451';
	document.getElementById('weather').innerHTML = `Weather: ${weather}`;
	document.getElementById('temperature').innerHTML = `Temperature: ${temp}${unit}`;
}
