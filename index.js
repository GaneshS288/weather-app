const city = document.getElementById("city");

function searchValidation(customError = null) {
  if (city.validity.valueMissing) {
    console.log("the value is missing");
  } else if (customError) {
    console.log(customError);
  }
}

async function getWeatherData(city) {
  try {
    const fetchData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=2RJEGTEK9UT4YSHRG9HF3R9FK`, {mode: "cors"}
    );
    const weatherData = await fetchData.json();
    console.log(weatherData);
  } catch (err) {
    console.log(err.message, err.stack);
  }
}
