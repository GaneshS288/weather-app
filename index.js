const city = document.getElementById("city");
const errorDisplay = document.querySelector(".error");
const button = document.querySelector("button");
const celsiusButton = document.getElementById("celsius");
const fahrenhietButton = document.getElementById("fahrenheit");

let showCelsiusTemp = false;

function searchValidation(customError = null) {
  if (city.validity.valueMissing) {
    errorDisplay.textContent = "This field cannot be empty";
  } else if (customError === "code 400") {
    errorDisplay.textContent = "This city name is incorrect";
  } else {
    getWeatherData(city.value);
    errorDisplay.textContent = "";
  }
}

async function getWeatherData(city) {
  try {
    const fetchData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=2RJEGTEK9UT4YSHRG9HF3R9FK`,
      { mode: "cors" },
    );
    const weatherData = await fetchData.json();
    renderWeather(weatherData);
    console.log(weatherData);
  } catch (err) {
    searchValidation("code 400");
  }
}

function convertToAmPmTime(data) {
  const timeInHours = Number(data.slice(0, 2));
  const timeInMinutes = data.slice(3, 5);
  if (timeInHours > 12) {
    return `${timeInHours - 12}:${timeInMinutes} PM`;
  } else if (timeInHours < 12) {
    return `${timeInHours}:${timeInMinutes} AM`;
  }
}

function getWeekday(dateString) {
  const date = new Date(dateString);
  let weekday;

  switch (date.getDay()) {
    case 0:
      weekday = "Sunday";
      break;
    case 1:
      weekday = "Monday";
      break;
    case 2:
      weekday = "Tuesday";
      break;
    case 3:
      weekday = "Wednesday";
      break;
    case 4:
      weekday = "Thursday";
      break;
    case 5:
      weekday = "Friday";
      break;
    case 6:
      weekday = "Saturday";
      break;
  }

  return weekday;
}

function getFahrenheitOrCelsius(Ftemp) {
  if (showCelsiusTemp) {
    const celsiusTemp = ((((Ftemp - 32) * 5) / 9).toFixed(2) * 100) / 100;
    return `${celsiusTemp}\u00B0C`;
  } else return `${Ftemp}\u00B0F`;
}

function createTodayWeather(data) {
  const container = document.createElement("div");
  container.classList.add("weather-today");

  const address = document.createElement("p");
  address.classList.add("address");
  address.textContent = data.resolvedAddress;

  const hr1 = document.createElement("hr");

  const timezone = document.createElement("p");
  timezone.classList.add("timezone");
  timezone.textContent = data.timezone;

  const addressTimezoneContainer = document.createElement("div");
  addressTimezoneContainer.append(address, timezone);

  const temp = document.createElement("p");
  temp.classList.add("temp");
  temp.textContent = getFahrenheitOrCelsius(data.currentConditions.temp);

  const feelsLike = document.createElement("p");
  feelsLike.classList.add("feels-like");
  feelsLike.textContent = getFahrenheitOrCelsius(
    data.currentConditions.feelslike,
  );

  const tempFeelslikeContainer = document.createElement("div");
  tempFeelslikeContainer.append(temp, feelsLike);

  const hr2 = document.createElement("hr");

  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = data.description;

  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");
  weatherIcon.src = "thunderstorm.svg";

  const descriptionWeatherIconContainer = document.createElement("div");
  descriptionWeatherIconContainer.append(description, weatherIcon);

  const hr3 = document.createElement("hr");

  const sunrise = document.createElement("p");
  sunrise.classList.add("sunrise");
  sunrise.textContent = `Sunset ${convertToAmPmTime(data.currentConditions.sunrise)}`;

  const sunset = document.createElement("p");
  sunset.classList.add("sunset");
  sunset.textContent = `Sunset ${convertToAmPmTime(data.currentConditions.sunset)}`;

  const sunriseSunsetContainer = document.createElement("div");
  sunriseSunsetContainer.append(sunrise, sunset);

  container.append(
    addressTimezoneContainer,
    hr1,
    tempFeelslikeContainer,
    hr2,
    descriptionWeatherIconContainer,
    hr3,
    sunriseSunsetContainer,
  );
  document.body.append(container);
}

function createForcastCards(data) {
  const forcastCard = document.createElement("div");
  forcastCard.classList.add("forcast-card");

  const weekday = document.createElement("p");
  weekday.classList.add("weekday");
  weekday.textContent = getWeekday(data.datetime);

  const temp = document.createElement("p");
  temp.classList.add("temp");
  temp.textContent = getFahrenheitOrCelsius(data.temp);

  const conditon = document.createElement("p");
  conditon.classList.add("condition");
  conditon.textContent = data.conditions;

  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");
  weatherIcon.src = "thunderstorm.svg";

  forcastCard.append(weekday, temp, conditon, weatherIcon);

  return forcastCard;
}

function renderWeather(data) {
  const weatherToday = document.querySelector(".weather-today");
  const weatherForcast = document.querySelector(".weather-forcast");

  if (weatherToday !== null && weatherForcast !== null) {
    weatherToday.remove();
    weatherForcast.remove();
  }

  createTodayWeather(data);

  const forcastContainer = document.createElement("div");
  forcastContainer.classList.add("weather-forcast");

  const forcastHeading = document.createElement("h2");
  forcastHeading.textContent = "7 Day Forcast";

  forcastContainer.append(forcastHeading);

  const forcastCardContainer = document.createElement("div");
  forcastContainer.append(forcastCardContainer);

  for (let i = 1; i < 8; i++) {
    forcastCardContainer.append(createForcastCards(data.days[i]));
  }

  document.body.append(forcastContainer);
}

city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchValidation();
  }
});

button.addEventListener("click", searchValidation);

celsiusButton.addEventListener("click", () => {
  showCelsiusTemp = true;
  celsiusButton.classList.add("toggled");
  fahrenhietButton.classList.remove("toggled");
  searchValidation();
});

fahrenhietButton.addEventListener("click", () => {
  showCelsiusTemp = false;
  fahrenhietButton.classList.add("toggled");
  celsiusButton.classList.remove("toggled");
  searchValidation();
});
