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
	const tempMax = data.main.temp_max;
	const tempMin = data.main.temp_min;
	const weatherIcon = data.weather[0].icon;
	let strWeather = weather.join(', ');
	console.log(
		`Weather: ${strWeather} \nTemperature: ${temp} \n Temp High: ${tempMax} Temp Low: ${tempMin} \n Icon: ${weatherIcon}`
	);
	const newData = {
		weatherState: strWeather,
		temperature: temp,
		tempMax: tempMax,
		tempMin: tempMin,
		icon: weatherIcon,
	};
	return newData;
}

function weatherIcon(icon) {
	var iconImage = '';
	switch (icon) {
		case '01d':
			iconImage = 'wi-day-sunny';
			break;
		case '01n':
			iconImage = 'wi-night-clear';
			break;
		case '02d':
			iconImage = 'wi-day-cloudy';
			break;
		case '02n':
			iconImage = 'wi-night-alt-cloudy';
			break;
		case '03d':
		case '03n':
			iconImage = 'wi-cloud';
			break;
		case '04d':
		case '04n':
			iconImage = 'wi-cloudy';
			break;
		case '09d':
			iconImage = 'wi-rain';
			break;
		case '09n':
			iconImage = 'wi-night-alt-rain';
			break;
		case '10d':
			iconImage = 'wi-day-rain';
			break;
		case '10n':
			iconImage = 'wi-night-alt-rain';
			break;
		case '11d':
			iconImage = 'wi-thunderstorm';
			break;
		case '11n':
			iconImage = 'wi-night-alt-thunderstorm';
			break;
		case '13d':
		case '13n':
			iconImage = 'wi-snow';
			break;
		case '50d':
		case '50n':
			iconImage = 'wi-fog';
			break;
	}
	console.log(`icon image: ${iconImage}`);
	return iconImage;
}

function displayWeather(processedData, unit) {
	loader.style.display = 'none';
	weatherDisplay.style.display = 'block';
	let weather = processedData.weatherState;
	let temp = processedData.temperature;
	let tempHigh = processedData.tempMax;
	let tempLow = processedData.tempMin;
	let icon = processedData.icon;
	const iconImage = weatherIcon(icon);
	getTime(icon);

	unit = unit === 'Imperial' ? '&#8457' : '&#8451';
	const currentWeather = document.getElementById('weather');
	currentWeather.innerHTML = `Weather: ${weather}`;
	document.getElementById('temperature').innerHTML = `Temperature: ${temp}${unit}`;
	document.getElementById('highLow').innerHTML = `H: ${tempHigh}${unit} L: ${tempLow}${unit}`;
	var currentIcon = document.getElementById('icon');
	if (currentIcon) {
		currentIcon.remove();
	}
	const newIcon = document.createElement('i');
	newIcon.id = 'icon';
	newIcon.className = `wi ${iconImage}`;
	weatherDisplay.appendChild(newIcon);
	currentWeather.after(newIcon);
}

function getTime(icon) {
	const time = icon.includes('d') ? 'day' : 'night';
	if (time === 'night') {
		document.body.style.backgroundColor = 'black';
		document.getElementById('content').style.color = 'white';
	} else {
		document.body.style.backgroundColor = 'white';
		document.getElementById('content').style.color = 'black';
	}
}
