const city = document.getElementById("city");
const errorDisplay = document.querySelector(".error");
const button = document.querySelector("button");

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
    createTodayWeather(weatherData);
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
  temp.textContent = `${data.currentConditions.temp}\u00B0`;

  const feelsLike = document.createElement("p");
  feelsLike.classList.add("feels-like");
  feelsLike.textContent = `${data.currentConditions.feelslike} \u00B0`;

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

city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchValidation();
  }
});

button.addEventListener("click", searchValidation);
