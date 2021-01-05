var apiKey = 'cf24eeeafcce3b1d18d208261aa51b3b';
const submit = document.getElementById('submitBtn');
submit.addEventListener('click', submitLocation);
const loader = document.getElementById('loader');
const weatherContainer = document.getElementById('weatherContainer');
function submitLocation(e) {
	e.preventDefault();
	let location = document.getElementById('location').value;
	let units = document.getElementById('units').value;
	loader.style.display = 'block';
	weatherContainer.style.display = 'none';
	weatherData(location, units);
	getCoordinates(location, units);
}

async function weatherData(location, units) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${units}
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
		setTimeout(displayWeather(weatherStatus, units), 300);
	}
}

async function getCoordinates(location, units) {
	const response = await fetch(
		`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`,
		{ mode: 'cors' }
	);
	if (response.status === 400) {
		await window.alert('Error');
		window.location.reload();
		return;
	} else {
		const data = await response.json();
		const coordinates = {
			lon: data[0].lon,
			lat: data[0].lat,
		};
		oneCallWeather(coordinates, units);
	}
}

async function oneCallWeather(location, units) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&exclude=hourly,minutely&appid=${apiKey}&units=${units}`,
		{ mode: 'cors' }
	);
	if (response === (400 || 404)) {
		await window.alert('Something went wrong');
		window.location.reload();
		return;
	} else {
		const data = await response.json();
		console.log('one call api:');
		console.log(data);
		const dailyData = dailyWeather(data);
		createDailyChart(dailyData, units);
		console.log(dailyData[0].day);
	}
}

function dailyWeather(data) {
	const days = [];
	data.daily.forEach((e, i) =>
		days.push({
			morning: e.temp.morn,
			day: e.temp.day,
			even: e.temp.eve,
			night: e.temp.night,
			tempMin: e.temp.min,
			tempMax: e.temp.max,
			icon: e.weather[0].icon,
			humidity: e.humidity,
			wind: e.wind_speed,
			time: e.dt,
			day: getDay(i),
		})
	);
	return days;
}

function getDay(a = 0) {
	var d = new Date();
	const weekday = {
		0: 'Sunday',
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday',
	};
	let b = d.getDay() + a;
	if (b > 6) {
		b = b - 7;
	}
	var n = weekday[b];
	return n;
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

function createDailyChart(data, units) {
	const forecast = document.createElement('div');
	forecast.className = 'animate-bottom';
	makeElement(forecast, 'forecast', weatherContainer, 'after', weatherDisplay);
	for (i = 0; i < 3; i++) {
		const day = document.createElement('div');
		day.className = 'day';
		makeElement(day, `day${i}`, forecast, 'after', day);
		const dateName = document.createElement('h2');
		day.appendChild(dateName);
		dateName.innerHTML = `${data[i].day}`;

		const icon = document.createElement('i');
		const tempMax = document.createElement('h2');
		const tempMin = document.createElement('h2');
		const wind = document.createElement('h3');
		day.appendChild(icon);
		const iconImage = data[i].icon;
		const newIcon = weatherIcon(iconImage);
		icon.className = `wi ${newIcon}`;
		icon.id = 'icon';
		makeElement(wind, 'wind', weatherContainer, 'after', icon);
		makeElement(tempMin, `tempMin`, weatherContainer, 'after', icon);
		makeElement(tempMax, `tempMax`, weatherContainer, 'after', icon);

		tempUnit = units === 'Imperial' ? '&#8457' : '&#8451';
		speedUnit = units === 'Imperial' ? 'mph' : 'm/s';

		tempMax.innerHTML = `H: ${data[i].tempMax}${tempUnit}`;
		tempMin.innerHTML = `L: ${data[i].tempMin}${tempUnit}`;
		wind.innerHTML = `Wind: ${data[i].wind}${speedUnit}`;
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

function displayWeather(processedData, units) {
	loader.style.display = 'none';
	weatherContainer.style.display = 'grid';
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

	tempUnit = units === 'Imperial' ? '&#8457' : '&#8451';
	speedUnit = units === 'Imperial' ? 'mph' : 'm/s';
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
	makeElement(location, 'inputLocation', weatherContainer, 'before', currentWeather);
	location.textContent = `${city}, ${country}`;

	const newIcon = document.createElement('i');
	makeElement(newIcon, 'icon', weatherContainer, 'after', temperature);
	newIcon.className = `wi ${iconImage}`;

	const humidity = document.createElement('h4');
	makeElement(humidity, 'humidity', weatherContainer, 'after', highLow);
	humidity.textContent = `Humidity: ${humid}%`;

	const wind = document.createElement('h4');
	makeElement(wind, 'wind', weatherContainer, 'after', highLow);
	wind.textContent = `Wind: ${windSpeed} ${speedUnit}`;
}

function makeElement(item, id, appendElement, placement, refElement) {
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
