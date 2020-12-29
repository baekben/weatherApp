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
		await window.alert('Error');
		window.location.reload();
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
	let strWeather = weather.join(', ');
	const newData = {
		weatherState: strWeather,
		temperature: data.main.temp,
		tempMax: data.main.temp_max,
		tempMin: data.main.temp_min,
		icon: data.weather[0].icon,
		location: data.name,
		country: data.sys.country,
		humidity: data.main.humidity,
		wind: data.wind.speed,
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
	let temp = Math.round(processedData.temperature);
	let tempHigh = Math.round(processedData.tempMax);
	let tempLow = Math.round(processedData.tempMin);
	let icon = processedData.icon;
	let city = processedData.location;
	let country = processedData.country;
	let humid = processedData.humidity;
	let windSpeed = processedData.wind;
	const iconImage = weatherIcon(icon);
	getTime(icon);

	tempUnit = unit === 'Imperial' ? '&#8457' : '&#8451';
	speedUnit = unit === 'Imperial' ? 'mph' : 'm/s';
	const currentWeather = document.getElementById('weather');
	currentWeather.innerHTML = `Weather: ${weather}`;
	const temperature = document.getElementById('temperature');
	temperature.innerHTML = `Temperature: ${temp}${tempUnit}`;
	const highLow = document.getElementById('highLow');
	highLow.innerHTML = `L: ${tempLow}${tempUnit} / H: ${tempHigh}${tempUnit}`;
	var currentIcon = document.getElementById('icon');
	var currentLocation = document.getElementById('inputLocation');
	var currentHumidity = document.getElementById('humidity');
	var currentWind = document.getElementById('wind');
	if (currentIcon) {
		currentIcon.remove();
		currentLocation.remove();
		currentHumidity.remove();
		currentWind.remove();
	}

	const location = document.createElement('h1');
	createElement(location, 'inputLocation', weatherDisplay, 'before', currentWeather);
	location.textContent = `${city}, ${country}`;

	const newIcon = document.createElement('i');
	createElement(newIcon, 'icon', weatherDisplay, 'after', temperature);
	newIcon.className = `wi ${iconImage}`;

	const humidity = document.createElement('h4');
	createElement(humidity, 'humidity', weatherDisplay, 'after', highLow);
	humidity.textContent = `Humidity: ${humid}%`;

	const wind = document.createElement('h4');
	createElement(wind, 'wind', weatherDisplay, 'after', highLow);
	wind.textContent = `Wind: ${windSpeed} ${speedUnit}`;
}

function createElement(item, id, appendElement, placement, refElement) {
	item.id = `${id}`;
	appendElement.appendChild(item);
	if (placement == 'before') {
		refElement.before(item);
	} else {
		refElement.after(item);
	}
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
